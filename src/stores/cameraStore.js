import { reactive } from 'vue'
import { buildBaseUrl, buildCaptureUrl, buildStreamUrl } from '../utils/cameraProtocol.js'

export const OFFLINE_MS = 5000
export const devices = reactive([])

function deviceBase(raw) {
  return raw.BASE || buildBaseUrl(raw.IP, raw.PORT || 80)
}

function findMatches(raw) {
  return devices.filter((device) => (raw.MAC && device.MAC === raw.MAC) || device.IP === raw.IP)
}

export function upsertDevice(raw) {
  if (!raw || !raw.IP) return null
  const now = Number(raw.now) || Date.now()
  const base = deviceBase(raw)
  if (!base) return null
  const record = {
    MAC: raw.MAC || '',
    IP: raw.IP,
    PORT: String(raw.PORT || new URL(base).port || 80),
    BASE: base,
    STREAM: raw.STREAM || buildStreamUrl(base),
    CAPTURE: raw.CAPTURE || buildCaptureUrl(base),
    NAME: raw.NAME || 'esp32cam',
    source: raw.source || raw.SOURCE || 'manual',
    lastSeen: now,
    lastSuccessfulAt: now,
    isOnline: true,
    lastError: ''
  }
  const matches = findMatches(raw)
  const found = matches[0]
  if (found) {
    Object.assign(found, record, { MAC: raw.MAC || found.MAC })
    // A previously IP-only HTTP record can be joined to an existing MAC record.
    matches.slice(1).forEach((duplicate) => {
      const index = devices.indexOf(duplicate)
      if (index >= 0) devices.splice(index, 1)
    })
    return found
  }
  devices.push(record)
  return record
}

export function markSuccess(target, now = Date.now()) {
  const device = typeof target === 'string' ? devices.find((item) => item.IP === target || item.MAC === target) : target
  if (!device) return null
  device.lastSeen = now
  device.lastSuccessfulAt = now
  device.isOnline = true
  device.lastError = ''
  return device
}

export function markFailure(target, error = '') {
  const device = typeof target === 'string' ? devices.find((item) => item.IP === target || item.MAC === target) : target
  if (device) device.lastError = String(error || '')
  return device || null
}

export function pruneOffline(now = Date.now()) {
  devices.forEach((device) => {
    if (now - device.lastSuccessfulAt > OFFLINE_MS) device.isOnline = false
  })
}

export function clear() {
  devices.splice(0, devices.length)
}

export const cameraStore = { devices, upsertDevice, markSuccess, markFailure, pruneOffline, clear }
