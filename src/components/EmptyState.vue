<template>
  <view class="empty-state">
    <view class="empty-title">{{ title }}</view>
    <view class="empty-desc">{{ desc }}</view>
  </view>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'No data'
  },
  desc: {
    type: String,
    default: 'Please complete the admin configuration first'
  }
})
</script>

<style scoped>
.empty-state {
  padding: 54rpx 24rpx;
  border: 1px var(--theme-card-border-style) var(--theme-empty-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface-alt);
  text-align: center;
  color: var(--theme-text-secondary);
}

.empty-title {
  color: var(--theme-text-primary);
  font-size: 32rpx;
  font-weight: 900;
}

.empty-desc {
  margin-top: 12rpx;
  font-size: 26rpx;
}
</style>
