import { DISCOVER_MSG, DISCOVER_PORT, guessBroadcastAddresses, parseEsp32CamMessage } from './cameraProtocol.js'

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
