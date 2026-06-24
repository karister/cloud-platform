/**
 * 全局数据 Store
 *
 * 整个应用只有这一份"云端实时值"的事实来源。任何页面需要展示或下发
 * displayPoints / switchPoints / thresholdPoints 的当前值，都从这里的
 * latestValues 拿，并通过 setDesired() 下发指令。
 *
 * 启动后由 App.vue 调 start() 全局以 POLL_INTERVAL_MS 节奏轮询；
 * 页面 onShow 时可调 refresh() 立刻拉一次（与定时器去重）。
 *
 * 设计要点：
 * - 单例模式：模块顶层共享 reactive 状态，import 即用
 * - 并发去重：refresh() 进行中时再次调用直接复用当前 Promise
 * - 下发去抖：setDesired 后 1.5s 内的轮询跳过对应 identifier，
 *   避免服务器还没同步完成时把下发前的旧值回灌覆盖
 * - mock 模式：轮询与下发都跳过（由调用方处理 mock 逻辑）
 */

import { reactive, ref } from 'vue'
import { fetchProperties, setDesiredProperty } from '../services/onenet'
import { getConfig } from '../utils/storage'

// 轮询节奏：3 秒一次全局统一拉取
export const POLL_INTERVAL_MS = 3000

// 下发后多长时间内的轮询要跳过对应 identifier，避免覆盖
const RECENT_PUSH_WINDOW_MS = 1500

// 全局状态（模块单例）
const latestValues = reactive({})
const lastSyncedAt = ref(0)
const refreshing = ref(false)
const lastError = ref('')
const recentPushAt = {}

let pollTimer = null
let inflightPromise = null  // 并发去重：避免同一时刻多次 fetchProperties

/**
 * 立即拉取一次最新值。
 * - 进行中的请求会被复用，不会发两次
 * - mock 模式下不会发请求，仅更新 lastSyncedAt 占位
 * - silent=true 时失败不弹 toast（轮询场景）
 */
async function refresh({ silent = false } = {}) {
  const config = getConfig()
  if (config.cloud.mockMode) {
    lastSyncedAt.value = Date.now()
    return {}
  }

  if (inflightPromise) return inflightPromise
  if (refreshing.value) return inflightPromise

  refreshing.value = true
  inflightPromise = (async () => {
    try {
      const values = await fetchProperties(config)
      const now = Date.now()
      Object.entries(values).forEach(([k, v]) => {
        if (v === undefined || v === null) return
        const num = Number(v)
        if (!Number.isFinite(num)) {
          // 保留非数值（比如 bool / 字符串），但仅在原始值有效时
          latestValues[k] = v
          return
        }
        // 跳过刚下发 1.5s 内的点
        if (recentPushAt[k] && now - recentPushAt[k] < RECENT_PUSH_WINDOW_MS) return
        latestValues[k] = num
      })
      lastSyncedAt.value = now
      lastError.value = ''
      return latestValues
    } catch (err) {
      lastError.value = err?.message || String(err)
      if (!silent) {
        uni.showToast({ title: lastError.value, icon: 'none' })
      }
      return null
    } finally {
      refreshing.value = false
      inflightPromise = null
    }
  })()

  return inflightPromise
}

/**
 * 下发一个期望属性（开关或阈值）。
 * - 立即把目标值写进 latestValues，UI 不等网络就先更新
 * - 标记 recentPushAt，1.5s 内的轮询不会回灌旧值
 * - 失败抛出，调用方决定如何提示用户
 */
async function setDesired(identifier, value) {
  const config = getConfig()
  if (config.cloud.mockMode) {
    latestValues[identifier] = value
    return
  }
  recentPushAt[identifier] = Date.now()
  latestValues[identifier] = value  // 乐观更新
  await setDesiredProperty(config, identifier, value)
}

/**
 * 启动轮询。已启动则先停。
 * 间隔从 config.cloud.pollIntervalSeconds 读，非法值回退到默认值。
 */
function start() {
  stop()
  const config = getConfig()
  if (config.cloud.mockMode) return
  const seconds = Number(config.cloud.pollIntervalSeconds)
  const intervalMs = (Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : POLL_INTERVAL_MS / 1000) * 1000
  // 立刻拉一次再开始计时
  refresh({ silent: true })
  pollTimer = setInterval(() => {
    refresh({ silent: true })
  }, intervalMs)
}

/**
 * 停止轮询（App onHide 或调试时调用）。
 */
function stop() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

function isRunning() {
  return pollTimer !== null
}

export const dataStore = {
  // 状态
  latestValues,
  lastSyncedAt,
  refreshing,
  lastError,
  // 操作
  refresh,
  setDesired,
  start,
  stop,
  isRunning
}