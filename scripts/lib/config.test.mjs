import assert from 'node:assert/strict'
import path from 'node:path'
import test from 'node:test'

import { PROJECT_ROOT } from './config.mjs'

test('PROJECT_ROOT resolves to repository root on this platform', () => {
  assert.equal(path.resolve(PROJECT_ROOT), path.resolve(process.cwd()))
})
