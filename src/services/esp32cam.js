import { buildCaptureUrl, buildControlUrl, buildStatusUrl } from '../utils/cameraProtocol.js'

function uniRequest({ url, timeout = 5000 }) {
  return new Promise((resolve, reject) => {
    uni.request({ url, method: 'GET', timeout, success: resolve, fail: reject })
  })
}

async function withRetry(fn, retries = 1) {
  let lastErr = null
  for (let i = 0; i <= retries; i += 1) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr
}

export function fetchCamStatus(base) {
  return withRetry(async () => {
    const res = await uniRequest({ url: buildStatusUrl(base) })
    if (res.statusCode < 200 || res.statusCode >= 300) throw new Error(`状态读取失败：HTTP ${res.statusCode}`)
    return res.data
  })
}

export function sendCamControl(base, variable, value) {
  return withRetry(async () => {
    const res = await uniRequest({ url: buildControlUrl(base, variable, value) })
    if (res.statusCode < 200 || res.statusCode >= 300) throw new Error(`控制下发失败：HTTP ${res.statusCode}`)
    return res.data
  })
}

export function capturePhoto(base) {
  return withRetry(() => new Promise((resolve, reject) => {
    uni.downloadFile({
      url: buildCaptureUrl(base),
      timeout: 5000,
      success: (res) => {
        if (res.statusCode === 200 && res.tempFilePath) resolve(res)
        else reject(new Error(`拍照失败：HTTP ${res.statusCode}`))
      },
      fail: reject
    })
  }))
}
