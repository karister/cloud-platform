import { DEFAULT_CONFIG, HISTORY_LIMIT } from './defaultConfig'

const CONFIG_KEY = 'cloud_comm_config'
const HISTORY_KEY = 'cloud_comm_history'

function deepClone(value) {
  return JSON.parse(JSON.stringify(value))
}

function mergeConfig(saved = {}) {
  return {
    ...deepClone(DEFAULT_CONFIG),
    ...saved,
    cloud: {
      ...deepClone(DEFAULT_CONFIG.cloud),
      ...(saved.cloud || {})
    },
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
