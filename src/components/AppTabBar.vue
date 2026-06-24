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
  left: 16rpx;
  right: 16rpx;
  bottom: calc(18rpx + env(safe-area-inset-bottom));
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4rpx;
  padding: var(--theme-tab-wrapper-padding);
  border: 0.5px solid var(--theme-tab-wrapper-border);
  border-radius: 999rpx;
  background: var(--theme-tab-wrapper-bg);
  box-shadow: 0 18rpx 54rpx var(--theme-tab-wrapper-shadow);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}

.tab-item {
  position: relative;
  display: flex;
  min-width: 0;
  height: var(--theme-tab-height);
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  border-radius: 999rpx;
  color: var(--theme-tab-text);
  transition: transform 0.18s cubic-bezier(0.32, 0.72, 0, 1),
              opacity 0.18s ease,
              background-color 0.18s ease,
              color 0.18s ease;
}

.tab-item:active {
  transform: scale(0.96);
  opacity: 0.78;
}

/* Filled-pill active state — replaces the inset-ring capsule.
   Apple Settings tab bar uses a solid color fill for the selected tab. */
.tab-item.active {
  background: var(--theme-tab-active-bg);
  color: var(--theme-tab-active-text);
  box-shadow: 0 2rpx 8rpx var(--theme-tab-shadow-inset);
}

.icon-wrap {
  display: flex;
  width: 46rpx;
  height: 46rpx;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
}

.tab-icon {
  width: 44rpx;
  height: 44rpx;
  transition: transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);
}

.tab-item.active .tab-icon {
  transform: scale(1.06);
}

.tab-text {
  overflow: hidden;
  font-size: 22rpx;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.005em;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
