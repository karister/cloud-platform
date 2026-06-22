/**
 * PgyerUploadService — upload an APK to 蒲公英 (Pgyer).
 *
 * Endpoint: https://www.pgyer.com/apiv2/app/upload (POST, multipart/form-data)
 * Docs:     https://www.pgyer.com/doc/view/apiv2_upload_app
 *
 * Returns a unified {@link UploadResult}. Throws only on programmer errors
 * (bad arguments); operational failures (network, 4xx/5xx) populate
 * `success: false` with an explanatory `errorMessage`.
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { info, warn, error, maskForLog } from './logger.mjs'

const PGYER_UPLOAD_URL = 'https://www.pgyer.com/apiv2/app/upload'
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 2000
/** Per-request timeout. Pgyer uploads can be slow on big APKs. */
const REQUEST_TIMEOUT_MS = 5 * 60 * 1000
const SOFT_FILE_LIMIT_BYTES = 1500 * 1024 * 1024 // 1500 MB — Pgyer free tier cap

/**
 * @typedef {Object} UploadResult
 * @property {boolean} success
 * @property {string}  [appName]
 * @property {string}  [versionName]
 * @property {string|number} [versionCode]
 * @property {string}  [buildKey]
 * @property {string}  [downloadUrl]
 * @property {string}  [shortcutUrl]
 * @property {string}  [qrCodeUrl]
 * @property {string}  [installPassword]
 * @property {number}  [fileSize]
 * @property {string}  [updateDescription]
 * @property {string}  [errorMessage]
 * @property {number}  [attempts]
 * @property {Object}  [raw]
 */

/**
 * Inspect the APK before uploading. Returns a small descriptor used in
 * logs and the final UploadResult.
 *
 * @param {string} apkPath
 * @returns {{ exists: boolean, size: number, name: string, sizeText: string }}
 */
function inspectApk(apkPath) {
  const abs = path.resolve(apkPath)
  const exists = fs.existsSync(abs)
  if (!exists) {
    return { exists: false, size: 0, name: path.basename(abs), sizeText: '0 B' }
  }
  const stat = fs.statSync(abs)
  return {
    exists: true,
    size: stat.size,
    name: path.basename(abs),
    sizeText: formatBytes(stat.size)
  }
}

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
 * Try to extract a buildKey from a Pgyer response that doesn't follow
 * the documented shape. The real API returns a numeric `code` (0 = ok)
 * and a `data` object; some errors return strings inside `data`.
 *
 * @param {any} json
 */
function extractBuildKey(json) {
  if (!json) return null
  const candidates = [json?.data?.buildKey, json?.data?.buildKeyShort, json?.buildKey]
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 0) return c
  }
  return null
}

function buildFailureResult(reason, extra = {}) {
  return {
    success: false,
    errorMessage: reason,
    attempts: extra.attempts ?? 1,
    raw: extra.raw
  }
}

/**
 * Upload the APK to Pgyer. Retries up to MAX_RETRIES times on transient
 * failures (network errors, 5xx, aborts). On permanent failure returns
 * an UploadResult with success=false; never throws for operational
 * reasons.
 *
 * @param {{
 *   apkPath: string,
 *   apiKey: string,
 *   installPassword?: string,
 *   installType?: string|number,
 *   updateDescription?: string,
 *   appName?: string,
 *   versionName?: string,
 *   versionCode?: string|number,
 * }} options
 * @returns {Promise<UploadResult>}
 */
export async function uploadApk(options) {
  const {
    apkPath,
    apiKey,
    installPassword = '',
    installType = 1,
    updateDescription = '',
    appName = '',
    versionName = '',
    versionCode = ''
  } = options || {}

  if (!apkPath) {
    return buildFailureResult('APK path is required')
  }
  if (!apiKey) {
    return buildFailureResult('PGYER_API_KEY is required')
  }

  const meta = inspectApk(apkPath)
  if (!meta.exists) {
    return buildFailureResult(`APK not found: ${apkPath}`)
  }
  if (meta.size <= 0) {
    return buildFailureResult(`APK is empty: ${apkPath}`)
  }
  if (meta.size > SOFT_FILE_LIMIT_BYTES) {
    return buildFailureResult(
      `APK too large: ${meta.sizeText} (Pgyer free tier limit is ${formatBytes(
        SOFT_FILE_LIMIT_BYTES
      )})`
    )
  }

  info(`APK path         : ${apkPath}`)
  info(`APK size         : ${meta.sizeText}`)
  info(`APK filename     : ${meta.name}`)
  info(`PGYER_API_KEY    : ${maskForLog(apiKey)}`)
  if (installPassword) info(`Install password : ${installPassword} (${installPassword.length} chars)`)
  info(`Install type     : ${installType}`)

  const form = new FormData()
  // `_api_key` is the documented field; the file field must be `file`.
  form.set('_api_key', apiKey)
  form.set('buildInstallType', String(installType))
  form.set('buildUpdateDescription', updateDescription)
  if (installPassword) form.set('buildPassword', installPassword)

  // Node 18+ File API: append a Blob backed by a read stream of the APK.
  // We use fs.readFileSync to keep the implementation simple and reliable;
  // APKs of a few hundred MB are fine to hold in memory briefly.
  info('Reading APK into memory...')
  const apkBuffer = fs.readFileSync(apkPath)
  info(`Read ${formatBytes(apkBuffer.length)} into memory.`)
  form.set('file', new Blob([apkBuffer], { type: 'application/vnd.android.package-archive' }), meta.name)

  let lastError = null
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    info(`Upload attempt ${attempt}/${MAX_RETRIES}...`)
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
      let response
      try {
        response = await fetch(PGYER_UPLOAD_URL, {
          method: 'POST',
          body: form,
          signal: controller.signal
        })
      } finally {
        clearTimeout(timer)
      }

      const text = await response.text()
      let json = null
      try {
        json = text ? JSON.parse(text) : null
      } catch {
        // Some Pgyer error paths return non-JSON; keep the raw text.
      }

      const code = json?.code
      const ok = response.ok && (code === 0 || code === undefined)

      if (ok) {
        const data = json?.data || {}
        const buildKey = extractBuildKey(json) || data.buildKey
        const downloadUrl =
          data.buildShortcutUrl || data.buildQRCodeURL || data.buildURL || data.appUrl || null
        if (!buildKey || !downloadUrl) {
          return {
            ...buildFailureResult('Pgyer returned OK but no buildKey/downloadUrl', {
              attempts: attempt,
              raw: json
            })
          }
        }
        info(`Upload success on attempt ${attempt}.`)
        info(`Build key        : ${buildKey}`)
        info(`Download URL     : ${downloadUrl}`)
        return {
          success: true,
          appName: appName || data.appName || '',
          versionName: versionName || data.buildVersion || data.buildName || '',
          versionCode: versionCode || data.buildVersionNo || data.buildBuildVersion || '',
          buildKey,
          downloadUrl,
          shortcutUrl: data.buildShortcutUrl || downloadUrl,
          qrCodeUrl: data.buildQRCodeURL || data.appQRCodeURL || '',
          installPassword: installPassword || '',
          fileSize: meta.size,
          updateDescription: updateDescription || '',
          attempts: attempt,
          raw: json
        }
      }

      // Non-OK: capture reason and decide whether to retry.
      const reason =
        (json && (json.message || json.error || json.msg)) ||
        `HTTP ${response.status} ${response.statusText}`.trim()
      lastError = reason
      warn(`Upload failed (attempt ${attempt}): ${reason}`)

      // 4xx (except 408/429) is not retryable — it will not get better.
      if (response.status >= 400 && response.status < 500 && response.status !== 408 && response.status !== 429) {
        return buildFailureResult(reason, { attempts: attempt, raw: json })
      }
    } catch (err) {
      const isAbort = err && (err.name === 'AbortError' || err.code === 'ABORT_ERR')
      lastError = isAbort
        ? `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s`
        : (err && err.message) || String(err)
      warn(`Upload error (attempt ${attempt}): ${lastError}`)
    }

    if (attempt < MAX_RETRIES) {
      const backoff = RETRY_DELAY_MS * attempt
      info(`Retrying in ${backoff / 1000}s...`)
      await new Promise((r) => setTimeout(r, backoff))
    }
  }

  error(`Upload failed after ${MAX_RETRIES} attempts: ${lastError}`)
  return buildFailureResult(lastError || 'Unknown upload error', { attempts: MAX_RETRIES })
}

export { PGYER_UPLOAD_URL, MAX_RETRIES, REQUEST_TIMEOUT_MS, formatBytes, inspectApk }
