import { it } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

it('Android 摄像头按目标网段选择 Wi-Fi，本机热点不绑定上游网络', (t) => {
  try {
    execFileSync('javac', ['-version'], { stdio: 'pipe' })
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    t.skip('需要 JDK 执行原生网络路由回归测试')
    return
  }
  const output = mkdtempSync(join(tmpdir(), 'camera-routing-test-'))
  try {
    execFileSync('javac', ['-d', output,
      fileURLToPath(new URL('../android-webview/app/src/main/java/com/example/cloudplatformcomm/CameraNetworkRoute.java', import.meta.url)),
      fileURLToPath(new URL('./fixtures/CameraNetworkRouteTest.java', import.meta.url))
    ], { stdio: 'pipe' })
    const result = execFileSync('java', ['-cp', output, 'com.example.cloudplatformcomm.CameraNetworkRouteTest'], { encoding: 'utf8' })
    assert.match(result, /all routing regression cases passed/)
  } finally {
    rmSync(output, { recursive: true, force: true })
  }
})
