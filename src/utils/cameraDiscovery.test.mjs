import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { candidateIps } from './cameraDiscovery.js'

describe('cameraDiscovery', () => {
  it('完整 IP 直接透传', () => {
    assert.deepEqual(candidateIps(['192.168.4.1']), ['192.168.4.1'])
  })

  it('/24 网段展开且跳过网关 .1', () => {
    const ips = candidateIps(['192.168.43'])
    assert.equal(ips.length, 253)
    assert.ok(ips.includes('192.168.43.2'))
    assert.ok(ips.includes('192.168.43.254'))
    assert.ok(!ips.includes('192.168.43.1'))
  })

  it('多网段合并去重', () => {
    const ips = candidateIps(['192.168.43', '192.168.4.1', '192.168.43'])
    assert.equal(ips.length, 254)
  })
})
