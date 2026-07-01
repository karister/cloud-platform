import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import { buildImportPreviewData } from './configImportExport.js'

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

test('settings import textarea allows full JSON config content', () => {
  const settingsVue = readFileSync(resolve(__dirname, '../pages/settings/settings.vue'), 'utf8')
  const importTextarea = settingsVue.match(/<textarea\b(?=[^>]*class="textarea import-textarea")[^>]*>/)

  assert.ok(importTextarea, 'import textarea should exist')
  assert.match(importTextarea[0], /maxlength="-1"/)
})
