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
        <text v-if="lastSyncedAt && !config.cloud.mockMode" class="sync-meta num">
          最近同步：{{ formatTime(lastSyncedAt) }}
        </text>
      </view>
      <view class="summary-chip" aria-label="刷新云端阈值" @tap="loadFromCloud">
        <AppIcon name="sliders-horizontal" :size="34" />
        <text class="summary-count num">{{ thresholds.length }}</text>
        <text>项</text>
      </view>
    </view>

    <view v-if="thresholds.length" class="threshold-list">
      <view v-for="point in thresholds" :key="point.identifier" class="threshold-card">
        <view class="card-head">
          <view>
            <text class="point-label">{{ point.label || point.identifier }}</text>
            <text class="point-id code">{{ point.identifier }}</text>
          </view>
          <view class="value-badge">
            <text class="num">{{ formatValue(point.value) }}</text>
            <text>{{ point.unit }}</text>
          </view>
        </view>

        <slider
          class="slider"
          :activeColor="themeAccent"
          :backgroundColor="themeDividerLight"
          :block-color="themeAccent"
          :min="Number(point.min)"
          :max="Number(point.max)"
          :step="Number(point.step) || 1"
          :value="Number(point.value)"
          @changing="onAdjust(point, $event.detail.value)"
          @change="onAdjust(point, $event.detail.value)"
        />

        <view class="range-row num">
          <text>{{ point.min }}{{ point.unit }}</text>
          <input
            class="value-input num"
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

    <EmptyState v-else icon="sliders-horizontal" title="未配置阈值数据点" desc="请在后台配置中添加需要通过滑条下发的属性" />

    <AppTabBar current="threshold" />
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppIcon from '../../components/AppIcon.vue'
import AppTabBar from '../../components/AppTabBar.vue'
import EmptyState from '../../components/EmptyState.vue'
import { dataStore } from '../../stores/dataStore'
import { getConfig, saveConfig } from '../../utils/storage'
import { THEME_LIST } from '../../utils/themes'

const config = ref(getConfig())
const thresholds = ref([])
// per-identifier status: 'idle' | 'pending' | 'sending' | 'success' | { error: string }
const sendStatus = reactive({})

// 防抖 timer：每个 identifier 独立一份
const debounceTimers = {}

// 暴露 store 派生状态给模板使用
const lastSyncedAt = computed(() => dataStore.lastSyncedAt.value)
const currentValues = dataStore.latestValues  // reactive 全局实时值字典

const themeAccent = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? theme.cssVars['--theme-accent'] : '#0f6b67'
})

// uni slider 的 backgroundColor 是原生属性，不认 CSS var，需传主题实际色值
const themeDividerLight = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? theme.cssVars['--theme-divider-light'] : '#eaf1f3'
})

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
  thresholds.value = config.value.thresholdPoints.map((point) => {
    const step = Number(point.step) || 1
    const raw = Number(currentValues[point.identifier] ?? point.value ?? point.min ?? 0)
    // 云端实时值可能带小数，按滑条步进取整，保证徽标/输入框/滑条三者一致
    const snapped = Number.isFinite(raw) ? Math.round(raw / step) * step : raw
    return {
      ...point,
      // 优先用 store 里的最新值（刚拉下来的云端值），没有则用本地持久化值
      value: snapped
    }
  })
  thresholds.value.forEach((p) => {
    sendStatus[p.identifier] = sendStatus[p.identifier] || 'idle'
  })
}

/**
 * 用户主动触发的手动刷新：走全局 store 的 refresh()。
 * 轮询已经在 App.vue 全局跑着，这里只是手动再拉一次（与定时器去重）。
 */
async function loadFromCloud() {
  await dataStore.refresh()
}

/**
 * 把当前阈值最新值下发到下位机（350ms 防抖后由 onAdjust / onInputAdjust 调用）。
 * 走全局 store.setDesired() — 已包含 recentPushAt 防覆盖 + 乐观更新。
 */
async function pushToCloud(point) {
  sendStatus[point.identifier] = 'sending'
  try {
    await dataStore.setDesired(point.identifier, String(Number(point.value)))
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

function persistThresholds() {
  config.value.thresholdPoints = thresholds.value
  saveConfig(config.value)
}

function onAdjust(point, value) {
  const next = Number(value)
  if (!Number.isFinite(next)) return
  point.value = clamp(next, Number(point.min), Number(point.max))
  sendStatus[point.identifier] = 'pending'
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
    : '已同步 · ' + formatTime(lastSyncedAt.value || Date.now())
  return config.value.cloud.mockMode
    ? '模拟模式'
    : (lastSyncedAt.value ? '已绑定云平台 · ' + formatTime(lastSyncedAt.value) : '正在拉取云平台当前值…')
}

onShow(() => {
  syncThresholds()
  loadFromCloud()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28rpx 28rpx 176rpx;
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
  font-size: 22rpx;
  font-weight: 600;
  letter-spacing: 3rpx;
}

.title {
  margin-top: 8rpx;
  color: var(--theme-text-primary);
  font-size: 40rpx;
  font-weight: 700;
  line-height: 1.2;
}

.desc {
  margin-top: 10rpx;
  color: var(--theme-text-secondary);
  font-size: 24rpx;
  font-weight: 500;
  line-height: 1.45;
}

.sync-meta {
  margin-top: 8rpx;
  color: var(--theme-text-tertiary);
  font-size: 22rpx;
}

.summary-chip {
  display: flex;
  width: 112rpx;
  height: 112rpx;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  border-radius: 28rpx;
  background: var(--theme-summary-chip-bg);
  color: var(--theme-summary-chip-text);
  font-size: 21rpx;
  font-weight: 600;
  flex-shrink: 0;
  transition: transform 0.12s ease, opacity 0.12s ease;
}

.summary-chip:active {
  transform: scale(0.92);
  opacity: 0.85;
}

.summary-count {
  font-size: 36rpx;
  font-weight: 700;
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
  font-size: 28rpx;
  font-weight: 600;
}

.point-id {
  margin-top: 8rpx;
  color: var(--theme-text-tertiary);
  font-size: 21rpx;
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
  font-weight: 700;
  line-height: 1;
}

.value-badge text:last-child {
  margin-top: 4rpx;
  color: var(--theme-value-badge-unit);
  font-size: 20rpx;
  font-weight: 500;
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
  font-weight: 600;
  text-align: center;
}

.status-row {
  margin-top: 16rpx;
  padding: 8rpx 14rpx;
  border-radius: var(--theme-radius-input);
  font-size: 22rpx;
  font-weight: 500;
  line-height: 1.4;
  transition: background-color 0.2s ease, color 0.2s ease;
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
  background: var(--theme-accent-light);
  color: var(--theme-accent-dark);
}

.status-row.is-success {
  background: var(--theme-accent-light);
  color: var(--theme-accent-dark);
}

.status-row.is-error {
  background: var(--theme-danger-bg);
  color: var(--theme-danger);
}
</style>
