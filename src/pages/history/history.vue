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
      <HistoryChart canvas-id="historyCanvasMain" :history="history" :points="config.displayPoints" :chartColors="chartColors" :chartBgColor="chartBgColor" :chartGridColor="chartGridColor" :chartLineWidth="chartLineWidth" :chartDotRadius="chartDotRadius" />
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
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppTabBar from '../../components/AppTabBar.vue'
import EmptyState from '../../components/EmptyState.vue'
import HistoryChart from '../../components/HistoryChart.vue'
import { dataStore } from '../../stores/dataStore'
import { appendHistory, clearHistory, getConfig, getHistory, saveHistory } from '../../utils/storage'
import { formatTime, formatValue } from '../../utils/format'
import { THEME_LIST } from '../../utils/themes'

const config = ref(getConfig())
const history = ref([])
const loading = ref(false)

const chartColors = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  if (!theme) return ['#0dc9b0', '#0df0d0', '#e0b040', '#f06070', '#60a0f0']
  // Read individual --theme-chart-color-N variables (bug fix: was reading non-existent singular --theme-chart-color)
  return [0, 1, 2, 3, 4].map((i) => theme.cssVars[`--theme-chart-color-${i}`] || '#0dc9b0')
})

const chartBgColor = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? theme.cssVars['--theme-chart-bg'] : '#16383a'
})

const chartGridColor = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? theme.cssVars['--theme-chart-grid'] : '#1a4840'
})

const chartLineWidth = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? Number(theme.cssVars['--theme-chart-line-width']) || 3 : 3
})

const chartDotRadius = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? Number(theme.cssVars['--theme-chart-dot-radius']) || 4.5 : 4.5
})

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
    // 然后把此刻的实时值追加进历史
    const result = await dataStore.refresh()
    if (!result) {
      uni.showToast({ title: dataStore.lastError.value || '采样失败', icon: 'none' })
      return
    }
    history.value = appendHistory(dataStore.latestValues, config.value.displayPoints)
    uni.showToast({ title: '采样完成', icon: 'success' })
  } catch (error) {
    uni.showToast({ title: error.message || '采样失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

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

onShow(load)
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28rpx 28rpx 150rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, var(--theme-bg-gradient-settings-start) 0%, var(--theme-bg-gradient-settings-end) 45%, var(--theme-bg-gradient-settings-end) 100%);
}

.header-panel,
.chart-card,
.record-card {
  border: var(--theme-card-border-width) var(--theme-card-border-style) var(--theme-surface-border);
  border-radius: var(--theme-radius-lg);
  background: var(--theme-surface);
  box-shadow: 0 14rpx 38rpx var(--theme-shadow-sm);
}

.header-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 30rpx;
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
}

.actions {
  display: flex;
  gap: 10rpx;
}

.ghost-btn {
  width: 108rpx;
  height: 64rpx;
  margin: 0;
  border: 1px solid var(--theme-btn-secondary-border);
  border-radius: var(--theme-btn-style);
  background: var(--theme-btn-secondary-bg);
  color: var(--theme-btn-secondary-text);
  font-size: 24rpx;
  font-weight: 800;
  line-height: 64rpx;
}

.ghost-btn.danger {
  border-color: var(--theme-danger-border);
  background: var(--theme-danger-bg);
  color: var(--theme-danger);
}

.chart-card {
  margin-top: 22rpx;
  padding: 24rpx;
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
  font-weight: 900;
}

.section-desc {
  margin-top: 6rpx;
  color: var(--theme-text-secondary);
  font-size: 23rpx;
}

.count-badge {
  padding: 10rpx 16rpx;
  border-radius: var(--theme-radius-pill);
  background: var(--theme-badge-bg);
  color: var(--theme-badge-text);
  font-size: 23rpx;
  font-weight: 800;
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
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
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
  padding: 22rpx;
}

.record-time {
  color: var(--theme-text-secondary);
  font-size: 24rpx;
  font-weight: 700;
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
  font-weight: 700;
}

.record-value text:first-child {
  color: var(--theme-text-secondary);
  font-weight: 600;
}
</style>
