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
  }
})

const canvasWidth = ref(340)
const canvasHeight = ref(230)

/**
 * Read theme tokens from the document root at draw time.
 * Canvas APIs (uni.createCanvasContext) can't read CSS custom properties directly,
 * so we resolve them once per draw() call. Theme switching triggers a redraw
 * via the theme watcher in themes.js — by the time draw() runs, the new values
 * are already on documentElement.
 */
function readThemeToken(name, fallback) {
  if (typeof document === 'undefined' || !document.documentElement) return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

function resolveChartPalette() {
  return {
    colors: [
      readThemeToken('--theme-chart-color-0', '#0071e3'),
      readThemeToken('--theme-chart-color-1', '#34c759'),
      readThemeToken('--theme-chart-color-2', '#ff9f0a'),
      readThemeToken('--theme-chart-color-3', '#ff3b30'),
      readThemeToken('--theme-chart-color-4', '#af52de')
    ],
    bg: readThemeToken('--theme-chart-bg', '#ffffff'),
    grid: readThemeToken('--theme-chart-grid', '#f0f0f3'),
    textTertiary: readThemeToken('--theme-text-tertiary', '#86868b'),
    lineWidth: Number(readThemeToken('--theme-chart-line-width', '2.5')) || 2.5,
    dotRadius: Number(readThemeToken('--theme-chart-dot-radius', '3.5')) || 3.5
  }
}

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
  const palette = resolveChartPalette()
  const activePoints = props.points.filter((point) => numericSeries(point).length > 0)
  const allValues = activePoints.flatMap((point) => numericSeries(point))

  ctx.clearRect(0, 0, width, height)
  ctx.setFillStyle(palette.bg)
  ctx.fillRect(0, 0, width, height)
  ctx.setStrokeStyle(palette.grid)
  ctx.setLineWidth(1)

  for (let i = 0; i <= 4; i += 1) {
    const y = padding + (chartHeight / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding, y)
    ctx.lineTo(width - padding, y)
    ctx.stroke()
  }

  if (!activePoints.length || !allValues.length) {
    ctx.setFillStyle(palette.textTertiary)
    ctx.setFontSize(13)
    ctx.fillText('暂无数据', width / 2 - 26, height / 2)
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

    const color = palette.colors[pointIndex % palette.colors.length]
    ctx.setStrokeStyle(color)
    ctx.setLineWidth(palette.lineWidth)
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
      ctx.setFillStyle(palette.bg)
      ctx.beginPath()
      ctx.arc(x, y, palette.dotRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.setStrokeStyle(color)
      ctx.setLineWidth(2)
      ctx.stroke()
    })
  })

  ctx.setFillStyle(palette.textTertiary)
  ctx.setFontSize(11)
  ctx.fillText(String(Number(max.toFixed(1))), 6, padding + 4)
  ctx.fillText(String(Number(min.toFixed(1))), 6, height - padding)
  ctx.draw()
}

watch(
  () => [props.history, props.points],
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
