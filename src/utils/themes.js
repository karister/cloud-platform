/**
 * Theme System v2 - Complete Visual Schemes
 *
 * Each theme is a full visual identity covering:
 *   colors, background image, card morphology, tab bar style,
 *   chart appearance, button shape, layout density.
 *
 * Themes are applied via two HTML attributes:
 *   data-theme="id"        -> color CSS variables
 *   data-theme-layout="id" -> structural CSS (radii, borders, shadows, tab shape)
 */

// ---------------------------------------------------------------------------
// Teal - Industrial IoT Command Center
// ---------------------------------------------------------------------------
const TEAL = {
  id: 'teal',
  name: '工业互联指挥舱', // 工业互联指挥舱
  description: 'Dark teal hero, grid background, compact data cards, strong status indicators',
  layoutPreset: 'compact',
  surfacePreset: 'sharp',
  tabPreset: 'capsule',
  chartPreset: 'angular',
  backgroundImage: "url('/static/theme/bg-teal.svg')",
  heroPattern: 'solid-dark',
  cssVars: {
    // Accent
    '--theme-accent': '#0dc9b0',
    '--theme-accent-light': '#0a3035',
    '--theme-accent-dark': '#0ab898',
    '--theme-accent-contrast': '#ffffff',

    // Background
    '--theme-bg': '#0d2829',
    '--theme-bg-image': "url('/static/theme/bg-teal.svg')",
    '--theme-bg-image-opacity': '0.55',
    '--theme-bg-gradient-start': '#0e3032',
    '--theme-bg-gradient-end': '#0d2829',
    '--theme-bg-gradient-settings-start': '#0f3235',
    '--theme-bg-gradient-settings-end': '#0d2829',

    // Surface / Cards
    '--theme-surface': '#122f31',
    '--theme-surface-alt': '#16383a',
    '--theme-surface-alt-2': '#143436',
    '--theme-surface-hover': '#1a4042',
    '--theme-surface-border': 'rgba(13, 201, 176, 0.14)',
    '--theme-surface-border-light': 'rgba(13, 201, 176, 0.08)',
    '--theme-surface-border-accent': 'rgba(13, 201, 176, 0.25)',

    // Text
    '--theme-text-primary': '#d8ecea',
    '--theme-text-secondary': '#7aa8a4',
    '--theme-text-tertiary': '#5a8a85',
    '--theme-text-heading': '#e0f2f0',

    // Hero
    '--theme-hero-bg-start': '#0f3a3c',
    '--theme-hero-bg-end': '#0a2021',
    '--theme-hero-border': 'rgba(13, 201, 176, 0.2)',
    '--theme-hero-text': '#e0f2f0',
    '--theme-hero-text-muted': 'rgba(200, 230, 225, 0.7)',
    '--theme-hero-btn-bg': 'rgba(13, 201, 176, 0.12)',
    '--theme-hero-btn-border': 'rgba(13, 201, 176, 0.22)',
    '--theme-hero-overlay': 'none',

    // Inputs
    '--theme-input-bg': '#16383a',
    '--theme-input-border': '#1a4840',
    '--theme-input-border-focus': '#0dc9b0',
    '--theme-input-style': '10rpx',

    // Dividers
    '--theme-divider': '#16383a',
    '--theme-divider-light': '#1a4042',

    // Shadows
    '--theme-shadow-sm': 'rgba(0, 0, 0, 0.25)',
    '--theme-shadow-md': 'rgba(0, 0, 0, 0.35)',
    '--theme-shadow-lg': 'rgba(0, 0, 0, 0.5)',
    '--theme-shadow-accent': 'rgba(13, 201, 176, 0.18)',

    // Semantic
    '--theme-danger': '#f06070',
    '--theme-danger-bg': '#2a1820',
    '--theme-danger-border': '#f06070',
    '--theme-success': '#0dc9b0',
    '--theme-warning': '#e0b040',

    // Radii (compact: sharp)
    '--theme-radius-sm': '8rpx',
    '--theme-radius-md': '12rpx',
    '--theme-radius-lg': '16rpx',
    '--theme-radius-pill': '999rpx',
    '--theme-radius-input': '8rpx',

    // Card morphology
    '--theme-card-border-width': '1.5px',
    '--theme-card-border-style': 'solid',
    '--theme-card-bg-opacity': '1',

    // Layout
    '--theme-layout-gap': '14rpx',
    '--theme-layout-section-gap': '20rpx',

    // Tab bar
    '--theme-tab-active-bg': '#0a3035',
    '--theme-tab-height': '96rpx',
    '--theme-tab-border-radius': '28rpx',
    '--theme-tab-wrapper-bg': 'rgba(18, 47, 49, 0.96)',
    '--theme-tab-wrapper-border': 'rgba(13, 201, 176, 0.12)',
    '--theme-tab-wrapper-shadow': 'rgba(0, 0, 0, 0.35)',
    '--theme-tab-wrapper-padding': '8rpx',

    // Misc
    '--theme-metric-fill-end': '#0df0d0',
    '--theme-card-accent-bg-start': '#122f31',
    '--theme-card-accent-bg-end': '#163d3f',
    '--theme-card-accent-shadow': 'rgba(13, 201, 176, 0.13)',
    '--theme-card-accent-border': 'rgba(13, 201, 176, 0.28)',
    '--theme-badge-bg': '#0a3035',
    '--theme-badge-text': '#0dc9b0',

    // Chart
    '--theme-chart-bg': '#16383a',
    '--theme-chart-grid': '#1a4840',
    '--theme-chart-color-0': '#0dc9b0',
    '--theme-chart-color-1': '#0df0d0',
    '--theme-chart-color-2': '#e0b040',
    '--theme-chart-color-3': '#f06070',
    '--theme-chart-color-4': '#60a0f0',
    '--theme-chart-line-width': '3',
    '--theme-chart-dot-radius': '4.5',

    // Modal
    '--theme-modal-overlay': 'rgba(0, 0, 0, 0.6)',
    '--theme-btn-secondary-bg': '#16383a',
    '--theme-btn-secondary-border': '#0dc9b0',
    '--theme-btn-secondary-text': '#0dc9b0',
    '--theme-btn-style': '8rpx',

    // Tab text
    '--theme-tab-text': '#7aa8a4',
    '--theme-tab-active-text': '#0dc9b0',
    '--theme-tab-shadow-inset': 'rgba(13, 201, 176, 0.08)',
    '--theme-tab-border': 'rgba(13, 201, 176, 0.14)',
    '--theme-tab-bg': 'rgba(18, 47, 49, 0.96)',
    '--theme-tab-shadow': 'rgba(0, 0, 0, 0.4)',

    // Settings-specific
    '--theme-summary-chip-bg': '#0a3035',
    '--theme-summary-chip-text': '#0dc9b0',
    '--theme-value-badge-bg': '#16383a',
    '--theme-value-badge-text': '#0dc9b0',
    '--theme-value-badge-unit': '#7aa8a4',
    '--theme-empty-border': '#1a4042',
    '--theme-category-tabs-bg': '#16383a',
    '--theme-category-tab-active-bg': '#1a4042',
    '--theme-category-tab-active-shadow': 'rgba(0, 0, 0, 0.3)',
    '--theme-quick-chip-border': '#1a4840',
    '--theme-menu-accent-bg': 'rgba(13, 201, 176, 0.07)'
  }
}

// ---------------------------------------------------------------------------
// Night - Dark Tech Console
// ---------------------------------------------------------------------------
const NIGHT = {
  id: 'night',
  name: '暗色科技控制台', // 暗色科技控制台
  description: 'Deep dark backgrounds, neon highlights, frosted glass panels, horizontal modules',
  layoutPreset: 'glass',
  surfacePreset: 'frosted',
  tabPreset: 'glow',
  chartPreset: 'neon',
  backgroundImage: "url('/static/theme/bg-night.svg')",
  heroPattern: 'gradient-dark',
  cssVars: {
    // Accent
    '--theme-accent': '#7b9cff',
    '--theme-accent-light': '#1a2448',
    '--theme-accent-dark': '#6a8af0',
    '--theme-accent-contrast': '#ffffff',

    // Background
    '--theme-bg': '#060b14',
    '--theme-bg-image': "url('/static/theme/bg-night.svg')",
    '--theme-bg-image-opacity': '0.45',
    '--theme-bg-gradient-start': '#080e1a',
    '--theme-bg-gradient-end': '#060b14',
    '--theme-bg-gradient-settings-start': '#090f1c',
    '--theme-bg-gradient-settings-end': '#060b14',

    // Surface / Cards (frosted glass)
    '--theme-surface': 'rgba(18, 22, 40, 0.75)',
    '--theme-surface-alt': 'rgba(22, 28, 50, 0.7)',
    '--theme-surface-alt-2': 'rgba(20, 25, 45, 0.72)',
    '--theme-surface-hover': 'rgba(26, 34, 58, 0.8)',
    '--theme-surface-border': 'rgba(123, 156, 255, 0.12)',
    '--theme-surface-border-light': 'rgba(123, 156, 255, 0.06)',
    '--theme-surface-border-accent': 'rgba(123, 156, 255, 0.25)',

    // Text
    '--theme-text-primary': '#dce0f0',
    '--theme-text-secondary': '#8890b8',
    '--theme-text-tertiary': '#6670a0',
    '--theme-text-heading': '#e4eaf8',

    // Hero
    '--theme-hero-bg-start': '#0f1830',
    '--theme-hero-bg-end': '#080e1c',
    '--theme-hero-border': 'rgba(123, 156, 255, 0.18)',
    '--theme-hero-text': '#e4eaf8',
    '--theme-hero-text-muted': 'rgba(200, 210, 240, 0.65)',
    '--theme-hero-btn-bg': 'rgba(123, 156, 255, 0.1)',
    '--theme-hero-btn-border': 'rgba(123, 156, 255, 0.2)',
    '--theme-hero-overlay': 'none',

    // Inputs
    '--theme-input-bg': 'rgba(22, 28, 50, 0.7)',
    '--theme-input-border': '#1e2848',
    '--theme-input-border-focus': '#7b9cff',
    '--theme-input-style': '12rpx',

    // Dividers
    '--theme-divider': 'rgba(26, 34, 55, 0.6)',
    '--theme-divider-light': '#1a2240',

    // Shadows
    '--theme-shadow-sm': 'rgba(0, 0, 0, 0.3)',
    '--theme-shadow-md': 'rgba(0, 0, 0, 0.4)',
    '--theme-shadow-lg': 'rgba(0, 0, 0, 0.55)',
    '--theme-shadow-accent': 'rgba(123, 156, 255, 0.15)',

    // Semantic
    '--theme-danger': '#f06078',
    '--theme-danger-bg': '#2a1822',
    '--theme-danger-border': '#f06078',
    '--theme-success': '#5ef0b8',
    '--theme-warning': '#f0b868',

    // Radii (glass: medium)
    '--theme-radius-sm': '12rpx',
    '--theme-radius-md': '18rpx',
    '--theme-radius-lg': '22rpx',
    '--theme-radius-pill': '999rpx',
    '--theme-radius-input': '12rpx',

    // Card morphology
    '--theme-card-border-width': '1px',
    '--theme-card-border-style': 'solid',
    '--theme-card-bg-opacity': '0.75',

    // Layout
    '--theme-layout-gap': '18rpx',
    '--theme-layout-section-gap': '24rpx',

    // Tab bar
    '--theme-tab-active-bg': '#1a2448',
    '--theme-tab-height': '98rpx',
    '--theme-tab-border-radius': '26rpx',
    '--theme-tab-wrapper-bg': 'rgba(14, 18, 32, 0.92)',
    '--theme-tab-wrapper-border': 'rgba(123, 156, 255, 0.14)',
    '--theme-tab-wrapper-shadow': 'rgba(0, 0, 0, 0.5)',
    '--theme-tab-wrapper-padding': '10rpx',

    // Misc
    '--theme-metric-fill-end': '#9cb8ff',
    '--theme-card-accent-bg-start': 'rgba(18, 22, 40, 0.75)',
    '--theme-card-accent-bg-end': 'rgba(22, 30, 60, 0.8)',
    '--theme-card-accent-shadow': 'rgba(123, 156, 255, 0.1)',
    '--theme-card-accent-border': 'rgba(123, 156, 255, 0.28)',
    '--theme-badge-bg': '#1a2448',
    '--theme-badge-text': '#9cb8ff',

    // Chart
    '--theme-chart-bg': 'rgba(22, 28, 50, 0.7)',
    '--theme-chart-grid': '#1e2848',
    '--theme-chart-color-0': '#7b9cff',
    '--theme-chart-color-1': '#5ef0b8',
    '--theme-chart-color-2': '#f0b868',
    '--theme-chart-color-3': '#f06078',
    '--theme-chart-color-4': '#c084fc',
    '--theme-chart-line-width': '2.5',
    '--theme-chart-dot-radius': '4',

    // Modal
    '--theme-modal-overlay': 'rgba(0, 0, 0, 0.65)',
    '--theme-btn-secondary-bg': 'rgba(22, 28, 50, 0.7)',
    '--theme-btn-secondary-border': '#7b9cff',
    '--theme-btn-secondary-text': '#7b9cff',
    '--theme-btn-style': '12rpx',

    // Tab text
    '--theme-tab-text': '#8890b8',
    '--theme-tab-active-text': '#7b9cff',
    '--theme-tab-shadow-inset': 'rgba(123, 156, 255, 0.06)',
    '--theme-tab-border': 'rgba(123, 156, 255, 0.15)',
    '--theme-tab-bg': 'rgba(14, 18, 32, 0.92)',
    '--theme-tab-shadow': 'rgba(0, 0, 0, 0.5)',

    // Settings-specific
    '--theme-summary-chip-bg': '#1a2448',
    '--theme-summary-chip-text': '#9cb8ff',
    '--theme-value-badge-bg': 'rgba(22, 30, 60, 0.7)',
    '--theme-value-badge-text': '#7b9cff',
    '--theme-value-badge-unit': '#8890b8',
    '--theme-empty-border': '#1e2848',
    '--theme-category-tabs-bg': 'rgba(22, 28, 50, 0.6)',
    '--theme-category-tab-active-bg': '#1e2850',
    '--theme-category-tab-active-shadow': 'rgba(0, 0, 0, 0.35)',
    '--theme-quick-chip-border': '#1e2848',
    '--theme-menu-accent-bg': 'rgba(123, 156, 255, 0.06)'
  }
}

// ---------------------------------------------------------------------------
// Amber - Agricultural / Environmental Monitor
// ---------------------------------------------------------------------------
const AMBER = {
  id: 'amber',
  name: '农业环境监测', // 农业环境监测
  description: 'Warm cream background, green-amber accents, generous spacing, rounded organic cards',
  layoutPreset: 'organic',
  surfacePreset: 'soft',
  tabPreset: 'natural',
  chartPreset: 'earth',
  backgroundImage: "url('/static/theme/bg-amber.svg')",
  heroPattern: 'warm-gradient',
  cssVars: {
    // Accent
    '--theme-accent': '#c8782b',
    '--theme-accent-light': '#fdf2e6',
    '--theme-accent-dark': '#b06820',
    '--theme-accent-contrast': '#ffffff',

    // Background
    '--theme-bg': '#faf6f0',
    '--theme-bg-image': "url('/static/theme/bg-amber.svg')",
    '--theme-bg-image-opacity': '0.35',
    '--theme-bg-gradient-start': '#f7efe2',
    '--theme-bg-gradient-end': '#faf6f0',
    '--theme-bg-gradient-settings-start': '#f4ecdd',
    '--theme-bg-gradient-settings-end': '#faf6f0',

    // Surface / Cards
    '--theme-surface': '#fffdf8',
    '--theme-surface-alt': '#fdf9f2',
    '--theme-surface-alt-2': '#fcf6ed',
    '--theme-surface-hover': '#fef8ef',
    '--theme-surface-border': 'rgba(180, 140, 100, 0.18)',
    '--theme-surface-border-light': 'rgba(200, 120, 40, 0.07)',
    '--theme-surface-border-accent': 'rgba(200, 120, 40, 0.22)',

    // Text
    '--theme-text-primary': '#2d2218',
    '--theme-text-secondary': '#8c7458',
    '--theme-text-tertiary': '#a69078',
    '--theme-text-heading': '#3d2e20',

    // Hero
    '--theme-hero-bg-start': '#6b8c3a',
    '--theme-hero-bg-end': '#3d2a18',
    '--theme-hero-border': 'rgba(255, 255, 255, 0.18)',
    '--theme-hero-text': '#fffaf2',
    '--theme-hero-text-muted': 'rgba(255, 245, 230, 0.72)',
    '--theme-hero-btn-bg': 'rgba(255, 255, 255, 0.12)',
    '--theme-hero-btn-border': 'rgba(255, 255, 255, 0.18)',
    '--theme-hero-overlay': 'none',

    // Inputs
    '--theme-input-bg': '#fdf9f2',
    '--theme-input-border': '#e0d4c0',
    '--theme-input-border-focus': '#c8782b',
    '--theme-input-style': '16rpx',

    // Dividers
    '--theme-divider': '#f4ecdd',
    '--theme-divider-light': '#e8dcc8',

    // Shadows
    '--theme-shadow-sm': 'rgba(80, 50, 20, 0.06)',
    '--theme-shadow-md': 'rgba(80, 50, 20, 0.08)',
    '--theme-shadow-lg': 'rgba(60, 35, 10, 0.14)',
    '--theme-shadow-accent': 'rgba(200, 120, 40, 0.16)',

    // Semantic
    '--theme-danger': '#c04540',
    '--theme-danger-bg': '#fef5f4',
    '--theme-danger-border': '#c04540',
    '--theme-success': '#5da870',
    '--theme-warning': '#d9a040',

    // Radii (organic: soft rounded)
    '--theme-radius-sm': '16rpx',
    '--theme-radius-md': '24rpx',
    '--theme-radius-lg': '32rpx',
    '--theme-radius-pill': '999rpx',
    '--theme-radius-input': '16rpx',

    // Card morphology
    '--theme-card-border-width': '1px',
    '--theme-card-border-style': 'solid',
    '--theme-card-bg-opacity': '1',

    // Layout
    '--theme-layout-gap': '22rpx',
    '--theme-layout-section-gap': '28rpx',

    // Tab bar
    '--theme-tab-active-bg': '#fdf2e6',
    '--theme-tab-height': '100rpx',
    '--theme-tab-border-radius': '30rpx',
    '--theme-tab-wrapper-bg': 'rgba(255, 253, 248, 0.96)',
    '--theme-tab-wrapper-border': 'rgba(180, 140, 100, 0.16)',
    '--theme-tab-wrapper-shadow': 'rgba(60, 35, 10, 0.1)',
    '--theme-tab-wrapper-padding': '12rpx',

    // Misc
    '--theme-metric-fill-end': '#e8a858',
    '--theme-card-accent-bg-start': '#fffdf8',
    '--theme-card-accent-bg-end': '#fef6ed',
    '--theme-card-accent-shadow': 'rgba(200, 120, 40, 0.1)',
    '--theme-card-accent-border': 'rgba(200, 120, 40, 0.24)',
    '--theme-badge-bg': '#fdf2e6',
    '--theme-badge-text': '#c8782b',

    // Chart
    '--theme-chart-bg': '#fdf9f2',
    '--theme-chart-grid': '#e8dcc8',
    '--theme-chart-color-0': '#c8782b',
    '--theme-chart-color-1': '#5da870',
    '--theme-chart-color-2': '#4a90c4',
    '--theme-chart-color-3': '#c04540',
    '--theme-chart-color-4': '#8b5fc0',
    '--theme-chart-line-width': '3',
    '--theme-chart-dot-radius': '5',

    // Modal
    '--theme-modal-overlay': 'rgba(30, 20, 10, 0.45)',
    '--theme-btn-secondary-bg': '#fdf9f2',
    '--theme-btn-secondary-border': '#c8782b',
    '--theme-btn-secondary-text': '#c8782b',
    '--theme-btn-style': '16rpx',

    // Tab text
    '--theme-tab-text': '#8c7458',
    '--theme-tab-active-text': '#c8782b',
    '--theme-tab-shadow-inset': 'rgba(200, 120, 40, 0.05)',
    '--theme-tab-border': 'rgba(180, 140, 100, 0.16)',
    '--theme-tab-bg': 'rgba(255, 253, 248, 0.96)',
    '--theme-tab-shadow': 'rgba(60, 35, 10, 0.1)',

    // Settings-specific
    '--theme-summary-chip-bg': '#fdf2e6',
    '--theme-summary-chip-text': '#c8782b',
    '--theme-value-badge-bg': '#fdf6ed',
    '--theme-value-badge-text': '#c8782b',
    '--theme-value-badge-unit': '#8c7458',
    '--theme-empty-border': '#e0d4c0',
    '--theme-category-tabs-bg': '#f4ecdd',
    '--theme-category-tab-active-bg': '#fffdf8',
    '--theme-category-tab-active-shadow': 'rgba(80, 50, 20, 0.05)',
    '--theme-quick-chip-border': '#e0d4c0',
    '--theme-menu-accent-bg': 'rgba(200, 120, 40, 0.06)'
  }
}

// ---------------------------------------------------------------------------
// Steel - Enterprise Operations Briefing
// ---------------------------------------------------------------------------
const STEEL = {
  id: 'steel',
  name: '企业运维简报', // 企业运维简报
  description: 'White and navy, thin borders, high information density, sharp professional feel',
  layoutPreset: 'dense',
  surfacePreset: 'crisp',
  tabPreset: 'corporate',
  chartPreset: 'precise',
  backgroundImage: "url('/static/theme/bg-steel.svg')",
  heroPattern: 'navy-solid',
  cssVars: {
    // Accent
    '--theme-accent': '#2c5282',
    '--theme-accent-light': '#e8eff8',
    '--theme-accent-dark': '#1e3d64',
    '--theme-accent-contrast': '#ffffff',

    // Background
    '--theme-bg': '#f4f6f9',
    '--theme-bg-image': "url('/static/theme/bg-steel.svg')",
    '--theme-bg-image-opacity': '0.3',
    '--theme-bg-gradient-start': '#eaedf2',
    '--theme-bg-gradient-end': '#f4f6f9',
    '--theme-bg-gradient-settings-start': '#e8ecf2',
    '--theme-bg-gradient-settings-end': '#f4f6f9',

    // Surface / Cards
    '--theme-surface': '#ffffff',
    '--theme-surface-alt': '#f7f9fc',
    '--theme-surface-alt-2': '#f5f7fb',
    '--theme-surface-hover': '#f2f5fa',
    '--theme-surface-border': 'rgba(44, 60, 90, 0.1)',
    '--theme-surface-border-light': 'rgba(44, 82, 130, 0.05)',
    '--theme-surface-border-accent': 'rgba(44, 82, 130, 0.18)',

    // Text
    '--theme-text-primary': '#1a2332',
    '--theme-text-secondary': '#4a5a72',
    '--theme-text-tertiary': '#6b7a95',
    '--theme-text-heading': '#15202f',

    // Hero
    '--theme-hero-bg-start': '#1a3650',
    '--theme-hero-bg-end': '#0f2438',
    '--theme-hero-border': 'rgba(255, 255, 255, 0.15)',
    '--theme-hero-text': '#ffffff',
    '--theme-hero-text-muted': 'rgba(255, 255, 255, 0.65)',
    '--theme-hero-btn-bg': 'rgba(255, 255, 255, 0.1)',
    '--theme-hero-btn-border': 'rgba(255, 255, 255, 0.14)',
    '--theme-hero-overlay': 'none',

    // Inputs
    '--theme-input-bg': '#f7f9fc',
    '--theme-input-border': '#d0d6e0',
    '--theme-input-border-focus': '#2c5282',
    '--theme-input-style': '6rpx',

    // Dividers
    '--theme-divider': '#e8ecf2',
    '--theme-divider-light': '#dde3ed',

    // Shadows
    '--theme-shadow-sm': 'rgba(20, 30, 50, 0.04)',
    '--theme-shadow-md': 'rgba(20, 30, 50, 0.06)',
    '--theme-shadow-lg': 'rgba(15, 25, 45, 0.12)',
    '--theme-shadow-accent': 'rgba(44, 82, 130, 0.12)',

    // Semantic
    '--theme-danger': '#c43840',
    '--theme-danger-bg': '#fef5f6',
    '--theme-danger-border': '#c43840',
    '--theme-success': '#4a8a60',
    '--theme-warning': '#c88828',

    // Radii (dense: sharp)
    '--theme-radius-sm': '4rpx',
    '--theme-radius-md': '8rpx',
    '--theme-radius-lg': '12rpx',
    '--theme-radius-pill': '999rpx',
    '--theme-radius-input': '4rpx',

    // Card morphology
    '--theme-card-border-width': '1px',
    '--theme-card-border-style': 'solid',
    '--theme-card-bg-opacity': '1',

    // Layout
    '--theme-layout-gap': '10rpx',
    '--theme-layout-section-gap': '16rpx',

    // Tab bar
    '--theme-tab-active-bg': '#e8eff8',
    '--theme-tab-height': '88rpx',
    '--theme-tab-border-radius': '12rpx',
    '--theme-tab-wrapper-bg': '#ffffff',
    '--theme-tab-wrapper-border': 'rgba(44, 60, 90, 0.1)',
    '--theme-tab-wrapper-shadow': 'rgba(20, 30, 50, 0.08)',
    '--theme-tab-wrapper-padding': '4rpx',

    // Misc
    '--theme-metric-fill-end': '#5a8cc0',
    '--theme-card-accent-bg-start': '#ffffff',
    '--theme-card-accent-bg-end': '#f5f8fc',
    '--theme-card-accent-shadow': 'rgba(44, 82, 130, 0.08)',
    '--theme-card-accent-border': 'rgba(44, 82, 130, 0.2)',
    '--theme-badge-bg': '#e8eff8',
    '--theme-badge-text': '#2c5282',

    // Chart
    '--theme-chart-bg': '#f7f9fc',
    '--theme-chart-grid': '#dde4ef',
    '--theme-chart-color-0': '#2c5282',
    '--theme-chart-color-1': '#4a8a60',
    '--theme-chart-color-2': '#c88828',
    '--theme-chart-color-3': '#c43840',
    '--theme-chart-color-4': '#6c50b0',
    '--theme-chart-line-width': '2',
    '--theme-chart-dot-radius': '3.5',

    // Modal
    '--theme-modal-overlay': 'rgba(10, 18, 32, 0.4)',
    '--theme-btn-secondary-bg': '#f5f7fb',
    '--theme-btn-secondary-border': '#2c5282',
    '--theme-btn-secondary-text': '#2c5282',
    '--theme-btn-style': '4rpx',

    // Tab text
    '--theme-tab-text': '#4a5a72',
    '--theme-tab-active-text': '#2c5282',
    '--theme-tab-shadow-inset': 'rgba(44, 82, 130, 0.04)',
    '--theme-tab-border': 'rgba(44, 60, 90, 0.08)',
    '--theme-tab-bg': '#ffffff',
    '--theme-tab-shadow': 'rgba(20, 30, 50, 0.08)',

    // Settings-specific
    '--theme-summary-chip-bg': '#e8eff8',
    '--theme-summary-chip-text': '#2c5282',
    '--theme-value-badge-bg': '#f0f3f8',
    '--theme-value-badge-text': '#2c5282',
    '--theme-value-badge-unit': '#4a5a72',
    '--theme-empty-border': '#d0d6e0',
    '--theme-category-tabs-bg': '#e8ecf2',
    '--theme-category-tab-active-bg': '#ffffff',
    '--theme-category-tab-active-shadow': 'rgba(20, 30, 50, 0.04)',
    '--theme-quick-chip-border': '#d0d6e0',
    '--theme-menu-accent-bg': 'rgba(44, 82, 130, 0.04)'
  }
}

// ---------------------------------------------------------------------------
// Public API
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
// uni-app's `rpx` is a runtime unit (750rpx = screen width). The Vue compiler
// converts rpx → rem for static CSS, but it CAN'T inspect the value of a
// CSS custom property (--var-name) because that value is set at runtime.
// As a result, `height: var(--theme-tab-height)` resolves to `height: 96rpx`,
// which the browser silently rejects — the rule is dropped, and the element
// falls back to its content height. This is why the tab bar shrinks to a flat
// rectangle after a theme switch and only "recovers" when the surrounding
// page is rebuilt by a tab navigation.
//
// We fix it by translating every rpx in the CSS-var payload into a concrete
// `px` value before writing it to the DOM. We also re-apply on resize so
// the conversion tracks the actual viewport width.
const RPX_RE = /(-?\d+(?:\.\d+)?)rpx\b/gi

function viewportRpxRatio() {
  if (typeof window === 'undefined' || !window.innerWidth) return 0
  // uni-app defaults: 750rpx = full screen width
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

// Cache the last-applied theme id so resize can re-run the same write.
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
