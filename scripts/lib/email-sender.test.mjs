import assert from 'node:assert/strict'
import test from 'node:test'

import { normalizeDownloadUrl, renderHtml, renderText } from './email-sender.mjs'

const baseVars = {
  appName: 'Cloud Platform',
  versionName: '1.0.0',
  versionCode: '1',
  fileSize: 310068,
  installPassword: '',
  updateDescription: 'Fix import config',
  expireDays: 7
}

test('normalizes Pgyer shortcut code to a clickable absolute URL', () => {
  assert.equal(normalizeDownloadUrl('RaY1CLmZ'), 'https://www.pgyer.com/RaY1CLmZ')
})

test('keeps already absolute download URLs unchanged', () => {
  assert.equal(
    normalizeDownloadUrl('https://www.pgyer.com/RaY1CLmZ'),
    'https://www.pgyer.com/RaY1CLmZ'
  )
})

test('renders email button and text with absolute download URL', () => {
  const vars = { ...baseVars, downloadUrl: 'RaY1CLmZ' }
  const html = renderHtml(vars)
  const text = renderText(vars)

  assert.match(html, /href="https:\/\/www\.pgyer\.com\/RaY1CLmZ"/)
  assert.match(html, />https:\/\/www\.pgyer\.com\/RaY1CLmZ</)
  assert.match(text, /下载地址: https:\/\/www\.pgyer\.com\/RaY1CLmZ/)
})
