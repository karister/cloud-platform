<script>
import { getConfig } from './utils/storage'
import { getThemeById, applyThemeToDOM, DEFAULT_THEME_ID } from './utils/themes'
import { dataStore } from './stores/dataStore'

export default {
  globalData: {
    themeId: DEFAULT_THEME_ID
  },
  onLaunch() {
    console.log('Cloud platform communication app launched')
    this.applyTheme()
    // 应用启动即开始 3s 轮询拉取最新云平台值，任何页面打开时都有数据
    dataStore.start()
  },
  onShow() {
    this.applyTheme()
    // 从后台回到前台时恢复轮询（onHide 期间已停止）
    dataStore.start()
  },
  onHide() {
    // 切到后台时停止轮询，节省流量与电量
    dataStore.stop()
  },
  methods: {
    applyTheme() {
      try {
        const config = getConfig()
        const themeId = config.themeId || DEFAULT_THEME_ID
        this.globalData.themeId = themeId
        applyThemeToDOM(themeId)
      } catch (e) {
        console.warn('Failed to apply theme', e)
      }
    },
    setTheme(themeId) {
      this.globalData.themeId = themeId
      applyThemeToDOM(themeId)
    }
  }
}
</script>

<style>
/* ===================================================================
   Theme System v2 - Complete Visual Schemes
   data-theme="id"         -> colors, backgrounds, shadows
   data-theme-layout="id"  -> structural CSS (radii, spacing, tab shape)
   =================================================================== */

/* ── DEFAULT: Apple Standard Light ── */
:root {
  /* Accent — Apple systemBlue, single source of color identity */
  --theme-accent: #0071e3;
  --theme-accent-light: #e8f1fd;
  --theme-accent-dark: #0058b0;
  --theme-accent-contrast: #ffffff;
  --theme-accent-tint-16: rgba(0, 113, 227, 0.16);
  --theme-danger-contrast: #ffffff;
  /* Background — Apple systemGroupedBackground */
  --theme-bg: #f5f5f7;
  --theme-bg-image: none;
  --theme-bg-image-opacity: 0;
  --theme-bg-gradient-start: #fbfbfd;
  --theme-bg-gradient-end: #f5f5f7;
  --theme-bg-gradient-settings-start: #f5f5f7;
  --theme-bg-gradient-settings-end: #f5f5f7;
  /* Surface — pure white with hairline border */
  --theme-surface: #ffffff;
  --theme-surface-alt: #f5f5f7;
  --theme-surface-alt-2: #f0f0f3;
  --theme-surface-hover: #f0f6ff;
  --theme-surface-border: rgba(0, 0, 0, 0.08);
  --theme-surface-border-light: rgba(0, 0, 0, 0.04);
  --theme-surface-border-accent: rgba(0, 113, 227, 0.18);
  /* Text — Apple label / secondaryLabel / tertiaryLabel */
  --theme-text-primary: #1d1d1f;
  --theme-text-secondary: #6e6e73;
  --theme-text-tertiary: #86868b;
  --theme-text-heading: #000000;
  /* Hero — deep contrast block (only saturated area on light theme) */
  --theme-hero-bg-start: #1d1d1f;
  --theme-hero-bg-end: #000000;
  --theme-hero-border: rgba(255, 255, 255, 0.10);
  --theme-hero-text: #ffffff;
  --theme-hero-text-muted: rgba(235, 235, 245, 0.6);
  --theme-hero-btn-bg: rgba(255, 255, 255, 0.10);
  --theme-hero-btn-border: rgba(255, 255, 255, 0.20);
  --theme-hero-overlay: none;
  /* Inputs */
  --theme-input-bg: #ffffff;
  --theme-input-border: #d2d2d7;
  --theme-input-border-focus: #0071e3;
  --theme-input-style: 12rpx;
  /* Dividers — Apple separator */
  --theme-divider: #e5e5ea;
  --theme-divider-light: #f0f0f3;
  /* Shadows — rgba(0,0,0,x) only, never pure black */
  --theme-shadow-sm: rgba(0, 0, 0, 0.04);
  --theme-shadow-md: rgba(0, 0, 0, 0.06);
  --theme-shadow-lg: rgba(0, 0, 0, 0.10);
  --theme-shadow-accent: rgba(0, 113, 227, 0.18);
  /* Semantic — Apple systemRed / systemGreen / systemOrange */
  --theme-danger: #ff3b30;
  --theme-danger-bg: #fff5f4;
  --theme-danger-border: #ff3b30;
  --theme-success: #34c759;
  --theme-warning: #ff9f0a;
  /* Radii */
  --theme-radius-sm: 10rpx;
  --theme-radius-md: 16rpx;
  --theme-radius-lg: 22rpx;
  --theme-radius-pill: 999rpx;
  --theme-radius-input: 12rpx;
  /* Card morphology */
  --theme-card-border-width: 0.5px;
  --theme-card-border-style: solid;
  --theme-card-bg-opacity: 1;
  /* Layout */
  --theme-layout-gap: 16rpx;
  --theme-layout-section-gap: 24rpx;
  /* Tab bar — pill wrapper + filled active state */
  --theme-tab-active-bg: #0071e3;
  --theme-tab-active-text: #ffffff;
  --theme-tab-height: 96rpx;
  --theme-tab-border-radius: 26rpx;
  --theme-tab-wrapper-bg: rgba(255, 255, 255, 0.72);
  --theme-tab-wrapper-border: rgba(0, 0, 0, 0.08);
  --theme-tab-wrapper-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.10);
  --theme-tab-wrapper-padding: 6rpx;
  --theme-tab-text: #6e6e73;
  --theme-tab-shadow-inset: rgba(0, 113, 227, 0.16);
  --theme-tab-border: rgba(0, 0, 0, 0.06);
  --theme-tab-bg: rgba(255, 255, 255, 0.96);
  --theme-tab-shadow: rgba(0, 0, 0, 0.10);
  /* Misc */
  --theme-metric-fill-end: #0071e3;
  --theme-card-accent-bg-start: #ffffff;
  --theme-card-accent-bg-end: #f0f6ff;
  --theme-card-accent-shadow: rgba(0, 113, 227, 0.10);
  --theme-card-accent-border: rgba(0, 113, 227, 0.20);
  --theme-badge-bg: #e8f1fd;
  --theme-badge-text: #0058b0;
  /* Chart */
  --theme-chart-bg: #ffffff;
  --theme-chart-grid: #f0f0f3;
  --theme-chart-color-0: #0071e3;
  --theme-chart-color-1: #34c759;
  --theme-chart-color-2: #ff9f0a;
  --theme-chart-color-3: #ff3b30;
  --theme-chart-color-4: #af52de;
  --theme-chart-line-width: 2.5;
  --theme-chart-dot-radius: 3.5;
  /* Modal */
  --theme-modal-overlay: rgba(0, 0, 0, 0.40);
  --theme-btn-secondary-bg: #ffffff;
  --theme-btn-secondary-border: #0071e3;
  --theme-btn-secondary-text: #0071e3;
  --theme-btn-style: 12rpx;
  /* Settings */
  --theme-summary-chip-bg: #e8f1fd;
  --theme-summary-chip-text: #0058b0;
  --theme-value-badge-bg: transparent;
  --theme-value-badge-text: #0071e3;
  --theme-value-badge-unit: #86868b;
  --theme-empty-border: #d2d2d7;
  --theme-category-tabs-bg: #f0f0f3;
  --theme-category-tab-active-bg: #ffffff;
  --theme-category-tab-active-shadow: rgba(0, 0, 0, 0.08);
  --theme-quick-chip-border: #e5e5ea;
  --theme-menu-accent-bg: rgba(0, 113, 227, 0.06);
}

/* ── NIGHT (Apple Dark Mode · Graphite) ── */
[data-theme="night"] {
  --theme-accent: #0a84ff;
  --theme-accent-light: rgba(10, 132, 255, 0.18);
  --theme-accent-dark: #5ac8fa;
  --theme-accent-contrast: #ffffff;
  --theme-accent-tint-16: rgba(10, 132, 255, 0.20);
  --theme-danger-contrast: #ffffff;
  --theme-bg: #000000;
  --theme-bg-image: none;
  --theme-bg-image-opacity: 0;
  --theme-bg-gradient-start: #1c1c1e;
  --theme-bg-gradient-end: #000000;
  --theme-bg-gradient-settings-start: #1c1c1e;
  --theme-bg-gradient-settings-end: #000000;
  --theme-surface: #1c1c1e;
  --theme-surface-alt: #2c2c2e;
  --theme-surface-alt-2: #3a3a3c;
  --theme-surface-hover: rgba(10, 132, 255, 0.12);
  --theme-surface-border: rgba(255, 255, 255, 0.10);
  --theme-surface-border-light: rgba(255, 255, 255, 0.06);
  --theme-surface-border-accent: rgba(10, 132, 255, 0.30);
  --theme-text-primary: #f5f5f7;
  --theme-text-secondary: #a1a1a6;
  --theme-text-tertiary: #6e6e73;
  --theme-text-heading: #ffffff;
  --theme-hero-bg-start: #1c1c1e;
  --theme-hero-bg-end: #2c2c2e;
  --theme-hero-border: rgba(255, 255, 255, 0.10);
  --theme-hero-text: #ffffff;
  --theme-hero-text-muted: rgba(235, 235, 245, 0.6);
  --theme-hero-btn-bg: rgba(255, 255, 255, 0.10);
  --theme-hero-btn-border: rgba(255, 255, 255, 0.20);
  --theme-hero-overlay: none;
  --theme-input-bg: #1c1c1e;
  --theme-input-border: rgba(255, 255, 255, 0.15);
  --theme-input-border-focus: #0a84ff;
  --theme-input-style: 12rpx;
  --theme-divider: rgba(255, 255, 255, 0.10);
  --theme-divider-light: rgba(255, 255, 255, 0.06);
  --theme-shadow-sm: rgba(0, 0, 0, 0.30);
  --theme-shadow-md: rgba(0, 0, 0, 0.40);
  --theme-shadow-lg: rgba(0, 0, 0, 0.55);
  --theme-shadow-accent: rgba(10, 132, 255, 0.30);
  --theme-danger: #ff453a;
  --theme-danger-bg: rgba(255, 69, 58, 0.15);
  --theme-danger-border: #ff453a;
  --theme-success: #30d158;
  --theme-warning: #ff9f0a;
  --theme-radius-sm: 10rpx;
  --theme-radius-md: 16rpx;
  --theme-radius-lg: 22rpx;
  --theme-radius-pill: 999rpx;
  --theme-radius-input: 12rpx;
  --theme-card-border-width: 0.5px;
  --theme-card-border-style: solid;
  --theme-card-bg-opacity: 1;
  --theme-layout-gap: 16rpx;
  --theme-layout-section-gap: 24rpx;
  --theme-tab-active-bg: #0a84ff;
  --theme-tab-active-text: #ffffff;
  --theme-tab-height: 96rpx;
  --theme-tab-border-radius: 26rpx;
  --theme-tab-wrapper-bg: rgba(28, 28, 30, 0.72);
  --theme-tab-wrapper-border: rgba(255, 255, 255, 0.10);
  --theme-tab-wrapper-shadow: 0 12rpx 32rpx rgba(0, 0, 0, 0.55);
  --theme-tab-wrapper-padding: 6rpx;
  --theme-tab-text: #a1a1a6;
  --theme-tab-shadow-inset: rgba(10, 132, 255, 0.20);
  --theme-tab-border: rgba(255, 255, 255, 0.10);
  --theme-tab-bg: rgba(28, 28, 30, 0.88);
  --theme-tab-shadow: rgba(0, 0, 0, 0.55);
  --theme-metric-fill-end: #0a84ff;
  --theme-card-accent-bg-start: #2c2c2e;
  --theme-card-accent-bg-end: #1c1c1e;
  --theme-card-accent-shadow: rgba(0, 0, 0, 0.40);
  --theme-card-accent-border: rgba(10, 132, 255, 0.28);
  --theme-badge-bg: rgba(10, 132, 255, 0.18);
  --theme-badge-text: #5ac8fa;
  --theme-chart-bg: #1c1c1e;
  --theme-chart-grid: rgba(255, 255, 255, 0.08);
  --theme-chart-color-0: #0a84ff;
  --theme-chart-color-1: #30d158;
  --theme-chart-color-2: #ff9f0a;
  --theme-chart-color-3: #ff453a;
  --theme-chart-color-4: #bf5af2;
  --theme-chart-line-width: 2.5;
  --theme-chart-dot-radius: 3.5;
  --theme-modal-overlay: rgba(0, 0, 0, 0.60);
  --theme-btn-secondary-bg: #2c2c2e;
  --theme-btn-secondary-border: #0a84ff;
  --theme-btn-secondary-text: #5ac8fa;
  --theme-btn-style: 12rpx;
  --theme-summary-chip-bg: rgba(10, 132, 255, 0.18);
  --theme-summary-chip-text: #5ac8fa;
  --theme-value-badge-bg: transparent;
  --theme-value-badge-text: #5ac8fa;
  --theme-value-badge-unit: #a1a1a6;
  --theme-empty-border: rgba(255, 255, 255, 0.15);
  --theme-category-tabs-bg: #2c2c2e;
  --theme-category-tab-active-bg: #3a3a3c;
  --theme-category-tab-active-shadow: rgba(0, 0, 0, 0.40);
  --theme-quick-chip-border: rgba(255, 255, 255, 0.10);
  --theme-menu-accent-bg: rgba(10, 132, 255, 0.10);
}

/* ── AMBER (Apple Warm Light · True Tone) ── */
[data-theme="amber"] {
  --theme-accent: #0071e3;
  --theme-accent-light: #f0e6d2;
  --theme-accent-dark: #0058b0;
  --theme-accent-contrast: #ffffff;
  --theme-accent-tint-16: rgba(0, 113, 227, 0.14);
  --theme-danger-contrast: #ffffff;
  --theme-bg: #fbf7ee;
  --theme-bg-image: none;
  --theme-bg-image-opacity: 0;
  --theme-bg-gradient-start: #fbf7ee;
  --theme-bg-gradient-end: #f5efe0;
  --theme-bg-gradient-settings-start: #f5efe0;
  --theme-bg-gradient-settings-end: #fbf7ee;
  --theme-surface: #fffdf6;
  --theme-surface-alt: #f7f0de;
  --theme-surface-alt-2: #efe5cc;
  --theme-surface-hover: #fdf3df;
  --theme-surface-border: rgba(150, 110, 50, 0.12);
  --theme-surface-border-light: rgba(150, 110, 50, 0.06);
  --theme-surface-border-accent: rgba(0, 113, 227, 0.20);
  --theme-text-primary: #2c2c2e;
  --theme-text-secondary: #7a6f5d;
  --theme-text-tertiary: #a89878;
  --theme-text-heading: #1a1a1c;
  --theme-hero-bg-start: #3a3022;
  --theme-hero-bg-end: #1f1810;
  --theme-hero-border: rgba(255, 245, 220, 0.18);
  --theme-hero-text: #fffaf0;
  --theme-hero-text-muted: rgba(255, 245, 220, 0.65);
  --theme-hero-btn-bg: rgba(255, 250, 240, 0.10);
  --theme-hero-btn-border: rgba(255, 245, 220, 0.22);
  --theme-hero-overlay: none;
  --theme-input-bg: #fffdf6;
  --theme-input-border: #e0d4b8;
  --theme-input-border-focus: #0071e3;
  --theme-input-style: 12rpx;
  --theme-divider: #ebe3d3;
  --theme-divider-light: #f0e8d8;
  --theme-shadow-sm: rgba(80, 50, 20, 0.05);
  --theme-shadow-md: rgba(80, 50, 20, 0.08);
  --theme-shadow-lg: rgba(60, 35, 10, 0.12);
  --theme-shadow-accent: rgba(0, 113, 227, 0.18);
  --theme-danger: #d70015;
  --theme-danger-bg: #fff0f0;
  --theme-danger-border: #d70015;
  --theme-success: #34c759;
  --theme-warning: #ff9f0a;
  --theme-radius-sm: 12rpx;
  --theme-radius-md: 18rpx;
  --theme-radius-lg: 24rpx;
  --theme-radius-pill: 999rpx;
  --theme-radius-input: 14rpx;
  --theme-card-border-width: 0.5px;
  --theme-card-border-style: solid;
  --theme-card-bg-opacity: 1;
  --theme-layout-gap: 18rpx;
  --theme-layout-section-gap: 28rpx;
  --theme-tab-active-bg: #0071e3;
  --theme-tab-active-text: #ffffff;
  --theme-tab-height: 96rpx;
  --theme-tab-border-radius: 26rpx;
  --theme-tab-wrapper-bg: rgba(255, 253, 246, 0.78);
  --theme-tab-wrapper-border: rgba(150, 110, 50, 0.12);
  --theme-tab-wrapper-shadow: 0 12rpx 32rpx rgba(80, 50, 20, 0.12);
  --theme-tab-wrapper-padding: 6rpx;
  --theme-tab-text: #7a6f5d;
  --theme-tab-shadow-inset: rgba(0, 113, 227, 0.14);
  --theme-tab-border: rgba(150, 110, 50, 0.12);
  --theme-tab-bg: rgba(255, 253, 246, 0.96);
  --theme-tab-shadow: rgba(80, 50, 20, 0.10);
  --theme-metric-fill-end: #0071e3;
  --theme-card-accent-bg-start: #fffdf6;
  --theme-card-accent-bg-end: #f7f0de;
  --theme-card-accent-shadow: rgba(150, 110, 50, 0.10);
  --theme-card-accent-border: rgba(0, 113, 227, 0.20);
  --theme-badge-bg: #f0e6d2;
  --theme-badge-text: #0058b0;
  --theme-chart-bg: #fffdf6;
  --theme-chart-grid: #ebe3d3;
  --theme-chart-color-0: #0071e3;
  --theme-chart-color-1: #34c759;
  --theme-chart-color-2: #ff9f0a;
  --theme-chart-color-3: #d70015;
  --theme-chart-color-4: #af52de;
  --theme-chart-line-width: 2.5;
  --theme-chart-dot-radius: 3.5;
  --theme-modal-overlay: rgba(40, 25, 10, 0.40);
  --theme-btn-secondary-bg: #fffdf6;
  --theme-btn-secondary-border: #0071e3;
  --theme-btn-secondary-text: #0058b0;
  --theme-btn-style: 14rpx;
  --theme-summary-chip-bg: #f0e6d2;
  --theme-summary-chip-text: #0058b0;
  --theme-value-badge-bg: transparent;
  --theme-value-badge-text: #0071e3;
  --theme-value-badge-unit: #7a6f5d;
  --theme-empty-border: #e0d4b8;
  --theme-category-tabs-bg: #f0e6d2;
  --theme-category-tab-active-bg: #fffdf6;
  --theme-category-tab-active-shadow: rgba(80, 50, 20, 0.06);
  --theme-quick-chip-border: #ebe3d3;
  --theme-menu-accent-bg: rgba(0, 113, 227, 0.06);
}

/* ── STEEL (Pure Mono · GitHub Primer-like) ── */
[data-theme="steel"] {
  --theme-accent: #0071e3;
  --theme-accent-light: #eef4fa;
  --theme-accent-dark: #0058b0;
  --theme-accent-contrast: #ffffff;
  --theme-accent-tint-16: rgba(0, 113, 227, 0.14);
  --theme-danger-contrast: #ffffff;
  --theme-bg: #f6f7f8;
  --theme-bg-image: none;
  --theme-bg-image-opacity: 0;
  --theme-bg-gradient-start: #f6f7f8;
  --theme-bg-gradient-end: #f6f7f8;
  --theme-bg-gradient-settings-start: #f6f7f8;
  --theme-bg-gradient-settings-end: #f6f7f8;
  --theme-surface: #ffffff;
  --theme-surface-alt: #f6f7f8;
  --theme-surface-alt-2: #eceef0;
  --theme-surface-hover: #eef4fa;
  --theme-surface-border: rgba(31, 35, 40, 0.10);
  --theme-surface-border-light: rgba(31, 35, 40, 0.05);
  --theme-surface-border-accent: rgba(0, 113, 227, 0.20);
  --theme-text-primary: #1f2328;
  --theme-text-secondary: #59636e;
  --theme-text-tertiary: #818b98;
  --theme-text-heading: #0d1117;
  --theme-hero-bg-start: #1f2328;
  --theme-hero-bg-end: #0d1117;
  --theme-hero-border: rgba(255, 255, 255, 0.10);
  --theme-hero-text: #ffffff;
  --theme-hero-text-muted: rgba(230, 237, 243, 0.6);
  --theme-hero-btn-bg: rgba(255, 255, 255, 0.10);
  --theme-hero-btn-border: rgba(255, 255, 255, 0.20);
  --theme-hero-overlay: none;
  --theme-input-bg: #ffffff;
  --theme-input-border: #d0d7de;
  --theme-input-border-focus: #0071e3;
  --theme-input-style: 6rpx;
  --theme-divider: #d0d7de;
  --theme-divider-light: #eaeef2;
  --theme-shadow-sm: rgba(31, 35, 40, 0.04);
  --theme-shadow-md: rgba(31, 35, 40, 0.06);
  --theme-shadow-lg: rgba(31, 35, 40, 0.10);
  --theme-shadow-accent: rgba(0, 113, 227, 0.18);
  --theme-danger: #cf222e;
  --theme-danger-bg: #ffebe9;
  --theme-danger-border: #cf222e;
  --theme-success: #1a7f37;
  --theme-warning: #9a6700;
  --theme-radius-sm: 6rpx;
  --theme-radius-md: 10rpx;
  --theme-radius-lg: 14rpx;
  --theme-radius-pill: 999rpx;
  --theme-radius-input: 6rpx;
  --theme-card-border-width: 1px;
  --theme-card-border-style: solid;
  --theme-card-bg-opacity: 1;
  --theme-layout-gap: 12rpx;
  --theme-layout-section-gap: 18rpx;
  --theme-tab-active-bg: #1f2328;
  --theme-tab-active-text: #ffffff;
  --theme-tab-height: 92rpx;
  --theme-tab-border-radius: 20rpx;
  --theme-tab-wrapper-bg: rgba(255, 255, 255, 0.78);
  --theme-tab-wrapper-border: rgba(31, 35, 40, 0.10);
  --theme-tab-wrapper-shadow: 0 8rpx 24rpx rgba(31, 35, 40, 0.08);
  --theme-tab-wrapper-padding: 4rpx;
  --theme-tab-text: #59636e;
  --theme-tab-shadow-inset: rgba(31, 35, 40, 0.08);
  --theme-tab-border: rgba(31, 35, 40, 0.08);
  --theme-tab-bg: rgba(255, 255, 255, 0.96);
  --theme-tab-shadow: rgba(31, 35, 40, 0.08);
  --theme-metric-fill-end: #0071e3;
  --theme-card-accent-bg-start: #ffffff;
  --theme-card-accent-bg-end: #f6f7f8;
  --theme-card-accent-shadow: rgba(31, 35, 40, 0.06);
  --theme-card-accent-border: rgba(0, 113, 227, 0.18);
  --theme-badge-bg: #eef4fa;
  --theme-badge-text: #0058b0;
  --theme-chart-bg: #ffffff;
  --theme-chart-grid: #eaeef2;
  --theme-chart-color-0: #0071e3;
  --theme-chart-color-1: #1a7f37;
  --theme-chart-color-2: #9a6700;
  --theme-chart-color-3: #cf222e;
  --theme-chart-color-4: #8250df;
  --theme-chart-line-width: 2;
  --theme-chart-dot-radius: 3;
  --theme-modal-overlay: rgba(13, 17, 23, 0.50);
  --theme-btn-secondary-bg: #ffffff;
  --theme-btn-secondary-border: #d0d7de;
  --theme-btn-secondary-text: #1f2328;
  --theme-btn-style: 6rpx;
  --theme-summary-chip-bg: #eef4fa;
  --theme-summary-chip-text: #0058b0;
  --theme-value-badge-bg: transparent;
  --theme-value-badge-text: #0071e3;
  --theme-value-badge-unit: #59636e;
  --theme-empty-border: #d0d7de;
  --theme-category-tabs-bg: #eceef0;
  --theme-category-tab-active-bg: #ffffff;
  --theme-category-tab-active-shadow: rgba(31, 35, 40, 0.06);
  --theme-quick-chip-border: #d0d7de;
  --theme-menu-accent-bg: rgba(0, 113, 227, 0.06);
}

/* ===================================================================
   Layout Presets (structural CSS not covered by color vars)
   =================================================================== */

/* All themes share the same flat background now — bg-*.svg retired
   (files retained on disk for config round-trip compat). Each preset
   block is a no-op kept only so the [data-theme-layout] attribute
   still resolves without breaking consumers. */
[data-theme-layout="compact"] page,
[data-theme-layout="glass"] page,
[data-theme-layout="organic"] page,
[data-theme-layout="dense"] page {
  background-color: var(--theme-bg);
}

/* ── Base page styles ── */
page {
  min-height: 100%;
  background-color: var(--theme-bg);
  color: var(--theme-text-primary);
  /* Apple system font stack: SF Pro on Apple platforms, PingFang SC
     on Chinese-locale Apple devices, Helvetica Neue fallback, Segoe UI
     for Windows. Tabular numerals align numeric values in data tables. */
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "PingFang SC", "Helvetica Neue", "Segoe UI", sans-serif;
  font-size: 28rpx;
  line-height: 1.45;
  letter-spacing: -0.01em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
  color-scheme: light dark;
}

button::after {
  border: 0;
}

/* ── Button press feedback (all pages) ──
   Apple-style spring: scale down + fade, with cubic-bezier(0.32, 0.72, 0, 1)
   that mimics the iOS UIKit spring. Disabled buttons excluded. */
button {
  transition: transform 0.18s cubic-bezier(0.32, 0.72, 0, 1),
              opacity 0.18s ease,
              background-color 0.18s ease,
              color 0.18s ease;
}

button:not([disabled]):active {
  transform: scale(0.97);
  opacity: 0.72;
}

/* ── Apple utility classes (reusable across pages) ── */

/* Frosted glass surface — used on modals, overlays, the tab bar wrapper.
   Solid-fill fallback under prefers-reduced-transparency. */
.glass {
  background: rgba(255, 255, 255, 0.72);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}

[data-theme="night"] .glass {
  background: rgba(28, 28, 30, 0.72);
}

@media (prefers-reduced-transparency: reduce) {
  .glass {
    background: var(--theme-surface);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}

/* Apple-style card: white surface, hairline border, soft double shadow. */
.apple-card {
  background: var(--theme-surface);
  border-radius: var(--theme-radius-lg);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8rpx 24rpx var(--theme-shadow-sm);
  border: 0.5px solid var(--theme-surface-border);
}

/* Apple-style pill (solid button shape). */
.apple-pill {
  border-radius: 999rpx;
  padding: 12rpx 28rpx;
  background: var(--theme-accent);
  color: var(--theme-accent-contrast);
  font-weight: 500;
}

/* Tabular numerals — align decimal points in numeric values. */
.tabular-nums {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}

uni-tabbar {
  display: none !important;
}
</style>
