<template>
  <view class="skeleton-card" aria-hidden="true">
    <view class="skeleton-line title" />
    <view class="skeleton-line value" />
    <view class="skeleton-line bar" />
  </view>
</template>

<script setup>
/**
 * 指标卡形态的加载占位。shimmer 动画在 prefers-reduced-motion 下
 * 静态化（见 App.vue 全局规则）。
 */
</script>

<style scoped>
.skeleton-card {
  min-height: 224rpx;
  padding: 22rpx;
  border: var(--theme-card-border-width) var(--theme-card-border-style) var(--theme-surface-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface-alt);
  box-sizing: border-box;
}

.skeleton-line {
  border-radius: var(--theme-radius-pill);
  background: linear-gradient(
    90deg,
    var(--theme-surface-alt-2) 25%,
    var(--theme-surface-hover) 45%,
    var(--theme-surface-alt-2) 65%
  );
  background-size: 220% 100%;
  animation: skeleton-shimmer 1.4s ease-in-out infinite;
}

.title {
  width: 46%;
  height: 26rpx;
}

.value {
  width: 64%;
  height: 44rpx;
  margin-top: 30rpx;
}

.bar {
  width: 100%;
  height: 12rpx;
  margin-top: 30rpx;
}

@keyframes skeleton-shimmer {
  0% {
    background-position: 120% 0;
  }
  100% {
    background-position: -120% 0;
  }
}
</style>
