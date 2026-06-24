<template>
  <view class="page">
    <view class="header-panel">
      <view>
        <text class="eyebrow">趋势分析</text>
        <text class="title">历史数据</text>
        <text class="desc">展示数据点的采样趋势和最近记录。</text>
      </view>
      <view class="actions">
        <button class="ghost-btn" :loading="loading" @tap="sampleNow">采样</button>
        <button class="ghost-btn danger" @tap="clearAll">清空</button>
      </view>
    </view>

    <view class="chart-card">
      <view class="section-head">
        <view>
          <text class="section-title">数据曲线</text>
          <text class="section-desc">最近 {{ Math.min(history.length, 20) }} 个采样点</text>
        </view>
        <text class="count-badge">{{ history.length }} 条</text>
      </view>
      <HistoryChart canvas-id="historyCanvasMain" :history="history" :points="config.displayPoints" />
      <view v-if="config.displayPoints.length" class="legend">
        <view
          v-for="(point, index) in config.displayPoints"
          :key="point.identifier"
          class="legend-item"
        >
          <text class="legend-dot" :class="`dot-${index % 5}`" />
          <text>{{ point.label || point.identifier }}</text>
        </view>
      </view>
    </view>

    <view class="section-head list-head">
      <view>
        <text class="section-title">采样列表</text>
        <text class="section-desc">最近 {{ Math.min(history.length, 20) }} 条记录</text>
      </view>
    </view>

    <view v-if="history.length" class="record-list">
      <view v-for="item in visibleHistory" :key="item.time" class="record-card">
        <view class="record-time">{{ formatTime(item.time) }}</view>
        <view class="record-values">
          <view v-for="point in config.displayPoints" :key="point.identifier" class="record-value">
            <text>{{ point.label || point.identifier }}</text>
            <text>{{ formatValue(item.values?.[point.identifier], point.unit) }}</text>
          </view>
        </view>
      </view>
    </view>
    <EmptyState v-else title="暂无历史采样" desc="点击采样或进入数据展示页刷新后会生成历史记录" />

    <AppTabBar current="history" />
  </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { onShow, onHide } from '@dcloudio/uni-app'
import AppTabBar from '../../components/AppTabBar.vue'
import EmptyState from '../../components/EmptyState.vue'
import HistoryChart from '../../components/HistoryChart.vue'
import { dataStore } from '../../stores/dataStore'
import { appendHistory, clearHistory, getConfig, getHistory, saveHistory } from '../../utils/storage'
import { formatTime, formatValue } from '../../utils/format'

const config = ref(getConfig())
const history = ref([])
const loading = ref(false)
// 仅在历史页 tab 处于前台时跟随全局 3s 轮询自动采样，避免后台页也写历史
const isActive = ref(false)

const visibleHistory = computed(() => [...history.value].reverse().slice(0, 20))

function mockNumber(identifier, index) {
  const seed = identifier.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const base = identifier.toLowerCase().includes('humi') ? 58 : 26
  const amplitude = identifier.toLowerCase().includes('humi') ? 7 : 4
  return Number((base + Math.sin(index / 2 + seed) * amplitude + index * 0.18).toFixed(1))
}

function createPreviewHistory() {
  const now = Date.now()
  return Array.from({ length: 14 }, (_, index) => {
    const values = {}
    config.value.displayPoints.forEach((point) => {
      values[point.identifier] = mockNumber(point.identifier, index)
    })
    return {
      time: now - (13 - index) * 60 * 1000,
      values
    }
  })
}

function load() {
  config.value = getConfig()
  history.value = getHistory()
  if (!history.value.length && config.value.cloud.mockMode && config.value.displayPoints.length) {
    history.value = createPreviewHistory()
    saveHistory(history.value)
  }
}

async function sampleNow() {
  loading.value = true
  try {
    // 全局 3s 轮询已经在跑，sampleNow 只是触发一次手动刷新
    // 新的样本由下方 watch(lastSyncedAt) 监听到刷新完成后追加，避免双写
    const result = await dataStore.refresh()
    if (!result) {
      uni.showToast({ title: dataStore.lastError.value || '采样失败', icon: 'none' })
      return
    }
    uni.showToast({ title: '采样完成', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: error.message || '采样失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

/**
 * 全局 3s 轮询完成时，把当前的实时值追加到历史。
 * 仅在历史页 tab 处于前台时执行；切到其他 tab 后暂停写入。
 */
function autoSampleOnPoll() {
  if (!isActive.value) return
  if (!config.value.displayPoints.length) return
  history.value = appendHistory(dataStore.latestValues, config.value.displayPoints)
}

watch(() => dataStore.lastSyncedAt.value, autoSampleOnPoll)

function clearAll() {
  uni.showModal({
    title: '清空历史',
    content: '确认删除本地历史采样记录？',
    success(result) {
      if (result.confirm) {
        clearHistory()
        history.value = []
      }
    }
  })
}

onShow(() => {
  isActive.value = true
  load()
})
onHide(() => {
  isActive.value = false
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28rpx 28rpx 150rpx;
  box-sizing: border-box;
  background: var(--theme-bg);
}

.header-panel,
.chart-card,
.record-card {
  border: 0.5px solid var(--theme-surface-border);
  border-radius: var(--theme-radius-lg);
  background: var(--theme-surface);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8rpx 24rpx var(--theme-shadow-sm);
}

.header-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 32rpx 30rpx;
}

.eyebrow,
.title,
.desc,
.section-title,
.section-desc {
  display: block;
}

.eyebrow {
  color: var(--theme-accent);
  font-size: 22rpx;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.title {
  margin-top: 8rpx;
  color: var(--theme-text-primary);
  font-size: 40rpx;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.desc {
  margin-top: 10rpx;
  color: var(--theme-text-secondary);
  font-size: 25rpx;
}

.actions {
  display: flex;
  gap: 10rpx;
}

.ghost-btn {
  margin: 0;
  height: 64rpx;
  padding: 0 28rpx;
  line-height: 64rpx;
  border: 1px solid var(--theme-btn-secondary-border);
  border-radius: 999rpx;
  background: var(--theme-btn-secondary-bg);
  color: var(--theme-btn-secondary-text);
  font-size: 24rpx;
  font-weight: 500;
}

.ghost-btn.danger {
  border-color: var(--theme-danger-border);
  background: var(--theme-danger-bg);
  color: var(--theme-danger);
}

.chart-card {
  margin-top: 22rpx;
  padding: 28rpx 24rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  margin-bottom: 18rpx;
}

.list-head {
  margin: 30rpx 4rpx 16rpx;
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

.count-badge {
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: var(--theme-divider);
  color: var(--theme-text-secondary);
  font-size: 23rpx;
  font-weight: 500;
}

.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx 22rpx;
  margin-top: 18rpx;
  color: var(--theme-text-secondary);
  font-size: 24rpx;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 9rpx;
}

.legend-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 4rpx;
}

.dot-0 { background: var(--theme-chart-color-0); }
.dot-1 { background: var(--theme-chart-color-1); }
.dot-2 { background: var(--theme-chart-color-2); }
.dot-3 { background: var(--theme-chart-color-3); }
.dot-4 { background: var(--theme-chart-color-4); }

.record-list {
  display: flex;
  flex-direction: column;
  gap: var(--theme-layout-gap);
}

.record-card {
  padding: 22rpx 24rpx;
  border: 0.5px solid var(--theme-surface-border);
}

.record-time {
  color: var(--theme-text-secondary);
  font-size: 24rpx;
  font-weight: 500;
}

.record-values {
  margin-top: 12rpx;
}

.record-value {
  display: flex;
  justify-content: space-between;
  padding: 10rpx 0;
  color: var(--theme-text-primary);
  font-size: 26rpx;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.record-value text:first-child {
  color: var(--theme-text-secondary);
  font-weight: 500;
}
</style>
