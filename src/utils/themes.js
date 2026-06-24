/**
 * Theme System v2 — Apple Visual Language
 *
 * 每个主题共用一套 token 命名，只是 surface / text / accent 染色不同。
 * 设计原则：
 * - 单一 system-blue accent（#0071e3），所有主题共用
 * - surface + text 决定主题气质（浅/深/暖/极简）
 * - 阴影统一 rgba(0,0,0,0.x)，绝不用纯黑
 * - 圆角统一 sm 10 / md 16 / lg 22 / pill 999
 *
 * 通过两个 HTML 属性应用：
 *   data-theme="id"        -> 颜色 CSS 变量
 *   data-theme-layout="id" -> 结构 CSS（圆角、间距、tab 形状）
 */

// ---------------------------------------------------------------------------
// 浅色 — Apple Standard Light
// 系统蓝 accent + 接近 iOS Settings 的 off-white surface
// ---------------------------------------------------------------------------
const TEAL = {
  id: 'teal',
  name: '浅色',
  description: 'Apple 标准浅色：off-white 背景，system-blue 单一强调色，克制留白',
  layoutPreset: 'compact',
  surfacePreset: 'sharp',
  tabPreset: 'capsule',
  chartPreset: 'angular',
  backgroundImage: 'none',
  heroPattern: 'solid-bright',
  cssVars: {
    // Accent — Apple systemBlue
    '--theme-accent': '#0071e3',
    '--theme-accent-light': '#e8f1fd',
    '--theme-accent-dark': '#0058b0',
    '--theme-accent-contrast': '#ffffff',
    '--theme-accent-tint-16': 'rgba(0, 113, 227, 0.16)',
    '--theme-danger-contrast': '#ffffff',

    // Background — Apple systemGroupedBackground
    '--theme-bg': '#f5f5f7',
    '--theme-bg-image': 'none',
    '--theme-bg-image-opacity': '0',
    '--theme-bg-gradient-start': '#fbfbfd',
    '--theme-bg-gradient-end': '#f5f5f7',
    '--theme-bg-gradient-settings-start': '#f5f5f7',
    '--theme-bg-gradient-settings-end': '#f5f5f7',

    // Surface — 纯白卡片 + 极淡 hairline 边框
    '--theme-surface': '#ffffff',
    '--theme-surface-alt': '#f5f5f7',
    '--theme-surface-alt-2': '#f0f0f3',
    '--theme-surface-hover': '#f0f6ff',
    '--theme-surface-border': 'rgba(0, 0, 0, 0.08)',
    '--theme-surface-border-light': 'rgba(0, 0, 0, 0.04)',
    '--theme-surface-border-accent': 'rgba(0, 113, 227, 0.18)',

    // Text — Apple label / secondaryLabel / tertiaryLabel
    '--theme-text-primary': '#1d1d1f',
    '--theme-text-secondary': '#6e6e73',
    '--theme-text-tertiary': '#86868b',
    '--theme-text-heading': '#000000',

    // Hero — 深色对比块，作为唯一的彩色饱和点
    '--theme-hero-bg-start': '#1d1d1f',
    '--theme-hero-bg-end': '#000000',
    '--theme-hero-border': 'rgba(255, 255, 255, 0.10)',
    '--theme-hero-text': '#ffffff',
    '--theme-hero-text-muted': 'rgba(235, 235, 245, 0.6)',
    '--theme-hero-btn-bg': 'rgba(255, 255, 255, 0.10)',
    '--theme-hero-btn-border': 'rgba(255, 255, 255, 0.20)',
    '--theme-hero-overlay': 'none',

    // Inputs
    '--theme-input-bg': '#ffffff',
    '--theme-input-border': '#d2d2d7',
    '--theme-input-border-focus': '#0071e3',
    '--theme-input-style': '12rpx',

    // Dividers — Apple separator
    '--theme-divider': '#e5e5ea',
    '--theme-divider-light': '#f0f0f3',

    // Shadows — 统一 rgba(0,0,0,...) 透明叠层
    '--theme-shadow-sm': 'rgba(0, 0, 0, 0.04)',
    '--theme-shadow-md': 'rgba(0, 0, 0, 0.06)',
    '--theme-shadow-lg': 'rgba(0, 0, 0, 0.10)',
    '--theme-shadow-accent': 'rgba(0, 113, 227, 0.18)',

    // Semantic — Apple systemRed / systemGreen / systemOrange
    '--theme-danger': '#ff3b30',
    '--theme-danger-bg': '#fff5f4',
    '--theme-danger-border': '#ff3b30',
    '--theme-success': '#34c759',
    '--theme-warning': '#ff9f0a',

    // Radii
    '--theme-radius-sm': '10rpx',
    '--theme-radius-md': '16rpx',
    '--theme-radius-lg': '22rpx',
    '--theme-radius-pill': '999rpx',
    '--theme-radius-input': '12rpx',

    // Card morphology
    '--theme-card-border-width': '0.5px',
    '--theme-card-border-style': 'solid',
    '--theme-card-bg-opacity': '1',

    // Layout
    '--theme-layout-gap': '16rpx',
    '--theme-layout-section-gap': '24rpx',

    // Tab bar — pill wrapper + filled active state
    '--theme-tab-active-bg': '#0071e3',
    '--theme-tab-active-text': '#ffffff',
    '--theme-tab-text': '#6e6e73',
    '--theme-tab-height': '96rpx',
    '--theme-tab-border-radius': '26rpx',
    '--theme-tab-wrapper-bg': 'rgba(255, 255, 255, 0.72)',
    '--theme-tab-wrapper-border': 'rgba(0, 0, 0, 0.08)',
    '--theme-tab-wrapper-shadow': '0 12rpx 32rpx rgba(0, 0, 0, 0.10)',
    '--theme-tab-wrapper-padding': '6rpx',

    // Misc
    '--theme-metric-fill-end': '#0071e3',
    '--theme-card-accent-bg-start': '#ffffff',
    '--theme-card-accent-bg-end': '#f0f6ff',
    '--theme-card-accent-shadow': 'rgba(0, 113, 227, 0.10)',
    '--theme-card-accent-border': 'rgba(0, 113, 227, 0.20)',
    '--theme-badge-bg': '#e8f1fd',
    '--theme-badge-text': '#0058b0',

    // Chart
    '--theme-chart-bg': '#ffffff',
    '--theme-chart-grid': '#f0f0f3',
    '--theme-chart-color-0': '#0071e3',
    '--theme-chart-color-1': '#34c759',
    '--theme-chart-color-2': '#ff9f0a',
    '--theme-chart-color-3': '#ff3b30',
    '--theme-chart-color-4': '#af52de',
    '--theme-chart-line-width': '2.5',
    '--theme-chart-dot-radius': '3.5',

    // Modal
    '--theme-modal-overlay': 'rgba(0, 0, 0, 0.40)',
    '--theme-btn-secondary-bg': '#ffffff',
    '--theme-btn-secondary-border': '#0071e3',
    '--theme-btn-secondary-text': '#0071e3',
    '--theme-btn-style': '12rpx',

    // Tab internals
    '--theme-tab-shadow-inset': 'rgba(0, 113, 227, 0.16)',
    '--theme-tab-border': 'rgba(0, 0, 0, 0.06)',
    '--theme-tab-bg': 'rgba(255, 255, 255, 0.96)',
    '--theme-tab-shadow': 'rgba(0, 0, 0, 0.10)',

    // Settings-specific
    '--theme-summary-chip-bg': '#e8f1fd',
    '--theme-summary-chip-text': '#0058b0',
    '--theme-value-badge-bg': 'transparent',
    '--theme-value-badge-text': '#0071e3',
    '--theme-value-badge-unit': '#86868b',
    '--theme-empty-border': '#d2d2d7',
    '--theme-category-tabs-bg': '#f0f0f3',
    '--theme-category-tab-active-bg': '#ffffff',
    '--theme-category-tab-active-shadow': 'rgba(0, 0, 0, 0.08)',
    '--theme-quick-chip-border': '#e5e5ea',
    '--theme-menu-accent-bg': 'rgba(0, 113, 227, 0.06)'
  }
}

// ---------------------------------------------------------------------------
// 深色 — Apple Dark Mode
// 同一 system-blue accent + graphite surface，文字调高对比
// ---------------------------------------------------------------------------
const NIGHT = {
  id: 'night',
  name: '深色',
  description: 'Apple 深色模式：纯黑背景，graphite 卡片，system-blue accent，文字提亮',
  layoutPreset: 'glass',
  surfacePreset: 'frosted',
  tabPreset: 'glow',
  chartPreset: 'neon',
  backgroundImage: 'none',
  heroPattern: 'gradient-bright',
  cssVars: {
    '--theme-accent': '#0a84ff',
    '--theme-accent-light': 'rgba(10, 132, 255, 0.18)',
    '--theme-accent-dark': '#5ac8fa',
    '--theme-accent-contrast': '#ffffff',
    '--theme-accent-tint-16': 'rgba(10, 132, 255, 0.20)',
    '--theme-danger-contrast': '#ffffff',

    // Background — Apple systemBackground dark
    '--theme-bg': '#000000',
    '--theme-bg-image': 'none',
    '--theme-bg-image-opacity': '0',
    '--theme-bg-gradient-start': '#1c1c1e',
    '--theme-bg-gradient-end': '#000000',
    '--theme-bg-gradient-settings-start': '#1c1c1e',
    '--theme-bg-gradient-settings-end': '#000000',

    // Surface — Apple secondarySystemBackground / tertiarySystemBackground
    '--theme-surface': '#1c1c1e',
    '--theme-surface-alt': '#2c2c2e',
    '--theme-surface-alt-2': '#3a3a3c',
    '--theme-surface-hover': 'rgba(10, 132, 255, 0.12)',
    '--theme-surface-border': 'rgba(255, 255, 255, 0.10)',
    '--theme-surface-border-light': 'rgba(255, 255, 255, 0.06)',
    '--theme-surface-border-accent': 'rgba(10, 132, 255, 0.30)',

    '--theme-text-primary': '#f5f5f7',
    '--theme-text-secondary': '#a1a1a6',
    '--theme-text-tertiary': '#6e6e73',
    '--theme-text-heading': '#ffffff',

    // Hero — 深色模式下 hero 改为浅色玻璃质，作为页内最亮点
    '--theme-hero-bg-start': '#1c1c1e',
    '--theme-hero-bg-end': '#2c2c2e',
    '--theme-hero-border': 'rgba(255, 255, 255, 0.10)',
    '--theme-hero-text': '#ffffff',
    '--theme-hero-text-muted': 'rgba(235, 235, 245, 0.6)',
    '--theme-hero-btn-bg': 'rgba(255, 255, 255, 0.10)',
    '--theme-hero-btn-border': 'rgba(255, 255, 255, 0.20)',
    '--theme-hero-overlay': 'none',

    '--theme-input-bg': '#1c1c1e',
    '--theme-input-border': 'rgba(255, 255, 255, 0.15)',
    '--theme-input-border-focus': '#0a84ff',
    '--theme-input-style': '12rpx',

    '--theme-divider': 'rgba(255, 255, 255, 0.10)',
    '--theme-divider-light': 'rgba(255, 255, 255, 0.06)',

    '--theme-shadow-sm': 'rgba(0, 0, 0, 0.30)',
    '--theme-shadow-md': 'rgba(0, 0, 0, 0.40)',
    '--theme-shadow-lg': 'rgba(0, 0, 0, 0.55)',
    '--theme-shadow-accent': 'rgba(10, 132, 255, 0.30)',

    '--theme-danger': '#ff453a',
    '--theme-danger-bg': 'rgba(255, 69, 58, 0.15)',
    '--theme-danger-border': '#ff453a',
    '--theme-success': '#30d158',
    '--theme-warning': '#ff9f0a',

    '--theme-radius-sm': '10rpx',
    '--theme-radius-md': '16rpx',
    '--theme-radius-lg': '22rpx',
    '--theme-radius-pill': '999rpx',
    '--theme-radius-input': '12rpx',

    '--theme-card-border-width': '0.5px',
    '--theme-card-border-style': 'solid',
    '--theme-card-bg-opacity': '1',

    '--theme-layout-gap': '16rpx',
    '--theme-layout-section-gap': '24rpx',

    '--theme-tab-active-bg': '#0a84ff',
    '--theme-tab-active-text': '#ffffff',
    '--theme-tab-text': '#a1a1a6',
    '--theme-tab-height': '96rpx',
    '--theme-tab-border-radius': '26rpx',
    '--theme-tab-wrapper-bg': 'rgba(28, 28, 30, 0.72)',
    '--theme-tab-wrapper-border': 'rgba(255, 255, 255, 0.10)',
    '--theme-tab-wrapper-shadow': '0 12rpx 32rpx rgba(0, 0, 0, 0.55)',
    '--theme-tab-wrapper-padding': '6rpx',

    '--theme-metric-fill-end': '#0a84ff',
    '--theme-card-accent-bg-start': '#2c2c2e',
    '--theme-card-accent-bg-end': '#1c1c1e',
    '--theme-card-accent-shadow': 'rgba(0, 0, 0, 0.40)',
    '--theme-card-accent-border': 'rgba(10, 132, 255, 0.28)',
    '--theme-badge-bg': 'rgba(10, 132, 255, 0.18)',
    '--theme-badge-text': '#5ac8fa',

    '--theme-chart-bg': '#1c1c1e',
    '--theme-chart-grid': 'rgba(255, 255, 255, 0.08)',
    '--theme-chart-color-0': '#0a84ff',
    '--theme-chart-color-1': '#30d158',
    '--theme-chart-color-2': '#ff9f0a',
    '--theme-chart-color-3': '#ff453a',
    '--theme-chart-color-4': '#bf5af2',
    '--theme-chart-line-width': '2.5',
    '--theme-chart-dot-radius': '3.5',

    '--theme-modal-overlay': 'rgba(0, 0, 0, 0.60)',
    '--theme-btn-secondary-bg': '#2c2c2e',
    '--theme-btn-secondary-border': '#0a84ff',
    '--theme-btn-secondary-text': '#5ac8fa',
    '--theme-btn-style': '12rpx',

    '--theme-tab-shadow-inset': 'rgba(10, 132, 255, 0.20)',
    '--theme-tab-border': 'rgba(255, 255, 255, 0.10)',
    '--theme-tab-bg': 'rgba(28, 28, 30, 0.88)',
    '--theme-tab-shadow': 'rgba(0, 0, 0, 0.55)',

    '--theme-summary-chip-bg': 'rgba(10, 132, 255, 0.18)',
    '--theme-summary-chip-text': '#5ac8fa',
    '--theme-value-badge-bg': 'transparent',
    '--theme-value-badge-text': '#5ac8fa',
    '--theme-value-badge-unit': '#a1a1a6',
    '--theme-empty-border': 'rgba(255, 255, 255, 0.15)',
    '--theme-category-tabs-bg': '#2c2c2e',
    '--theme-category-tab-active-bg': '#3a3a3c',
    '--theme-category-tab-active-shadow': 'rgba(0, 0, 0, 0.40)',
    '--theme-quick-chip-border': 'rgba(255, 255, 255, 0.10)',
    '--theme-menu-accent-bg': 'rgba(10, 132, 255, 0.10)'
  }
}

// ---------------------------------------------------------------------------
// 暖色 — Apple Warm Light (True Tone)
// 暖 cream surface + graphite 文字，accent 仍为 system-blue（保持品牌）
// ---------------------------------------------------------------------------
const AMBER = {
  id: 'amber',
  name: '暖色',
  description: 'Apple 暖屏色感：cream 背景，graphite 文字，system-blue 强调，舒适不刺眼',
  layoutPreset: 'organic',
  surfacePreset: 'soft',
  tabPreset: 'natural',
  chartPreset: 'earth',
  backgroundImage: 'none',
  heroPattern: 'warm-gradient',
  cssVars: {
    '--theme-accent': '#0071e3',
    '--theme-accent-light': '#f0e6d2',
    '--theme-accent-dark': '#0058b0',
    '--theme-accent-contrast': '#ffffff',
    '--theme-accent-tint-16': 'rgba(0, 113, 227, 0.14)',
    '--theme-danger-contrast': '#ffffff',

    '--theme-bg': '#fbf7ee',
    '--theme-bg-image': 'none',
    '--theme-bg-image-opacity': '0',
    '--theme-bg-gradient-start': '#fbf7ee',
    '--theme-bg-gradient-end': '#f5efe0',
    '--theme-bg-gradient-settings-start': '#f5efe0',
    '--theme-bg-gradient-settings-end': '#fbf7ee',

    '--theme-surface': '#fffdf6',
    '--theme-surface-alt': '#f7f0de',
    '--theme-surface-alt-2': '#efe5cc',
    '--theme-surface-hover': '#fdf3df',
    '--theme-surface-border': 'rgba(150, 110, 50, 0.12)',
    '--theme-surface-border-light': 'rgba(150, 110, 50, 0.06)',
    '--theme-surface-border-accent': 'rgba(0, 113, 227, 0.20)',

    '--theme-text-primary': '#2c2c2e',
    '--theme-text-secondary': '#7a6f5d',
    '--theme-text-tertiary': '#a89878',
    '--theme-text-heading': '#1a1a1c',

    '--theme-hero-bg-start': '#3a3022',
    '--theme-hero-bg-end': '#1f1810',
    '--theme-hero-border': 'rgba(255, 245, 220, 0.18)',
    '--theme-hero-text': '#fffaf0',
    '--theme-hero-text-muted': 'rgba(255, 245, 220, 0.65)',
    '--theme-hero-btn-bg': 'rgba(255, 250, 240, 0.10)',
    '--theme-hero-btn-border': 'rgba(255, 245, 220, 0.22)',
    '--theme-hero-overlay': 'none',

    '--theme-input-bg': '#fffdf6',
    '--theme-input-border': '#e0d4b8',
    '--theme-input-border-focus': '#0071e3',
    '--theme-input-style': '12rpx',

    '--theme-divider': '#ebe3d3',
    '--theme-divider-light': '#f0e8d8',

    '--theme-shadow-sm': 'rgba(80, 50, 20, 0.05)',
    '--theme-shadow-md': 'rgba(80, 50, 20, 0.08)',
    '--theme-shadow-lg': 'rgba(60, 35, 10, 0.12)',
    '--theme-shadow-accent': 'rgba(0, 113, 227, 0.18)',

    '--theme-danger': '#d70015',
    '--theme-danger-bg': '#fff0f0',
    '--theme-danger-border': '#d70015',
    '--theme-success': '#34c759',
    '--theme-warning': '#ff9f0a',

    '--theme-radius-sm': '12rpx',
    '--theme-radius-md': '18rpx',
    '--theme-radius-lg': '24rpx',
    '--theme-radius-pill': '999rpx',
    '--theme-radius-input': '14rpx',

    '--theme-card-border-width': '0.5px',
    '--theme-card-border-style': 'solid',
    '--theme-card-bg-opacity': '1',

    '--theme-layout-gap': '18rpx',
    '--theme-layout-section-gap': '28rpx',

    '--theme-tab-active-bg': '#0071e3',
    '--theme-tab-active-text': '#ffffff',
    '--theme-tab-text': '#7a6f5d',
    '--theme-tab-height': '96rpx',
    '--theme-tab-border-radius': '26rpx',
    '--theme-tab-wrapper-bg': 'rgba(255, 253, 246, 0.78)',
    '--theme-tab-wrapper-border': 'rgba(150, 110, 50, 0.12)',
    '--theme-tab-wrapper-shadow': '0 12rpx 32rpx rgba(80, 50, 20, 0.12)',
    '--theme-tab-wrapper-padding': '6rpx',

    '--theme-metric-fill-end': '#0071e3',
    '--theme-card-accent-bg-start': '#fffdf6',
    '--theme-card-accent-bg-end': '#f7f0de',
    '--theme-card-accent-shadow': 'rgba(150, 110, 50, 0.10)',
    '--theme-card-accent-border': 'rgba(0, 113, 227, 0.20)',
    '--theme-badge-bg': '#f0e6d2',
    '--theme-badge-text': '#0058b0',

    '--theme-chart-bg': '#fffdf6',
    '--theme-chart-grid': '#ebe3d3',
    '--theme-chart-color-0': '#0071e3',
    '--theme-chart-color-1': '#34c759',
    '--theme-chart-color-2': '#ff9f0a',
    '--theme-chart-color-3': '#d70015',
    '--theme-chart-color-4': '#af52de',
    '--theme-chart-line-width': '2.5',
    '--theme-chart-dot-radius': '3.5',

    '--theme-modal-overlay': 'rgba(40, 25, 10, 0.40)',
    '--theme-btn-secondary-bg': '#fffdf6',
    '--theme-btn-secondary-border': '#0071e3',
    '--theme-btn-secondary-text': '#0058b0',
    '--theme-btn-style': '14rpx',

    '--theme-tab-shadow-inset': 'rgba(0, 113, 227, 0.14)',
    '--theme-tab-border': 'rgba(150, 110, 50, 0.12)',
    '--theme-tab-bg': 'rgba(255, 253, 246, 0.96)',
    '--theme-tab-shadow': 'rgba(80, 50, 20, 0.10)',

    '--theme-summary-chip-bg': '#f0e6d2',
    '--theme-summary-chip-text': '#0058b0',
    '--theme-value-badge-bg': 'transparent',
    '--theme-value-badge-text': '#0071e3',
    '--theme-value-badge-unit': '#7a6f5d',
    '--theme-empty-border': '#e0d4b8',
    '--theme-category-tabs-bg': '#f0e6d2',
    '--theme-category-tab-active-bg': '#fffdf6',
    '--theme-category-tab-active-shadow': 'rgba(80, 50, 20, 0.06)',
    '--theme-quick-chip-border': '#ebe3d3',
    '--theme-menu-accent-bg': 'rgba(0, 113, 227, 0.06)'
  }
}

// ---------------------------------------------------------------------------
// 极简 — Pure Mono
// 单色灰阶 + 一抹 system-blue（GitHub Primer 风），高对比、克制、文档感
// ---------------------------------------------------------------------------
const STEEL = {
  id: 'steel',
  name: '极简',
  description: '单色灰阶 + system-blue 高对比，类 GitHub Primer 风，适合阅读密集场景',
  layoutPreset: 'dense',
  surfacePreset: 'crisp',
  tabPreset: 'corporate',
  chartPreset: 'precise',
  backgroundImage: 'none',
  heroPattern: 'navy-solid',
  cssVars: {
    '--theme-accent': '#0071e3',
    '--theme-accent-light': '#eef4fa',
    '--theme-accent-dark': '#0058b0',
    '--theme-accent-contrast': '#ffffff',
    '--theme-accent-tint-16': 'rgba(0, 113, 227, 0.14)',
    '--theme-danger-contrast': '#ffffff',

    '--theme-bg': '#f6f7f8',
    '--theme-bg-image': 'none',
    '--theme-bg-image-opacity': '0',
    '--theme-bg-gradient-start': '#f6f7f8',
    '--theme-bg-gradient-end': '#f6f7f8',
    '--theme-bg-gradient-settings-start': '#f6f7f8',
    '--theme-bg-gradient-settings-end': '#f6f7f8',

    '--theme-surface': '#ffffff',
    '--theme-surface-alt': '#f6f7f8',
    '--theme-surface-alt-2': '#eceef0',
    '--theme-surface-hover': '#eef4fa',
    '--theme-surface-border': 'rgba(31, 35, 40, 0.10)',
    '--theme-surface-border-light': 'rgba(31, 35, 40, 0.05)',
    '--theme-surface-border-accent': 'rgba(0, 113, 227, 0.20)',

    '--theme-text-primary': '#1f2328',
    '--theme-text-secondary': '#59636e',
    '--theme-text-tertiary': '#818b98',
    '--theme-text-heading': '#0d1117',

    '--theme-hero-bg-start': '#1f2328',
    '--theme-hero-bg-end': '#0d1117',
    '--theme-hero-border': 'rgba(255, 255, 255, 0.10)',
    '--theme-hero-text': '#ffffff',
    '--theme-hero-text-muted': 'rgba(230, 237, 243, 0.6)',
    '--theme-hero-btn-bg': 'rgba(255, 255, 255, 0.10)',
    '--theme-hero-btn-border': 'rgba(255, 255, 255, 0.20)',
    '--theme-hero-overlay': 'none',

    '--theme-input-bg': '#ffffff',
    '--theme-input-border': '#d0d7de',
    '--theme-input-border-focus': '#0071e3',
    '--theme-input-style': '6rpx',

    '--theme-divider': '#d0d7de',
    '--theme-divider-light': '#eaeef2',

    '--theme-shadow-sm': 'rgba(31, 35, 40, 0.04)',
    '--theme-shadow-md': 'rgba(31, 35, 40, 0.06)',
    '--theme-shadow-lg': 'rgba(31, 35, 40, 0.10)',
    '--theme-shadow-accent': 'rgba(0, 113, 227, 0.18)',

    '--theme-danger': '#cf222e',
    '--theme-danger-bg': '#ffebe9',
    '--theme-danger-border': '#cf222e',
    '--theme-success': '#1a7f37',
    '--theme-warning': '#9a6700',

    '--theme-radius-sm': '6rpx',
    '--theme-radius-md': '10rpx',
    '--theme-radius-lg': '14rpx',
    '--theme-radius-pill': '999rpx',
    '--theme-radius-input': '6rpx',

    '--theme-card-border-width': '1px',
    '--theme-card-border-style': 'solid',
    '--theme-card-bg-opacity': '1',

    '--theme-layout-gap': '12rpx',
    '--theme-layout-section-gap': '18rpx',

    '--theme-tab-active-bg': '#1f2328',
    '--theme-tab-active-text': '#ffffff',
    '--theme-tab-text': '#59636e',
    '--theme-tab-height': '92rpx',
    '--theme-tab-border-radius': '20rpx',
    '--theme-tab-wrapper-bg': 'rgba(255, 255, 255, 0.78)',
    '--theme-tab-wrapper-border': 'rgba(31, 35, 40, 0.10)',
    '--theme-tab-wrapper-shadow': '0 8rpx 24rpx rgba(31, 35, 40, 0.08)',
    '--theme-tab-wrapper-padding': '4rpx',

    '--theme-metric-fill-end': '#0071e3',
    '--theme-card-accent-bg-start': '#ffffff',
    '--theme-card-accent-bg-end': '#f6f7f8',
    '--theme-card-accent-shadow': 'rgba(31, 35, 40, 0.06)',
    '--theme-card-accent-border': 'rgba(0, 113, 227, 0.18)',
    '--theme-badge-bg': '#eef4fa',
    '--theme-badge-text': '#0058b0',

    '--theme-chart-bg': '#ffffff',
    '--theme-chart-grid': '#eaeef2',
    '--theme-chart-color-0': '#0071e3',
    '--theme-chart-color-1': '#1a7f37',
    '--theme-chart-color-2': '#9a6700',
    '--theme-chart-color-3': '#cf222e',
    '--theme-chart-color-4': '#8250df',
    '--theme-chart-line-width': '2',
    '--theme-chart-dot-radius': '3',

    '--theme-modal-overlay': 'rgba(13, 17, 23, 0.50)',
    '--theme-btn-secondary-bg': '#ffffff',
    '--theme-btn-secondary-border': '#d0d7de',
    '--theme-btn-secondary-text': '#1f2328',
    '--theme-btn-style': '6rpx',

    '--theme-tab-shadow-inset': 'rgba(31, 35, 40, 0.08)',
    '--theme-tab-border': 'rgba(31, 35, 40, 0.08)',
    '--theme-tab-bg': 'rgba(255, 255, 255, 0.96)',
    '--theme-tab-shadow': 'rgba(31, 35, 40, 0.08)',

    '--theme-summary-chip-bg': '#eef4fa',
    '--theme-summary-chip-text': '#0058b0',
    '--theme-value-badge-bg': 'transparent',
    '--theme-value-badge-text': '#0071e3',
    '--theme-value-badge-unit': '#59636e',
    '--theme-empty-border': '#d0d7de',
    '--theme-category-tabs-bg': '#eceef0',
    '--theme-category-tab-active-bg': '#ffffff',
    '--theme-category-tab-active-shadow': 'rgba(31, 35, 40, 0.06)',
    '--theme-quick-chip-border': '#d0d7de',
    '--theme-menu-accent-bg': 'rgba(0, 113, 227, 0.06)'
  }
}

// ---------------------------------------------------------------------------
// Public API（保持不变 —— 加载逻辑 / rpx→px 转换 / resize 监听）
// ---------------------------------------------------------------------------

export const THEME_LIST = [TEAL, NIGHT, AMBER, STEEL]

export const DEFAULT_THEME_ID = 'teal'

/** Look up a theme by its id. Returns the teal default if not found. */
export function getThemeById(id) {
  return THEME_LIST.find((t) => t.id === id) || THEME_LIST[0]
}

function getThemeTargets() {
  if (typeof document === 'undefined' || !document.documentElement) return []

  const targets = new Set([document.documentElement])
  if (document.body) targets.add(document.body)

  const selectors = ['#app', 'uni-app', 'uni-page', 'uni-page-wrapper', 'uni-page-body', '.page']
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => targets.add(element))
  })

  return Array.from(targets)
}

// ---------------------------------------------------------------------------
// rpx → px conversion for CSS variables
// ---------------------------------------------------------------------------
// uni-app 的 `rpx` 是运行时单位（750rpx = 屏幕宽度）。Vue 编译器能把静态
// CSS 里的 rpx 转成 rem，但无法在运行时检查 CSS 自定义属性值。所以
// `height: var(--theme-tab-height)` 会解析为 `height: 96rpx`，浏览器会静默
// 拒绝这条规则，元素塌缩到内容高度。这就是为什么切主题后 tab 栏会缩成扁平
// 矩形，只有在切回 tab 时页面重建才「恢复」。
//
// 修复方法：写入 DOM 前把 cssVars 里所有 rpx 翻译成 px，并监听 resize 重算。
const RPX_RE = /(-?\d+(?:\.\d+)?)rpx\b/gi

function viewportRpxRatio() {
  if (typeof window === 'undefined' || !window.innerWidth) return 0
  return window.innerWidth / 750
}

function convertRpxInValue(value) {
  if (typeof value !== 'string' || value.indexOf('rpx') === -1) return value
  const ratio = viewportRpxRatio()
  if (!ratio) return value
  return value.replace(RPX_RE, (_, num) => `${parseFloat(num) * ratio}px`)
}

function convertVars(vars) {
  if (!vars) return vars
  const out = {}
  for (const [k, v] of Object.entries(vars)) {
    out[k] = convertRpxInValue(v)
  }
  return out
}

let lastAppliedThemeId = null
let resizeBound = false

function bindResizeAutoApply() {
  if (resizeBound) return
  if (typeof window === 'undefined') return
  resizeBound = true
  let raf = 0
  window.addEventListener('resize', () => {
    if (!lastAppliedThemeId) return
    if (raf) cancelAnimationFrame(raf)
    raf = window.requestAnimationFrame(() => writeThemeToTargets(getThemeById(lastAppliedThemeId)))
  })
}

function writeThemeToTargets(theme) {
  const layout = theme.layoutPreset || 'compact'
  const vars = convertVars(theme.cssVars) || {}

  getThemeTargets().forEach((element) => {
    element.setAttribute('data-theme', theme.id)
    element.setAttribute('data-theme-layout', layout)

    Object.entries(vars).forEach(([prop, value]) => {
      element.style.setProperty(prop, value)
    })
  })
}

/**
 * Apply a theme to all H5 DOM containers created by uni-app.
 * uni-page-body can receive default variables from compiled global CSS, so
 * writing the full variable set to each runtime container keeps inheritance
 * consistent after navigation and immediate theme switching.
 */
export function applyThemeToDOM(themeId) {
  if (typeof document === 'undefined' || !document.documentElement) return

  const theme = getThemeById(themeId)
  lastAppliedThemeId = themeId
  const apply = () => writeThemeToTargets(theme)

  apply()
  bindResizeAutoApply()

  if (typeof window !== 'undefined') {
    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(apply)
    }
    ;[0, 80, 240].forEach((delay) => window.setTimeout(apply, delay))
  }
}
