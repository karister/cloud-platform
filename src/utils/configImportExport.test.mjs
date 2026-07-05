import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import { buildImportPreviewData, serializeConfig } from './configImportExport.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

test('buildImportPreviewData summarizes imported config for confirmation', () => {
  const preview = buildImportPreviewData(
    {
      appName: 'Greenhouse Console',
      themeId: 'forest',
      exportedAt: 1782873600000,
      cloud: {
        productId: 'product-1',
        mockMode: false
      },
      displayPoints: [{ identifier: 'temp' }],
      switchPoints: [{ identifier: 'fan' }, { identifier: 'pump' }],
      thresholdPoints: []
    },
    [{ id: 'forest', name: 'Forest' }]
  )

  assert.equal(preview.appName, 'Greenhouse Console')
  assert.equal(preview.themeName, 'Forest')
  assert.equal(preview.productId, 'product-1')
  assert.equal(preview.mockMode, false)
  assert.equal(preview.displayCount, 1)
  assert.equal(preview.switchCount, 2)
  assert.equal(preview.thresholdCount, 0)
  assert.equal(preview.exportedAt, 1782873600000)
  assert.equal(typeof preview.formattedTime, 'string')
  assert.notEqual(preview.formattedTime, '')
})

test('serializeConfig preserves accessKey when point lists are malformed', () => {
  const exported = JSON.parse(serializeConfig({
    appName: 'Greenhouse Console',
    themeId: 'forest',
    cloud: {
      productId: 'product-1',
      deviceName: 'device-1',
      accessKey: 'one-net-access-key'
    },
    displayPoints: 'config.displayPoints is not iterable',
    switchPoints: null,
    thresholdPoints: { identifier: 'threshold' }
  }))

  assert.equal(exported.cloud.accessKey, 'one-net-access-key')
  assert.deepEqual(exported.displayPoints, [])
  assert.deepEqual(exported.switchPoints, [])
  assert.deepEqual(exported.thresholdPoints, [])
})

test('settings import textarea allows full JSON config content', () => {
  const settingsVue = readFileSync(resolve(__dirname, '../pages/settings/settings.vue'), 'utf8')
  const importTextarea = settingsVue.match(/<textarea\b(?=[^>]*class="textarea import-textarea")[^>]*>/)

  assert.ok(importTextarea, 'import textarea should exist')
  assert.match(importTextarea[0], /maxlength="-1"/)
})

test('settings export email shows an animated sending state', () => {
  const settingsVue = readFileSync(resolve(__dirname, '../pages/settings/settings.vue'), 'utf8')

  assert.match(settingsVue, /:disabled="emailSending"/)
  assert.match(settingsVue, /class="send-loader"/)
  assert.match(settingsVue, /class="export-send-progress"/)
  assert.match(settingsVue, /@keyframes sendPulse/)
})
