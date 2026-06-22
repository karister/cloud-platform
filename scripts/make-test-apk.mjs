#!/usr/bin/env node
/**
 * make-test-apk.mjs — Generate a Pgyer-acceptable test APK using the
 * official aapt2 / apksigner / zipalign tools from Android SDK.
 *
 * This is a real, properly-formed APK that:
 *   - Has a binary AndroidManifest.xml compiled by aapt2
 *   - Has a valid resources.arsc (even if empty)
 *   - Has a valid (empty) classes.dex
 *   - Is v1 + v2 + v3 signed by apksigner
 *   - Is zipalign'd
 *
 * Pgyer will accept it for upload. The APK does nothing useful if
 * installed (no Activity, no code); it's purely for pipeline testing.
 *
 * Requirements:
 *   - ANDROID_HOME or ANDROID_SDK_ROOT pointing at the Android SDK
 *   - Build-tools 35.0.0 (aapt2, apksigner, zipalign) installed
 *   - Java 11+ on PATH
 *
 * Usage:
 *   node scripts/make-test-apk.mjs [output.apk]
 *
 * Default output: apks/cloud-platform.apk
 */

import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'
import process from 'node:process'

import { defaultApkPath, PROJECT_ROOT } from './lib/config.mjs'
import { info, error, success, kv } from './lib/logger.mjs'

// =============================================================================
// Path resolution
// =============================================================================

function findAndroidHome() {
  return (
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    '/usr/local/share/android-commandlinetools'
  )
}

const ANDROID_HOME = findAndroidHome()
const BUILD_TOOLS = path.join(ANDROID_HOME, 'build-tools', '35.0.0')
const AAPT2 = path.join(BUILD_TOOLS, 'aapt2')
const APKSIGNER = path.join(BUILD_TOOLS, 'apksigner')
const ZIPALIGN = path.join(BUILD_TOOLS, 'zipalign')

function needTool(p, name) {
  if (!fs.existsSync(p)) {
    throw new Error(
      `${name} not found at ${p}\n` +
        `Install with: ${AAPT2.replace('/aapt2', '')}/../sdkmanager "build-tools;35.0.0"`
    )
  }
}
needTool(AAPT2, 'aapt2')
needTool(APKSIGNER, 'apksigner')
needTool(ZIPALIGN, 'zipalign')

// =============================================================================
// Keystore (reused; generated on first run)
// =============================================================================

const KEYSTORE_PATH = path.join(PROJECT_ROOT, 'work', 'test-release.keystore')
const KEY_ALIAS = 'test'
const KEYSTORE_PASS = 'changeit'
const KEY_PASS = 'changeit'
const KEY_DNAME = 'CN=Cloud Platform Test, OU=Test, O=Test, L=Test, ST=Test, C=CN'

function ensureKeystore() {
  if (fs.existsSync(KEYSTORE_PATH)) {
    return Promise.resolve(KEYSTORE_PATH)
  }
  fs.mkdirSync(path.dirname(KEYSTORE_PATH), { recursive: true })
  return new Promise((resolve, reject) => {
    const proc = spawn('keytool', [
      '-genkeypair',
      '-alias', KEY_ALIAS,
      '-keyalg', 'RSA',
      '-keysize', '2048',
      '-validity', '10000',
      '-keystore', KEYSTORE_PATH,
      '-storepass', KEYSTORE_PASS,
      '-keypass', KEY_PASS,
      '-dname', KEY_DNAME
    ], { stdio: 'inherit' })
    proc.on('error', reject)
    proc.on('exit', (code) => (code === 0 ? resolve(KEYSTORE_PATH) : reject(new Error(`keytool exited with ${code}`))))
  })
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    info(`$ ${cmd} ${args.map((a) => (a.includes(' ') ? `"${a}"` : a)).join(' ')}`)
    const child = spawn(cmd, args, { stdio: opts.stdio || 'inherit', ...opts })
    let stdout = ''
    let stderr = ''
    if (child.stdout) child.stdout.on('data', (b) => (stdout += b.toString()))
    if (child.stderr) child.stderr.on('data', (b) => (stderr += b.toString()))
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve({ stdout, stderr })
      else reject(new Error(`${path.basename(cmd)} exited with code ${code}: ${stderr.trim() || stdout.trim()}`))
    })
  })
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const outPath = path.resolve(process.argv[2] || defaultApkPath())
  const packageName = process.env.ANDROID_PACKAGE || 'com.example.cloudplatformcomm'
  const versionCode = Number(process.env.VERSION_CODE || '1')
  const versionName = process.env.VERSION_NAME || '1.0.0'

  info('Building test APK with aapt2 + apksigner...')
  kv('Output path', outPath)
  kv('Package', packageName)
  kv('Version', `${versionName} (code ${versionCode})`)

  // 1. Create a working dir with the inputs aapt2 expects.
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'test-apk-'))
  info(`Working dir: ${workDir}`)

  // 1a. Text AndroidManifest.xml in the conventional location.
  const manifestText = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${packageName}"
    platformBuildVersionCode="${versionCode}"
    platformBuildVersionName="${versionName}">
    <uses-sdk android:minSdkVersion="23" android:targetSdkVersion="35" />
</manifest>
`
  fs.writeFileSync(path.join(workDir, 'AndroidManifest.xml'), manifestText)

  // 1b. A values/ directory with an empty strings.xml (aapt2 needs at
  // least one resource to produce resources.arsc).
  const valuesDir = path.join(workDir, 'res', 'values')
  fs.mkdirSync(valuesDir, { recursive: true })
  fs.writeFileSync(path.join(valuesDir, 'strings.xml'),
    '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n</resources>\n')

  // 1c. Empty classes.dex (DEX035 magic + zero-size table). aapt2 link
  // will leave our pre-built dex alone; we just need it in the ZIP.
  const dexPath = path.join(workDir, 'classes.dex')
  const dexHeader = Buffer.alloc(128)
  let p = 0
  dexHeader.write('dex\n035\x00', p, 8, 'utf8'); p += 8
  p += 4 // checksum placeholder
  dexHeader.writeUInt32LE(128, p); p += 4 // file size
  dexHeader.writeUInt32LE(0x12345678, p); p += 4 // endian tag
  for (let i = 0; i < 24; i++) { dexHeader.writeUInt32LE(0, p); p += 4 }
  // Adler32 over bytes 12..end
  let a = 1, b = 0
  for (let i = 12; i < dexHeader.length; i++) { a = (a + dexHeader[i]) % 65521; b = (b + a) % 65521 }
  dexHeader.writeUInt32LE(((b << 16) | a) >>> 0, 8)
  fs.writeFileSync(dexPath, dexHeader)
  info(`Empty classes.dex: ${dexHeader.length} bytes`)

  // 2. Run aapt2 link — this is the only step that produces a valid
  // binary AndroidManifest.xml and a valid resources.arsc.
  const unsignedApk = path.join(workDir, 'unsigned.apk')
  await run(AAPT2, [
    'link',
    '-o', unsignedApk,
    '-I', path.join(ANDROID_HOME, 'platforms', 'android-35', 'android.jar'),
    '--manifest', path.join(workDir, 'AndroidManifest.xml'),
    '-A', workDir,        // include any assets (we have none)
    '--target-sdk-version', '35',
    '--min-sdk-version', '23',
    '--version-code', String(versionCode),
    '--version-name', String(versionName),
    '--rename-manifest-package', packageName
  ])

  // 3. Splice in classes.dex (aapt2 link doesn't add a dex; we need
  // one for the file to be a real APK rather than a "resource bundle").
  await run('zip', ['-j', unsignedApk, dexPath])
  // (using the system `zip` to inject the dex in-place; could also
  // rebuild the whole ZIP, but this is fine for a test APK.)

  // 4. Zipalign — required for v2+ signing.
  const alignedApk = path.join(workDir, 'aligned.apk')
  await run(ZIPALIGN, ['-f', '-p', '4', unsignedApk, alignedApk])

  // 5. Sign with v1 + v2 + v3.
  info('Generating test keystore (one-time)...')
  await ensureKeystore()
  await run(APKSIGNER, [
    'sign',
    '--ks', KEYSTORE_PATH,
    '--ks-pass', `pass:${KEYSTORE_PASS}`,
    '--key-pass', `pass:${KEY_PASS}`,
    '--ks-key-alias', KEY_ALIAS,
    '--v1-signing-enabled', 'true',
    '--v2-signing-enabled', 'true',
    '--v3-signing-enabled', 'true',
    '--out', outPath,
    alignedApk
  ])

  // 6. Verify
  await run(APKSIGNER, ['verify', '--print-certs', outPath], { stdio: 'pipe' })

  const finalSize = fs.statSync(outPath).size
  success(`Signed APK ready: ${outPath} (${finalSize} bytes)`)
}

main().catch((err) => {
  error(err.stack || String(err))
  process.exit(1)
})
