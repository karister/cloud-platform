import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { candidateIps, isCameraStatus } from './cameraDiscovery.js'

describe('cameraDiscovery', () => {
  it('完整 IP 直接透传', () => {
    assert.deepEqual(candidateIps(['192.168.4.1']), ['192.168.4.1'])
  })

  it('/24 网段展开，包含可能运行摄像头的 .1', () => {
    const ips = candidateIps(['192.168.43'])
    assert.equal(ips.length, 254)
    assert.ok(ips.includes('192.168.43.1'))
    assert.ok(ips.includes('192.168.43.2'))
    assert.ok(ips.includes('192.168.43.254'))
  })

  it('多网段合并去重', () => {
    const ips = candidateIps(['192.168.43', '192.168.4.1', '192.168.43'])
    assert.equal(ips.length, 255)
  })

  it('仅把包含 ESP32 摄像头状态字段的响应视为设备', () => {
    assert.equal(isCameraStatus({ framesize: 9, quality: 12, brightness: 0 }), true)
    assert.equal(isCameraStatus('{"framesize":9,"quality":12}'), true)
    assert.equal(isCameraStatus({ ok: true }), false)
  })
})
