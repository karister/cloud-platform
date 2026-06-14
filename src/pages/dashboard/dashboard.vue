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
        <button class="refresh-btn" :loading="loading" @tap="loadData">刷新</button>
      </view>

      <view v-if="config.displayPoints.length" class="metric-grid">
        <view v-for="point in config.displayPoints" :key="point.identifier" class="metric-card">
          <view class="metric-top">
            <text class="metric-label">{{ point.label || point.identifier }}</text>
            <text class="metric-id">{{ point.identifier }}</text>
          </view>
          <text class="metric-value">{{ formatValue(values[point.identifier], point.unit) }}</text>
          <view class="metric-track">
            <view class="metric-fill" :style="{ width: metricWidth(values[point.identifier]) }" />
          </view>
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
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppTabBar from '../../components/AppTabBar.vue'
import EmptyState from '../../components/EmptyState.vue'
import { fetchProperties, setDesiredProperty } from '../../services/onenet'
import { appendHistory, getConfig } from '../../utils/storage'
import { formatTime, formatValue } from '../../utils/format'
import { THEME_LIST } from '../../utils/themes'

const config = ref(getConfig())
const values = ref({})
const status = ref('idle')
const loading = ref(false)
const lastUpdate = ref(0)

const statusText = computed(() => {
  if (status.value === 'online') return config.value.cloud.mockMode ? '模拟运行' : '云端在线'
  if (status.value === 'error') return '连接异常'
  return '等待刷新'
})

const lastUpdateText = computed(() => (lastUpdate.value ? formatTime(lastUpdate.value) : '--:--:--'))

const themeAccent = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? theme.cssVars['--theme-accent'] : '#0f6b67'
})

function metricWidth(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '18%'
  return `${Math.max(18, Math.min(96, number))}%`
}

async function loadData() {
  loading.value = true
  try {
    const nextValues = await fetchProperties(config.value)
    values.value = {
      ...values.value,
      ...nextValues
    }
    appendHistory(values.value, config.value.displayPoints)
    lastUpdate.value = Date.now()
    status.value = 'online'
  } catch (error) {
    status.value = 'error'
    uni.showToast({
      title: error.message || '读取失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

async function onSwitchChange(point, checked) {
  const previous = values.value[point.identifier]
  values.value[point.identifier] = checked
  try {
    await setDesiredProperty(config.value, point.identifier, checked ? 1 : 0)
    uni.showToast({
      title: '指令已下发',
      icon: 'success'
    })
  } catch (error) {
    values.value[point.identifier] = previous
    uni.showToast({
      title: error.message || '下发失败',
      icon: 'none'
    })
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

.hero::after {
  position: absolute;
  right: -80rpx;
  bottom: -120rpx;
  width: 280rpx;
  height: 280rpx;
  border: 1px solid var(--theme-hero-border);
  border-radius: 50%;
  content: "";
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
  font-size: 24rpx;
  font-weight: 700;
}

.title {
  margin-top: 12rpx;
  font-size: 42rpx;
  font-weight: 900;
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

.quick-label {
  color: var(--theme-text-secondary);
  font-size: 22rpx;
  font-weight: 700;
}

.quick-value,
.quick-time {
  margin-top: 12rpx;
  color: var(--theme-text-primary);
  font-size: 34rpx;
  font-weight: 900;
}

.quick-time {
  color: var(--theme-accent);
  font-size: 28rpx;
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
  font-size: 31rpx;
  font-weight: 900;
}

.section-desc {
  margin-top: 6rpx;
  color: var(--theme-text-secondary);
  font-size: 23rpx;
}

.refresh-btn {
  width: 128rpx;
  height: 64rpx;
  margin: 0;
  border-radius: var(--theme-btn-style);
  background: var(--theme-accent);
  color: var(--theme-accent-contrast);
  font-size: 25rpx;
  font-weight: 800;
  line-height: 64rpx;
}

.count-badge {
  padding: 10rpx 16rpx;
  border-radius: var(--theme-radius-pill);
  background: var(--theme-badge-bg);
  color: var(--theme-badge-text);
  font-size: 23rpx;
  font-weight: 800;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--theme-layout-gap);
}

.metric-card {
  min-height: 224rpx;
  padding: 22rpx;
  border: var(--theme-card-border-width) var(--theme-card-border-style) var(--theme-surface-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface-alt);
  box-sizing: border-box;
}

.metric-top {
  min-height: 60rpx;
}

.metric-label {
  color: var(--theme-text-heading);
  font-size: 27rpx;
  font-weight: 800;
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
  font-weight: 900;
  line-height: 1;
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
  font-size: 29rpx;
  font-weight: 850;
}

.switch-state {
  display: flex;
  align-items: center;
  gap: 12rpx;
  color: var(--theme-text-secondary);
  font-size: 23rpx;
}
</style>
