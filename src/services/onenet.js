import { getDebugValues } from '../utils/storage'

function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: resolve,
      fail: reject
    })
  })
}

function unwrapValue(value) {
  if (value && typeof value === 'object') {
    return value.value ?? value.property_value ?? value.current ?? value.data ?? value
  }
  return value
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
    ...config.displayPoints,
    ...config.switchPoints,
    ...config.thresholdPoints
  ].filter((point) => point.identifier)

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

  const response = await request({
    url: config.cloud.getUrl,
    method: 'GET',
    header: {
      Authorization: config.cloud.authorization
    },
    timeout: 10000
  })

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`云平台读取失败：HTTP ${response.statusCode}`)
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

  const response = await request({
    url: config.cloud.postUrl,
    method: 'POST',
    data: payload,
    header: {
      Authorization: config.cloud.authorization,
      'Content-Type': 'application/json'
    },
    timeout: 10000
  })

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`指令下发失败：HTTP ${response.statusCode}`)
  }

  return response.data
}
