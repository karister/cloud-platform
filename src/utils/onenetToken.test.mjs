import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import { generateOneNetToken } from './onenetToken.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '../..')

test('generateOneNetToken matches the official OneNET md5 sample', () => {
  const token = generateOneNetToken({
    productId: '85zH3LlDLF',
    deviceName: 'device',
    accessKey: 'THg0NTVRSnhUWnFhcUxuTFhYcHl3WWVZa3RZOXM4Ukk=',
    expirationSeconds: 1993491199,
    method: 'md5'
  })

  assert.equal(
    token,
    'version=2018-10-31&res=products%2F85zH3LlDLF%2Fdevices%2Fdevice&et=1993491199&method=md5&sign=u4vFu18O1Pc6BhNnosz%2BJQ%3D%3D'
  )
})

test('token flow no longer exposes manualToken fallback', () => {
  const files = [
    'src/services/onenet.js',
    'src/pages/settings/settings.vue',
    'src/utils/defaultConfig.js'
  ]

  for (const file of files) {
    const content = readFileSync(resolve(repoRoot, file), 'utf8')
    assert.equal(content.includes('manualToken'), false, `${file} should not contain manualToken`)
  }

  const storage = readFileSync(resolve(repoRoot, 'src/utils/storage.js'), 'utf8')
  assert.match(storage, /delete cloud\.manualToken/)
})
