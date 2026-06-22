#!/usr/bin/env node
/**
 * release-apk.mjs — command entry point for the post-build release flow.
 *
 * Usage:
 *   node scripts/release-apk.mjs [options]
 *   npm run release:apk -- --email user@example.com --desc "fix bug"
 *
 * Options:
 *   --apk <path>          Path to the APK (default: $APK_OUTPUT_PATH or apks/cloud-platform.apk)
 *   --email <addr>        Recipient email (overrides RECEIVER_EMAIL)
 *   --desc <text>         Update description (overrides PGYER_BUILD_UPDATE_DESCRIPTION)
 *   --app-name <name>     App display name (default: $APP_NAME)
 *   --version-name <v>    versionName (default: $VERSION_NAME)
 *   --version-code <n>    versionCode (default: $VERSION_CODE)
 *   --variant <Debug|Release>
 *                         Gradle variant for build-apk.ps1 (default: Debug)
 *   --skip-build          Skip the Gradle build, only upload + email (assumes APK already exists)
 *   --list                Print recent release history and exit
 *   --help                Show this help and exit
 *
 * Exit code is 0 on full success, 1 on any failure.
 */

import process from 'node:process'
import { info, error, exitWithError, kv, maskForLog } from './lib/logger.mjs'
import { resolveConfig } from './lib/config.mjs'
import { runRelease, listRecent } from './lib/release-publisher.mjs'

const HELP = `release-apk — build, upload, and email an internal-test APK

Usage:
  node scripts/release-apk.mjs [options]

Options:
  --apk <path>            Path to the APK file
  --email <addr>          Recipient email address
  --desc <text>           Update description
  --app-name <name>       App display name
  --version-name <v>      App version name (e.g. 1.0.0)
  --version-code <n>      App version code (e.g. 1)
  --variant <Debug|Release>
                          Gradle variant (default: Debug)
  --skip-build            Skip Gradle build; upload the existing APK
  --list                  Print recent release history and exit
  --help                  Show this help

Examples:
  node scripts/release-apk.mjs
  node scripts/release-apk.mjs --email user@example.com --desc "fix crash on startup"
  node scripts/release-apk.mjs --apk ./apks/cloud-platform.apk --skip-build --email qa@example.com

Environment:
  All Pgyer and EmailJS credentials come from .env or process.env.
  See .env.example for the full list.
`

function parseArgs(argv) {
  const opts = {
    apkPath: null,
    recipient: null,
    updateDescription: null,
    appName: null,
    versionName: null,
    versionCode: null,
    variant: null,
    skipBuild: false,
    list: false,
    help: false
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    const next = () => {
      const v = argv[i + 1]
      if (v === undefined || v.startsWith('--')) {
        throw new Error(`Missing value for ${a}`)
      }
      i++
      return v
    }
    switch (a) {
      case '--apk': opts.apkPath = next(); break
      case '--email': opts.recipient = next(); break
      case '--desc': opts.updateDescription = next(); break
      case '--app-name': opts.appName = next(); break
      case '--version-name': opts.versionName = next(); break
      case '--version-code': opts.versionCode = next(); break
      case '--variant': opts.variant = next(); break
      case '--skip-build': opts.skipBuild = true; break
      case '--list': opts.list = true; break
      case '--help':
      case '-h':
        opts.help = true
        break
      default:
        if (a.startsWith('--')) {
          throw new Error(`Unknown option: ${a}`)
        }
        break
    }
  }
  return opts
}

function printHistory() {
  const recent = listRecent(20)
  if (recent.length === 0) {
    info('No release history yet.')
    return
  }
  // eslint-disable-next-line no-console
  console.log('Recent releases (newest first):')
  // eslint-disable-next-line no-console
  console.log('-'.repeat(80))
  for (const r of recent) {
    // eslint-disable-next-line no-console
    console.log(
      `${r.id}  ${r.created_at}  ${r.app_name} v${r.version_name} (build ${r.version_code})`
    )
    // eslint-disable-next-line no-console
    console.log(
      `  upload=${r.upload_status}  email=${r.email_status}  apk=${r.apk_file_name}`
    )
    if (r.download_url) {
      // eslint-disable-next-line no-console
      console.log(`  download: ${r.download_url}`)
    }
    if (r.error_message) {
      // eslint-disable-next-line no-console
      console.log(`  error  : ${r.error_message}`)
    }
  }
}

async function main() {
  const args = parseArgs(process.argv)
  if (args.help) {
    process.stdout.write(HELP)
    return
  }

  // --list prints local history; it does not need Pgyer/EmailJS config,
  // so handle it before resolveConfig().
  if (args.list) {
    printHistory()
    return
  }

  let config
  try {
    config = resolveConfig({
      apkPath: args.apkPath || undefined,
      appName: args.appName || undefined,
      versionName: args.versionName || undefined,
      versionCode: args.versionCode ?? undefined,
      receiverEmail: args.recipient || undefined,
      updateDescription: args.updateDescription ?? undefined
    })
  } catch (err) {
    if (err.code === 'CONFIG_MISSING') {
      exitWithError(
        `Configuration error: ${err.message}\n` +
          `Tip: copy .env.example to .env and fill in the required values, ` +
          `or set them as system environment variables.`
      )
    }
    throw err
  }

  // Mask any secrets we are about to echo.
  info('Resolved configuration:')
  kv('App name', config.appName)
  kv('Version', `${config.versionName} (code ${config.versionCode})`)
  kv('APK path', config.apkPath)
  kv('PGYER_API_KEY', maskForLog(config.pgyerApiKey))
  kv('EMAILJS_PUBLIC_KEY', maskForLog(config.email.publicKey))
  kv('EMAILJS_SERVICE_ID', maskForLog(config.email.serviceId))
  kv('EMAILJS_TEMPLATE_ID', maskForLog(config.email.templateId))
  kv('Recipient', config.email.receiver || '(none — email step will skip)')
  if (config.updateDescription) {
    kv('Update desc', config.updateDescription)
  }
  // eslint-disable-next-line no-console
  console.log('')

  await runRelease({
    skipBuild: args.skipBuild,
    variant: args.variant || 'Debug',
    apkPath: args.apkPath || undefined,
    recipient: args.recipient || undefined,
    updateDescription: args.updateDescription ?? undefined,
    config
  })
}

main().catch((err) => {
  error(err && err.stack ? err.stack : String(err))
  process.exit(1)
})
