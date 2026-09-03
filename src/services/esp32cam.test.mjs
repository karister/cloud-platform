import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { isCamQuality, sendCamControl } from './esp32cam.js'

describe('esp32cam service', () => {
  it('接受固件支持的画质范围 4–63', () => {
    assert.equal(isCamQuality(4), true)
    assert.equal(isCamQuality(63), true)
    assert.equal(isCamQuality(3), false)
    assert.equal(isCamQuality(64), false)
  })

  it('在发送请求前拒绝非法画质', async () => {
    await assert.rejects(() => sendCamControl('http://192.168.4.1', 'quality', 64), /4–63/)
  })
})
