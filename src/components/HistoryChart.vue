<template>
  <view class="chart-wrap">
    <canvas
      :canvas-id="canvasId"
      :id="canvasId"
      class="chart-canvas"
      :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
    />
  </view>
</template>

<script setup>
import { nextTick, onMounted, ref, watch } from 'vue'

const props = defineProps({
  canvasId: {
    type: String,
    default: 'historyCanvas'
  },
  history: {
    type: Array,
    default: () => []
  },
  points: {
    type: Array,
    default: () => []
  },
  chartColors: {
    type: Array,
    default: () => ['#0dc9b0', '#0df0d0', '#e0b040', '#f06070', '#60a0f0']
  },
  chartBgColor: {
    type: String,
    default: '#16383a'
  },
  chartGridColor: {
    type: String,
    default: '#1a4840'
  },
  chartLineWidth: {
    type: Number,
    default: 3
  },
  chartDotRadius: {
    type: Number,
    default: 4.5
  }
})

const canvasWidth = ref(340)
const canvasHeight = ref(230)

function numericSeries(point) {
  return props.history
    .map((item) => Number(item.values?.[point.identifier]))
    .filter((value) => Number.isFinite(value))
}

function updateCanvasSize() {
  const info = uni.getSystemInfoSync()
  canvasWidth.value = Math.max(300, Math.min(520, info.windowWidth - 56))
  canvasHeight.value = 230
}

function draw() {
  updateCanvasSize()
  const ctx = uni.createCanvasContext(props.canvasId)
  const width = canvasWidth.value
  const height = canvasHeight.value
  const padding = 34
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2
  const activePoints = props.points.filter((point) => numericSeries(point).length > 0)
  const allValues = activePoints.flatMap((point) => numericSeries(point))

  ctx.clearRect(0, 0, width, height)
  ctx.setFillStyle(props.chartBgColor)
  ctx.fillRect(0, 0, width, height)
  ctx.setStrokeStyle(props.chartGridColor)
  ctx.setLineWidth(1)

  for (let i = 0; i <= 4; i += 1) {
    const y = padding + (chartHeight / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  if (!activePoints.length || !allValues.length) {
    ctx.setFillStyle('#708092')
    ctx.setFontSize(13)
    ctx.fillText('No data to render', width / 2 - 46, height / 2)
    ctx.draw()
    return
  }

  const min = Math.floor(Math.min(...allValues))
  const max = Math.ceil(Math.max(...allValues))
  const span = max === min ? 1 : max - min

  activePoints.forEach((point, pointIndex) => {
    const values = props.history
      .map((item) => Number(item.values?.[point.identifier]))
      .filter((value) => Number.isFinite(value))
      .slice(-20)

    const color = props.chartColors[pointIndex % props.chartColors.length]
    ctx.setStrokeStyle(color)
    ctx.setLineWidth(props.chartLineWidth)
    ctx.beginPath()

    values.forEach((value, index) => {
      const x = padding + (values.length <= 1 ? 0 : (chartWidth / (values.length - 1)) * index)
      const y = padding + chartHeight - ((value - min) / span) * chartHeight
      if (index === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })

    ctx.stroke()

    values.forEach((value, index) => {
      const x = padding + (values.length <= 1 ? 0 : (chartWidth / (values.length - 1)) * index)
      const y = padding + chartHeight - ((value - min) / span) * chartHeight
      ctx.setFillStyle(props.chartBgColor)
      ctx.beginPath()
      ctx.arc(x, y, props.chartDotRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.setStrokeStyle(color)
      ctx.setLineWidth(2)
      ctx.stroke()
    })
  })

  ctx.setFillStyle('#708092')
  ctx.setFontSize(11)
  ctx.fillText(String(Number(max.toFixed(1))), 6, padding + 4)
  ctx.fillText(String(Number(min.toFixed(1))), 6, height - padding)
  ctx.draw()
}

watch(
  () => [props.history, props.points, props.chartColors],
  () => nextTick(draw),
  { deep: true, immediate: true }
)

onMounted(() => {
  setTimeout(draw, 120)
})
</script>

<style scoped>
.chart-wrap {
  display: flex;
  justify-content: center;
  overflow: hidden;
  border-radius: 22rpx;
  background: var(--theme-chart-bg);
}

.chart-canvas {
  display: block;
}
</style>
