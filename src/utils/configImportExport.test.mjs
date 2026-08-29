import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import { buildImportPreviewData, serializeConfig, validateImportData } from './configImportExport.js'

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
  assert.equal(preview.recommendedCount, 0)
  assert.equal(preview.exportedAt, 1782873600000)
  assert.equal(typeof preview.formattedTime, 'string')
  assert.notEqual(preview.formattedTime, '')
})

test('buildImportPreviewData counts recommended points across categories', () => {
  const preview = buildImportPreviewData({
    cloud: { productId: 'product-1' },
    recommendedPoints: {
      display: [{ identifier: 'temp' }, { identifier: 'humi' }],
      switch: [{ identifier: 'switch' }],
      threshold: [{ identifier: 'temp_threshold' }]
    }
  })

  assert.equal(preview.recommendedCount, 4)
})

test('buildImportPreviewData tolerates malformed recommendedPoints', () => {
  expectZeroRecommended(buildImportPreviewData({ recommendedPoints: 'oops' }))
  expectZeroRecommended(buildImportPreviewData({ recommendedPoints: { display: 'oops' } }))
  expectZeroRecommended(buildImportPreviewData({}))
})

function expectZeroRecommended(preview) {
  assert.equal(preview.recommendedCount, 0)
}

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

test('serializeConfig exports normalized recommended points', () => {
  const exported = JSON.parse(serializeConfig({
    appName: 'Greenhouse Console',
    themeId: 'forest',
    cloud: { productId: 'product-1', deviceName: 'device-1' },
    recommendedPoints: {
      display: [{ label: '温度', identifier: 'temp', unit: 'C', extra: 'drop-me' }],
      switch: [{ label: '风机开关', identifier: 'fan', unit: '' }],
      threshold: [{ label: '温度阈值', identifier: 'temp_threshold', unit: 'C', min: 0, max: 100, step: 1, value: 35 }]
    }
  }))

  assert.deepEqual(exported.recommendedPoints.display, [
    { label: '温度', identifier: 'temp', unit: 'C' }
  ])
  assert.deepEqual(exported.recommendedPoints.switch, [
    { label: '风机开关', identifier: 'fan', unit: '' }
  ])
  assert.deepEqual(exported.recommendedPoints.threshold, [
    { label: '温度阈值', identifier: 'temp_threshold', unit: 'C', min: 0, max: 100, step: 1, value: 35 }
  ])
})

test('serializeConfig fills empty recommended categories when malformed', () => {
  const exported = JSON.parse(serializeConfig({
    cloud: { productId: 'product-1', deviceName: 'device-1' },
    recommendedPoints: 'not-an-object'
  }))
  assert.deepEqual(exported.recommendedPoints, { display: [], switch: [], threshold: [] })

  const partial = JSON.parse(serializeConfig({
    cloud: { productId: 'product-1', deviceName: 'device-1' },
    recommendedPoints: { display: null }
  }))
  assert.deepEqual(partial.recommendedPoints, { display: [], switch: [], threshold: [] })
})

test('validateImportData accepts optional recommendedPoints and rejects malformed ones', () => {
  const base = {
    cloud: { productId: 'product-1', deviceName: 'device-1' }
  }

  assert.equal(validateImportData({ ...base }).valid, true)

  const withRecommended = validateImportData({
    ...base,
    recommendedPoints: {
      display: [{ label: '温度', identifier: 'temp' }],
      switch: [],
      threshold: [{ label: '温度阈值', identifier: 'temp_threshold' }]
    }
  })
  assert.equal(withRecommended.valid, true)

  assert.equal(validateImportData({ ...base, recommendedPoints: 'oops' }).valid, false)
  assert.equal(
    validateImportData({ ...base, recommendedPoints: { display: 'oops' } }).valid,
    false
  )
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
