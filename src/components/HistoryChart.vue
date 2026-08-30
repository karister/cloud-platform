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
    default: () => ['#0891a0', '#14b8a6', '#d97706', '#e11d48', '#4f46e5']
  },
  chartBgColor: {
    type: String,
    default: '#ffffff'
  },
  chartGridColor: {
    type: String,
    default: '#d8e3e6'
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
const canvasHeight = ref(240)

// #708092 的主题中性回退：轴标签/空态文字
const AXIS_TEXT = '#708092'

function numericSeries(point) {
  return props.history
    .map((item) => Number(item.values?.[point.identifier]))
    .filter((value) => Number.isFinite(value))
}

function updateCanvasSize() {
  const info = uni.getSystemInfoSync()
  canvasWidth.value = Math.max(300, Math.min(520, info.windowWidth - 56))
  canvasHeight.value = 240
}

/** '#rrggbb' -> 'rgba(r, g, b, a)'；非法输入原样返回 */
function withAlpha(hexColor, alpha) {
  const m = /^#([0-9a-f]{6})$/i.exec(String(hexColor || '').trim())
  if (!m) return hexColor
  const n = parseInt(m[1], 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

function shortTime(ts) {
  const d = new Date(ts)
  const pad = (v) => String(v).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * 相邻点中点做二次贝塞尔，折线平滑且严格过每个数据点。
 */
function strokeSmoothLine(ctx, coords) {
  ctx.beginPath()
  ctx.moveTo(coords[0].x, coords[0].y)
  if (coords.length === 2) {
    ctx.lineTo(coords[1].x, coords[1].y)
  } else {
    for (let i = 1; i < coords.length - 1; i += 1) {
      const midX = (coords[i].x + coords[i + 1].x) / 2
      const midY = (coords[i].y + coords[i + 1].y) / 2
      ctx.quadraticCurveTo(coords[i].x, coords[i].y, midX, midY)
    }
    ctx.lineTo(coords[coords.length - 1].x, coords[coords.length - 1].y)
  }
  ctx.stroke()
}

function draw() {
  updateCanvasSize()
  const ctx = uni.createCanvasContext(props.canvasId)
  const width = canvasWidth.value
  const height = canvasHeight.value
  const padding = {
    top: 30,
    right: 22,
    bottom: 46,
    left: 40
  }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  const activePoints = props.points.filter((point) => numericSeries(point).length > 0)
  const allValues = activePoints.flatMap((point) => numericSeries(point))

  ctx.clearRect(0, 0, width, height)
  ctx.setFillStyle(props.chartBgColor)
  ctx.fillRect(0, 0, width, height)

  // 空态：中文文案，主题网格色背景
  if (!activePoints.length || !allValues.length) {
    ctx.setFillStyle(AXIS_TEXT)
    ctx.setFontSize(13)
    ctx.fillText('暂无采样数据，点击「采样」开始记录', width / 2 - 100, height / 2)
    ctx.draw()
    return
  }

  // 横向网格
  ctx.setStrokeStyle(props.chartGridColor)
  ctx.setLineWidth(1)
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (chartHeight / 4) * i
    ctx.beginPath()
    ctx.moveTo(padding.left, y)
    ctx.lineTo(width - padding.right, y)
    ctx.stroke()
  }

  const min = Math.floor(Math.min(...allValues))
  const max = Math.ceil(Math.max(...allValues))
  const span = max === min ? 1 : max - min

  // 取值同时携带采样时间：坐标映射与首末时间标注共用一份数据
  const samplesFor = (point) => props.history
    .map((item) => ({ value: Number(item.values?.[point.identifier]), time: item.time }))
    .filter((sample) => Number.isFinite(sample.value))
    .slice(-20)

  const coordsFor = (point) => {
    const samples = samplesFor(point)
    return samples.map((sample, index) => ({
      x: padding.left + (samples.length <= 1 ? chartWidth / 2 : (chartWidth / (samples.length - 1)) * index),
      y: padding.top + chartHeight - ((sample.value - min) / span) * chartHeight,
      time: sample.time
    }))
  }

  // 面积填充：只给第一条曲线，低透明渐变，不干扰多系列读线
  const primaryColor = props.chartColors[0]
  const primaryCoords = coordsFor(activePoints[0])
  const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight)
  gradient.addColorStop(0, withAlpha(primaryColor, 0.16))
  gradient.addColorStop(1, withAlpha(primaryColor, 0.01))
  ctx.setFillStyle(gradient)
  ctx.beginPath()
  ctx.moveTo(primaryCoords[0].x, padding.top + chartHeight)
  primaryCoords.forEach((c) => ctx.lineTo(c.x, c.y))
  ctx.lineTo(primaryCoords[primaryCoords.length - 1].x, padding.top + chartHeight)
  ctx.closePath()
  ctx.fill()

  activePoints.forEach((point, pointIndex) => {
    const coords = coordsFor(point)
    const color = props.chartColors[pointIndex % props.chartColors.length]

    ctx.setStrokeStyle(color)
    ctx.setLineWidth(props.chartLineWidth)
    ctx.setLineCap('round')
    ctx.setLineJoin('round')
    strokeSmoothLine(ctx, coords)

    // 空心点：底色填充遮住折线穿过，保留呼吸感
    coords.forEach((c) => {
      ctx.setFillStyle(props.chartBgColor)
      ctx.beginPath()
      ctx.arc(c.x, c.y, props.chartDotRadius, 0, Math.PI * 2)
      ctx.fill()
      ctx.setStrokeStyle(color)
      ctx.setLineWidth(2)
      ctx.stroke()
    })
  })

  // 轴标签：max / min 用等宽读数；底部标注首末采样时间
  ctx.setFillStyle(AXIS_TEXT)
  ctx.setFontSize(11)
  ctx.fillText(String(Number(max.toFixed(1))), 6, padding.top + 4)
  ctx.fillText(String(Number(min.toFixed(1))), 6, padding.top + chartHeight)
  ctx.setFontSize(10)
  ctx.fillText(shortTime(primaryCoords[0].time), padding.left, height - 12)
  ctx.fillText(shortTime(primaryCoords[primaryCoords.length - 1].time), width - padding.right - 34, height - 12)
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
  border-radius: var(--theme-radius-md);
  background: var(--theme-chart-bg);
}

.chart-canvas {
  display: block;
}
</style>
