import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { cameraStore } from './cameraStore.js'

describe('cameraStore', () => {
  beforeEach(() => cameraStore.clear())

  it('HTTP 记录在取得 MAC 后合并，而不是显示两台设备', () => {
    cameraStore.upsertDevice({ IP: '192.168.4.1', source: 'http' })
    cameraStore.upsertDevice({ IP: '192.168.4.1', MAC: 'AA:BB:CC:DD:EE:FF', source: 'udp' })
    assert.equal(cameraStore.devices.length, 1)
    assert.equal(cameraStore.devices[0].MAC, 'AA:BB:CC:DD:EE:FF')
    assert.equal(cameraStore.devices[0].source, 'udp')
  })

  it('过期设备标为离线但仍保留在列表中，并能恢复', () => {
    const device = cameraStore.upsertDevice({ IP: '192.168.4.1', source: 'http', now: 100 })
    cameraStore.pruneOffline(5_101)
    assert.equal(cameraStore.devices.length, 1)
    assert.equal(device.isOnline, false)
    cameraStore.markSuccess(device, 5_102)
    assert.equal(device.isOnline, true)
  })
})
