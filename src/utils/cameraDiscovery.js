import { DISCOVER_MSG, DISCOVER_PORT, buildCaptureUrl, guessBroadcastAddresses, parseEsp32CamMessage } from './cameraProtocol.js'

// 热点手机开热点时常见网段：Android 热点默认 192.168.43.x，部分机型 192.168.223.x，ESP32 自身 AP 为 192.168.4.1
export const DEFAULT_SCAN_SUBNETS = ['192.168.43', '192.168.223', '192.168.4.1']

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
    for (let i = 2; i <= 254; i += 1) out.push(`${base}.${i}`)
  })
  return [...new Set(out)]
}

// 用 <img> 加载 /capture 探测：能解码出图片即判定存活。
// 刻意不用 XHR/fetch，避免 ESP32 固件无 CORS 头导致浏览器拦截误判。
function probeCapture(ip, timeoutMs) {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') {
      resolve(false)
      return
    }
    let done = false
    const img = new Image()
    const timer = setTimeout(() => {
      if (done) return
      done = true
      try {
        img.src = ''
      } catch (err) {}
      resolve(false)
    }, timeoutMs)
    img.onload = () => {
      if (done) return
      done = true
      clearTimeout(timer)
      resolve(true)
    }
    img.onerror = () => {
      if (done) return
      done = true
      clearTimeout(timer)
      resolve(false)
    }
    img.src = `${buildCaptureUrl(ip)}?_t=${Date.now()}`
  })
}

export async function scanSubnetForCameras({ subnets, onDevice, onProgress, timeoutMs = 1500, batchSize = 40, shouldStop } = {}) {
  const ips = candidateIps(subnets)
  let checked = 0
  for (let i = 0; i < ips.length; i += batchSize) {
    if (shouldStop && shouldStop()) break
    const batch = ips.slice(i, i + batchSize)
    const results = await Promise.all(batch.map(async (ip) => ({ ip, alive: await probeCapture(ip, timeoutMs) })))
    results.forEach(({ ip, alive }) => {
      checked += 1
      if (alive && onDevice) {
        onDevice({ IP: ip, STREAM: `http://${ip}:81/stream`, CAPTURE: `http://${ip}/capture`, MAC: '', NAME: 'esp32cam' })
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
  function sendOnce() {
    guessBroadcastAddresses().forEach((address) => {
      try {
        socket.send({ address, port: DISCOVER_PORT, message: DISCOVER_MSG })
      } catch (err) {}
    })
  }
  return {
    supported: true,
    start() {
      socket = uni.createUDPSocket()
      socket.onMessage((res) => {
        const text = res && res.message ? String(res.message) : ''
        const dev = parseEsp32CamMessage(text)
        if (dev && onDevice) onDevice(dev)
      })
      try {
        socket.bind(DISCOVER_PORT)
      } catch (err) {}
      sendOnce()
      timer = setInterval(sendOnce, 2000)
    },
    stop() {
      if (timer) clearInterval(timer)
      timer = null
      try {
        if (socket) socket.close()
      } catch (err) {}
      socket = null
    }
  }
}
