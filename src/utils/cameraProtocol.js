export const DISCOVER_MSG = 'DISCOVER_ESP32CAM'
export const DISCOVER_PORT = 4210

// Values are the esp32-camera framesize enum, not the ordinal positions in this list.
export const FRAMESIZE_MAP = [
  { label: 'QVGA 320x240', value: 5 },
  { label: 'VGA 640x480', value: 8 },
  { label: 'SVGA 800x600', value: 9 },
  { label: 'XGA 1024x768', value: 10 },
  { label: 'UXGA 1600x1200', value: 13 }
]

export function isValidIpv4(value) {
  const parts = String(value || '').trim().split('.')
  return parts.length === 4 && parts.every((part) => /^(0|[1-9]\d{0,2})$/.test(part) && Number(part) >= 0 && Number(part) <= 255)
}

export function isValidPort(value) {
  const port = Number(value)
  return Number.isInteger(port) && port >= 1 && port <= 65535
}

function decodeText(input) {
  if (typeof input === 'string') return input.trim()
  if (input == null) return ''
  let bytes = null
  if (input instanceof ArrayBuffer) bytes = new Uint8Array(input)
  else if (ArrayBuffer.isView(input)) bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
  if (!bytes) return String(input).trim()
  if (typeof TextDecoder !== 'undefined') return new TextDecoder().decode(bytes).trim()
  let text = ''
  for (let i = 0; i < bytes.length; i += 1) text += String.fromCharCode(bytes[i])
  return text.trim()
}

function safeUrl(input) {
  try {
    const url = new URL(String(input || '').trim())
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    if (!isValidIpv4(url.hostname)) return null
    if (url.port && !isValidPort(url.port)) return null
    if (url.username || url.password || url.hash) return null
    return url
  } catch (err) {
    return null
  }
}

function stripBase(input) {
  return String(input || '').trim().replace(/\/+$/, '')
}

export function normalizeManualIp(input) {
  const raw = String(input || '').trim()
  if (!raw) return ''
  const url = safeUrl(/^https?:\/\//i.test(raw) ? raw : `http://${raw}`)
  if (!url || url.pathname !== '/' || url.search) return ''
  return stripBase(url.toString())
}

export function buildBaseUrl(ip, port = 80, protocol = 'http:') {
  if (!isValidIpv4(ip) || !isValidPort(port) || !/^https?:$/.test(protocol)) return ''
  return `${protocol}//${ip}${Number(port) === 80 ? '' : `:${Number(port)}`}`
}

function ensureBase(base) {
  return normalizeManualIp(base)
}

function urlForPath(base, path) {
  const normalized = ensureBase(base)
  if (!normalized) return ''
  const url = new URL(normalized)
  url.pathname = path
  url.search = ''
  return url.toString()
}

function isDeviceUrl(value, ip) {
  const url = safeUrl(value)
  return Boolean(url && url.hostname === ip)
}

export function parseEsp32CamMessage(msg) {
  const text = decodeText(msg)
  if (!text.startsWith('ESP32CAM|')) return null
  const out = {}
  text.split('|').slice(1).forEach((part) => {
    const idx = part.indexOf('=')
    if (idx <= 0) return
    const key = part.slice(0, idx).trim().toUpperCase()
    const value = part.slice(idx + 1).trim()
    if (key) out[key] = value
  })
  if (!isValidIpv4(out.IP)) return null
  const port = out.PORT == null || out.PORT === '' ? 80 : Number(out.PORT)
  if (!isValidPort(port)) return null
  if (out.STREAM && !isDeviceUrl(out.STREAM, out.IP)) return null
  if (out.CAPTURE && !isDeviceUrl(out.CAPTURE, out.IP)) return null
  const base = buildBaseUrl(out.IP, port)
  return {
    ...out,
    PORT: String(port),
    BASE: base,
    STREAM: out.STREAM || buildStreamUrl(base),
    CAPTURE: out.CAPTURE || buildCaptureUrl(base)
  }
}

export function buildControlUrl(base, variable, value) {
  const url = urlForPath(base, '/control')
  if (!url) return ''
  return `${url}?var=${encodeURIComponent(variable)}&val=${encodeURIComponent(value)}`
}

export function buildCaptureUrl(base) {
  return urlForPath(base, '/capture')
}

export function buildStreamUrl(base) {
  const normalized = ensureBase(base)
  if (!normalized) return ''
  const url = new URL(normalized)
  // A manually supplied non-standard port normally already identifies the stream server.
  url.port = url.port && url.port !== '80' ? url.port : '81'
  url.pathname = '/stream'
  url.search = ''
  return url.toString()
}

export function buildStatusUrl(base) {
  return urlForPath(base, '/status')
}

export function guessBroadcastAddresses() {
  return ['255.255.255.255', '192.168.223.255', '192.168.43.255', '192.168.4.255']
}
