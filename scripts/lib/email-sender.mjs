/**
 * EmailSender — server-side EmailJS REST API client.
 *
 * The existing browser-side email service (src/services/emailService.js)
 * uses EmailJS's web SDK and depends on `document`. The release pipeline
 * runs under Node, so we use the same service from the REST endpoint:
 *   POST https://api.emailjs.com/api/v1.0/email/send
 *
 * Sends a multipart/form-data body with template variables, plus a
 * pre-rendered HTML body so the template can be minimal (just a thin
 * wrapper around the variables) while the rich layout lives in code.
 *
 * The recipient, appName, version, fileSize, download URL, install
 * password, and update description are passed as template params; the
 * HTML body is sent under `body_html` and the plain-text fallback under
 * `body_text` so the template can either inline them or ignore them.
 */

import { info, warn, error, maskForLog } from './logger.mjs'

const EMAILJS_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send'
const REQUEST_TIMEOUT_MS = 30 * 1000

/**
 * Render a friendly file size for emails (KB/MB/GB).
 *
 * @param {number} bytes
 */
function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value.toFixed(value >= 10 || unit === 0 ? 0 : 2)} ${units[unit]}`
}

/**
 * Escape user-controlled text for safe inclusion in HTML.
 * @param {string} value
 */
function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * Build the plain-text body.
 * @param {{
 *   appName: string, versionName: string, versionCode: string|number,
 *   fileSize: number, downloadUrl: string, installPassword: string,
 *   updateDescription: string, expireDays: number
 * }} vars
 */
function renderText(vars) {
  const lines = [
    `【应用内测包】${vars.appName} v${vars.versionName} 已生成`,
    '',
    `应用名称: ${vars.appName}`,
    `版本号  : ${vars.versionName}`,
    `构建版本: ${vars.versionCode}`,
    `包大小  : ${formatBytes(vars.fileSize)}`,
    `下载地址: ${vars.downloadUrl}`,
    `安装密码: ${vars.installPassword || '(无)'}`,
    `有效期  : ${vars.expireDays} 天`,
    '',
    '更新说明:',
    vars.updateDescription || '(无)',
    '',
    '请使用 Android 手机打开下载链接,按照页面提示下载安装。',
    '该链接仅用于内部测试,请不要转发给无关人员。'
  ]
  return lines.join('\n')
}

/**
 * Build the HTML body. Inline styles only — most email clients strip
 * <style> blocks.
 *
 * @param {ReturnType<typeof renderText> extends string ? Parameters<typeof renderText>[0] : never} vars
 */
function renderHtml(vars) {
  const safe = {
    appName: escapeHtml(vars.appName),
    versionName: escapeHtml(vars.versionName),
    versionCode: escapeHtml(vars.versionCode),
    fileSize: escapeHtml(formatBytes(vars.fileSize)),
    downloadUrl: escapeHtml(vars.downloadUrl),
    installPassword: escapeHtml(vars.installPassword || '(无)'),
    updateDescription: escapeHtml(vars.updateDescription || '(无)'),
    expireDays: escapeHtml(String(vars.expireDays))
  }
  return `<!doctype html>
<html lang="zh-CN">
  <head><meta charset="utf-8" /><title>内测包发布通知</title></head>
  <body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1f2937;">
    <div style="max-width:560px;margin:24px auto;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <div style="background:#2563eb;color:#ffffff;padding:20px 24px;">
        <h1 style="margin:0;font-size:18px;font-weight:600;">【应用内测包】${safe.appName} v${safe.versionName} 已生成</h1>
      </div>
      <div style="padding:24px;">
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;line-height:1.6;">
          <tr><td style="color:#6b7280;width:96px;">应用名称</td><td style="font-weight:600;">${safe.appName}</td></tr>
          <tr><td style="color:#6b7280;">版本号</td><td>${safe.versionName}</td></tr>
          <tr><td style="color:#6b7280;">构建版本</td><td>${safe.versionCode}</td></tr>
          <tr><td style="color:#6b7280;">包大小</td><td>${safe.fileSize}</td></tr>
        </table>

        <div style="margin:24px 0;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;text-align:center;">
          <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">下载地址(链接 ${safe.expireDays} 天内有效)</div>
          <a href="${safe.downloadUrl}" style="display:inline-block;padding:10px 20px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:4px;font-weight:600;word-break:break-all;">点击下载内测包</a>
          <div style="margin-top:8px;font-size:12px;color:#9ca3af;word-break:break-all;">${safe.downloadUrl}</div>
        </div>

        <div style="margin:0 0 24px 0;padding:16px;background:#fff7ed;border:1px solid #fed7aa;border-radius:6px;">
          <div style="font-size:12px;color:#9a3412;margin-bottom:4px;">安装密码</div>
          <div style="font-size:20px;font-weight:700;letter-spacing:4px;color:#9a3412;">${safe.installPassword}</div>
        </div>

        <div style="margin:0 0 16px 0;">
          <div style="font-size:12px;color:#6b7280;margin-bottom:6px;">更新说明</div>
          <div style="white-space:pre-wrap;font-size:14px;line-height:1.6;">${safe.updateDescription}</div>
        </div>

        <div style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;line-height:1.6;">
          请使用 Android 手机打开下载链接,按照页面提示下载安装。<br/>
          该链接仅用于内部测试,请不要转发给无关人员。
        </div>
      </div>
    </div>
  </body>
</html>`
}

/**
 * @typedef {Object} SendEmailParams
 * @property {string} publicKey
 * @property {string} serviceId
 * @property {string} templateId
 * @property {string} recipient
 * @property {string} appName
 * @property {string} versionName
 * @property {string|number} versionCode
 * @property {number} fileSize
 * @property {string} downloadUrl
 * @property {string} installPassword
 * @property {string} updateDescription
 * @property {number} expireDays
 */

/**
 * Send a release notification email via EmailJS REST.
 *
 * @param {SendEmailParams} params
 * @returns {Promise<{ success: boolean, status?: number, error?: string }>}
 */
export async function sendReleaseEmail(params) {
  const {
    publicKey,
    serviceId,
    templateId,
    recipient,
    appName,
    versionName,
    versionCode,
    fileSize,
    downloadUrl,
    installPassword,
    updateDescription,
    expireDays
  } = params || {}

  if (!publicKey || !serviceId || !templateId) {
    return { success: false, error: 'EmailJS credentials are incomplete' }
  }
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return { success: false, error: `Invalid recipient email: ${recipient}` }
  }
  if (!downloadUrl) {
    return { success: false, error: 'downloadUrl is required' }
  }

  const vars = {
    appName,
    versionName,
    versionCode,
    fileSize,
    downloadUrl,
    installPassword,
    updateDescription,
    expireDays
  }
  const text = renderText(vars)
  const html = renderHtml(vars)

  const subject = `【应用内测包】${appName} v${versionName} 已生成`

  // The EmailJS REST endpoint accepts either JSON or form-encoded.
  // Recent versions of the API prefer JSON; sending as JSON avoids the
  // "Public Key is required" 400 that the form-encoded path returns
  // when the parser cannot find `user_id`.
  const payload = {
    lib_version: 'rest-v1',
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: publicKey,
    template_params: {
      to_email: recipient,
      to_name: recipient,
      subject,
      app_name: appName,
      version_name: String(versionName),
      version_code: String(versionCode),
      file_size: formatBytes(fileSize),
      download_url: downloadUrl,
      install_password: installPassword || '',
      update_description: updateDescription || '',
      expire_days: String(expireDays),
      body_html: html,
      body_text: text
    }
  }

  info(`Sending email to ${recipient} via EmailJS (service=${serviceId}, template=${templateId})...`)
  info(`EmailJS user_id : ${maskForLog(publicKey)}`)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const response = await fetch(EMAILJS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'https://api.emailjs.com',
        referer: 'https://api.emailjs.com/'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    })

    if (response.ok) {
      // EmailJS returns "OK" on a 200 even when the downstream SMTP
      // might have failed silently. We log the body to surface
      // anything that comes back beyond the bare 200.
      let detail = ''
      try {
        detail = (await response.text()).slice(0, 200)
      } catch {
        // ignore
      }
      info(`Email sent successfully (HTTP ${response.status}).`)
      if (detail && detail !== 'OK') info(`EmailJS response body: ${detail}`)
      return { success: true, status: response.status, detail }
    }

    let detail = ''
    try {
      detail = await response.text()
    } catch {
      // ignore
    }
    const msg = `EmailJS returned HTTP ${response.status}: ${detail || response.statusText}`
    warn(msg)
    return { success: false, status: response.status, error: msg }
  } catch (err) {
    const isAbort = err && (err.name === 'AbortError' || err.code === 'ABORT_ERR')
    const msg = isAbort
      ? `Email request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`
      : (err && err.message) || String(err)
    error(`Email send failed: ${msg}`)
    return { success: false, error: msg }
  } finally {
    clearTimeout(timer)
  }
}

export { EMAILJS_ENDPOINT, REQUEST_TIMEOUT_MS, formatBytes, renderText, renderHtml }
