import { buildCaptureUrl, buildControlUrl, buildStatusUrl } from '../utils/cameraProtocol.js'

export function isCamQuality(value) {
  return Number.isInteger(Number(value)) && Number(value) >= 4 && Number(value) <= 63
}

function cameraError(message, details = {}) {
  return Object.assign(new Error(message), details)
}

function readableError(error, operation) {
  const raw = String(error?.errMsg || error?.message || error || '')
  if (/mixed.?content|cleartext|insecure/i.test(raw)) {
    return cameraError('浏览器阻止了 HTTP 摄像头请求（混合内容）；请使用 Android 原生 APK、HTTPS 摄像头或手动打开预览。', { code: 'MIXED_CONTENT' })
  }
  return cameraError(raw || `${operation}失败`, { code: error?.code, statusCode: error?.statusCode })
}

function uniRequest({ url, timeout = 5000 }) {
  return new Promise((resolve, reject) => {
    if (typeof uni === 'undefined' || typeof uni.request !== 'function') {
      reject(cameraError('当前平台不支持局域网 HTTP 请求', { code: 'UNSUPPORTED' }))
      return
    }
    uni.request({ url, method: 'GET', timeout, success: resolve, fail: reject })
  })
}

function shouldRetry(error) {
  if (error?.code === 'CANCELLED' || error?.code === 'UNSUPPORTED' || error?.code === 'MIXED_CONTENT') return false
  const status = Number(error?.statusCode || error?.status)
  return !status || status >= 500
}

async function withRetry(fn) {
  let error = null
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await fn()
    } catch (nextError) {
      error = nextError
      if (!shouldRetry(nextError)) break
    }
  }
  throw error
}

// Android retries twice, each with a 5 s connect timeout and a 5 s read timeout.
// Leave time for the native error/result to reach the WebView after both attempts.
const NATIVE_REQUEST_TIMEOUT_MS = 22000

async function nativeRequest(bridge, operation, base, extra = {}, timeoutMs = NATIVE_REQUEST_TIMEOUT_MS) {
  if (!bridge?.supported) return null
  return bridge.request(operation, { base, ...extra }, timeoutMs)
}

export async function fetchCamStatus(base, bridge) {
  if (bridge?.supported) return nativeRequest(bridge, 'status', base)
  return withRetry(async () => {
    try {
      const res = await uniRequest({ url: buildStatusUrl(base) })
      if (res.statusCode < 200 || res.statusCode >= 300) throw cameraError(`状态读取失败：HTTP ${res.statusCode}`, { statusCode: res.statusCode })
      return res.data
    } catch (error) {
      throw readableError(error, '状态读取')
    }
  })
}

export async function sendCamControl(base, variable, value, bridge) {
  if (variable === 'quality' && !isCamQuality(value)) {
    throw cameraError('画质必须是 4–63 之间的整数', { code: 'INVALID_ARGUMENT' })
  }
  if (bridge?.supported) return nativeRequest(bridge, 'control', base, { variable, value })
  return withRetry(async () => {
    try {
      const res = await uniRequest({ url: buildControlUrl(base, variable, value) })
      if (res.statusCode < 200 || res.statusCode >= 300) throw cameraError(`控制下发失败：HTTP ${res.statusCode}`, { statusCode: res.statusCode })
      return res.data
    } catch (error) {
      throw readableError(error, '控制下发')
    }
  })
}

export async function capturePhoto(base, bridge) {
  if (bridge?.supported) return nativeRequest(bridge, 'capture', base, {}, 60000)
  return withRetry(() => new Promise((resolve, reject) => {
    if (typeof uni === 'undefined' || typeof uni.downloadFile !== 'function') {
      reject(cameraError('当前平台不支持拍照下载', { code: 'UNSUPPORTED' }))
      return
    }
    uni.downloadFile({
      url: buildCaptureUrl(base),
      timeout: 5000,
      success: (res) => {
        if (res.statusCode === 200 && res.tempFilePath) resolve(res)
        else reject(cameraError(`拍照失败：HTTP ${res.statusCode}`, { statusCode: res.statusCode }))
      },
      fail: (error) => reject(readableError(error, '拍照'))
    })
  }))
}

export async function openCamStream(base, streamUrl, bridge) {
  if (bridge?.supported) {
    const data = await nativeRequest(bridge, 'stream', base, { streamUrl })
    return data.streamUrl || ''
  }
  return streamUrl
}

/**
 * Release a live MJPEG stream without ending the discovery session. On web
 * targets, removing the preview element closes the browser request; Android
 * also needs to release its native proxy connection explicitly.
 */
export async function closeCamStream(base, bridge) {
  if (bridge?.supported) await nativeRequest(bridge, 'closeStream', base)
}
