export const DISCOVER_MSG = 'DISCOVER_ESP32CAM'
export const DISCOVER_PORT = 4210
export const FRAMESIZE_MAP = [
  { label: 'SVGA 800x600', value: 8 },
  { label: 'XGA 1024x768', value: 9 },
  { label: 'UXGA 1600x1200', value: 10 }
]

function stripBase(input) {
  return String(input || '').trim().replace(/\/+$/, '')
}

export function parseEsp32CamMessage(msg) {
  const text = String(msg || '').trim()
  if (!text.startsWith('ESP32CAM|')) return null
  const out = {}
  text.split('|').slice(1).forEach((part) => {
    const idx = part.indexOf('=')
    if (idx <= 0) return
    const k = part.slice(0, idx).trim()
    const v = part.slice(idx + 1).trim()
    if (k) out[k] = v
  })
  if (!out.IP) return null
  return out
}

export function normalizeManualIp(input) {
  const raw = String(input || '').trim()
  if (!raw) return ''
  const withProto = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`
  return stripBase(withProto)
}

function ensureBase(base) {
  const normalized = normalizeManualIp(base)
  return normalized || stripBase(base)
}

export function buildControlUrl(base, variable, value) {
  return `${ensureBase(base)}/control?var=${encodeURIComponent(variable)}&val=${encodeURIComponent(value)}`
}

export function buildCaptureUrl(base) {
  return `${ensureBase(base)}/capture`
}

export function buildStreamUrl(base) {
  const b = ensureBase(base)
  return `${b}:81/stream`
}

export function buildStatusUrl(base) {
  return `${ensureBase(base)}/status`
}

export function guessBroadcastAddresses() {
  return ['255.255.255.255', '192.168.223.255', '192.168.43.255', '192.168.4.255']
}
