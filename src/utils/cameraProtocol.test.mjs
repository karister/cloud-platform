import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  buildCaptureUrl,
  buildControlUrl,
  buildStatusUrl,
  buildStreamUrl,
  guessBroadcastAddresses,
  normalizeManualIp,
  parseEsp32CamMessage
} from './cameraProtocol.js'

describe('cameraProtocol', () => {
  it('解析标准广播消息', () => {
    const msg = 'ESP32CAM|IP=192.168.223.102|PORT=80|STREAM=http://192.168.223.102:81/stream|CAPTURE=http://192.168.223.102/capture|MAC=AA:BB:CC:DD:EE:FF|NAME=esp32cam'
    const dev = parseEsp32CamMessage(msg)
    assert.equal(dev.IP, '192.168.223.102')
    assert.equal(dev.PORT, '80')
    assert.equal(dev.STREAM, 'http://192.168.223.102:81/stream')
    assert.equal(dev.CAPTURE, 'http://192.168.223.102/capture')
    assert.equal(dev.MAC, 'AA:BB:CC:DD:EE:FF')
    assert.equal(dev.NAME, 'esp32cam')
  })

  it('非协议消息返回 null', () => {
    assert.equal(parseEsp32CamMessage('HELLO'), null)
    assert.equal(parseEsp32CamMessage(''), null)
    assert.equal(parseEsp32CamMessage('ESP32CAM|FOO=bar'), null)
  })

  it('手动 IP 归一化', () => {
    assert.equal(normalizeManualIp('192.168.223.102'), 'http://192.168.223.102')
    assert.equal(normalizeManualIp('http://192.168.4.1/'), 'http://192.168.4.1')
    assert.equal(normalizeManualIp(''), '')
  })

  it('URL 拼装', () => {
    assert.equal(buildControlUrl('http://192.168.4.1', 'framesize', 8), 'http://192.168.4.1/control?var=framesize&val=8')
    assert.equal(buildCaptureUrl('http://192.168.4.1/'), 'http://192.168.4.1/capture')
    assert.equal(buildStatusUrl('192.168.4.1'), 'http://192.168.4.1/status')
    assert.equal(buildStreamUrl('http://192.168.4.1'), 'http://192.168.4.1:81/stream')
  })

  it('广播地址猜测含兜底', () => {
    const list = guessBroadcastAddresses()
    assert.ok(list.includes('255.255.255.255'))
    assert.ok(list.includes('192.168.223.255'))
    assert.ok(list.includes('192.168.43.255'))
    assert.ok(list.includes('192.168.4.255'))
  })
})
