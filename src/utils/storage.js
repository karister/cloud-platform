import { DEFAULT_CONFIG, HISTORY_LIMIT } from './defaultConfig'

const CONFIG_KEY = 'cloud_comm_config'
const HISTORY_KEY = 'cloud_comm_history'

function deepClone(value) {
  return JSON.parse(JSON.stringify(value))
}

function mergeConfig(saved = {}) {
  const cloud = {
    ...deepClone(DEFAULT_CONFIG.cloud),
    ...(saved.cloud || {})
  }
  // 兼容旧版存储：旧 config.cloud.authorization 不再需要，主动丢弃
  delete cloud.authorization
  // 默认签名方法
  if (!cloud.signMethod) {
    cloud.signMethod = DEFAULT_CONFIG.cloud.signMethod || 'md5'
  }
  // 默认 token 有效期 365 天
  if (!Number.isFinite(cloud.tokenTtlDays) || cloud.tokenTtlDays <= 0) {
    cloud.tokenTtlDays = DEFAULT_CONFIG.cloud.tokenTtlDays || 365
  }
  // 旧版本没有缓存 token 字段时清空，避免使用伪造/过期值
  if (typeof cloud.token !== 'string') cloud.token = ''
  if (!Number.isFinite(cloud.tokenExpiresAt)) cloud.tokenExpiresAt = 0
  // TODO: 临时调试字段 — token 算法修好后删除
  if (typeof cloud.manualToken !== 'string') cloud.manualToken = ''
  // 兜底 getUrl / postUrl
  if (!cloud.getUrl) cloud.getUrl = DEFAULT_CONFIG.cloud.getUrl
  if (!cloud.postUrl) cloud.postUrl = DEFAULT_CONFIG.cloud.postUrl
  return {
    ...deepClone(DEFAULT_CONFIG),
    ...saved,
    cloud,
    displayPoints: saved.displayPoints || deepClone(DEFAULT_CONFIG.displayPoints),
    switchPoints: saved.switchPoints || deepClone(DEFAULT_CONFIG.switchPoints),
    thresholdPoints: saved.thresholdPoints || deepClone(DEFAULT_CONFIG.thresholdPoints),
    recommendedPoints: {
      ...deepClone(DEFAULT_CONFIG.recommendedPoints),
      ...(saved.recommendedPoints || {})
    }
  }
}

export function getConfig() {
  try {
    const saved = uni.getStorageSync(CONFIG_KEY)
    return mergeConfig(saved || {})
  } catch (error) {
    console.warn('Failed to read config', error)
    return deepClone(DEFAULT_CONFIG)
  }
}

export function saveConfig(config) {
  uni.setStorageSync(CONFIG_KEY, mergeConfig(config))
}

export function getHistory() {
  try {
    return uni.getStorageSync(HISTORY_KEY) || []
  } catch (error) {
    console.warn('Failed to read history', error)
    return []
  }
}

export function saveHistory(history) {
  uni.setStorageSync(HISTORY_KEY, history.slice(-HISTORY_LIMIT))
}

export function appendHistory(values, displayPoints) {
  const nextItem = {
    time: Date.now(),
    values: {}
  }

  displayPoints.forEach((point) => {
    if (point.identifier) {
      nextItem.values[point.identifier] = values[point.identifier]
    }
  })

  const nextHistory = [...getHistory(), nextItem].slice(-HISTORY_LIMIT)
  saveHistory(nextHistory)
  return nextHistory
}

export function clearHistory() {
  uni.removeStorageSync(HISTORY_KEY)
}

// ── Debug values ──

const DEBUG_VALUES_KEY = 'cloud_comm_debug_values'

export function getDebugValues() {
  try {
    return uni.getStorageSync(DEBUG_VALUES_KEY) || {}
  } catch (error) {
    console.warn('Failed to read debug values', error)
    return {}
  }
}

export function saveDebugValues(values) {
  uni.setStorageSync(DEBUG_VALUES_KEY, values || {})
}

export function clearDebugValues() {
  uni.removeStorageSync(DEBUG_VALUES_KEY)
}
