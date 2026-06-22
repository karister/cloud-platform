/**
 * ReleaseHistory — append-only JSON store for release records.
 *
 * Schema for each record (matches the spec in the project brief):
 *   id, app_name, version_name, version_code, build_no,
 *   apk_file_name, apk_file_size, pgyer_build_key,
 *   download_url, shortcut_url, qr_code_url, install_password,
 *   update_description, upload_status, email_status,
 *   receiver_email, error_message, created_at, updated_at
 *
 * The file is small in practice; we read the whole thing in and write
 * the whole thing out. If this ever needs to scale, swap to SQLite or
 * a real DB — the surface here is small.
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { info, warn } from './logger.mjs'
import { PROJECT_ROOT } from './config.mjs'

const HISTORY_PATH = path.join(PROJECT_ROOT, 'release-history.json')

/**
 * Generate a sortable, URL-safe-ish ID. Time prefix + 6 random hex chars
 * is enough for human-scannable history.
 */
function newId() {
  const ts = new Date()
  const y = ts.getFullYear()
  const m = String(ts.getMonth() + 1).padStart(2, '0')
  const d = String(ts.getDate()).padStart(2, '0')
  const h = String(ts.getHours()).padStart(2, '0')
  const mi = String(ts.getMinutes()).padStart(2, '0')
  const s = String(ts.getSeconds()).padStart(2, '0')
  const rand = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')
  return `rel_${y}${m}${d}${h}${mi}${s}_${rand}`
}

function readHistory() {
  if (!fs.existsSync(HISTORY_PATH)) return []
  try {
    const text = fs.readFileSync(HISTORY_PATH, 'utf8')
    const parsed = JSON.parse(text)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    warn(`Failed to read ${HISTORY_PATH}: ${err.message}. Starting fresh.`)
    return []
  }
}

function writeHistory(records) {
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(records, null, 2) + '\n', 'utf8')
}

/**
 * List the most recent records, newest first.
 * @param {number} [limit=20]
 */
export function listRecent(limit = 20) {
  return readHistory().slice(-limit).reverse()
}

/**
 * Append a release record. Mutates the on-disk history file in place.
 * The returned record includes the assigned `id` and timestamps.
 *
 * @param {{
 *   appName: string,
 *   versionName: string,
 *   versionCode: string|number,
 *   buildNo?: string,
 *   apkFileName: string,
 *   apkFileSize?: number,
 *   pgyerBuildKey?: string,
 *   downloadUrl?: string,
 *   shortcutUrl?: string,
 *   qrCodeUrl?: string,
 *   installPassword?: string,
 *   updateDescription?: string,
 *   uploadStatus: 'success' | 'failed' | 'skipped',
 *   emailStatus: 'success' | 'failed' | 'skipped',
 *   receiverEmail?: string,
 *   errorMessage?: string,
 * }} record
 */
export function appendRecord(record) {
  const now = new Date().toISOString()
  const entry = {
    id: newId(),
    app_name: record.appName || '',
    version_name: record.versionName || '',
    version_code: record.versionCode ?? '',
    build_no: record.buildNo ?? '',
    apk_file_name: record.apkFileName || '',
    apk_file_size: record.apkFileSize ?? 0,
    pgyer_build_key: record.pgyerBuildKey || '',
    download_url: record.downloadUrl || '',
    shortcut_url: record.shortcutUrl || '',
    qr_code_url: record.qrCodeUrl || '',
    install_password: record.installPassword || '',
    update_description: record.updateDescription || '',
    upload_status: record.uploadStatus,
    email_status: record.emailStatus,
    receiver_email: record.receiverEmail || '',
    error_message: record.errorMessage || '',
    created_at: now,
    updated_at: now
  }
  const all = readHistory()
  all.push(entry)
  writeHistory(all)
  info(`Release record saved: ${entry.id} → ${HISTORY_PATH}`)
  return entry
}

export { HISTORY_PATH, readHistory }
