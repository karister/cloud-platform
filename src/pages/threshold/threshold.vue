<template>
  <view class="page">
    <view class="header-panel">
      <view>
        <text class="eyebrow">设备参数</text>
        <text class="title">阈值设置</text>
        <text class="desc">
          {{ config.cloud.mockMode
            ? '当前为模拟数据模式，阈值仅本地生效。'
            : '已绑定云平台当前值；调整后会自动下发到下位机。' }}
        </text>
        <text v-if="lastSyncedAt && !config.cloud.mockMode" class="sync-meta">
          最近同步：{{ formatTime(lastSyncedAt) }}
        </text>
      </view>
      <view class="summary-chip" @tap="loadFromCloud">
        <text>{{ refreshing ? '…' : thresholds.length }}</text>
        <text>{{ refreshing ? '同步中' : '项' }}</text>
      </view>
    </view>

    <view v-if="thresholds.length" class="threshold-list">
      <view v-for="point in thresholds" :key="point.identifier" class="threshold-card">
        <view class="card-head">
          <view>
            <text class="point-label">{{ point.label || point.identifier }}</text>
            <text class="point-id">{{ point.identifier }}</text>
          </view>
          <view class="value-badge">
            <text>{{ formatValue(point.value) }}</text>
            <text>{{ point.unit }}</text>
          </view>
        </view>

        <slider
          class="slider"
          :activeColor="themeAccent"
          backgroundColor="var(--theme-divider-light)"
          :block-color="themeAccent"
          :min="Number(point.min)"
          :max="Number(point.max)"
          :step="Number(point.step) || 1"
          :value="Number(point.value)"
          :disabled="config.cloud.mockMode && false"
          @changing="onAdjust(point, $event.detail.value)"
          @change="onAdjust(point, $event.detail.value)"
        />

        <view class="range-row">
          <text>{{ point.min }}{{ point.unit }}</text>
          <input
            class="value-input"
            type="number"
            :value="String(point.value)"
            @input="onInputAdjust(point, $event.detail.value)"
          />
          <text>{{ point.max }}{{ point.unit }}</text>
        </view>

        <view class="status-row" :class="statusClass(point.identifier)">
          <text>{{ statusText(point.identifier) }}</text>
        </view>
      </view>
    </view>

    <EmptyState v-else title="未配置阈值数据点" desc="请在后台配置中添加需要通过滑条下发的属性" />

    <AppTabBar current="threshold" />
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
import AppTabBar from '../../components/AppTabBar.vue'
import EmptyState from '../../components/EmptyState.vue'
import { fetchProperties, setDesiredProperty } from '../../services/onenet'
import { getConfig, saveConfig } from '../../utils/storage'
import { THEME_LIST } from '../../utils/themes'

// 阈值页轮询节奏：与 dashboard 保持一致，每 5 秒拉一次
const POLL_INTERVAL_MS = 5000

const config = ref(getConfig())
const thresholds = ref([])
const refreshing = ref(false)
const lastSyncedAt = ref(0)
// per-identifier status: 'idle' | 'pending' | 'sending' | 'success' | { error: string }
const sendStatus = reactive({})

// 轮询 timer 与上一次下发的时间戳 — 用于避免轮询把刚下发未确认的值覆盖掉
let pollTimer = null
const recentPushAt = {}  // { [identifier]: timestamp }

const themeAccent = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? theme.cssVars['--theme-accent'] : '#0f6b67'
})

const debounceTimers = {}

function formatTime(ts) {
  if (!ts) return '--'
  const d = new Date(ts)
  return d.toLocaleTimeString('zh-CN', { hour12: false })
}

function formatValue(v) {
  const num = Number(v)
  return Number.isFinite(num) ? String(num) : '--'
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function syncThresholds() {
  config.value = getConfig()
  thresholds.value = config.value.thresholdPoints.map((point) => ({
    ...point,
    value: Number(point.value ?? point.min ?? 0)
  }))
  // 重置每个点的状态
  thresholds.value.forEach((p) => {
    sendStatus[p.identifier] = sendStatus[p.identifier] || 'idle'
  })
}

function persistThresholds() {
  config.value.thresholdPoints = thresholds.value
  saveConfig(config.value)
}

/**
 * 从云平台拉取每个阈值点的当前值。仅 mockMode=false 时调用。
 * 同一函数既用于初次加载，也用于轮询节奏。
 */
async function loadFromCloud({ silent = false } = {}) {
  if (config.value.cloud.mockMode) {
    lastSyncedAt.value = Date.now()
    return
  }
  if (refreshing.value) return
  refreshing.value = true
  try {
    const values = await fetchProperties(config.value)
    let updated = 0
    thresholds.value.forEach((point) => {
      const v = values[point.identifier]
      if (v === undefined || v === null) return
      const num = Number(v)
      if (!Number.isFinite(num)) return

      // 如果刚刚下发过该点（1.5 秒内），跳过 — 避免轮询在服务器还没
      // 同步完成前把下发前的旧值回灌过来
      const pushedAt = recentPushAt[point.identifier] || 0
      if (Date.now() - pushedAt < 1500) return

      point.value = num
      sendStatus[point.identifier] = 'success'
      updated += 1
    })
    if (updated > 0) persistThresholds()
    lastSyncedAt.value = Date.now()
  } catch (error) {
    if (!silent) {
      uni.showToast({
        title: error.message || '读取云平台失败',
        icon: 'none'
      })
    }
  } finally {
    refreshing.value = false
  }
}

function startPolling() {
  stopPolling()
  if (config.value.cloud.mockMode) return
  pollTimer = setInterval(() => {
    loadFromCloud({ silent: true })
  }, POLL_INTERVAL_MS)
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

/**
 * 把指定阈值的最新值下发到下位机。
 * mockMode 下仅做本地持久化（不下发）。
 */
async function pushToCloud(point) {
  if (config.value.cloud.mockMode) {
    sendStatus[point.identifier] = 'success'
    persistThresholds()
    return
  }
  sendStatus[point.identifier] = 'sending'
  // 标记刚下发时间，1.5 秒内的轮询不会覆盖本地值（云端可能还没同步）
  recentPushAt[point.identifier] = Date.now()
  try {
    await setDesiredProperty(config.value, point.identifier, Number(point.value))
    sendStatus[point.identifier] = 'success'
    persistThresholds()
  } catch (error) {
    sendStatus[point.identifier] = { error: error.message || '下发失败' }
    uni.showToast({
      title: error.message || '下发失败',
      icon: 'none'
    })
  }
}

function onAdjust(point, value) {
  const next = Number(value)
  if (!Number.isFinite(next)) return
  point.value = clamp(next, Number(point.min), Number(point.max))
  sendStatus[point.identifier] = 'pending'
  // 防抖：用户连续拖动时只下发最后一次
  if (debounceTimers[point.identifier]) {
    clearTimeout(debounceTimers[point.identifier])
  }
  debounceTimers[point.identifier] = setTimeout(() => {
    pushToCloud(point)
  }, 350)
}

function onInputAdjust(point, value) {
  const next = Number(value)
  if (!Number.isFinite(next)) return
  point.value = clamp(next, Number(point.min), Number(point.max))
  sendStatus[point.identifier] = 'pending'
  // 输入框没有连续事件，短暂延迟后立即下发
  if (debounceTimers[point.identifier]) {
    clearTimeout(debounceTimers[point.identifier])
  }
  debounceTimers[point.identifier] = setTimeout(() => {
    pushToCloud(point)
  }, 350)
}

function statusClass(identifier) {
  const s = sendStatus[identifier]
  if (s === 'sending') return 'is-sending'
  if (s === 'pending') return 'is-pending'
  if (s && typeof s === 'object' && s.error) return 'is-error'
  if (s === 'success') return 'is-success'
  return 'is-idle'
}

function statusText(identifier) {
  const s = sendStatus[identifier]
  if (s === 'sending') return '下发中…'
  if (s === 'pending') return '待下发…'
  if (s && typeof s === 'object' && s.error) return `下发失败：${s.error}`
  if (s === 'success') return config.value.cloud.mockMode
    ? '本地已更新（模拟模式）'
    : '已同步 · ' + formatTime(lastSyncedAt || Date.now())
  return config.value.cloud.mockMode
    ? '模拟模式'
    : (lastSyncedAt ? '已绑定云平台' : '正在拉取云平台当前值…')
}

onShow(() => {
  syncThresholds()
  loadFromCloud()
  startPolling()
})

onHide(() => {
  stopPolling()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28rpx 28rpx 150rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, var(--theme-bg-gradient-settings-start) 0%, var(--theme-bg-gradient-settings-end) 45%, var(--theme-bg-gradient-settings-end) 100%);
}

.header-panel,
.threshold-card {
  border: var(--theme-card-border-width) var(--theme-card-border-style) var(--theme-surface-border);
  border-radius: var(--theme-radius-lg);
  background: var(--theme-surface);
  box-shadow: 0 14rpx 38rpx var(--theme-shadow-sm);
}

.header-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  padding: 30rpx;
}

.eyebrow,
.title,
.desc,
.sync-meta,
.point-label,
.point-id,
.value-badge text {
  display: block;
}

.eyebrow {
  color: var(--theme-accent);
  font-size: 23rpx;
  font-weight: 800;
}

.title {
  margin-top: 8rpx;
  color: var(--theme-text-primary);
  font-size: 40rpx;
  font-weight: 900;
}

.desc {
  margin-top: 10rpx;
  color: var(--theme-text-secondary);
  font-size: 25rpx;
  line-height: 1.45;
}

.sync-meta {
  margin-top: 8rpx;
  color: var(--theme-text-tertiary);
  font-size: 22rpx;
}

.summary-chip {
  display: flex;
  width: 108rpx;
  height: 108rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 28rpx;
  background: var(--theme-summary-chip-bg);
  color: var(--theme-summary-chip-text);
  font-size: 22rpx;
  font-weight: 800;
  flex-shrink: 0;
}

.summary-chip:active {
  transform: scale(0.96);
}

.summary-chip text:first-child {
  font-size: 38rpx;
  font-weight: 900;
  line-height: 1;
}

.threshold-list {
  display: flex;
  flex-direction: column;
  gap: var(--theme-layout-section-gap);
  margin-top: 22rpx;
}

.threshold-card {
  padding: 24rpx;
}

.card-head,
.range-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.point-label {
  color: var(--theme-text-primary);
  font-size: 30rpx;
  font-weight: 850;
}

.point-id {
  margin-top: 8rpx;
  color: var(--theme-text-tertiary);
  font-size: 22rpx;
}

.value-badge {
  min-width: 116rpx;
  padding: 14rpx 16rpx;
  border-radius: var(--theme-radius-md);
  background: var(--theme-value-badge-bg);
  color: var(--theme-value-badge-text);
  text-align: center;
  box-sizing: border-box;
}

.value-badge text:first-child {
  font-size: 38rpx;
  font-weight: 900;
  line-height: 1;
}

.value-badge text:last-child {
  margin-top: 4rpx;
  color: var(--theme-value-badge-unit);
  font-size: 20rpx;
  font-weight: 700;
}

.slider {
  margin: 38rpx 0 20rpx;
}

.range-row {
  color: var(--theme-text-secondary);
  font-size: 24rpx;
}

.value-input {
  width: 154rpx;
  height: 68rpx;
  border: 1px solid var(--theme-input-border);
  border-radius: var(--theme-input-style);
  background: var(--theme-input-bg);
  color: var(--theme-text-primary);
  font-size: 28rpx;
  font-weight: 800;
  text-align: center;
}

.status-row {
  margin-top: 16rpx;
  padding: 8rpx 14rpx;
  border-radius: var(--theme-radius-input);
  font-size: 22rpx;
  font-weight: 700;
  line-height: 1.4;
}

.status-row.is-idle {
  background: var(--theme-category-tabs-bg);
  color: var(--theme-text-tertiary);
}

.status-row.is-pending {
  background: var(--theme-category-tabs-bg);
  color: var(--theme-text-secondary);
}

.status-row.is-sending {
  background: rgba(13, 201, 176, 0.12);
  color: var(--theme-accent);
}

.status-row.is-success {
  background: rgba(13, 201, 176, 0.18);
  color: var(--theme-accent);
}

.status-row.is-error {
  background: var(--theme-danger-bg);
  color: var(--theme-danger);
}
</style>