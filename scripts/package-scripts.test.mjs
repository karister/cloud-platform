import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))

test('send:apk sends an existing APK without rebuilding it', () => {
  assert.equal(pkg.scripts['send:apk'], 'node scripts/release-apk.mjs --skip-build')
})
