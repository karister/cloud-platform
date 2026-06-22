/**
 * BuildPublishService — orchestrates the post-build release pipeline.
 *
 * Sequence (each step records progress before running, errors are
 * surfaced with the failing step name):
 *   1. buildApk()              — runs scripts/build-apk.ps1 via PowerShell
 *   2. uploadToPgyer()         — delegates to PgyerUploadService
 *   3. sendDownloadEmail()     — delegates to EmailSender
 *   4. saveReleaseRecord()     — writes release-history.json
 *   5. printReleaseSummary()   — terminal-friendly summary
 *
 * Critical: an upload success followed by an email failure MUST NOT
 * roll back the upload. The release record persists regardless, with
 * `upload_status=success` and `email_status=failed`.
 */

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'

import { uploadApk, inspectApk, formatBytes } from './pgyer-upload.mjs'
import { sendReleaseEmail } from './email-sender.mjs'
import { appendRecord, listRecent } from './release-history.mjs'
import { info, step, success, warn, error, kv, maskForLog } from './logger.mjs'
import { PROJECT_ROOT } from './config.mjs'

const BUILD_SCRIPT = path.join(PROJECT_ROOT, 'scripts', 'build-apk.ps1')

/**
 * Pick the right PowerShell binary. CI runners may not have `pwsh`; if
 * neither exists we throw with an actionable hint.
 */
async function resolvePowerShell() {
  const candidates =
    process.platform === 'win32'
      ? ['pwsh.exe', 'powershell.exe']
      : ['pwsh', 'powershell']
  for (const name of candidates) {
    try {
      const which = await new Promise((resolve) => {
        const cmd = process.platform === 'win32' ? 'where' : 'which'
        const child = spawn(cmd, [name], { stdio: 'ignore' })
        child.on('error', () => resolve(null))
        child.on('exit', (code) => resolve(code === 0 ? name : null))
      })
      if (which) return which
    } catch {
      // try next
    }
  }
  throw new Error(
    'PowerShell was not found on PATH. Install PowerShell 7 (https://aka.ms/powershell) ' +
      'and ensure `pwsh` is on PATH, then retry.'
  )
}

/**
 * Run the project's build-apk.ps1 script. Captures stdout/stderr and
 * forwards them to this process's terminal so the user can see progress.
 *
 * @param {{ variant?: 'Debug' | 'Release' }} [options]
 * @returns {Promise<{ code: number }>}
 */
export async function buildApk(options = {}) {
  const variant = options.variant || 'Debug'
  if (!fs.existsSync(BUILD_SCRIPT)) {
    throw new Error(`Build script not found: ${BUILD_SCRIPT}`)
  }

  step(`Step 1/5 — Building APK (${variant})...`)
  const ps = await resolvePowerShell()
  info(`Running ${ps} ${BUILD_SCRIPT} -Variant ${variant}`)

  return new Promise((resolve, reject) => {
    const child = spawn(
      ps,
      [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        BUILD_SCRIPT,
        '-Variant',
        variant
      ],
      { stdio: 'inherit', cwd: PROJECT_ROOT }
    )
    child.on('error', (err) => reject(new Error(`Failed to launch PowerShell: ${err.message}`)))
    child.on('exit', (code) => {
      if (code === 0) {
        success('APK build complete.')
        resolve({ code })
      } else {
        reject(new Error(`build-apk.ps1 exited with code ${code}`))
      }
    })
  })
}

/**
 * Upload the APK at `apkPath` to Pgyer.
 *
 * @param {{ apkPath: string, config: ReturnType<typeof import('./config.mjs').resolveConfig> }} options
 */
export async function uploadToPgyer(options) {
  const { apkPath, config } = options
  step('Step 2/5 — Uploading APK to Pgyer...')

  const meta = inspectApk(apkPath)
  if (!meta.exists) {
    const err = new Error(`APK not found: ${apkPath}`)
    err.code = 'APK_MISSING'
    throw err
  }
  info(`APK path  : ${apkPath}`)
  info(`APK size  : ${meta.sizeText}`)

  const result = await uploadApk({
    apkPath,
    apiKey: config.pgyerApiKey,
    installPassword: config.installPassword,
    installType: config.installType,
    updateDescription:
      config.updateDescription || config.defaultUpdateDescription,
    appName: config.appName,
    versionName: config.versionName,
    versionCode: config.versionCode
  })

  if (!result.success) {
    const err = new Error(result.errorMessage || 'Pgyer upload failed')
    err.code = 'PGYER_UPLOAD_FAILED'
    err.raw = result.raw
    throw err
  }

  success(`Pgyer upload success — ${result.downloadUrl}`)
  return result
}

/**
 * Send the release email. Failures are caught here so the caller can
 * decide whether to mark the release as failed or partial-success.
 *
 * @param {{
 *   recipient: string,
 *   uploadResult: import('./pgyer-upload.mjs').UploadResult,
 *   config: ReturnType<typeof import('./config.mjs').resolveConfig>,
 * }} options
 */
export async function sendDownloadEmail(options) {
  const { recipient, uploadResult, config } = options
  step('Step 3/5 — Sending download email...')

  if (!recipient) {
    return { success: false, error: 'No recipient email configured' }
  }

  const result = await sendReleaseEmail({
    publicKey: config.email.publicKey,
    serviceId: config.email.serviceId,
    templateId: config.email.templateId,
    recipient,
    appName: uploadResult.appName || config.appName,
    versionName: uploadResult.versionName || config.versionName,
    versionCode: uploadResult.versionCode || config.versionCode,
    fileSize: uploadResult.fileSize,
    downloadUrl: uploadResult.downloadUrl,
    installPassword: uploadResult.installPassword || config.installPassword,
    updateDescription: uploadResult.updateDescription || config.defaultUpdateDescription,
    expireDays: config.downloadExpireDays
  })

  if (!result.success) {
    warn(`Email failed: ${result.error || 'unknown error'}`)
  } else {
    success('Email sent.')
  }
  return result
}

/**
 * Persist a record to release-history.json. This is best-effort: errors
 * are logged but do not change the release's success state.
 *
 * @param {{
 *   apkPath: string,
 *   uploadResult: import('./pgyer-upload.mjs').UploadResult | null,
 *   emailResult: Awaited<ReturnType<typeof sendDownloadEmail>> | null,
 *   config: ReturnType<typeof import('./config.mjs').resolveConfig>,
 *   uploadError?: Error,
 *   emailError?: Error,
 * }} options
 */
export function saveReleaseRecord(options) {
  step('Step 4/5 — Saving release record...')
  const { apkPath, uploadResult, emailResult, config, uploadError, emailError } = options

  let uploadStatus = 'skipped'
  let emailStatus = 'skipped'
  const errorMessageParts = []

  if (uploadError) {
    uploadStatus = 'failed'
    errorMessageParts.push(`upload: ${uploadError.message}`)
  } else if (uploadResult && uploadResult.success) {
    uploadStatus = 'success'
  }

  if (emailError) {
    emailStatus = 'failed'
    errorMessageParts.push(`email: ${emailError.message}`)
  } else if (emailResult && emailResult.success) {
    emailStatus = 'success'
  } else if (emailResult && !emailResult.success) {
    emailStatus = 'failed'
    errorMessageParts.push(`email: ${emailResult.error || 'unknown'}`)
  }

  try {
    const entry = appendRecord({
      appName: config.appName,
      versionName: config.versionName,
      versionCode: config.versionCode,
      apkFileName: path.basename(apkPath),
      apkFileSize: uploadResult?.fileSize || (fs.existsSync(apkPath) ? fs.statSync(apkPath).size : 0),
      pgyerBuildKey: uploadResult?.buildKey,
      downloadUrl: uploadResult?.downloadUrl,
      shortcutUrl: uploadResult?.shortcutUrl,
      qrCodeUrl: uploadResult?.qrCodeUrl,
      installPassword: uploadResult?.installPassword,
      updateDescription: uploadResult?.updateDescription,
      uploadStatus,
      emailStatus,
      receiverEmail: config.email.receiver,
      errorMessage: errorMessageParts.join('; ')
    })
    return entry
  } catch (err) {
    warn(`Failed to save release record: ${err.message}`)
    return null
  }
}

/**
 * Pretty-print the final result. Always exits with non-zero if anything
 * failed, so CI pipelines pick it up automatically.
 *
 * @param {{
 *   apkPath: string,
 *   config: ReturnType<typeof import('./config.mjs').resolveConfig>,
 *   uploadResult: import('./pgyer-upload.mjs').UploadResult | null,
 *   emailResult: Awaited<ReturnType<typeof sendDownloadEmail>> | null,
 *   record: ReturnType<typeof appendRecord> | null,
 *   uploadError?: Error,
 *   emailError?: Error,
 * }} summary
 */
export function printReleaseSummary(summary) {
  step('Step 5/5 — Release summary')
  const {
    apkPath,
    config,
    uploadResult,
    emailResult,
    record,
    uploadError,
    emailError
  } = summary

  const lines = []
  lines.push('')
  lines.push('================ Release Summary ================')
  lines.push(`  App               : ${config.appName}`)
  lines.push(`  Version           : ${config.versionName} (build ${config.versionCode})`)
  lines.push(`  APK               : ${apkPath}`)
  if (uploadResult?.fileSize) lines.push(`  APK size          : ${formatBytes(uploadResult.fileSize)}`)

  if (uploadResult?.success) {
    lines.push('')
    lines.push('  [Pgyer upload]    : ✓ SUCCESS')
    lines.push(`    Download URL    : ${uploadResult.downloadUrl}`)
    if (uploadResult.shortcutUrl && uploadResult.shortcutUrl !== uploadResult.downloadUrl) {
      lines.push(`    Short URL       : ${uploadResult.shortcutUrl}`)
    }
    if (uploadResult.qrCodeUrl) lines.push(`    QR code         : ${uploadResult.qrCodeUrl}`)
    lines.push(`    Build key       : ${uploadResult.buildKey}`)
    lines.push(`    Attempts        : ${uploadResult.attempts}`)
  } else {
    lines.push('')
    lines.push(`  [Pgyer upload]    : ✗ FAILED — ${(uploadError?.message) || uploadResult?.errorMessage || 'unknown'}`)
  }

  if (emailResult?.success) {
    lines.push('')
    lines.push('  [Email]           : ✓ SENT')
    lines.push(`    Recipient       : ${config.email.receiver}`)
  } else if (emailResult) {
    lines.push('')
    lines.push(`  [Email]           : ✗ FAILED — ${emailResult.error || 'unknown'}`)
  } else if (emailError) {
    lines.push('')
    lines.push(`  [Email]           : ✗ FAILED — ${emailError.message}`)
  }

  if (record) {
    lines.push('')
    lines.push('  [Release record]  : ✓ SAVED')
    lines.push(`    Record id       : ${record.id}`)
    lines.push(`    Upload status   : ${record.upload_status}`)
    lines.push(`    Email status    : ${record.email_status}`)
  }

  lines.push('==================================================')
  // eslint-disable-next-line no-console
  console.log(lines.join('\n'))

  const fatal = uploadError || (!uploadResult?.success) || (emailError)
  if (fatal) {
    process.exitCode = 1
  }
}

/**
 * High-level orchestrator used by the CLI entry point.
 *
 * @param {{
 *   skipBuild?: boolean,
 *   variant?: 'Debug' | 'Release',
 *   apkPath?: string,
 *   recipient?: string,
 *   updateDescription?: string,
 *   config: ReturnType<typeof import('./config.mjs').resolveConfig>,
 * }} options
 */
export async function runRelease(options) {
  const { skipBuild = false, variant = 'Debug', config } = options
  const apkPath = options.apkPath || config.apkPath
  const recipient = options.recipient || config.email.receiver
  const updateDescription = options.updateDescription ?? config.defaultUpdateDescription

  // Mutable config snapshot for the rest of the run.
  const runConfig = {
    ...config,
    apkPath,
    email: { ...config.email, receiver: recipient },
    updateDescription
  }

  let uploadResult = null
  let emailResult = null
  let uploadError = null
  let emailError = null

  // Step 1 — build (skippable for re-runs during dev)
  if (!skipBuild) {
    try {
      await buildApk({ variant })
    } catch (err) {
      error(`APK build failed: ${err.message}`)
      throw err
    }
  } else {
    info('Skipping APK build (--skip-build).')
  }

  // Step 2 — upload. Hard-stop if this fails — there's nothing to email.
  try {
    uploadResult = await uploadToPgyer({ apkPath: runConfig.apkPath, config: runConfig })
  } catch (err) {
    uploadError = err
    error(`Upload step failed: ${err.message}`)
  }

  // Step 3 — email. Only attempted if upload succeeded. A failure here
  // must NOT roll back the upload; we just record it.
  if (uploadResult?.success) {
    try {
      emailResult = await sendDownloadEmail({
        recipient: runConfig.email.receiver,
        uploadResult,
        config: runConfig
      })
    } catch (err) {
      emailError = err
      error(`Email step failed: ${err.message}`)
    }
  }

  // Step 4 — record. Always runs.
  const record = saveReleaseRecord({
    apkPath: runConfig.apkPath,
    uploadResult,
    emailResult,
    config: runConfig,
    uploadError,
    emailError
  })

  // Step 5 — summary.
  printReleaseSummary({
    apkPath: runConfig.apkPath,
    config: runConfig,
    uploadResult,
    emailResult,
    record,
    uploadError,
    emailError
  })

  return { uploadResult, emailResult, record, uploadError, emailError }
}

export { listRecent }