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
  padding: 80rpx 24rpx;
  border: 1px dashed var(--theme-empty-border);
  border-radius: var(--theme-radius-lg);
  background: transparent;
  text-align: center;
  color: var(--theme-text-tertiary);
}

.empty-title {
  color: var(--theme-text-primary);
  font-size: 30rpx;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.empty-desc {
  margin-top: 12rpx;
  font-size: 25rpx;
  font-weight: 500;
}
</style>
