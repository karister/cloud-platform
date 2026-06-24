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
  gap: 18rpx;
}

.field {
  display: block;
}

.field text {
  display: block;
  margin-bottom: 10rpx;
  color: var(--theme-text-tertiary);
  font-size: 22rpx;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.input {
  width: 100%;
  height: 72rpx;
  padding: 0 18rpx;
  border: 1px solid var(--theme-input-border);
  border-radius: 12rpx;
  background: var(--theme-input-bg);
  color: var(--theme-text-primary);
  font-size: 26rpx;
  font-weight: 500;
  box-sizing: border-box;
  transition: border-color 0.18s ease, background-color 0.18s ease;
}

.input:focus {
  border-color: var(--theme-input-border-focus);
  background: var(--theme-surface);
}

.threshold-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18rpx;
}
</style>
