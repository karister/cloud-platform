import { defineConfig } from 'vite'
import uniPlugin from '@dcloudio/vite-plugin-uni'

const uni = typeof uniPlugin === 'function' ? uniPlugin : uniPlugin.default
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS === 'true' && repositoryName
  ? `/${repositoryName}/`
  : './'

export default defineConfig({
  base,
  // uni 插件默认把 publicDir 覆盖为 '__static__'，显式声明才能让 public/ 下的
  // 静态文件（import.html 复制中转页）随构建拷贝到部署产物根目录
  publicDir: 'public',
  plugins: [uni()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true
  }
})
