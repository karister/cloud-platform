/**
 * Config — load and validate environment variables.
 *
 * Sources (in order of precedence):
 *   1. process.env (system env / CI secret)
 *   2. .env file in the project root (loaded by loadDotEnv below)
 *
 * Sensitive values must NEVER be hardcoded. Callers should treat the
 * returned object as the single source of truth for all release-time
 * configuration.
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

/**
 * Minimal .env parser (no extra dependency).
 * Lines like `KEY=value` and `export KEY=value`, ignoring `#` comments.
 * Quoted values are unwrapped; `\n` is preserved literally.
 *
 * @param {string} filePath
 * @returns {Record<string, string>}
 */
function parseDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const text = fs.readFileSync(filePath, 'utf8')
  const out = {}
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue
    const stripped = line.startsWith('export ') ? line.slice(7) : line
    const eq = stripped.indexOf('=')
    if (eq < 0) continue
    const key = stripped.slice(0, eq).trim()
    let value = stripped.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    out[key] = value
  }
  return out
}

const PROJECT_ROOT = (() => {
  // scripts/lib/config.mjs → ../../  is the project root
  const here = path.dirname(fileURLToPath(import.meta.url))
  return path.resolve(here, '..', '..')
})()

/**
 * Load .env into process.env without overriding existing values.
 * Existing env vars take precedence over file values.
 */
export function loadDotEnv() {
  const envPath = path.join(PROJECT_ROOT, '.env')
  const fileVars = parseDotEnv(envPath)
  for (const [key, value] of Object.entries(fileVars)) {
    if (process.env[key] === undefined || process.env[key] === '') {
      process.env[key] = value
    }
  }
  return fileVars
}

/**
 * Required config keys. If a key is missing, callers get a clear error
 * pointing to the env var name rather than a cryptic undefined later.
 */
const REQUIRED = ['PGYER_API_KEY', 'EMAILJS_PUBLIC_KEY', 'EMAILJS_SERVICE_ID', 'EMAILJS_TEMPLATE_ID']

/**
 * Mask a secret for safe logging: first 4 + ... + last 4.
 * Short strings degrade gracefully.
 *
 * @param {string} value
 * @returns {string}
 */
export function maskSecret(value) {
  if (!value) return '(empty)'
  if (value.length <= 8) return '*'.repeat(value.length)
  return `${value.slice(0, 4)}****${value.slice(-4)}`
}

/**
 * Read a config value with a default. Returns '' when both are missing
 * (callers decide whether '' is a hard error).
 *
 * @param {string} key
 * @param {string} [fallback]
 */
export function getConfig(key, fallback = '') {
  const v = process.env[key]
  if (v === undefined || v === '') return fallback
  return v
}

/**
 * Default APK output path (matches scripts/build-apk.ps1).
 */
export function defaultApkPath() {
  return path.join(PROJECT_ROOT, 'apks', 'cloud-platform.apk')
}

/**
 * Build the resolved config object. Throws an AggregateError-like error
 * listing every missing required key, so the user can fix all at once.
 *
 * @param {{
 *   apkPath?: string,
 *   appName?: string,
 *   versionName?: string,
 *   versionCode?: string|number,
 *   receiverEmail?: string,
 *   updateDescription?: string,
 * }} [overrides]
 */
export function resolveConfig(overrides = {}) {
  loadDotEnv()

  const cfg = {
    pgyerApiKey: getConfig('PGYER_API_KEY'),
    installPassword: getConfig('PGYER_INSTALL_PASSWORD'),
    installType: getConfig('PGYER_BUILD_INSTALL_TYPE', '1'),
    defaultUpdateDescription: getConfig(
      'PGYER_BUILD_UPDATE_DESCRIPTION',
      '内测版本,问题反馈请联系项目负责人'
    ),
    apkPath: overrides.apkPath || getConfig('APK_OUTPUT_PATH') || defaultApkPath(),
    downloadExpireDays: Number(getConfig('DOWNLOAD_LINK_EXPIRE_DAYS', '7')) || 7,
    appName: overrides.appName || getConfig('APP_NAME', '云平台数据通信'),
    versionName: overrides.versionName || getConfig('VERSION_NAME', '1.0.0'),
    versionCode:
      overrides.versionCode !== undefined
        ? String(overrides.versionCode)
        : getConfig('VERSION_CODE', '1'),
    email: {
      publicKey: getConfig('EMAILJS_PUBLIC_KEY'),
      serviceId: getConfig('EMAILJS_SERVICE_ID'),
      templateId: getConfig('EMAILJS_TEMPLATE_ID'),
      receiver: overrides.receiverEmail || getConfig('RECEIVER_EMAIL')
    },
    updateDescription: overrides.updateDescription ?? null
  }

  const missing = []
  for (const key of REQUIRED) {
    const map = {
      PGYER_API_KEY: cfg.pgyerApiKey,
      EMAILJS_PUBLIC_KEY: cfg.email.publicKey,
      EMAILJS_SERVICE_ID: cfg.email.serviceId,
      EMAILJS_TEMPLATE_ID: cfg.email.templateId
    }
    if (!map[key]) missing.push(key)
  }

  if (missing.length) {
    const err = new Error(
      `Missing required env vars: ${missing.join(', ')}. ` +
        `Copy .env.example to .env and fill them in, or set them in your shell.`
    )
    err.code = 'CONFIG_MISSING'
    err.missing = missing
    throw err
  }

  return cfg
}

export { PROJECT_ROOT }
