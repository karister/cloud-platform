<template>
  <view class="page">
    <view class="header-panel">
      <view>
        <text class="eyebrow">设备参数</text>
        <text class="title">阈值设置</text>
        <text class="desc">滑动调整阈值，确认后下发到云平台期望属性。</text>
      </view>
      <view class="summary-chip">
        <text>{{ thresholds.length }}</text>
        <text>项</text>
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
            <text>{{ point.value }}</text>
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
          @changing="onSlider(point, $event.detail.value)"
          @change="onSlider(point, $event.detail.value)"
        />

        <view class="range-row">
          <text>{{ point.min }}{{ point.unit }}</text>
          <input
            class="value-input"
            type="number"
            :value="String(point.value)"
            @input="onInput(point, $event.detail.value)"
          />
          <text>{{ point.max }}{{ point.unit }}</text>
        </view>

        <button class="submit-btn" :loading="submittingId === point.identifier" @tap="submit(point)">
          下发阈值
        </button>
      </view>
    </view>

    <EmptyState v-else title="未配置阈值数据点" desc="请在后台配置中添加需要通过滑条下发的属性" />

    <AppTabBar current="threshold" />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppTabBar from '../../components/AppTabBar.vue'
import EmptyState from '../../components/EmptyState.vue'
import { setDesiredProperty } from '../../services/onenet'
import { getConfig, saveConfig } from '../../utils/storage'
import { THEME_LIST } from '../../utils/themes'

const config = ref(getConfig())
const thresholds = ref([])
const submittingId = ref('')

const themeAccent = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? theme.cssVars['--theme-accent'] : '#0f6b67'
})

function syncThresholds() {
  config.value = getConfig()
  thresholds.value = config.value.thresholdPoints.map((point) => ({
    ...point,
    value: Number(point.value ?? point.min ?? 0)
  }))
}

function persistThresholds() {
  config.value.thresholdPoints = thresholds.value
  saveConfig(config.value)
}

function onSlider(point, value) {
  point.value = Number(value)
  persistThresholds()
}

function onInput(point, value) {
  const nextValue = Number(value)
  if (!Number.isFinite(nextValue)) return
  const min = Number(point.min)
  const max = Number(point.max)
  point.value = Math.min(max, Math.max(min, nextValue))
  persistThresholds()
}

async function submit(point) {
  submittingId.value = point.identifier
  try {
    await setDesiredProperty(config.value, point.identifier, Number(point.value))
    uni.showToast({
      title: '阈值已下发',
      icon: 'success'
    })
  } catch (error) {
    uni.showToast({
      title: error.message || '下发失败',
      icon: 'none'
    })
  } finally {
    submittingId.value = ''
  }
}

onShow(syncThresholds)
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
  color: var(--theme-text-heading);
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

.submit-btn {
  height: 78rpx;
  margin-top: 26rpx;
  border-radius: var(--theme-btn-style);
  background: var(--theme-accent);
  color: var(--theme-accent-contrast);
  font-size: 27rpx;
  font-weight: 850;
  line-height: 78rpx;
  box-shadow: 0 12rpx 28rpx var(--theme-shadow-accent);
}
</style>
