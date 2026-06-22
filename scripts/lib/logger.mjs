/**
 * Logger — tiny leveled logger with secret redaction.
 *
 * Use info(...) for normal progress, warn(...) for recoverable issues,
 * error(...) for terminal failures. secret(...) prints a masked version
 * suitable for echoing API keys in logs.
 */

import process from 'node:process'

/**
 * Replace any value whose key matches a known secret name with a mask.
 * Recursively walks plain objects and arrays; primitives are returned
 * as-is (callers control redaction of primitive values via secret()).
 *
 * @param {any} input
 * @returns {any}
 */
export function redact(input) {
  const SECRET_KEYS = new Set([
    'pgyerApiKey',
    'apiKey',
    'api_key',
    'publicKey',
    'serviceId',
    'service_id',
    'templateId',
    'template_id',
    'password',
    'installPassword',
    'PGYER_API_KEY',
    'EMAILJS_PUBLIC_KEY',
    'EMAILJS_SERVICE_ID',
    'EMAILJS_TEMPLATE_ID',
    'PGYER_INSTALL_PASSWORD'
  ])

  if (input === null || input === undefined) return input
  if (Array.isArray(input)) return input.map(redact)
  if (typeof input !== 'object') return input

  const out = {}
  for (const [k, v] of Object.entries(input)) {
    if (SECRET_KEYS.has(k) && typeof v === 'string' && v.length > 0) {
      out[k] = maskForLog(v)
    } else {
      out[k] = redact(v)
    }
  }
  return out
}

/**
 * Mask a secret for safe logging: first 4 + ... + last 4.
 * Degrades gracefully on short values.
 *
 * @param {string} value
 * @returns {string}
 */
export function maskForLog(value) {
  if (!value) return '(empty)'
  if (value.length <= 8) return '*'.repeat(value.length)
  return `${value.slice(0, 4)}****${value.slice(-4)}`
}

const PREFIX = {
  info: '  •',
  step: '>>>',
  warn: '  ⚠',
  error: '  ✗',
  success: '  ✓'
}

function emit(level, args) {
  const tag = PREFIX[level] || '   '
  const out = `[${level.toUpperCase()}] ${tag}`
  // eslint-disable-next-line no-console
  console.log(out, ...args.map((a) => (typeof a === 'string' ? a : JSON.stringify(redact(a)))))
}

export const info = (...args) => emit('info', args)
export const step = (...args) => emit('step', args)
export const warn = (...args) => emit('warn', args)
export const error = (...args) => emit('error', args)
export const success = (...args) => emit('success', args)

/**
 * Print a labelled key/value line, useful for build summaries.
 * @param {string} label
 * @param {string|number} value
 */
export function kv(label, value) {
  // eslint-disable-next-line no-console
  console.log(`  ${label.padEnd(22, ' ')} ${value}`)
}

export function exitWithError(message, extra) {
  error(message)
  if (extra) console.error(extra)
  process.exit(1)
}
