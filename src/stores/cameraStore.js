import { reactive } from 'vue'

const OFFLINE_MS = 5000

export const devices = reactive([])

export function upsertDevice(raw) {
  if (!raw || !raw.IP) return null
  const key = raw.MAC || raw.IP
  const now = Date.now()
  const record = {
    MAC: raw.MAC || '',
    IP: raw.IP,
    STREAM: raw.STREAM || `http://${raw.IP}:81/stream`,
    CAPTURE: raw.CAPTURE || `http://${raw.IP}/capture`,
    NAME: raw.NAME || 'esp32cam',
    lastSeen: now
  }
  const found = devices.find((d) => (d.MAC || d.IP) === key)
  if (found) {
    Object.assign(found, record)
    return found
  }
  devices.push(record)
  return record
}

export function pruneOffline(now = Date.now()) {
  for (let i = devices.length - 1; i >= 0; i -= 1) {
    if (now - devices[i].lastSeen > OFFLINE_MS) devices.splice(i, 1)
  }
}

export function clear() {
  devices.splice(0, devices.length)
}

export const cameraStore = { devices, upsertDevice, pruneOffline, clear }
