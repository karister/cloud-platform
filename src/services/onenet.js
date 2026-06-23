import { getDebugValues } from '../utils/storage'
import { generateOneNetToken } from '../utils/onenetToken'

function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 根据当前 cloud 配置计算（或直接返回）鉴权 token。
 *
 * - 若 cloud.mockMode=true，返回空字符串（mock 模式不需要鉴权）
 * - 若 cloud.manualToken 非空，直接返回（调试用，跳过本地计算） — TODO: 算法修好后移除
 * - 若 cloud.token 与 cloud.tokenExpiresAt 都存在且未过期，直接复用缓存
 * - 否则按 productId/deviceName/accessKey 在本地重新生成；过期时间沿用
 *   cloud.tokenExpiresAt（首次未设置时默认为 +100 天，与 OneNET Java 示例一致）
 *
 * 失败时返回 null，由调用方决定如何降级（切换 mock 模式或提示用户）。
 */
export function buildAuthorization(cloud) {
  if (!cloud || cloud.mockMode) return ''

  // TODO: 临时调试用 — 让用户手动粘贴一个已知的有效 token
  if (typeof cloud.manualToken === 'string' && cloud.manualToken.trim()) {
    return cloud.manualToken.trim()
  }

  const now = Math.floor(Date.now() / 1000)

  // 缓存命中：token 非空且未过期
  if (
    typeof cloud.token === 'string' &&
    cloud.token &&
    Number.isFinite(cloud.tokenExpiresAt) &&
    cloud.tokenExpiresAt > now
  ) {
    return cloud.token
  }

  // 计算一个新的 token
  const expirationSeconds = Number.isFinite(cloud.tokenExpiresAt) && cloud.tokenExpiresAt > now
    ? cloud.tokenExpiresAt
    : now + 100 * 24 * 60 * 60

  try {
    return generateOneNetToken({
      productId: cloud.productId,
      deviceName: cloud.deviceName,
      accessKey: cloud.accessKey,
      method: cloud.signMethod || 'md5',
      expirationSeconds
    })
  } catch (err) {
    console.warn('[onenet] generate token failed:', err?.message || err)
    return null
  }
}

function unwrapValue(value) {
  if (value && typeof value === 'object') {
    return value.value ?? value.property_value ?? value.current ?? value.data ?? value
  }
  return value
}

/**
 * OneNET 业务层错误检查。
 * OneNET 在鉴权/参数失败时仍返回 HTTP 200，但响应体里 code / errno 非零，
 * 必须主动抛错，否则上层 verifyAuthorization 会误判为成功。
 *
 * 返回：
 *   - null 表示成功（或响应不是 JSON 对象，无法判断）
 *   - { code, message } 表示失败
 */
function extractApiError(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  // OneNET 不同 API 同时使用 { code, msg } 与 { errno, error } 两种格式
  const codeRaw = body.code ?? body.errno
  const message = body.msg ?? body.error ?? ''
  if (codeRaw === undefined || codeRaw === null) return null
  // 兼容字符串 / 数字形式的 code（部分 API 用字符串 '0'）
  const codeNum = Number(codeRaw)
  const codeOk = Number.isFinite(codeNum) ? codeNum === 0 : String(codeRaw) === '0'
  if (codeOk) return null
  return { code: String(codeRaw), message: String(message || '').trim() }
}

export function normalizeProperties(raw) {
  const body = raw?.data ?? raw
  const data = body?.data ?? body
  const map = {}

  if (Array.isArray(data)) {
    data.forEach((item) => {
      const id = item.identifier || item.id || item.code || item.name
      if (id) {
        map[id] = unwrapValue(item.value ?? item.property_value ?? item.val)
      }
    })
    return map
  }

  const candidates = data?.properties || data?.items || data?.list || data?.params || data?.values
  if (Array.isArray(candidates)) {
    candidates.forEach((item) => {
      const id = item.identifier || item.id || item.code || item.name
      if (id) {
        map[id] = unwrapValue(item.value ?? item.property_value ?? item.val)
      }
    })
    return map
  }

  if (candidates && typeof candidates === 'object') {
    Object.keys(candidates).forEach((key) => {
      map[key] = unwrapValue(candidates[key])
    })
    return map
  }

  if (data && typeof data === 'object') {
    Object.keys(data).forEach((key) => {
      if (!['code', 'msg', 'message'].includes(key)) {
        map[key] = unwrapValue(data[key])
      }
    })
  }

  return map
}

function makeMockValue(identifier, index) {
  const seed = identifier.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const wave = Math.sin(Date.now() / 180000 + seed) * 8
  if (identifier.toLowerCase().includes('humi')) return Math.round(55 + wave)
  if (identifier.toLowerCase().includes('switch')) return seed % 2 === index % 2
  return Number((24 + ((seed + index * 7) % 15) + wave / 4).toFixed(1))
}

export async function fetchProperties(config) {
  const allPoints = [
    ...(config.displayPoints || []),
    ...(config.switchPoints || []),
    ...(config.thresholdPoints || [])
  ].filter((point) => point && point.identifier)

  if (config.cloud.mockMode) {
    const debugValues = getDebugValues()
    const values = {}
    allPoints.forEach((point, index) => {
      // Use debug override if set, otherwise generate mock value
      if (debugValues[point.identifier] !== undefined && debugValues[point.identifier] !== '') {
        values[point.identifier] = debugValues[point.identifier]
      } else {
        values[point.identifier] = makeMockValue(point.identifier, index)
      }
    })
    return values
  }

  const authorization = buildAuthorization(config.cloud)
  if (!authorization) {
    throw new Error('无法生成鉴权 token，请检查 Product ID / Device Name / Access Key 是否填写')
  }

  const response = await request({
    url: config.cloud.getUrl,
    method: 'GET',
    header: {
      Authorization: authorization
    },
    timeout: 10000
  })

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`云平台读取失败：HTTP ${response.statusCode}`)
  }

  // OneNET 在鉴权 / 参数错误时仍会返回 HTTP 200，但响应体里的 code/errno 非零
  const apiError = extractApiError(response.data)
  if (apiError) {
    const detail = apiError.message ? `: ${apiError.message}` : ''
    throw new Error(`云平台鉴权失败（code=${apiError.code}）${detail}`)
  }

  return normalizeProperties(response.data)
}

export async function setDesiredProperty(config, identifier, value) {
  if (config.cloud.mockMode) {
    return {
      code: 0,
      msg: 'mock success',
      params: {
        [identifier]: value
      }
    }
  }

  const payload = {
    product_id: config.cloud.productId,
    device_name: config.cloud.deviceName,
    params: {
      [identifier]: value
    }
  }

  const authorization = buildAuthorization(config.cloud)
  if (!authorization) {
    throw new Error('无法生成鉴权 token，请检查 Product ID / Device Name / Access Key 是否填写')
  }

  const response = await request({
    url: config.cloud.postUrl,
    method: 'POST',
    data: payload,
    header: {
      Authorization: authorization,
      'Content-Type': 'application/json'
    },
    timeout: 10000
  })

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`指令下发失败：HTTP ${response.statusCode}`)
  }

  // 业务层错误：OneNET 返回 HTTP 200 + code 非零
  const apiError = extractApiError(response.data)
  if (apiError) {
    const detail = apiError.message ? `: ${apiError.message}` : ''
    throw new Error(`云平台指令被拒（code=${apiError.code}）${detail}`)
  }

  return response.data
}
