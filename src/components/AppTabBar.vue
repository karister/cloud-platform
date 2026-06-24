<template>
  <view class="tab-shell">
    <view
      v-for="item in tabs"
      :key="item.key"
      class="tab-item"
      :class="{ active: current === item.key }"
      @tap="switchPage(item)"
    >
      <view class="icon-wrap">
        <image class="tab-icon" :src="current === item.key ? item.activeIcon : item.icon" mode="aspectFit" />
      </view>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  current: {
    type: String,
    required: true
  }
})

const tabs = [
  {
    key: 'dashboard',
    text: '数据展示',
    url: '/pages/dashboard/dashboard',
    icon: '/static/tab/dashboard.png',
    activeIcon: '/static/tab/dashboard-active.png'
  },
  {
    key: 'threshold',
    text: '阈值设置',
    url: '/pages/threshold/threshold',
    icon: '/static/tab/threshold.png',
    activeIcon: '/static/tab/threshold-active.png'
  },
  {
    key: 'history',
    text: '历史数据',
    url: '/pages/history/history',
    icon: '/static/tab/history.png',
    activeIcon: '/static/tab/history-active.png'
  },
  {
    key: 'settings',
    text: '后台配置',
    url: '/pages/settings/settings',
    icon: '/static/tab/settings.png',
    activeIcon: '/static/tab/settings-active.png'
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
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.tab-item:active {
  transform: scale(0.94);
  opacity: 0.85;
}

.tab-item.active {
  background: var(--theme-tab-active-bg);
  color: var(--theme-tab-active-text);
  box-shadow: inset 0 0 0 1px var(--theme-tab-shadow-inset);
}

.icon-wrap {
  display: flex;
  width: 42rpx;
  height: 42rpx;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.tab-icon {
  width: 38rpx;
  height: 38rpx;
}

.tab-text {
  overflow: hidden;
  font-size: 23rpx;
  font-weight: 700;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
