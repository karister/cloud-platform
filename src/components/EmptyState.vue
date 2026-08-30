<template>
  <view class="empty-state">
    <view class="empty-icon">
      <AppIcon :name="icon" :size="40" />
    </view>
    <view class="empty-title">{{ title }}</view>
    <view class="empty-desc">{{ desc }}</view>
    <slot />
  </view>
</template>

<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  title: {
    type: String,
    default: '暂无数据'
  },
  desc: {
    type: String,
    default: '请先完成后台配置'
  },
  icon: {
    type: String,
    default: 'tray'
  }
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 56rpx 32rpx;
  border: 1px var(--theme-card-border-style) var(--theme-empty-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface-alt);
  text-align: center;
  color: var(--theme-text-secondary);
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  margin-bottom: 20rpx;
  border-radius: var(--theme-radius-lg);
  background: var(--theme-accent-light);
  color: var(--theme-accent-dark);
}

.empty-title {
  color: var(--theme-text-primary);
  font-size: 30rpx;
  font-weight: 700;
}

.empty-desc {
  max-width: 480rpx;
  margin-top: 10rpx;
  font-size: 25rpx;
  line-height: 1.5;
}
</style>
