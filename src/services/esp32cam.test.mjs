import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { capturePhoto, closeCamStream, fetchCamStatus, isCamQuality, sendCamControl } from './esp32cam.js'

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

  it('网页端关闭视频流不额外发起请求', async () => {
    await assert.doesNotReject(() => closeCamStream('http://192.168.4.1'))
  })

  it('原生端关闭视频流会发出 closeStream 请求', async () => {
    const calls = []
    await closeCamStream('http://192.168.4.1', {
      supported: true,
      request: async (...args) => calls.push(args)
    })
    assert.deepEqual(calls, [['closeStream', { base: 'http://192.168.4.1' }, 22000]])
  })

  it('原生状态和控制等待两次连接及读取超时后再报桥接超时', async () => {
    const calls = []
    const bridge = { supported: true, request: async (...args) => calls.push(args) }
    await fetchCamStatus('http://192.168.136.102', bridge)
    await sendCamControl('http://192.168.136.102', 'quality', 12, bridge)
    assert.deepEqual(calls, [
      ['status', { base: 'http://192.168.136.102' }, 22000],
      ['control', { base: 'http://192.168.136.102', variable: 'quality', value: 12 }, 22000]
    ])
  })

  it('拍照把保存相册所需的等待时间传给桥接', async () => {
    const calls = []
    await capturePhoto('http://192.168.136.102', {
      supported: true,
      request: async (...args) => calls.push(args)
    })
    assert.deepEqual(calls, [['capture', { base: 'http://192.168.136.102' }, 60000]])
  })
})
