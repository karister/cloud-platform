import { DISCOVER_MSG, DISCOVER_PORT, buildBaseUrl, buildStatusUrl, guessBroadcastAddresses, parseEsp32CamMessage } from './cameraProtocol.js'

// A browser cannot reliably obtain the current Wi-Fi prefix. Android uses its native
// adapter for this; callers on other targets may explicitly supply a /24 prefix.
export const DEFAULT_SCAN_SUBNETS = []

export function candidateIps(subnets = DEFAULT_SCAN_SUBNETS) {
  const out = []
  ;(Array.isArray(subnets) ? subnets : []).forEach((subnet) => {
    const base = String(subnet || '').trim().replace(/\.$/, '')
    if (!base) return
    if (/^\d+\.\d+\.\d+\.\d+$/.test(base)) {
      out.push(base)
      return
    }
    if (!/^\d+\.\d+\.\d+$/.test(base)) return
    for (let i = 1; i <= 254; i += 1) out.push(`${base}.${i}`)
  })
  return [...new Set(out)]
}

export function isCameraStatus(status) {
  let value = status
  if (typeof value === 'string') {
    try {
      value = JSON.parse(value)
    } catch (err) {
      return false
    }
  }
  return Boolean(value && typeof value === 'object'
    && Object.prototype.hasOwnProperty.call(value, 'framesize')
    && Object.prototype.hasOwnProperty.call(value, 'quality'))
}

function statusRequest(ip, timeoutMs) {
  const url = buildStatusUrl(buildBaseUrl(ip))
  return new Promise((resolve) => {
    if (typeof uni === 'undefined' || typeof uni.request !== 'function') {
      resolve({ alive: false, error: '当前平台无法发起局域网 HTTP 探测' })
      return
    }
    uni.request({
      url,
      method: 'GET',
      timeout: timeoutMs,
      success: (res) => resolve({
        alive: res.statusCode >= 200 && res.statusCode < 300 && isCameraStatus(res.data),
        status: res.data,
        statusCode: res.statusCode
      }),
      fail: (error) => resolve({ alive: false, error: error?.errMsg || '请求失败' })
    })
  })
}

export async function scanSubnetForCameras({ subnets, onDevice, onProgress, timeoutMs = 1500, batchSize = 16, shouldStop } = {}) {
  const ips = candidateIps(subnets)
  let checked = 0
  for (let i = 0; i < ips.length; i += batchSize) {
    if (shouldStop && shouldStop()) break
    const batch = ips.slice(i, i + batchSize)
    const results = await Promise.all(batch.map(async (ip) => ({ ip, ...(await statusRequest(ip, timeoutMs)) })))
    if (shouldStop && shouldStop()) break
    results.forEach(({ ip, alive, status }) => {
      checked += 1
      if (alive && onDevice) {
        const base = buildBaseUrl(ip)
        onDevice({ IP: ip, BASE: base, STREAM: `${base}:81/stream`, CAPTURE: `${base}/capture`, MAC: '', NAME: 'esp32cam', source: 'http', status })
      }
    })
    if (onProgress) onProgress({ checked, total: ips.length })
  }
  return { checked, total: ips.length }
}

export function createDiscovery({ onDevice } = {}) {
  const hasUdp = typeof uni !== 'undefined' && typeof uni.createUDPSocket === 'function'
  if (!hasUdp) return { supported: false, start() {}, stop() {} }
  let socket = null
  let timer = null
  let started = false
  function sendOnce() {
    if (!socket) return
    guessBroadcastAddresses().forEach((address) => {
      try {
        socket.send({ address, port: DISCOVER_PORT, message: DISCOVER_MSG })
      } catch (err) {}
    })
  }
  return {
    supported: true,
    start() {
      if (started) return
      started = true
      socket = uni.createUDPSocket()
      socket.onMessage((res) => {
        const dev = parseEsp32CamMessage(res?.message)
        if (dev && onDevice) onDevice({ ...dev, source: 'udp' })
      })
      try {
        socket.bind(DISCOVER_PORT)
      } catch (err) {}
      sendOnce()
      timer = setInterval(sendOnce, 2000)
    },
    stop() {
      started = false
      if (timer) clearInterval(timer)
      timer = null
      try {
        if (socket) socket.close()
      } catch (err) {}
      socket = null
    }
  }
}
