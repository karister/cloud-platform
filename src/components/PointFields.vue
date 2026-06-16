<template>
  <view class="point-fields">
    <label class="field">
      <text>展示中文</text>
      <input class="input" type="text" :value="point.label" @input="onField('label', $event)" />
    </label>
    <label class="field">
      <text>云平台标识符</text>
      <input class="input" type="text" :value="point.identifier" @input="onField('identifier', $event)" />
    </label>
    <label class="field">
      <text>单位</text>
      <input class="input" type="text" :value="point.unit" @input="onField('unit', $event)" />
    </label>
    <template v-if="threshold">
      <view class="threshold-grid">
        <label class="field">
          <text>最小值</text>
          <input class="input" type="number" :value="String(point.min)" @input="onField('min', $event, true)" />
        </label>
        <label class="field">
          <text>最大值</text>
          <input class="input" type="number" :value="String(point.max)" @input="onField('max', $event, true)" />
        </label>
        <label class="field">
          <text>步长</text>
          <input class="input" type="number" :value="String(point.step)" @input="onField('step', $event, true)" />
        </label>
        <label class="field">
          <text>默认值</text>
          <input class="input" type="number" :value="String(point.value)" @input="onField('value', $event, true)" />
        </label>
      </view>
    </template>
  </view>
</template>

<script setup>
const props = defineProps({
  point: { type: Object, required: true },
  threshold: { type: Boolean, default: false }
})

function onField(key, event, isNumber = false) {
  const raw = event.detail.value
  props.point[key] = isNumber ? Number(raw) : raw
}
</script>

<style scoped>
.point-fields {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.field {
  display: block;
}

.field text {
  display: block;
  margin-bottom: 10rpx;
  color: var(--theme-text-secondary);
  font-size: 24rpx;
  font-weight: 800;
}

.input {
  width: 100%;
  height: 72rpx;
  padding: 0 18rpx;
  border: 1rpx solid var(--theme-input-border);
  border-radius: var(--theme-radius-input);
  background: var(--theme-input-bg);
  color: var(--theme-text-primary);
  font-size: 26rpx;
  box-sizing: border-box;
}

.threshold-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14rpx;
}
</style>
