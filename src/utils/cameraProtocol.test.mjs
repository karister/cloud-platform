import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  FRAMESIZE_MAP,
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

  it('解析真实 UDP 二进制回包和有偏移的 TypedArray', () => {
    const text = 'ESP32CAM|IP=10.196.135.102|PORT=80|STREAM=http://10.196.135.102:81/stream|CAPTURE=http://10.196.135.102/capture|MAC=AA:BB:CC:DD:EE:FF'
    const bytes = new TextEncoder().encode(`xx${text}yy`)
    const dev = parseEsp32CamMessage(new Uint8Array(bytes.buffer, 2, text.length))
    assert.equal(dev.IP, '10.196.135.102')
    assert.equal(dev.STREAM, 'http://10.196.135.102:81/stream')
  })

  it('拒绝不安全的地址、端口和设备 URL', () => {
    assert.equal(parseEsp32CamMessage('ESP32CAM|IP=999.1.1.1|PORT=80'), null)
    assert.equal(parseEsp32CamMessage('ESP32CAM|IP=192.168.4.1|PORT=70000'), null)
    assert.equal(parseEsp32CamMessage('ESP32CAM|IP=192.168.4.1|STREAM=http://example.com/stream'), null)
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
    assert.equal(normalizeManualIp('https://192.168.4.1:8080/'), 'https://192.168.4.1:8080')
    assert.equal(normalizeManualIp('not-an-ip'), '')
  })

  it('URL 拼装', () => {
    assert.equal(buildControlUrl('http://192.168.4.1', 'framesize', 8), 'http://192.168.4.1/control?var=framesize&val=8')
    assert.equal(buildCaptureUrl('http://192.168.4.1/'), 'http://192.168.4.1/capture')
    assert.equal(buildStatusUrl('192.168.4.1'), 'http://192.168.4.1/status')
    assert.equal(buildStreamUrl('http://192.168.4.1'), 'http://192.168.4.1:81/stream')
    assert.equal(buildStreamUrl('http://192.168.4.1:81'), 'http://192.168.4.1:81/stream')
  })

  it('使用与现场固件一致的分辨率枚举', () => {
    assert.deepEqual(FRAMESIZE_MAP.map((item) => item.value), [5, 8, 9, 10, 13])
  })

  it('广播地址猜测含兜底', () => {
    const list = guessBroadcastAddresses()
    assert.ok(list.includes('255.255.255.255'))
    assert.ok(list.includes('192.168.223.255'))
    assert.ok(list.includes('192.168.43.255'))
    assert.ok(list.includes('192.168.4.255'))
  })
})
