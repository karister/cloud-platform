<template>
  <view class="page">
    <view class="hero">
      <view class="hero-overlay" />
      <view class="hero-copy">
        <text class="eyebrow">设备云平台</text>
        <text class="title">{{ config.appName }}</text>
        <view class="hero-meta">
          <text class="meta-item code">{{ config.cloud.productId || '--' }}</text>
          <view class="meta-divider" />
          <text class="meta-item code">{{ config.cloud.deviceName || '--' }}</text>
        </view>
      </view>
      <view class="hero-action">
        <view class="status-dot" :class="statusClass" />
        <text class="status-text">{{ statusText }}</text>
      </view>
    </view>

    <view class="quick-row">
      <view class="quick-card">
        <view class="quick-head">
          <AppIcon name="pulse" :size="26" class="quick-icon" />
          <text class="quick-label">展示点位</text>
        </view>
        <text class="quick-value num">{{ config.displayPoints.length }}</text>
      </view>
      <view class="quick-card">
        <view class="quick-head">
          <AppIcon name="toggle-left" :size="26" class="quick-icon" />
          <text class="quick-label">开关点位</text>
        </view>
        <text class="quick-value num">{{ config.switchPoints.length }}</text>
      </view>
      <view class="quick-card accent">
        <view class="quick-head">
          <AppIcon name="timer" :size="26" class="quick-icon" />
          <text class="quick-label">更新时间</text>
        </view>
        <text class="quick-time num">{{ lastUpdateText }}</text>
      </view>
    </view>

    <view class="section-card">
      <view class="section-head">
        <view>
          <text class="section-title">实时数据</text>
          <text class="section-desc">读取已配置的云平台属性</text>
        </view>
        <button class="refresh-btn" :disabled="refreshing" @tap="loadData">
          <AppIcon name="arrows-clockwise" :size="26" class="refresh-icon" :class="{ spinning: refreshing }" />
          <text>{{ refreshing ? '刷新中' : '刷新' }}</text>
        </button>
      </view>

      <view v-if="config.displayPoints.length && !hasSynced" class="metric-grid">
        <Skeleton v-for="i in Math.min(config.displayPoints.length, 4)" :key="i" />
      </view>

      <view v-else-if="config.displayPoints.length" class="metric-grid">
        <view
          v-for="(point, index) in config.displayPoints"
          :key="point.identifier + '-' + index"
          class="metric-card entry-rise"
          :class="{ 'metric-alarm': alarmIds.has(point.identifier) }"
          :style="{ animationDelay: (index % 6) * 40 + 'ms' }"
        >
          <view class="metric-top">
            <text class="metric-label">{{ point.label || point.identifier }}</text>
            <text class="metric-id code">{{ point.identifier }}</text>
          </view>
          <view class="metric-value-row">
            <text class="metric-value num" :class="{ 'value-alarm': alarmIds.has(point.identifier) }">
              {{ metricParts(values[point.identifier], point.unit).num }}
            </text>
            <text
              v-if="metricParts(values[point.identifier], point.unit).unit"
              class="metric-unit"
            >
              {{ metricParts(values[point.identifier], point.unit).unit }}
            </text>
          </view>
          <view v-if="point.alarmThresholdId" class="metric-track">
            <view
              class="metric-fill"
              :class="{ 'fill-alarm': alarmIds.has(point.identifier) }"
              :style="{ width: metricWidth(point, values[point.identifier]) }"
            />
          </view>
          <view v-if="alarmIds.has(point.identifier)" class="alarm-tag">
            <AppIcon name="warning" :size="22" />
            <text>告警</text>
          </view>
        </view>
      </view>
      <EmptyState v-else icon="pulse" title="未配置展示数据点" desc="请在后台配置中添加需要读取的云平台属性" />
    </view>

    <view class="section-card">
      <view class="section-head">
        <view>
          <text class="section-title">开关控制</text>
          <text class="section-desc">下发设备期望属性</text>
        </view>
        <text class="count-badge num">{{ config.switchPoints.length }} 项</text>
      </view>

      <view v-if="config.switchPoints.length" class="switch-list">
        <view
          v-for="(point, index) in config.switchPoints"
          :key="point.identifier + '-' + index"
          class="switch-row"
        >
          <view class="switch-copy">
            <text class="switch-title">{{ point.label || point.identifier }}</text>
            <text class="switch-id code">{{ point.identifier }}</text>
          </view>
          <view class="switch-state">
            <text class="switch-status" :class="{ on: Boolean(values[point.identifier]) }">
              {{ values[point.identifier] ? '已开启' : '已关闭' }}
            </text>
            <view class="switch-control">
              <switch
                :color="themeAccent"
                :checked="Boolean(values[point.identifier])"
                @change="onSwitchChange(point, $event.detail.value)"
              />
            </view>
          </view>
        </view>
      </view>
      <EmptyState v-else icon="toggle-left" title="未配置开关数据点" desc="请在后台配置中添加可下发的开关属性" />
    </view>

    <AppTabBar current="dashboard" />
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppIcon from '../../components/AppIcon.vue'
import AppTabBar from '../../components/AppTabBar.vue'
import EmptyState from '../../components/EmptyState.vue'
import Skeleton from '../../components/Skeleton.vue'
import { dataStore } from '../../stores/dataStore'
import { appendHistory, getConfig } from '../../utils/storage'
import { formatTime } from '../../utils/format'
import { THEME_LIST } from '../../utils/themes'

const config = ref(getConfig())
const status = computed(() => (dataStore.lastError.value ? 'error' : (dataStore.lastSyncedAt.value ? 'online' : 'idle')))
const lastUpdate = computed(() => dataStore.lastSyncedAt.value)
const refreshing = computed(() => dataStore.refreshing.value)
// 首次同步完成前用骨架屏占位，避免一屏 '--'
const hasSynced = computed(() => dataStore.lastSyncedAt.value > 0)

// 在 setup 内声明此模板引用的顶层标识，避免外层 ref 已删除后报 undefined
const values = dataStore.latestValues

const statusClass = computed(() => ({
  'is-online': status.value === 'online',
  'is-error': status.value === 'error'
}))

const statusText = computed(() => {
  if (status.value === 'online') return config.value.cloud.mockMode ? '模拟运行' : '云端在线'
  if (status.value === 'error') return dataStore.lastError.value || '连接异常'
  return '等待刷新'
})

const lastUpdateText = computed(() => (lastUpdate.value ? formatTime(lastUpdate.value) : '--:--:--'))

const themeAccent = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? theme.cssVars['--theme-accent'] : '#0f6b67'
})

/**
 * 数值与单位分离排版：数值走 tabular 大字，单位弱化显示。
 * 布尔（开关点位误配到展示区）显示 开启/关闭，非数值原样展示。
 */
function metricParts(value, unit = '') {
  if (value === undefined || value === null || value === '') return { num: '--', unit: '' }
  if (typeof value === 'boolean') return { num: value ? '开启' : '关闭', unit: '' }
  const num = Number(value)
  if (Number.isFinite(num)) return { num: String(Number(num.toFixed(2))), unit: unit || '' }
  return { num: String(value), unit: unit || '' }
}

function getThresholdForPoint(point) {
  if (!point.alarmThresholdId) return null
  return (config.value.thresholdPoints || []).find((t) => t.identifier === point.alarmThresholdId) || null
}

/**
 * 取出该阈值点当前应该用于比较的数值。
 * 优先用 dataStore 里的最新云端值（每次轮询都会刷新），
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
 * 每次全局轮询完成（lastSyncedAt 变化）就重判一次，
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

// 显式与全局轮询绑定：每次 lastSyncedAt 变化（refresh 成功）就重判一次报警
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
    await dataStore.setDesired(point.identifier, checked ? '1' : '0')
    uni.showToast({ title: '指令已下发', icon: 'success', duration: 1000, mask: true })
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
  padding: 28rpx 28rpx 176rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, var(--theme-bg-gradient-start) 0%, var(--theme-bg-gradient-end) 38%, var(--theme-bg-gradient-end) 100%);
}

.hero {
  position: relative;
  display: flex;
  min-height: 238rpx;
  align-items: flex-start;
  justify-content: space-between;
  gap: 22rpx;
  padding: 34rpx 32rpx;
  border-radius: var(--theme-radius-lg);
  background: linear-gradient(135deg, var(--theme-hero-bg-start) 0%, var(--theme-hero-bg-end) 100%);
  color: var(--theme-hero-text);
  box-shadow: 0 22rpx 56rpx var(--theme-shadow-lg);
  box-sizing: border-box;
  overflow: hidden;
}

/* 主题提供的 hero 表层：默认 none，glass 主题为径向光晕 */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: var(--theme-hero-overlay);
  pointer-events: none;
}

.hero-copy {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.eyebrow,
.title,
.status-text,
.quick-label,
.quick-value,
.quick-time,
.section-title,
.section-desc,
.metric-label,
.metric-id,
.metric-value,
.metric-unit,
.switch-title,
.switch-id {
  display: block;
}

.eyebrow {
  color: var(--theme-hero-text-muted);
  font-size: 22rpx;
  font-weight: 600;
  letter-spacing: 3rpx;
}

.title {
  margin-top: 12rpx;
  font-size: 44rpx;
  font-weight: 700;
  line-height: 1.2;
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 20rpx;
  min-width: 0;
}

.meta-item {
  overflow: hidden;
  color: var(--theme-hero-text-muted);
  font-size: 23rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta-divider {
  width: 5rpx;
  height: 5rpx;
  border-radius: 50%;
  background: var(--theme-hero-text-muted);
  flex: 0 0 auto;
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
  white-space: nowrap;
}

.status-text {
  font-size: 23rpx;
  font-weight: 500;
}

.status-dot {
  position: relative;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: var(--theme-warning);
  flex: 0 0 auto;
}

.status-dot.is-online {
  background: var(--theme-success);
}

.status-dot.is-error {
  background: var(--theme-danger);
}

/* 在线呼吸：外圈扩散提示数据在持续刷新 */
.status-dot.is-online::after {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--theme-success);
  content: "";
  animation: dot-pulse 2.2s ease-out infinite;
}

@keyframes dot-pulse {
  0% {
    opacity: 0.55;
    transform: scale(1);
  }
  70%,
  100% {
    opacity: 0;
    transform: scale(2.4);
  }
}

.quick-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.25fr;
  gap: var(--theme-layout-gap);
  margin-top: -46rpx;
  padding: 0 18rpx;
  position: relative;
  z-index: 2;
}

.quick-card {
  min-height: 116rpx;
  padding: 18rpx;
  border: var(--theme-card-border-width) var(--theme-card-border-style) var(--theme-surface-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface);
  box-shadow: 0 14rpx 38rpx var(--theme-shadow-md);
  box-sizing: border-box;
}

.quick-card.accent {
  background: var(--theme-surface-alt-2);
}

.quick-head {
  display: flex;
  align-items: center;
  gap: 8rpx;
  min-width: 0;
}

.quick-icon {
  color: var(--theme-accent);
  flex: 0 0 auto;
}

.quick-label {
  overflow: hidden;
  color: var(--theme-text-secondary);
  font-size: 22rpx;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-value,
.quick-time {
  margin-top: 12rpx;
  color: var(--theme-text-primary);
  font-size: 36rpx;
  font-weight: 700;
  line-height: 1;
}

.quick-time {
  color: var(--theme-accent);
  font-size: 30rpx;
}

.section-card {
  margin-top: var(--theme-layout-section-gap);
  padding: 24rpx;
  border: var(--theme-card-border-width) var(--theme-card-border-style) var(--theme-surface-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface);
  box-shadow: 0 12rpx 34rpx var(--theme-shadow-sm);
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
  font-size: 30rpx;
  font-weight: 700;
}

.section-desc {
  margin-top: 6rpx;
  color: var(--theme-text-secondary);
  font-size: 23rpx;
  font-weight: 500;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  width: auto;
  height: 64rpx;
  margin: 0;
  padding: 0 22rpx;
  border-radius: var(--theme-btn-style);
  background: var(--theme-accent);
  color: var(--theme-accent-contrast);
  font-size: 25rpx;
  font-weight: 600;
  line-height: 1;
}

.refresh-btn[disabled] {
  opacity: 0.72;
}

.refresh-icon.spinning {
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.count-badge {
  padding: 10rpx 16rpx;
  border-radius: var(--theme-radius-pill);
  background: var(--theme-badge-bg);
  color: var(--theme-badge-text);
  font-size: 23rpx;
  font-weight: 600;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--theme-layout-gap);
}

.metric-card {
  position: relative;
  min-height: 224rpx;
  padding: 22rpx;
  border: var(--theme-card-border-width) var(--theme-card-border-style) var(--theme-surface-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface-alt);
  box-sizing: border-box;
}

/* 入场：轻量上浮渐显，逐卡 40ms 错峰（reduced-motion 下全局关闭） */
.entry-rise {
  animation: entry-rise 0.34s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}

@keyframes entry-rise {
  from {
    opacity: 0;
    transform: translateY(14rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.metric-top {
  min-height: 60rpx;
}

.metric-label {
  overflow: hidden;
  color: var(--theme-text-heading);
  font-size: 27rpx;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-id,
.switch-id {
  margin-top: 8rpx;
  color: var(--theme-text-tertiary);
  font-size: 20rpx;
}

.metric-value-row {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
  margin-top: 24rpx;
  min-width: 0;
}

.metric-value {
  overflow: hidden;
  color: var(--theme-accent);
  font-size: 48rpx;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.metric-unit {
  color: var(--theme-text-tertiary);
  font-size: 22rpx;
  font-weight: 500;
  flex: 0 0 auto;
}

.metric-track {
  height: 10rpx;
  margin-top: 26rpx;
  border-radius: var(--theme-radius-pill);
  background: var(--theme-divider-light);
  overflow: hidden;
}

.metric-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--theme-accent), var(--theme-metric-fill-end));
  transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1);
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
  border: var(--theme-card-border-width) var(--theme-card-border-style) var(--theme-surface-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface-alt);
  box-sizing: border-box;
}

.switch-copy {
  min-width: 0;
}

.switch-title {
  color: var(--theme-text-heading);
  font-size: 28rpx;
  font-weight: 600;
}

.switch-state {
  display: flex;
  align-items: center;
  gap: 14rpx;
  flex: 0 0 auto;
}

.switch-status {
  color: var(--theme-text-tertiary);
  font-size: 22rpx;
  font-weight: 500;
}

.switch-status.on {
  color: var(--theme-accent-dark);
  font-weight: 600;
}

.switch-control {
  display: flex;
  transform: scale(0.82);
  transform-origin: right center;
}

/* ── Alarm state：全部走主题 danger token ── */
.metric-card.metric-alarm {
  border-color: var(--theme-danger-border);
  background: var(--theme-danger-bg);
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
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 5rpx 12rpx;
  border-radius: var(--theme-radius-pill);
  background: var(--theme-danger);
  color: #ffffff;
  font-size: 19rpx;
  font-weight: 600;
}
</style>
