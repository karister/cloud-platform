<template>
  <view class="tab-shell">
    <view
      v-for="item in tabs"
      :key="item.key"
      class="tab-item"
      :class="{ active: current === item.key }"
      :aria-label="item.text"
      role="tab"
      @tap="switchPage(item)"
    >
      <view class="icon-wrap">
        <AppIcon :name="item.icon" :size="40" />
      </view>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import AppIcon from './AppIcon.vue'

const props = defineProps({
  current: {
    type: String,
    required: true
  }
})

// 图标用 currentColor 填充，active 态由 CSS 切到主题 accent，自动跟随四套主题
const tabs = [
  {
    key: 'dashboard',
    text: '数据展示',
    url: '/pages/dashboard/dashboard',
    icon: 'gauge'
  },
  {
    key: 'threshold',
    text: '阈值设置',
    url: '/pages/threshold/threshold',
    icon: 'sliders-horizontal'
  },
  {
    key: 'history',
    text: '历史数据',
    url: '/pages/history/history',
    icon: 'chart-line-up'
  },
  {
    key: 'settings',
    text: '后台配置',
    url: '/pages/settings/settings',
    icon: 'gear-six'
  }
]

function switchPage(item) {
  if (props.current === item.key) return
  uni.reLaunch({
    url: item.url
  })
}
</script>

<style scoped>
.tab-shell {
  position: fixed;
  left: 24rpx;
  right: 24rpx;
  bottom: calc(18rpx + env(safe-area-inset-bottom));
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4rpx;
  padding: var(--theme-tab-wrapper-padding);
  border: 1px solid var(--theme-tab-wrapper-border);
  border-radius: var(--theme-tab-border-radius);
  background: var(--theme-tab-wrapper-bg);
  box-shadow: 0 18rpx 54rpx var(--theme-tab-wrapper-shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.tab-item {
  position: relative;
  display: flex;
  min-width: 0;
  height: var(--theme-tab-height);
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  border-radius: calc(var(--theme-tab-border-radius) - 8rpx);
  color: var(--theme-tab-text);
  transition: color 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.12s ease;
}

.tab-item:active {
  transform: scale(0.94);
}

.tab-item.active {
  background: var(--theme-tab-active-bg);
  color: var(--theme-tab-active-text);
  box-shadow: inset 0 0 0 1px var(--theme-tab-shadow-inset);
}

/* 未选中项图标降一档透明度，强化当前页指向 */
.tab-item:not(.active) .icon-wrap {
  opacity: 0.62;
}

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.tab-text {
  overflow: hidden;
  font-size: 23rpx;
  font-weight: 600;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-item.active .tab-text {
  font-weight: 700;
}
</style>
