/**
 * Email Service — EmailJS Integration
 *
 * Sends configuration files via email using EmailJS (free tier: 200 emails/month).
 * The EmailJS SDK is loaded dynamically from CDN to avoid increasing the app bundle.
 *
 * Usage:
 *   1. User registers at https://dashboard.emailjs.com (free)
 *   2. Creates an Email Service (SMTP or built-in)
 *   3. Creates an Email Template with variables:
 *      - to_email, configJson, exportTime, appName, themeId
 *   4. Copies Service ID, Template ID, and Public Key
 *   5. Enters them in the app's "Configure Email" form
 *   6. Uses the "Send to Email" button on the export modal
 */

const EMAIL_CONFIG_KEY = 'cloud_comm_email_config'

// Hardcoded default EmailJS credentials (user configured)
const DEFAULT_EMAIL_CONFIG = {
  publicKey: 'B5wGGu6GgLI_-bDpa',
  serviceId: 'service_1uqqwbl',
  templateId: 'template_45uum6a'
}

/**
 * Read saved EmailJS credentials from storage.
 * Falls back to hardcoded defaults if nothing saved.
 * @returns {{ publicKey: string, serviceId: string, templateId: string }}
 */
export function getEmailConfig() {
  try {
    const saved = uni.getStorageSync(EMAIL_CONFIG_KEY)
    if (saved && saved.publicKey && saved.serviceId && saved.templateId) {
      return saved
    }
  } catch (e) {
    // ignore
  }
  return { ...DEFAULT_EMAIL_CONFIG }
}

/**
 * Save EmailJS credentials to storage.
 * @param {{ publicKey: string, serviceId: string, templateId: string }} config
 */
export function saveEmailConfig(config) {
  uni.setStorageSync(EMAIL_CONFIG_KEY, {
    publicKey: config.publicKey || '',
    serviceId: config.serviceId || '',
    templateId: config.templateId || ''
  })
}

/**
 * Check whether EmailJS has been fully configured.
 * @returns {boolean}
 */
export function isEmailConfigured() {
  const { publicKey, serviceId, templateId } = getEmailConfig()
  return !!(publicKey && serviceId && templateId)
}

/**
 * Dynamically load the EmailJS browser SDK from CDN.
 * Only loads once per session.
 * @returns {Promise<void>}
 */
let emailjsPromise = null

function ensureEmailJS() {
  if (emailjsPromise) return emailjsPromise

  // Already loaded globally (e.g. by a previous call)
  if (typeof emailjs !== 'undefined') {
    emailjsPromise = Promise.resolve()
    return emailjsPromise
  }

  emailjsPromise = new Promise((resolve, reject) => {
    if (typeof document === 'undefined' || !document.createElement) {
      reject(new Error('当前平台不支持邮件发送'))
      return
    }

    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
    script.async = true
    script.onload = () => {
      if (typeof emailjs !== 'undefined') {
        resolve()
      } else {
        reject(new Error('邮件服务加载失败'))
      }
    }
    script.onerror = () => {
      // Reset so a retry can attempt again
      emailjsPromise = null
      reject(new Error('邮件服务加载失败，请检查网络连接'))
    }
    document.head.appendChild(script)
  })

  return emailjsPromise
}

/**
 * Send the configuration JSON via email using EmailJS.
 * @param {string} recipient — email address of the recipient
 * @param {string} configJson — pretty-printed JSON string of the config
 * @param {string} appName — app name for the email template
 * @param {string} themeId — theme ID for the email template
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function sendConfigEmail(recipient, configJson, appName, themeId) {
  const { publicKey, serviceId, templateId } = getEmailConfig()

  if (!publicKey || !serviceId || !templateId) {
    return { success: false, error: '请先在配置中设置邮箱服务凭据' }
  }

  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return { success: false, error: '请输入有效的邮箱地址' }
  }

  try {
    await ensureEmailJS()
  } catch (err) {
    return { success: false, error: err.message }
  }

  try {
    const templateParams = {
      to_email: recipient,
      configJson: configJson,
      exportTime: new Date().toLocaleString('zh-CN', { hour12: false }),
      appName: appName || '云平台数据通信',
      themeId: themeId || 'amber'
    }

    emailjs.init(publicKey)
    const result = await emailjs.send(serviceId, templateId, templateParams)

    if (result && result.status === 200) {
      return { success: true }
    }
    return { success: false, error: '邮件发送失败，状态码: ' + (result?.status || '未知') }
  } catch (err) {
    console.warn('[EmailJS] send error:', err)

    // Try to surface a useful error message
    let msg = '邮件发送失败'
    if (err && typeof err === 'object') {
      if (err.text) msg += ': ' + err.text
      else if (err.message) msg += ': ' + err.message
      else msg += '（请查看控制台详情）'
    }

    // Rate limit detection
    if (err && (err.status === 429 || /rate|limit/i.test(err.text || err.message || ''))) {
      msg = '本月免费额度已用完，请下月再试或更换邮箱服务'
    }
    // Auth error
    if (err && (err.status === 401 || err.status === 403)) {
      msg = '邮箱服务配置错误，请检查 API 密钥'
    }

    return { success: false, error: msg }
  }
}
