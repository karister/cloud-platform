/**
 * OneNET Token Generator
 *
 * 依据 OneNET 官方文档 https://open.iot.10086.cn/doc/aiot/fuse/detail/1486
 * 实现鉴权 token 的本地计算，无需用户手动拼接。
 *
 * Token 结构:
 *   version=2018-10-31&res=products/{productId}/devices/{deviceName}
 *     &et={expirationSeconds}&method={md5|sha1|sha256}&sign={base64HmacSig}
 *
 * 签名原文:
 *   {et}\n{method}\n{res}\n{version}
 *
 * 签名密钥:
 *   Base64 解码 accessKey 后得到的字节数组作为 HMAC 密钥
 *
 * 签名结果:
 *   Base64(HMAC({method}, key, signText))，再 URL-encode 后作为 sign 参数
 *
 * 本模块使用 crypto-js 实现 MD5/SHA1/SHA256 + HMAC，以保证在 H5、
 * 微信小程序、App 等 uni-app 目标平台上都能运行一致。
 */

import CryptoJS from 'crypto-js'

const TOKEN_VERSION = '2018-10-31'
const SUPPORTED_METHODS = ['md5', 'sha1', 'sha256']
const DEFAULT_METHOD = 'md5'

// crypto-js 的 WordArray 默认按大端解释字节，而我们存储/解析 Base64
// 时是按字节流处理的。下面的 helper 负责二者之间的双向转换，确保
// HMAC 使用的密钥字节序列与 Java 端一致。
function bytesToWordArray(bytes) {
  // bytes: number[]
  const words = []
  for (let i = 0; i < bytes.length; i++) {
    words[i >>> 2] |= bytes[i] << (24 - (i % 4) * 8)
  }
  return CryptoJS.lib.WordArray.create(words, bytes.length)
}

function wordArrayToBytes(wordArray) {
  const { words, sigBytes } = wordArray
  const out = []
  for (let i = 0; i < sigBytes; i++) {
    out.push((words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)
  }
  return out
}

function base64ToWordArray(b64) {
  return CryptoJS.enc.Base64.parse(b64)
}

function wordArrayToBase64(wordArray) {
  return CryptoJS.enc.Base64.stringify(wordArray)
}

/**
 * 与 Java URLEncoder.encode(str, "UTF-8") 行为一致：
 * 字母数字和 * - . _ ~ 不编码，空格编码为 +，其余字符使用 %XX。
 */
export function urlEncode(str) {
  return encodeURIComponent(str)
    .replace(/%20/g, '+')
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}

/**
 * 生成 OneNET 鉴权 token。
 *
 * @param {object} options
 * @param {string} options.productId  产品 ID
 * @param {string} options.deviceName 设备名称
 * @param {string} options.accessKey  设备 accessKey (Base64 字符串)
 * @param {number} [options.expirationSeconds] 过期时间(秒)。默认当前时间+100天。
 * @param {string} [options.method] 签名算法 md5/sha1/sha256，默认 md5。
 * @returns {string} token 字符串（已拼好，可直接作为 Authorization 头使用）
 */
export function generateOneNetToken(options) {
  const productId = String(options?.productId || '').trim()
  const deviceName = String(options?.deviceName || '').trim()
  const accessKey = String(options?.accessKey || '').trim()
  const method = String(options?.method || DEFAULT_METHOD).toLowerCase()
  const expirationSeconds = Number.isFinite(options?.expirationSeconds)
    ? Math.floor(options.expirationSeconds)
    : Math.floor(Date.now() / 1000) + 100 * 24 * 60 * 60

  if (!productId || !deviceName || !accessKey) {
    throw new Error('生成 token 缺少必要参数 (productId/deviceName/accessKey)')
  }
  if (!SUPPORTED_METHODS.includes(method)) {
    throw new Error(`不支持的签名方法: ${method}`)
  }

  const res = `products/${productId}/devices/${deviceName}`
  const encryptText = `${expirationSeconds}\n${method}\n${res}\n${TOKEN_VERSION}`

  // crypto-js 的 HmacSHA1 等支持直接传入 WordArray 形式的密钥，
  // 这里先把 base64 字符串解析为 WordArray，让密钥的字节序列与
  // Java 端 Base64.getDecoder().decode(accessKey) 完全一致。
  const keyWords = base64ToWordArray(accessKey)
  const messageWords = CryptoJS.enc.Utf8.parse(encryptText)

  const hasher = method === 'md5'
    ? CryptoJS.algo.HMAC.create(CryptoJS.algo.MD5, keyWords)
    : method === 'sha1'
      ? CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA1, keyWords)
      : CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, keyWords)

  hasher.update(messageWords)
  const signatureWords = hasher.finalize()
  const signature = wordArrayToBase64(signatureWords)

  return [
    `version=${TOKEN_VERSION}`,
    `res=${urlEncode(res)}`,
    `et=${expirationSeconds}`,
    `method=${method}`,
    `sign=${urlEncode(signature)}`
  ].join('&')
}

export const ONENET_TOKEN_VERSION = TOKEN_VERSION
export const ONENET_SUPPORTED_METHODS = SUPPORTED_METHODS
export const ONENET_DEFAULT_METHOD = DEFAULT_METHOD

// 暴露给单元测试使用
export const __internal = {
  urlEncode,
  wordArrayToBytes,
  bytesToWordArray,
  wordArrayToBase64,
  base64ToWordArray,
  generateOneNetToken
}
