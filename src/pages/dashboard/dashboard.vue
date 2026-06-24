<template>
  <view class="page">
    <view class="hero">
      <view class="hero-copy">
        <text class="eyebrow">设备云平台</text>
        <text class="title">{{ config.appName }}</text>
        <text class="subtitle">{{ config.cloud.productId }} / {{ config.cloud.deviceName }}</text>
      </view>
      <view class="hero-action">
        <text class="status-dot" :class="{ online: status === 'online' }" />
        <text>{{ statusText }}</text>
      </view>
    </view>

    <view class="quick-row">
      <view class="quick-card">
        <text class="quick-label">展示点位</text>
        <text class="quick-value">{{ config.displayPoints.length }}</text>
      </view>
      <view class="quick-card">
        <text class="quick-label">开关点位</text>
        <text class="quick-value">{{ config.switchPoints.length }}</text>
      </view>
      <view class="quick-card accent">
        <text class="quick-label">更新时间</text>
        <text class="quick-time">{{ lastUpdateText }}</text>
      </view>
    </view>

    <view class="section-card">
      <view class="section-head">
        <view>
          <text class="section-title">实时数据</text>
          <text class="section-desc">读取已配置的云平台属性</text>
        </view>
        <button class="refresh-btn" @tap="loadData">刷新</button>
      </view>

      <view v-if="config.displayPoints.length" class="metric-grid">
        <view
          v-for="point in config.displayPoints"
          :key="point.identifier"
          class="metric-card"
          :class="{ 'metric-alarm': alarmIds.has(point.identifier) }"
        >
          <view class="metric-top">
            <text class="metric-label">{{ point.label || point.identifier }}</text>
            <text class="metric-id">{{ point.identifier }}</text>
          </view>
          <text class="metric-value" :class="{ 'value-alarm': alarmIds.has(point.identifier) }">
            {{ formatValue(values[point.identifier], point.unit) }}
          </text>
          <view v-if="point.alarmThresholdId" class="metric-track">
            <view
              class="metric-fill"
              :class="{ 'fill-alarm': alarmIds.has(point.identifier) }"
              :style="{ width: metricWidth(point, values[point.identifier]) }"
            />
          </view>
          <text v-if="alarmIds.has(point.identifier)" class="alarm-tag">告警</text>
        </view>
      </view>
      <EmptyState v-else title="未配置展示数据点" desc="请在后台配置中添加需要读取的云平台属性" />
    </view>

    <view class="section-card">
      <view class="section-head">
        <view>
          <text class="section-title">开关控制</text>
          <text class="section-desc">下发设备期望属性</text>
        </view>
        <text class="count-badge">{{ config.switchPoints.length }} 项</text>
      </view>

      <view v-if="config.switchPoints.length" class="switch-list">
        <view v-for="point in config.switchPoints" :key="point.identifier" class="switch-row">
          <view class="switch-copy">
            <text class="switch-title">{{ point.label || point.identifier }}</text>
            <text class="switch-id">{{ point.identifier }}</text>
          </view>
          <view class="switch-state">
            <text>{{ values[point.identifier] ? '开启' : '关闭' }}</text>
            <switch
              :color="themeAccent"
              :checked="Boolean(values[point.identifier])"
              @change="onSwitchChange(point, $event.detail.value)"
            />
          </view>
        </view>
      </view>
      <EmptyState v-else title="未配置开关数据点" desc="请在后台配置中添加可下发的开关属性" />
    </view>

    <AppTabBar current="dashboard" />
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppTabBar from '../../components/AppTabBar.vue'
import EmptyState from '../../components/EmptyState.vue'
import { dataStore } from '../../stores/dataStore'
import { appendHistory, getConfig } from '../../utils/storage'
import { formatTime, formatValue } from '../../utils/format'
import { THEME_LIST } from '../../utils/themes'

const config = ref(getConfig())
const status = computed(() => (dataStore.lastError.value ? 'error' : (dataStore.lastSyncedAt.value ? 'online' : 'idle')))
const lastUpdate = computed(() => dataStore.lastSyncedAt.value)

// 在 setup 内声明此模板引用的顶层标识，避免外层 ref 已删除后报 undefined
const values = dataStore.latestValues

const statusText = computed(() => {
  if (status.value === 'online') return config.value.cloud.mockMode ? '模拟运行' : '云端在线'
  if (status.value === 'error') return dataStore.lastError.value || '连接异常'
  return '等待刷新'
})

const lastUpdateText = computed(() => (lastUpdate.value ? formatTime(lastUpdate.value) : '--:--:--'))

const themeAccent = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  // 兜底用 Apple systemBlue，主题正常定义后这里永远走 truthy 分支
  return theme ? theme.cssVars['--theme-accent'] : '#0071e3'
})

function getThresholdForPoint(point) {
  if (!point.alarmThresholdId) return null
  return (config.value.thresholdPoints || []).find((t) => t.identifier === point.alarmThresholdId) || null
}

/**
 * 取出该阈值点当前应该用于比较的数值。
 * 优先用 dataStore 里的最新云端值（每次 3s 轮询都会刷新），
 * 没有再回退到本地持久化的 threshold.value（首次进入 / 云端尚未下发时）。
 */
function getThresholdValue(threshold) {
  if (!threshold) return null
  const live = dataStore.latestValues[threshold.identifier]
  if (live !== undefined && live !== null && live !== '') {
    const num = Number(live)
    if (Number.isFinite(num)) return num
  }
  return Number(threshold.value)
}

function isAlarming(point, value) {
  const thresholdValue = getThresholdValue(getThresholdForPoint(point))
  if (thresholdValue === null) return false
  const num = Number(value)
  if (!Number.isFinite(num)) return false
  return num > thresholdValue
}

/**
 * 当前处于报警状态的数据点 identifier 集合。
 * 每次全局 3s 轮询完成（lastSyncedAt 变化）就重判一次，
 * 且判定时使用最新的云端阈值（latestValues），不是 config 里的本地旧值。
 */
const alarmIds = ref(new Set())

function evaluateAlarms() {
  const next = new Set()
  config.value.displayPoints.forEach((point) => {
    if (isAlarming(point, dataStore.latestValues[point.identifier])) {
      next.add(point.identifier)
    }
  })
  alarmIds.value = next
}

// 显式与全局 3s 轮询绑定：每次 lastSyncedAt 变化（refresh 成功）就重判一次报警
watch(() => dataStore.lastSyncedAt.value, evaluateAlarms, { immediate: true })

// 单独再监听最新云端阈值的变化：轮询/乐观下发都会更新 latestValues，
// 立即触发一次重判，避免「阈值刚变、轮询还没完成下一个 tick」的延迟感
watch(
  () => config.value.displayPoints.map((p) => {
    const t = getThresholdForPoint(p)
    return t ? dataStore.latestValues[t.identifier] : undefined
  }),
  evaluateAlarms
)

function metricWidth(point, value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '18%'
  const thresholdValue = getThresholdValue(getThresholdForPoint(point))
  // If threshold is bound, use threshold.value as the full scale
  if (thresholdValue !== null) {
    const max = thresholdValue || 100
    const pct = (number / max) * 100
    return `${Math.max(8, Math.min(100, pct))}%`
  }
  // Fallback: use value as-is (for percentage-like values such as humidity)
  return `${Math.max(18, Math.min(96, number))}%`
}

async function loadData() {
  const result = await dataStore.refresh()
  if (result) {
    appendHistory(dataStore.latestValues, config.value.displayPoints)
  }
}

async function onSwitchChange(point, checked) {
  const previous = dataStore.latestValues[point.identifier]
  try {
    await dataStore.setDesired(point.identifier, checked ? 1 : 0)
    uni.showToast({ title: '指令已下发', icon: 'success' })
  } catch (error) {
    dataStore.latestValues[point.identifier] = previous
    uni.showToast({ title: error.message || '下发失败', icon: 'none' })
  }
}

onShow(() => {
  config.value = getConfig()
  loadData()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28rpx 28rpx 150rpx;
  box-sizing: border-box;
  background: var(--theme-bg);
}

.hero {
  position: relative;
  display: flex;
  min-height: 238rpx;
  align-items: flex-start;
  justify-content: space-between;
  gap: 22rpx;
  padding: 34rpx 32rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, var(--theme-hero-bg-start) 0%, var(--theme-hero-bg-end) 100%);
  color: var(--theme-hero-text);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 24rpx 64rpx rgba(0, 0, 0, 0.18);
  box-sizing: border-box;
  overflow: hidden;
}

.hero-copy {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.eyebrow,
.title,
.subtitle,
.quick-label,
.quick-value,
.quick-time,
.section-title,
.section-desc,
.metric-label,
.metric-id,
.metric-value,
.switch-title,
.switch-id {
  display: block;
}

.eyebrow {
  color: var(--theme-hero-text-muted);
  font-size: 23rpx;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.title {
  margin-top: 12rpx;
  font-size: 42rpx;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.subtitle {
  margin-top: 20rpx;
  color: var(--theme-hero-text-muted);
  font-size: 24rpx;
}

.hero-action {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10rpx;
  padding: 12rpx 16rpx;
  border: 1px solid var(--theme-hero-btn-border);
  border-radius: var(--theme-radius-pill);
  background: var(--theme-hero-btn-bg);
  font-size: 23rpx;
  white-space: nowrap;
}

.status-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: var(--theme-warning);
}

.status-dot.online {
  background: var(--theme-success);
}

.quick-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--theme-layout-gap);
  margin-top: 22rpx;
  padding: 0;
  position: relative;
  z-index: 2;
}

.quick-card {
  min-height: 116rpx;
  padding: 18rpx;
  border: 0.5px solid var(--theme-surface-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8rpx 24rpx var(--theme-shadow-sm);
  box-sizing: border-box;
}

.quick-card.accent {
  background: var(--theme-surface-alt);
}

.quick-label {
  color: var(--theme-text-secondary);
  font-size: 22rpx;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.quick-value,
.quick-time {
  margin-top: 12rpx;
  color: var(--theme-text-primary);
  font-size: 34rpx;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.quick-time {
  color: var(--theme-accent);
  font-size: 28rpx;
}

.section-card {
  margin-top: var(--theme-layout-section-gap);
  padding: 28rpx;
  border: 0.5px solid var(--theme-surface-border);
  border-radius: var(--theme-radius-lg);
  background: var(--theme-surface);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8rpx 24rpx var(--theme-shadow-sm);
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18rpx;
  margin-bottom: 20rpx;
}

.section-title {
  color: var(--theme-text-primary);
  font-size: 31rpx;
  font-weight: 700;
  letter-spacing: -0.015em;
}

.section-desc {
  margin-top: 6rpx;
  color: var(--theme-text-secondary);
  font-size: 23rpx;
}

.refresh-btn {
  margin: 0;
  padding: 0 28rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 999rpx;
  background: var(--theme-accent);
  color: var(--theme-accent-contrast);
  font-size: 25rpx;
  font-weight: 500;
}

.count-badge {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: var(--theme-divider);
  color: var(--theme-text-secondary);
  font-size: 23rpx;
  font-weight: 500;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--theme-layout-gap);
}

.metric-card {
  position: relative;
  min-height: 224rpx;
  padding: 26rpx;
  border: 0.5px solid var(--theme-surface-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface);
  box-sizing: border-box;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  transition: transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);
}

.metric-top {
  min-height: 60rpx;
}

.metric-label {
  color: var(--theme-text-heading);
  font-size: 27rpx;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.metric-id,
.switch-id {
  margin-top: 8rpx;
  color: var(--theme-text-tertiary);
  font-size: 21rpx;
}

.metric-value {
  margin-top: 24rpx;
  color: var(--theme-accent);
  font-size: 45rpx;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}

.metric-track {
  height: 10rpx;
  margin-top: 26rpx;
  border-radius: 999rpx;
  background: var(--theme-divider-light);
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: inherit;
  background: var(--theme-accent);
}

.switch-list {
  display: flex;
  flex-direction: column;
  gap: var(--theme-layout-gap);
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 124rpx;
  padding: 20rpx;
  border: 0.5px solid var(--theme-surface-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface);
  box-sizing: border-box;
}

.switch-copy {
  min-width: 0;
}

.switch-title {
  color: var(--theme-text-heading);
  font-size: 29rpx;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.switch-state {
  display: flex;
  align-items: center;
  gap: 12rpx;
  color: var(--theme-text-secondary);
  font-size: 23rpx;
}

/* ── Alarm state (tokenized) ── */
.metric-card.metric-alarm {
  border-color: var(--theme-danger-border);
  background: linear-gradient(135deg, var(--theme-surface) 0%, var(--theme-danger-bg) 100%);
}

.metric-value.value-alarm {
  color: var(--theme-danger);
}

.metric-fill.fill-alarm {
  background: var(--theme-danger);
}

.alarm-tag {
  position: absolute;
  top: 12rpx;
  right: 14rpx;
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  background: var(--theme-danger);
  color: var(--theme-danger-contrast);
  font-size: 19rpx;
  font-weight: 700;
  letter-spacing: 0.04em;
}
</style>
