const EVENT_NAME = 'esp32-camera-event'

function randomId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function nativeBridge() {
  if (typeof window === 'undefined') return null
  const bridge = window.AndroidBridge
  return bridge && typeof bridge.cameraRequest === 'function' && typeof bridge.cancelCameraSession === 'function' ? bridge : null
}

export function hasNativeCameraBridge() {
  return Boolean(nativeBridge())
}

/**
 * A small promise wrapper over the Android WebView bridge. Every message carries
 * the session and request IDs so stale asynchronous callbacks are harmless.
 */
export function createCameraSession(onEvent) {
  const bridge = nativeBridge()
  const sessionId = randomId('camera')
  const pending = new Map()
  let cancelled = false

  function rejectPending(error) {
    pending.forEach(({ reject, timer }) => {
      clearTimeout(timer)
      reject(error)
    })
    pending.clear()
  }

  function receive(event) {
    const detail = event?.detail || {}
    if (detail.sessionId && detail.sessionId !== sessionId) return
    if (detail.event === 'result' && detail.requestId && pending.has(detail.requestId)) {
      const entry = pending.get(detail.requestId)
      clearTimeout(entry.timer)
      pending.delete(detail.requestId)
      if (detail.ok) entry.resolve(detail.data || {})
      else entry.reject(Object.assign(new Error(detail.error?.message || '摄像头操作失败'), detail.error || {}))
      return
    }
    if (onEvent) onEvent(detail)
  }

  if (typeof window !== 'undefined') window.addEventListener(EVENT_NAME, receive)

  function request(operation, data = {}, timeoutMs = 7000) {
    if (!bridge) return Promise.reject(new Error('当前环境没有 Android 摄像头桥接'))
    if (cancelled) return Promise.reject(new Error('摄像头会话已结束'))
    const requestId = randomId('request')
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(requestId)
        reject(Object.assign(new Error('摄像头操作超时'), { code: 'TIMEOUT' }))
      }, timeoutMs)
      pending.set(requestId, { resolve, reject, timer })
      try {
        bridge.cameraRequest(JSON.stringify({ sessionId, requestId, operation, ...data }))
      } catch (error) {
        clearTimeout(timer)
        pending.delete(requestId)
        reject(error)
      }
    })
  }

  function cancel() {
    if (cancelled) return
    cancelled = true
    try {
      if (bridge) bridge.cancelCameraSession(sessionId)
    } catch (err) {}
    rejectPending(Object.assign(new Error('摄像头会话已取消'), { code: 'CANCELLED' }))
    if (typeof window !== 'undefined') window.removeEventListener(EVENT_NAME, receive)
  }

  return { sessionId, supported: Boolean(bridge), request, cancel }
}
