<template>
  <view class="page">
    <!-- Hero panel: 渐变色顶部 + 标题 + 描述 + 最近同步 -->
    <view class="hero">
      <view class="hero-text">
        <text class="hero-title">阈值设置</text>
        <text class="hero-desc">修改安全阈值并下发到设备，正在输入时不会被刷新覆盖。</text>
        <text class="hero-meta">最近同步 {{ syncText }}</text>
      </view>
      <view class="hero-badge" @tap="loadFromCloud">
        <text class="hero-badge-num">{{ refreshing ? '…' : thresholds.length }}</text>
        <text class="hero-badge-label">{{ refreshing ? '同步中' : '项阈值' }}</text>
      </view>
    </view>

    <!-- 传感器对比卡：3 列展示配置 + 阈值 -->
    <view v-if="sensorCards.length" class="sensor-row">
      <view
        v-for="card in sensorCards"
        :key="card.identifier"
        class="sensor-card"
        :class="{ 'is-alarm': card.alarm }"
      >
        <text class="sensor-label">{{ card.label }}</text>
        <text class="sensor-value">
          <text class="sensor-value-num">{{ formatNumber(card.current) }}</text>
          <text class="sensor-value-unit">{{ card.unit }}</text>
        </text>
        <text class="sensor-threshold">
          阈值 {{ formatNumber(card.threshold) }}{{ card.unit }}
        </text>
      </view>
    </view>
    <view v-else-if="!config.cloud.mockMode && hasBoundSensors" class="empty-tip">
      <text>暂无传感器数据，等待首次同步…</text>
    </view>

    <!-- 设备阈值列表 -->
    <view class="section">
      <view class="section-head">
        <text class="section-title">设备阈值</text>
        <text class="section-desc">输入新数值后点击下发</text>
      </view>

      <view v-if="thresholds.length" class="threshold-list">
        <view v-for="point in thresholds" :key="point.identifier" class="threshold-row">
          <view class="row-head">
            <view class="row-head-text">
              <text class="row-title">{{ point.label || point.identifier }}</text>
              <text class="row-id">{{ point.identifier }}</text>
            </view>
            <text class="row-current">当前 {{ formatNumber(currentValues[point.identifier]) }}{{ point.unit }}</text>
          </view>

          <view class="row-input-row">
            <view class="input-wrap">
              <input
                class="row-input"
                type="number"
                :value="String(point.value)"
                :focus="focusedId === point.identifier"
                @focus="onFocus(point.identifier)"
                @blur="onBlur(point.identifier)"
                @input="onAdjust(point, $event.detail.value)"
              />
              <text class="row-unit">{{ point.unit }}</text>
            </view>
            <button
              class="send-btn"
              :class="{ 'is-sending': sendingId === point.identifier }"
              :disabled="sendingId === point.identifier"
              @tap="submit(point)"
            >
              {{ sendingId === point.identifier ? '下发中' : '下发' }}
            </button>
          </view>

          <view v-if="statusOf(point.identifier)" class="row-status" :class="statusClass(point.identifier)">
            <text>{{ statusOf(point.identifier) }}</text>
          </view>
        </view>
      </view>
      <view v-else class="empty-tip">
        <text>未配置阈值数据点，请在后台配置中添加。</text>
      </view>
    </view>

    <AppTabBar current="threshold" />
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppTabBar from '../../components/AppTabBar.vue'
import { fetchProperties, setDesiredProperty } from '../../services/onenet'
import { getConfig, saveConfig } from '../../utils/storage'

const config = ref(getConfig())
const thresholds = ref([])
const currentValues = reactive({})   // 各 threshold 当前值（云平台拉取）
const lastSyncedAt = ref(0)
const refreshing = ref(false)
const sendingId = ref('')
const rowStatus = reactive({})        // { [identifier]: 'success' | 'failed:<msg>' }
const focusedId = ref('')             // 当前聚焦的输入框，避免刷新覆盖

function syncThresholds() {
  config.value = getConfig()
  thresholds.value = config.value.thresholdPoints.map((point) => ({
    ...point,
    value: Number(point.value ?? point.min ?? 0)
  }))
}

function formatNumber(v) {
  const num = Number(v)
  if (!Number.isFinite(num)) return '--'
  // 整数不带小数；浮点保留 2 位
  return Number.isInteger(num) ? String(num) : num.toFixed(2)
}

const syncText = computed(() => {
  if (config.value.cloud.mockMode) return '模拟模式'
  if (!lastSyncedAt.value) return refreshing ? '同步中…' : '--'
  const d = new Date(lastSyncedAt.value)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

const sensorCards = computed(() => {
  // 展示所有 displayPoints 中绑定了阈值的那些
  const points = config.value.displayPoints || []
  return points
    .filter((p) => p.alarmThresholdId)
    .map((p) => {
      const t = (config.value.thresholdPoints || []).find((tp) => tp.identifier === p.alarmThresholdId)
      const cur = Number(currentValues[p.identifier])
      const thr = t ? Number(t.value) : NaN
      const alarm = Number.isFinite(cur) && Number.isFinite(thr) && cur > thr
      return {
        identifier: p.identifier,
        label: p.label || p.identifier,
        current: currentValues[p.identifier],
        threshold: t ? t.value : null,
        unit: p.unit || (t ? t.unit : ''),
        alarm
      }
    })
})

const hasBoundSensors = computed(() =>
  (config.value.displayPoints || []).some((p) => p.alarmThresholdId)
)

async function loadFromCloud() {
  if (config.value.cloud.mockMode) {
    lastSyncedAt.value = Date.now()
    return
  }
  if (refreshing.value) return
  refreshing.value = true
  try {
    const values = await fetchProperties(config.value)
    // 把所有 identifier 的当前值缓存
    Object.keys(values).forEach((k) => {
      if (Number.isFinite(Number(values[k]))) {
        currentValues[k] = Number(values[k])
      }
    })
    // 如果用户没在改这个输入框，更新它的本地 value（以保持一致）
    thresholds.value.forEach((point) => {
      if (focusedId.value === point.identifier) return
      const v = values[point.identifier]
      if (v === undefined || v === null) return
      const num = Number(v)
      if (!Number.isFinite(num)) return
      point.value = num
    })
    lastSyncedAt.value = Date.now()
  } catch (error) {
    uni.showToast({ title: error.message || '读取云平台失败', icon: 'none' })
  } finally {
    refreshing.value = false
  }
}

function persistThresholds() {
  config.value.thresholdPoints = thresholds.value
  saveConfig(config.value)
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function onFocus(identifier) {
  focusedId.value = identifier
}

function onBlur(identifier) {
  if (focusedId.value === identifier) {
    focusedId.value = ''
  }
}

function onAdjust(point, value) {
  const next = Number(value)
  if (!Number.isFinite(next)) return
  point.value = clamp(next, Number(point.min), Number(point.max))
  // 用户主动改了值，清掉该点的状态提示
  delete rowStatus[point.identifier]
}

async function submit(point) {
  if (sendingId.value) return
  sendingId.value = point.identifier
  delete rowStatus[point.identifier]

  try {
    if (config.value.cloud.mockMode) {
      persistThresholds()
      rowStatus[point.identifier] = 'success'
      uni.showToast({ title: '模拟模式已保存', icon: 'success' })
    } else {
      await setDesiredProperty(config.value, point.identifier, Number(point.value))
      currentValues[point.identifier] = Number(point.value)
      lastSyncedAt.value = Date.now()
      persistThresholds()
      rowStatus[point.identifier] = 'success'
      uni.showToast({ title: '下发成功', icon: 'success' })
    }
  } catch (error) {
    rowStatus[point.identifier] = `failed:${error.message || '下发失败'}`
    uni.showToast({ title: error.message || '下发失败', icon: 'none' })
  } finally {
    sendingId.value = ''
    // 短暂显示状态后自动清理
    setTimeout(() => {
      if (rowStatus[point.identifier] === 'success') {
        delete rowStatus[point.identifier]
      }
    }, 3000)
  }
}

function statusOf(identifier) {
  const s = rowStatus[identifier]
  if (!s) return ''
  if (s === 'success') return '已下发到设备'
  if (s.startsWith('failed:')) return `下发失败：${s.slice('failed:'.length)}`
  return s
}

function statusClass(identifier) {
  const s = rowStatus[identifier]
  if (s === 'success') return 'is-success'
  if (s && s.startsWith('failed:')) return 'is-failed'
  return ''
}

onShow(() => {
  syncThresholds()
  loadFromCloud()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28rpx 28rpx 150rpx;
  box-sizing: border-box;
  background: var(--theme-bg-gradient-end);
}

/* ── Hero 顶部渐变面板 ── */
.hero {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 18rpx;
  padding: 32rpx 30rpx;
  border-radius: var(--theme-radius-lg);
  background: linear-gradient(135deg, var(--theme-hero-bg-start) 0%, var(--theme-hero-bg-end) 100%);
  box-shadow: 0 18rpx 36rpx rgba(15, 118, 110, 0.18);
}

.hero-text {
  flex: 1;
  min-width: 0;
}

.hero-title,
.hero-desc,
.hero-meta {
  display: block;
  color: var(--theme-hero-text);
}

.hero-title {
  font-size: 44rpx;
  font-weight: 900;
  letter-spacing: 1rpx;
}

.hero-desc {
  margin-top: 10rpx;
  color: var(--theme-hero-text-muted);
  font-size: 24rpx;
  line-height: 1.5;
}

.hero-meta {
  margin-top: 14rpx;
  color: var(--theme-hero-text-muted);
  font-size: 22rpx;
}

.hero-badge {
  display: flex;
  width: 116rpx;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 24rpx;
  background: var(--theme-hero-btn-bg);
  border: 1rpx solid var(--theme-hero-btn-border);
}

.hero-badge:active {
  transform: scale(0.96);
}

.hero-badge-num {
  color: var(--theme-hero-text);
  font-size: 40rpx;
  font-weight: 900;
  line-height: 1;
}

.hero-badge-label {
  margin-top: 6rpx;
  color: var(--theme-hero-text-muted);
  font-size: 20rpx;
  font-weight: 700;
}

/* ── 传感器对比卡 ── */
.sensor-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 22rpx;
}

.sensor-card {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  padding: 22rpx 22rpx 24rpx;
  border-radius: var(--theme-radius-lg);
  background: var(--theme-surface);
  border: 2rpx solid var(--theme-surface-border-light);
  box-shadow: 0 12rpx 28rpx var(--theme-shadow-sm);
  box-sizing: border-box;
  min-width: 0;
}

.sensor-card.is-alarm {
  border-color: #ef4444;
  background: rgba(254, 226, 226, 0.6);
  box-shadow: 0 12rpx 28rpx rgba(239, 68, 68, 0.18);
}

.sensor-label {
  color: var(--theme-text-secondary);
  font-size: 24rpx;
  font-weight: 700;
}

.sensor-value {
  margin-top: 6rpx;
}

.sensor-value-num {
  color: var(--theme-text-primary);
  font-size: 38rpx;
  font-weight: 900;
  line-height: 1.1;
}

.sensor-value-unit {
  margin-left: 6rpx;
  color: var(--theme-text-secondary);
  font-size: 22rpx;
  font-weight: 700;
}

.sensor-card.is-alarm .sensor-value-num {
  color: #b91c1c;
}

.sensor-card.is-alarm .sensor-value-unit {
  color: #ef4444;
}

.sensor-threshold {
  margin-top: 8rpx;
  color: var(--theme-text-tertiary);
  font-size: 22rpx;
}

.sensor-card.is-alarm .sensor-threshold {
  color: #b91c1c;
  font-weight: 700;
}

/* ── 设备阈值列表 ── */
.section {
  margin-top: 28rpx;
}

.section-head {
  padding: 0 4rpx;
}

.section-title {
  display: block;
  color: var(--theme-text-primary);
  font-size: 34rpx;
  font-weight: 900;
}

.section-desc {
  display: block;
  margin-top: 8rpx;
  color: var(--theme-text-secondary);
  font-size: 24rpx;
}

.threshold-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 18rpx;
}

.threshold-row {
  padding: 22rpx 26rpx;
  border-radius: var(--theme-radius-lg);
  background: var(--theme-surface);
  border: 1rpx solid var(--theme-surface-border-light);
  box-shadow: 0 10rpx 24rpx var(--theme-shadow-sm);
  box-sizing: border-box;
}

.row-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12rpx;
}

.row-head-text {
  flex: 1;
  min-width: 0;
}

.row-title {
  display: block;
  color: var(--theme-text-primary);
  font-size: 30rpx;
  font-weight: 900;
}

.row-id {
  display: block;
  margin-top: 6rpx;
  color: var(--theme-text-tertiary);
  font-size: 22rpx;
}

.row-current {
  flex-shrink: 0;
  color: var(--theme-accent);
  font-size: 24rpx;
  font-weight: 800;
}

.row-input-row {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin-top: 18rpx;
}

.input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 0 22rpx;
  height: 80rpx;
  border-radius: 16rpx;
  background: var(--theme-input-bg);
  border: 1rpx solid var(--theme-input-border);
  box-sizing: border-box;
}

.row-input {
  flex: 1;
  width: 100%;
  height: 80rpx;
  color: var(--theme-text-primary);
  font-size: 30rpx;
  font-weight: 800;
}

.row-unit {
  flex-shrink: 0;
  color: var(--theme-text-secondary);
  font-size: 24rpx;
  font-weight: 700;
}

.send-btn {
  flex-shrink: 0;
  width: 168rpx;
  height: 80rpx;
  margin: 0;
  border-radius: 16rpx;
  background: var(--theme-accent);
  color: var(--theme-accent-contrast);
  font-size: 28rpx;
  font-weight: 900;
  line-height: 80rpx;
  box-shadow: 0 8rpx 18rpx var(--theme-shadow-accent);
}

.send-btn.is-sending {
  opacity: 0.65;
}

.send-btn:disabled {
  opacity: 0.5;
}

.row-status {
  margin-top: 14rpx;
  padding: 8rpx 14rpx;
  border-radius: var(--theme-radius-input);
  font-size: 22rpx;
  font-weight: 700;
  line-height: 1.4;
}

.row-status.is-success {
  background: rgba(13, 201, 176, 0.12);
  color: var(--theme-accent);
}

.row-status.is-failed {
  background: var(--theme-danger-bg);
  color: var(--theme-danger);
}

.empty-tip {
  margin-top: 18rpx;
  padding: 30rpx 20rpx;
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface-alt);
  color: var(--theme-text-secondary);
  font-size: 25rpx;
  text-align: center;
}
</style>