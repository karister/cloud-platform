<template>
  <view class="page">
    <view class="header-panel" @tap="handleHeaderTap">
      <view>
        <text class="eyebrow">{{ adminMode ? '管理员配置' : '系统管理' }}</text>
        <text class="title">后台配置</text>
        <text class="desc">
          {{ adminMode ? '已进入管理员配置界面，可维护数据点和推荐模板。' : '维护云平台连接和首页应用名称。' }}
        </text>
      </view>
      <button v-if="adminMode" class="admin-exit" @tap.stop="exitAdmin">退出</button>
    </view>

    <view class="name-panel">
      <text class="panel-title">应用名称</text>
      <view class="name-row">
        <input
          class="name-input"
          :value="config.appName"
          placeholder="请输入应用名称"
          @input="config.appName = $event.detail.value"
        />
        <button class="save-name" @tap="saveAppName">保存</button>
      </view>
    </view>

    <view class="menu-grid" :class="{ public: !adminMode }">
      <view class="menu-card primary-action" @tap="openCloud">
        <view class="menu-icon-wrap">
          <image class="menu-icon" src="/static/tab/settings-active.png" mode="aspectFit" />
        </view>
        <view class="menu-copy">
          <text class="menu-title">云平台连接</text>
          <text class="menu-desc">Product、Device、URL、鉴权</text>
        </view>
        <text class="menu-arrow">进入</text>
      </view>

      <template v-if="adminMode">
        <view class="menu-card" @tap="openPoints('displayPoints')">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/tab/dashboard-active.png" mode="aspectFit" />
          </view>
          <view class="menu-copy">
            <text class="menu-title">展示数据点</text>
            <text class="menu-desc">{{ config.displayPoints.length }} 个属性</text>
          </view>
          <text class="menu-arrow">配置</text>
        </view>
        <view class="menu-card" @tap="openPoints('switchPoints')">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/tab/threshold-active.png" mode="aspectFit" />
          </view>
          <view class="menu-copy">
            <text class="menu-title">开关数据点</text>
            <text class="menu-desc">{{ config.switchPoints.length }} 个属性</text>
          </view>
          <text class="menu-arrow">配置</text>
        </view>
        <view class="menu-card" @tap="openPoints('thresholdPoints')">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/tab/history-active.png" mode="aspectFit" />
          </view>
          <view class="menu-copy">
            <text class="menu-title">阈值数据点</text>
            <text class="menu-desc">{{ config.thresholdPoints.length }} 个属性</text>
          </view>
          <text class="menu-arrow">配置</text>
        </view>
        <view class="menu-card recommended-action" @tap="openRecommendations">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/tab/dashboard-active.png" mode="aspectFit" />
          </view>
          <view class="menu-copy">
            <text class="menu-title">推荐数据点</text>
            <text class="menu-desc">展示、开关、阈值模板</text>
          </view>
          <text class="menu-arrow">维护</text>
        </view>
        <view class="menu-card theme-action" @tap="openTheme">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/tab/settings-active.png" mode="aspectFit" />
          </view>
          <view class="menu-copy">
            <text class="menu-title">主题配置</text>
            <text class="menu-desc">{{ currentThemeName }} - 4套风格可选</text>
          </view>
          <text class="menu-arrow">{{ themeSectionOpen ? '收起' : '展开' }}</text>
        </view>
        <view class="menu-card debug-action" @tap="openDebug">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/tab/threshold-active.png" mode="aspectFit" />
          </view>
          <view class="menu-copy">
            <text class="menu-title">数据调试</text>
            <text class="menu-desc">手动设置模拟数据值进行调试</text>
          </view>
          <text class="menu-arrow">调试</text>
        </view>
      </template>
    </view>

    <!-- Inline theme selector (no modal — avoids scroll-view tap issues) -->
    <view v-if="adminMode && themeSectionOpen" class="theme-section">
      <text class="theme-intro">选择一套视觉主题，应用将自动重启以应用新风格。</text>
      <view class="theme-grid">
        <view
          v-for="theme in THEME_LIST"
          :key="theme.id"
          class="theme-card"
          :class="{ active: config.themeId === theme.id }"
          @tap="selectTheme(theme.id)"
        >
          <view class="theme-preview" :style="{ backgroundImage: themeBgImage(theme.id), backgroundSize: 'cover', backgroundColor: themePreviewBg(theme.id) }">
            <view class="theme-preview-hero" :style="{ background: themePreviewHero(theme.id) }" />
            <view class="theme-preview-cards">
              <view class="theme-preview-card" :style="{ background: themePreviewSurface(theme.id), borderRadius: themePreviewRadius(theme.id) }" />
              <view class="theme-preview-card" :style="{ background: themePreviewSurface(theme.id), borderRadius: themePreviewRadius(theme.id) }" />
            </view>
          </view>
          <view class="theme-meta">
            <view class="theme-meta-row">
              <view class="theme-swatch" :style="{ background: themeAccent(theme.id) }" />
              <text class="theme-name">{{ theme.name }}</text>
            </view>
            <text class="theme-desc">{{ theme.description }}</text>
          </view>
          <view v-if="config.themeId === theme.id" class="theme-check">Active</view>
        </view>
      </view>
    </view>

    <view class="summary-panel">
      <view class="summary-item">
        <text>产品 ID</text>
        <text>{{ config.cloud.productId || '--' }}</text>
      </view>
      <view class="summary-item">
        <text>设备名称</text>
        <text>{{ config.cloud.deviceName || '--' }}</text>
      </view>
      <view class="summary-item">
        <text>运行模式</text>
        <text>{{ config.cloud.mockMode ? '模拟数据' : '真实云平台' }}</text>
      </view>
    </view>

    <!-- Password verification modal -->
    <view v-if="showPasswordModal" class="modal-mask" @tap="cancelPassword">
      <view class="password-dialog" @tap.stop>
        <text class="password-title">管理员验证</text>
        <text class="password-desc">请输入管理员密码以解锁配置权限</text>
        <input
          class="password-input"
          type="text"
          password
          :value="passwordInput"
          placeholder="请输入密码"
          @input="passwordInput = $event.detail.value"
          @confirm="submitPassword"
        />
        <view class="password-actions">
          <button class="password-btn cancel" @tap="cancelPassword">取消</button>
          <button class="password-btn confirm" @tap="submitPassword">确认</button>
        </view>
      </view>
    </view>

    <view v-if="activeModal" class="modal-mask">
      <view class="modal">
        <view class="modal-head">
          <text>{{ modalTitle }}</text>
          <button class="close-btn" @tap="closeModal">关闭</button>
        </view>

        <scroll-view scroll-y class="modal-body">
          <view v-if="activeModal === 'cloud'" class="form">
            <label class="field">
              <text>Product ID</text>
              <input class="input" :value="draft.cloud.productId" @input="draft.cloud.productId = $event.detail.value" />
            </label>
            <label class="field">
              <text>Device Name</text>
              <input class="input" :value="draft.cloud.deviceName" @input="draft.cloud.deviceName = $event.detail.value" />
            </label>
            <button class="secondary-btn" @tap="syncGetUrl">根据产品和设备生成读取 URL</button>
            <label class="field">
              <text>GET URL</text>
              <textarea class="textarea" :value="draft.cloud.getUrl" @input="draft.cloud.getUrl = $event.detail.value" />
            </label>
            <label class="field">
              <text>POST URL</text>
              <textarea class="textarea" :value="draft.cloud.postUrl" @input="draft.cloud.postUrl = $event.detail.value" />
            </label>
            <label class="field">
              <text>Authorization</text>
              <textarea
                class="textarea auth"
                :value="draft.cloud.authorization"
                @input="draft.cloud.authorization = $event.detail.value"
              />
            </label>
            <view class="switch-field">
              <view>
                <text class="field-title">模拟数据模式</text>
                <text class="field-desc">关闭后使用真实云平台接口</text>
              </view>
              <switch color="#0f6b67" :checked="draft.cloud.mockMode" @change="draft.cloud.mockMode = $event.detail.value" />
            </view>
          </view>

          <view v-else-if="activeModal === 'recommendations'" class="form">
            <view class="category-tabs">
              <view
                v-for="item in categoryDefs"
                :key="item.key"
                class="category-tab"
                :class="{ active: activeRecommendCategory === item.key }"
                @tap="activeRecommendCategory = item.key"
              >
                {{ item.label }}
              </view>
            </view>

            <view
              v-for="(point, index) in currentRecommendedPoints"
              :key="`${activeRecommendCategory}-${index}`"
              class="point-row"
            >
              <view class="point-head">
                <text>{{ categoryName(activeRecommendCategory) }}推荐 {{ index + 1 }}</text>
                <button class="remove-btn" @tap="removeRecommendedPoint(index)">删除</button>
              </view>
              <PointFields :point="point" :threshold="activeRecommendCategory === 'threshold'" />
            </view>

            <button class="secondary-btn" @tap="addRecommendedPoint">新增推荐数据点</button>
          </view>

          <view v-else-if="activeModal === 'debug'" class="form">
            <text class="debug-intro">以下为已配置的展示和开关数据点，可手动设置调试值。仅在模拟数据模式下生效。</text>
            <view class="debug-list">
              <view v-for="point in debugPoints" :key="'debug-' + point.identifier" class="debug-row">
                <view class="debug-info">
                  <text class="debug-label">{{ point.label || point.identifier }}</text>
                  <text class="debug-id">{{ point.identifier }} {{ point.unit }}</text>
                </view>
                <input
                  class="debug-input"
                  type="text"
                  :value="String(debugValueMap[point.identifier] ?? '')"
                  :placeholder="String(debugCurrentValues[point.identifier] ?? '--')"
                  @input="onDebugValueChange(point.identifier, $event.detail.value)"
                />
              </view>
            </view>
            <view v-if="!debugPoints.length" class="debug-empty">请先在展示数据点和开关数据点中配置属性。</view>
            <button class="secondary-btn" style="margin-top: 20rpx" @tap="clearDebugValues">清空调试值</button>
          </view>

          <view v-else class="form">
            <view v-if="activeModal === 'displayPoints'" class="quick-panel">
              <view class="quick-head">
                <view>
                  <text class="quick-title">快速选择推荐数据点</text>
                  <text class="quick-desc">点击图标按钮即可加入当前展示配置</text>
                </view>
              </view>
              <view class="quick-grid">
                <view
                  v-for="point in recommendedDisplayPoints"
                  :key="point.identifier"
                  class="quick-chip"
                  @tap="quickAddPoint(point)"
                >
                  <view class="quick-icon">
                    <image src="/static/tab/dashboard-active.png" mode="aspectFit" />
                  </view>
                  <text>{{ point.label }}</text>
                  <text>{{ point.identifier }}</text>
                </view>
              </view>
            </view>

            <view v-for="(point, index) in draft[activeModal]" :key="index" class="point-row">
              <view class="point-head">
                <text>数据点 {{ index + 1 }}</text>
                <button class="remove-btn" @tap="removePoint(index)">删除</button>
              </view>
              <PointFields :point="point" :threshold="activeModal === 'thresholdPoints'" />
              <!-- Alarm threshold binding (display points only) -->
              <view v-if="activeModal === 'displayPoints'" class="alarm-field">
                <text>报警阈值绑定</text>
                <picker
                  :range="thresholdPickerRange"
                  :range-key="'label'"
                  :value="getThresholdPickerIndex(point)"
                  @change="onAlarmThresholdChange(point, $event.detail.value)"
                >
                  <view class="alarm-picker">
                    {{ getAlarmThresholdLabel(point) }}
                  </view>
                </picker>
              </view>
            </view>
            <button class="secondary-btn" @tap="addPoint">新增数据点</button>
          </view>
        </scroll-view>

        <view class="modal-footer">
          <button v-if="activeModal === 'debug'" class="primary-btn" @tap="saveDebug">保存调试值</button>
          <button v-else class="primary-btn" @tap="saveModal">保存配置</button>
        </view>
      </view>
    </view>

    <AppTabBar current="settings" />
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppTabBar from '../../components/AppTabBar.vue'
import PointFields from '../../components/PointFields.vue'
import { buildGetUrl, createPoint } from '../../utils/defaultConfig'
import { getConfig, saveConfig, getDebugValues, saveDebugValues, clearDebugValues as clearDebugStorage } from '../../utils/storage'
import { THEME_LIST, applyThemeToDOM } from '../../utils/themes'

const config = ref(getConfig())
const draft = ref(getConfig())
const activeModal = ref('')
const adminMode = ref(false)
const unlockTapCount = ref(0)
const unlockTimer = ref(null)
const activeRecommendCategory = ref('display')
const themeSectionOpen = ref(false)
const showPasswordModal = ref(false)
const passwordInput = ref('')
const debugValueMap = ref({})
const debugCurrentValues = ref({})

const categoryDefs = [
  { key: 'display', label: '展示' },
  { key: 'switch', label: '开关' },
  { key: 'threshold', label: '阈值' }
]

// Alarm threshold dropdown helpers
const thresholdPickerRange = computed(() => {
  return [{ label: '无', identifier: '' }, ...(draft.value.thresholdPoints || [])]
})

function getThresholdPickerIndex(point) {
  const id = point.alarmThresholdId || ''
  const idx = thresholdPickerRange.value.findIndex((t) => t.identifier === id)
  return idx >= 0 ? idx : 0
}

function getAlarmThresholdLabel(point) {
  const id = point.alarmThresholdId || ''
  if (!id) return '无'
  const found = thresholdPickerRange.value.find((t) => t.identifier === id)
  return found ? found.label : '无'
}

function onAlarmThresholdChange(point, pickerIndex) {
  const selected = thresholdPickerRange.value[pickerIndex]
  point.alarmThresholdId = selected ? selected.identifier : ''
}

// Debug panel
const debugPoints = computed(() => {
  return [...(config.value.displayPoints || []), ...(config.value.switchPoints || [])]
})

function openDebug() {
  debugValueMap.value = { ...getDebugValues() }
  // Build current values snapshot from config (for placeholder display)
  const snapshot = {}
  const allPoints = [...(config.value.displayPoints || []), ...(config.value.switchPoints || [])]
  allPoints.forEach((p) => {
    if (p.identifier) snapshot[p.identifier] = '--'
  })
  debugCurrentValues.value = snapshot
  activeModal.value = 'debug'
}

function onDebugValueChange(identifier, value) {
  debugValueMap.value[identifier] = value === '' ? undefined : value
}

function saveDebug() {
  const cleaned = {}
  Object.entries(debugValueMap.value).forEach(([key, val]) => {
    if (val !== undefined && val !== '') {
      // Try to parse numbers
      const num = Number(val)
      cleaned[key] = Number.isFinite(num) ? num : val
    }
  })
  saveDebugValues(cleaned)
  closeModal()
  uni.showToast({ title: '调试值已保存', icon: 'success' })
}

function clearDebugValues() {
  clearDebugStorage()
  debugValueMap.value = {}
  uni.showToast({ title: '调试值已清空', icon: 'success' })
}

const modalTitle = computed(() => {
  const titles = {
    cloud: '云平台连接配置',
    displayPoints: '展示数据点配置',
    switchPoints: '开关数据点配置',
    thresholdPoints: '阈值数据点配置',
    recommendations: '推荐数据点配置',
    debug: '数据调试'
  }
  return titles[activeModal.value] || ''
})

const currentThemeName = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? theme.name : '默认墨绿'
})

const recommendedDisplayPoints = computed(() => draft.value.recommendedPoints?.display || [])
const currentRecommendedPoints = computed(() => draft.value.recommendedPoints?.[activeRecommendCategory.value] || [])

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function ensureRecommendedPoints(target) {
  target.recommendedPoints = {
    display: target.recommendedPoints?.display || [],
    switch: target.recommendedPoints?.switch || [],
    threshold: target.recommendedPoints?.threshold || []
  }
}

function reload() {
  config.value = getConfig()
}

function handleHeaderTap() {
  if (adminMode.value) return
  unlockTapCount.value += 1
  if (unlockTimer.value) clearTimeout(unlockTimer.value)

  if (unlockTapCount.value >= 5) {
    unlockTapCount.value = 0
    // TODO: uncomment before production release
    // passwordInput.value = ''
    // showPasswordModal.value = true
    // return
    adminMode.value = true
    uni.showToast({ title: '管理员配置已开启', icon: 'none' })
    return
  }

  unlockTimer.value = setTimeout(() => {
    unlockTapCount.value = 0
  }, 10000)
}

function submitPassword() {
  if (passwordInput.value === 'esp8266') {
    adminMode.value = true
    showPasswordModal.value = false
    passwordInput.value = ''
    uni.showToast({
      title: '管理员配置已开启',
      icon: 'none'
    })
  } else {
    passwordInput.value = ''
    uni.showToast({
      title: '密码错误',
      icon: 'error'
    })
  }
}

function cancelPassword() {
  showPasswordModal.value = false
  passwordInput.value = ''
}

function exitAdmin() {
  adminMode.value = false
}

function saveAppName() {
  saveConfig(config.value)
  uni.showToast({
    title: '已保存',
    icon: 'success'
  })
}

function openCloud() {
  draft.value = clone(config.value)
  ensureRecommendedPoints(draft.value)
  activeModal.value = 'cloud'
}

function openPoints(type) {
  draft.value = clone(config.value)
  ensureRecommendedPoints(draft.value)
  activeModal.value = type
}

function openRecommendations() {
  draft.value = clone(config.value)
  ensureRecommendedPoints(draft.value)
  activeRecommendCategory.value = 'display'
  activeModal.value = 'recommendations'
}

function openTheme() {
  themeSectionOpen.value = !themeSectionOpen.value
}

function selectTheme(themeId) {
  config.value.themeId = themeId
  saveConfig(config.value)
  applyThemeToDOM(themeId)

  const app = getApp()
  if (app && app.setTheme) {
    app.setTheme(themeId)
  }

  uni.showToast({
    title: '主题已应用',
    icon: 'success'
  })
}

// Theme preview helpers - extract accent/surface from THEME_LIST cssVars
function themeAccent(id) {
  const theme = THEME_LIST.find((t) => t.id === id)
  return theme ? theme.cssVars['--theme-accent'] : '#0dc9b0'
}

function themeBgImage(id) {
  const theme = THEME_LIST.find((t) => t.id === id)
  return theme ? theme.backgroundImage : 'none'
}

function themePreviewBg(id) {
  const theme = THEME_LIST.find((t) => t.id === id)
  return theme ? theme.cssVars['--theme-bg'] : '#0d2829'
}

function themePreviewHero(id) {
  const theme = THEME_LIST.find((t) => t.id === id)
  if (!theme) return 'linear-gradient(135deg, #0f3a3c 0%, #0a2021 100%)'
  return `linear-gradient(135deg, ${theme.cssVars['--theme-hero-bg-start']} 0%, ${theme.cssVars['--theme-hero-bg-end']} 100%)`
}

function themePreviewSurface(id) {
  const theme = THEME_LIST.find((t) => t.id === id)
  return theme ? theme.cssVars['--theme-surface'] : '#122f31'
}

function themePreviewRadius(id) {
  const theme = THEME_LIST.find((t) => t.id === id)
  return theme ? theme.cssVars['--theme-radius-sm'] : '8rpx'
}

function closeModal() {
  activeModal.value = ''
}

function syncGetUrl() {
  draft.value.cloud.getUrl = buildGetUrl(draft.value.cloud)
}

function addPoint() {
  const type = activeModal.value
  draft.value[type].push(createPoint(type === 'thresholdPoints' ? 'threshold' : 'display'))
}

function removePoint(index) {
  draft.value[activeModal.value].splice(index, 1)
}

function addRecommendedPoint() {
  const category = activeRecommendCategory.value
  draft.value.recommendedPoints[category].push(createPoint(category === 'threshold' ? 'threshold' : 'display'))
}

function removeRecommendedPoint(index) {
  draft.value.recommendedPoints[activeRecommendCategory.value].splice(index, 1)
}

function quickAddPoint(point) {
  if (!point.identifier) return
  const exists = draft.value.displayPoints.some((item) => item.identifier === point.identifier)
  if (exists) {
    uni.showToast({
      title: '已存在该数据点',
      icon: 'none'
    })
    return
  }
  draft.value.displayPoints.push(clone(point))
  uni.showToast({
    title: '已加入配置',
    icon: 'success'
  })
}

function categoryName(category) {
  const item = categoryDefs.find((entry) => entry.key === category)
  return item?.label || ''
}

function normalizePoints(points, isThreshold = false) {
  return (points || [])
    .map((point) => ({
      ...point,
      label: String(point.label || '').trim(),
      identifier: String(point.identifier || '').trim(),
      unit: String(point.unit || '').trim()
    }))
    .filter((point) => point.label && point.identifier)
    .map((point) => {
      if (!isThreshold) return point
      const min = Number(point.min)
      const max = Number(point.max)
      return {
        ...point,
        min: Number.isFinite(min) ? min : 0,
        max: Number.isFinite(max) ? max : 100,
        step: Number(point.step) || 1,
        value: Number(point.value) || 0
      }
    })
}

function saveModal() {
  const nextConfig = clone(draft.value)
  ensureRecommendedPoints(nextConfig)
  nextConfig.displayPoints = normalizePoints(nextConfig.displayPoints)
  nextConfig.switchPoints = normalizePoints(nextConfig.switchPoints)
  nextConfig.thresholdPoints = normalizePoints(nextConfig.thresholdPoints, true)
  nextConfig.recommendedPoints = {
    display: normalizePoints(nextConfig.recommendedPoints.display),
    switch: normalizePoints(nextConfig.recommendedPoints.switch),
    threshold: normalizePoints(nextConfig.recommendedPoints.threshold, true)
  }
  saveConfig(nextConfig)
  config.value = getConfig()
  closeModal()
  uni.showToast({
    title: '配置已保存',
    icon: 'success'
  })
}

onShow(reload)
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 28rpx 28rpx 150rpx;
  box-sizing: border-box;
  background: linear-gradient(180deg, var(--theme-bg-gradient-settings-start) 0%, var(--theme-bg-gradient-settings-end) 45%, var(--theme-bg-gradient-settings-end) 100%);
}

.header-panel,
.name-panel,
.summary-panel,
.menu-card {
  border: 1rpx solid var(--theme-surface-border);
  border-radius: var(--theme-radius-lg);
  background: var(--theme-surface);
  box-shadow: 0 14rpx 38rpx var(--theme-shadow-sm);
}

.header-panel {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18rpx;
  padding: 30rpx;
}

.eyebrow,
.title,
.desc,
.panel-title,
.menu-title,
.menu-desc,
.quick-title,
.quick-desc {
  display: block;
}

.eyebrow {
  color: var(--theme-accent);
  font-size: 23rpx;
  font-weight: 800;
}

.title {
  margin-top: 8rpx;
  color: var(--theme-text-primary);
  font-size: 40rpx;
  font-weight: 900;
}

.desc {
  margin-top: 10rpx;
  color: var(--theme-text-secondary);
  font-size: 25rpx;
  line-height: 1.45;
}

.admin-exit {
  width: 96rpx;
  height: 56rpx;
  margin: 0;
  border-radius: var(--theme-radius-input);
  background: var(--theme-category-tabs-bg);
  color: var(--theme-text-secondary);
  font-size: 23rpx;
  line-height: 56rpx;
}

.name-panel {
  margin-top: 22rpx;
  padding: 24rpx;
}

.panel-title {
  color: var(--theme-text-primary);
  font-size: 30rpx;
  font-weight: 900;
}

.name-row {
  display: flex;
  gap: 14rpx;
  margin-top: 18rpx;
}

.name-input,
.input,
.textarea {
  border: 1rpx solid var(--theme-input-border);
  border-radius: var(--theme-radius-input);
  background: var(--theme-input-bg);
  color: var(--theme-text-primary);
  font-size: 26rpx;
  box-sizing: border-box;
}

.name-input {
  flex: 1;
  height: 76rpx;
  padding: 0 20rpx;
}

.save-name,
.primary-btn,
.secondary-btn,
.close-btn,
.remove-btn {
  border-radius: var(--theme-radius-input);
  font-size: 26rpx;
  font-weight: 800;
}

.save-name {
  width: 126rpx;
  height: 76rpx;
  margin: 0;
  background: var(--theme-accent);
  color: var(--theme-accent-contrast);
  line-height: 76rpx;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
  margin-top: 22rpx;
}

.menu-grid.public {
  grid-template-columns: 1fr;
}

.menu-card {
  position: relative;
  display: flex;
  min-height: 176rpx;
  flex-direction: column;
  justify-content: space-between;
  padding: 22rpx;
  border: 2rpx solid var(--theme-surface-border-light);
  box-sizing: border-box;
  overflow: hidden;
}

.menu-card::after {
  position: absolute;
  right: 20rpx;
  top: 20rpx;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: var(--theme-menu-accent-bg);
  content: "";
}

.menu-card.primary-action {
  min-height: 168rpx;
  border-color: var(--theme-card-accent-border);
  background: linear-gradient(135deg, var(--theme-card-accent-bg-start) 0%, var(--theme-card-accent-bg-end) 100%);
  box-shadow: 0 18rpx 42rpx var(--theme-card-accent-shadow);
}

.menu-card.recommended-action {
  border-color: rgba(43, 138, 239, 0.18);
}

.menu-card:active {
  transform: scale(0.985);
}

.menu-icon-wrap {
  display: flex;
  width: 58rpx;
  height: 58rpx;
  align-items: center;
  justify-content: center;
  border-radius: var(--theme-radius-input);
  background: var(--theme-accent-light);
}

.menu-icon {
  width: 36rpx;
  height: 36rpx;
}

.menu-copy {
  margin-top: 18rpx;
}

.menu-title {
  color: var(--theme-text-primary);
  font-size: 29rpx;
  font-weight: 900;
}

.menu-desc {
  margin-top: 8rpx;
  color: var(--theme-text-secondary);
  font-size: 22rpx;
  line-height: 1.35;
}

.menu-arrow {
  position: absolute;
  right: 18rpx;
  bottom: 18rpx;
  padding: 8rpx 14rpx;
  border-radius: var(--theme-radius-pill);
  background: var(--theme-accent);
  color: var(--theme-accent-contrast);
  font-size: 21rpx;
  font-weight: 800;
}

.summary-panel {
  margin-top: 22rpx;
  padding: 10rpx 24rpx;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  gap: 18rpx;
  padding: 22rpx 0;
  border-bottom: 1rpx solid var(--theme-divider);
  color: var(--theme-text-primary);
  font-size: 26rpx;
  font-weight: 750;
}

.summary-item:last-child {
  border-bottom: 0;
}

.summary-item text:first-child {
  color: var(--theme-text-secondary);
  font-weight: 650;
}

.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: flex-end;
  background: var(--theme-modal-overlay);
}

.modal {
  width: 100%;
  max-height: 90vh;
  border-radius: var(--theme-radius-lg) var(--theme-radius-lg) 0 0;
  background: var(--theme-surface);
  overflow: hidden;
}

.modal-head,
.modal-footer,
.point-head,
.switch-field,
.quick-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.modal-head {
  padding: 26rpx 28rpx;
  border-bottom: 1rpx solid var(--theme-divider);
  color: var(--theme-text-primary);
  font-size: 31rpx;
  font-weight: 900;
}

.close-btn,
.refresh-btn,
.remove-btn {
  width: 108rpx;
  height: 58rpx;
  margin: 0;
  background: var(--theme-divider);
  color: var(--theme-text-secondary);
  font-size: 24rpx;
  line-height: 58rpx;
}

.modal-body {
  max-height: 70vh;
  padding: 24rpx 28rpx;
  box-sizing: border-box;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.field text,
.field-title,
.field-desc {
  display: block;
}

.field text,
.field-title {
  margin-bottom: 10rpx;
  color: var(--theme-text-secondary);
  font-size: 24rpx;
  font-weight: 800;
}

.field-desc {
  color: var(--theme-text-tertiary);
  font-size: 22rpx;
}

.input {
  width: 100%;
  height: 72rpx;
  padding: 0 18rpx;
}

.textarea {
  width: 100%;
  min-height: 132rpx;
  padding: 18rpx;
  line-height: 1.4;
}

.textarea.auth {
  min-height: 190rpx;
}

.switch-field,
.point-row,
.quick-panel {
  padding: 20rpx;
  border: 1rpx solid var(--theme-divider-light);
  border-radius: 22rpx;
  background: var(--theme-surface-alt);
}

.point-fields {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.point-head {
  margin-bottom: 16rpx;
  color: var(--theme-text-primary);
  font-size: 26rpx;
  font-weight: 900;
}

.remove-btn {
  background: var(--theme-danger-bg);
  color: var(--theme-danger);
}

.threshold-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14rpx;
}

.secondary-btn {
  height: 76rpx;
  margin: 0;
  border: 1rpx solid var(--theme-btn-secondary-border);
  background: var(--theme-btn-secondary-bg);
  color: var(--theme-btn-secondary-text);
  line-height: 76rpx;
}

.quick-title {
  color: var(--theme-text-primary);
  font-size: 27rpx;
  font-weight: 900;
}

.quick-desc {
  margin-top: 6rpx;
  color: var(--theme-text-secondary);
  font-size: 22rpx;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14rpx;
  margin-top: 18rpx;
}

.quick-chip {
  display: flex;
  min-height: 138rpx;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 6rpx;
  border: 1rpx solid var(--theme-quick-chip-border);
  border-radius: 20rpx;
  background: var(--theme-surface);
  color: var(--theme-text-primary);
  font-size: 23rpx;
  font-weight: 800;
}

.quick-chip text:last-child {
  color: var(--theme-text-tertiary);
  font-size: 19rpx;
  font-weight: 650;
}

.quick-icon {
  display: flex;
  width: 48rpx;
  height: 48rpx;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  background: var(--theme-accent-light);
}

.quick-icon image {
  width: 30rpx;
  height: 30rpx;
}

.category-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12rpx;
  padding: 8rpx;
  border-radius: 22rpx;
  background: var(--theme-category-tabs-bg);
}

.category-tab {
  height: 64rpx;
  border-radius: var(--theme-radius-input);
  color: var(--theme-text-secondary);
  font-size: 25rpx;
  font-weight: 800;
  line-height: 64rpx;
  text-align: center;
}

.category-tab.active {
  background: var(--theme-category-tab-active-bg);
  color: var(--theme-accent);
  box-shadow: 0 8rpx 20rpx var(--theme-category-tab-active-shadow);
}

.modal-footer {
  padding: 18rpx 28rpx 28rpx;
  border-top: 1rpx solid var(--theme-divider);
}

.primary-btn {
  width: 100%;
  height: 80rpx;
  margin: 0;
  background: var(--theme-accent);
  color: var(--theme-accent-contrast);
  line-height: 80rpx;
  box-shadow: 0 12rpx 28rpx var(--theme-shadow-accent);
}

/* ── Password modal ── */
.password-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 560rpx;
  padding: 40rpx 36rpx 30rpx;
  border-radius: var(--theme-radius-lg);
  background: var(--theme-surface);
  box-shadow: 0 28rpx 68rpx var(--theme-shadow-lg);
  z-index: 50;
}

.password-title {
  display: block;
  color: var(--theme-text-primary);
  font-size: 34rpx;
  font-weight: 900;
}

.password-desc {
  display: block;
  margin-top: 10rpx;
  color: var(--theme-text-secondary);
  font-size: 24rpx;
}

.password-input {
  width: 100%;
  height: 80rpx;
  margin-top: 28rpx;
  padding: 0 20rpx;
  border: 1px solid var(--theme-input-border);
  border-radius: var(--theme-radius-input);
  background: var(--theme-input-bg);
  color: var(--theme-text-primary);
  font-size: 28rpx;
  box-sizing: border-box;
  letter-spacing: 4rpx;
}

.password-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 26rpx;
}

.password-btn {
  flex: 1;
  height: 76rpx;
  margin: 0;
  border-radius: var(--theme-radius-input);
  font-size: 27rpx;
  font-weight: 800;
  line-height: 76rpx;
}

.password-btn.cancel {
  border: 1px solid var(--theme-surface-border);
  background: var(--theme-surface-alt);
  color: var(--theme-text-secondary);
}

.password-btn.confirm {
  background: var(--theme-accent);
  color: var(--theme-accent-contrast);
}

/* ── Theme selector (inline, not modal) ── */
.theme-section {
  margin-top: 22rpx;
  padding: 24rpx;
  border: var(--theme-card-border-width) var(--theme-card-border-style) var(--theme-surface-border);
  border-radius: var(--theme-radius-lg);
  background: var(--theme-surface);
  box-shadow: 0 14rpx 38rpx var(--theme-shadow-sm);
}

.theme-action {
  border-color: rgba(140, 100, 220, 0.18);
}

.theme-intro {
  display: block;
  margin-bottom: 22rpx;
  color: var(--theme-text-secondary);
  font-size: 25rpx;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16rpx;
}

.theme-card {
  position: relative;
  border: 2rpx solid var(--theme-input-border);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface);
  overflow: hidden;
}

.theme-card.active {
  border-color: var(--theme-accent);
  box-shadow: 0 0 0 3rpx var(--theme-surface-border-light);
}

.theme-preview {
  height: 108rpx;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  padding: 12rpx;
}

.theme-preview-hero {
  height: 36rpx;
  border-radius: 8rpx;
}

.theme-preview-cards {
  display: flex;
  gap: 6rpx;
  flex: 1;
}

.theme-preview-card {
  flex: 1;
  border-radius: 6rpx;
}

.theme-meta {
  padding: 14rpx 16rpx 16rpx;
  border-top: 1rpx solid var(--theme-divider);
}

.theme-meta-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.theme-swatch {
  width: 22rpx;
  height: 22rpx;
  border-radius: 50%;
  flex-shrink: 0;
}

.theme-name {
  color: var(--theme-text-primary);
  font-size: 26rpx;
  font-weight: 800;
}

.theme-desc {
  display: block;
  margin-top: 8rpx;
  color: var(--theme-text-secondary);
  font-size: 21rpx;
}

.theme-check {
  position: absolute;
  top: 0;
  right: 0;
  padding: 6rpx 14rpx;
  border-radius: 0 22rpx 0 18rpx;
  background: var(--theme-accent);
  color: var(--theme-accent-contrast);
  font-size: 19rpx;
  font-weight: 800;
}

/* ── Alarm threshold field ── */
.alarm-field {
  margin-top: 16rpx;
  padding: 16rpx 18rpx;
  border: 1rpx solid var(--theme-divider-light);
  border-radius: 16rpx;
  background: var(--theme-surface-alt);
}

.alarm-field text {
  display: block;
  margin-bottom: 10rpx;
  color: var(--theme-text-secondary);
  font-size: 23rpx;
  font-weight: 750;
}

.alarm-picker {
  height: 68rpx;
  padding: 0 18rpx;
  border: 1rpx solid var(--theme-input-border);
  border-radius: var(--theme-radius-input);
  background: var(--theme-input-bg);
  color: var(--theme-text-primary);
  font-size: 26rpx;
  line-height: 68rpx;
}

/* ── Debug panel ── */
.debug-action {
  border-color: rgba(200, 160, 40, 0.2);
}

.debug-intro {
  display: block;
  margin-bottom: 22rpx;
  color: var(--theme-text-secondary);
  font-size: 24rpx;
}

.debug-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.debug-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 16rpx 18rpx;
  border: 1rpx solid var(--theme-divider-light);
  border-radius: 16rpx;
  background: var(--theme-surface-alt);
}

.debug-info {
  flex: 1;
  min-width: 0;
}

.debug-label {
  display: block;
  color: var(--theme-text-primary);
  font-size: 27rpx;
  font-weight: 800;
}

.debug-id {
  display: block;
  margin-top: 6rpx;
  color: var(--theme-text-tertiary);
  font-size: 22rpx;
}

.debug-input {
  width: 160rpx;
  height: 64rpx;
  padding: 0 14rpx;
  border: 1rpx solid var(--theme-input-border);
  border-radius: var(--theme-radius-input);
  background: var(--theme-input-bg);
  color: var(--theme-accent);
  font-size: 26rpx;
  font-weight: 800;
  text-align: center;
  box-sizing: border-box;
}

.debug-empty {
  padding: 40rpx 20rpx;
  text-align: center;
  color: var(--theme-text-tertiary);
  font-size: 25rpx;
}
</style>
