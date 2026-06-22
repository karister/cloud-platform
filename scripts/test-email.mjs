#!/usr/bin/env node
/**
 * test-email.mjs — Send a test email via EmailJS REST API, bypassing
 * the Pgyer upload step. Use this to verify the EmailJS chain
 * independently of APK validation.
 *
 * Usage:
 *   node scripts/test-email.mjs [recipient@example.com]
 *
 * If no recipient is given, uses RECEIVER_EMAIL from .env, else
 * prompts for one.
 */

import process from 'node:process'
import { resolveConfig } from './lib/config.mjs'
import { sendReleaseEmail } from './lib/email-sender.mjs'
import { info, error, kv, maskForLog } from './lib/logger.mjs'
import { saveReleaseRecord } from './lib/release-publisher.mjs'

async function main() {
  const args = process.argv.slice(2)
  const config = resolveConfig({})

  const recipient = args[0] || config.email.receiver
  if (!recipient) {
    error('No recipient. Pass as CLI arg or set RECEIVER_EMAIL in .env')
    process.exit(1)
  }

  info('Test email configuration:')
  kv('Recipient', recipient)
  kv('EmailJS user_id', maskForLog(config.email.publicKey))
  kv('EmailJS service_id', maskForLog(config.email.serviceId))
  kv('EmailJS template_id', maskForLog(config.email.templateId))

  const result = await sendReleaseEmail({
    publicKey: config.email.publicKey,
    serviceId: config.email.serviceId,
    templateId: config.email.templateId,
    recipient,
    appName: '云平台数据通信 (Test)',
    versionName: '1.0.0',
    versionCode: 1,
    fileSize: 12983,
    downloadUrl: 'https://www.pgyer.com/RaY1CLmZ',
    installPassword: config.installPassword || '888888',
    updateDescription: '这是一封独立测试邮件,用于验证 EmailJS 链路是否通畅。请检查收件箱(包括垃圾邮件夹)。',
    expireDays: config.downloadExpireDays
  })

  // eslint-disable-next-line no-console
  console.log('\n=== Result ===')
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(result, null, 2))

  // Record this attempt in release-history.json so we can audit later
  saveReleaseRecord({
    apkPath: '(test-only, no APK)',
    uploadResult: { success: true, fileSize: 12983 },
    emailResult: result,
    config: {
      ...config,
      email: { ...config.email, receiver: recipient },
      updateDescription: 'EmailJS 链路独立测试'
    }
  })

  if (!result.success) process.exit(1)
}

main().catch((err) => {
  error(err.stack || String(err))
  process.exit(1)
})
