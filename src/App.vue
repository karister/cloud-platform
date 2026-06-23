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

/* ── DEFAULT: Teal (Industrial IoT Command Center · Bright Edition) ── */
:root {
  /* Accent — electric teal, single source of color identity */
  --theme-accent: #0891a0;
  --theme-accent-light: #e0f4f6;
  --theme-accent-dark: #066976;
  --theme-accent-contrast: #ffffff;
  /* Background — light cool teal-tinted paper */
  --theme-bg: #eef3f5;
  --theme-bg-image: url('/static/theme/bg-teal.svg');
  --theme-bg-image-opacity: 0.5;
  --theme-bg-gradient-start: #e8f0f2;
  --theme-bg-gradient-end: #eef3f5;
  --theme-bg-gradient-settings-start: #e6eef0;
  --theme-bg-gradient-settings-end: #eef3f5;
  /* Surface — pure white with teal-tinted border */
  --theme-surface: #ffffff;
  --theme-surface-alt: #f6fafb;
  --theme-surface-alt-2: #eff6f7;
  --theme-surface-hover: #f0f7f8;
  --theme-surface-border: rgba(8, 145, 160, 0.14);
  --theme-surface-border-light: rgba(8, 145, 160, 0.07);
  --theme-surface-border-accent: rgba(8, 145, 160, 0.24);
  /* Text — deep teal-navy (off-black, not pure #000) */
  --theme-text-primary: #0e2530;
  --theme-text-secondary: #4a6573;
  --theme-text-tertiary: #7a9099;
  --theme-text-heading: #08182a;
  /* Hero — saturated teal gradient */
  --theme-hero-bg-start: #14b8a6;
  --theme-hero-bg-end: #0e7490;
  --theme-hero-border: rgba(8, 145, 160, 0.2);
  --theme-hero-text: #ffffff;
  --theme-hero-text-muted: rgba(255, 255, 255, 0.78);
  --theme-hero-btn-bg: rgba(255, 255, 255, 0.18);
  --theme-hero-btn-border: rgba(255, 255, 255, 0.32);
  --theme-hero-overlay: none;
  /* Inputs */
  --theme-input-bg: #ffffff;
  --theme-input-border: #d2dee2;
  --theme-input-border-focus: #0891a0;
  --theme-input-style: 10rpx;
  /* Dividers */
  --theme-divider: #e0e9ec;
  --theme-divider-light: #eaf1f3;
  /* Shadows — tinted to the cool teal hue, not pure black */
  --theme-shadow-sm: rgba(8, 60, 70, 0.06);
  --theme-shadow-md: rgba(8, 60, 70, 0.1);
  --theme-shadow-lg: rgba(8, 60, 70, 0.16);
  --theme-shadow-accent: rgba(8, 145, 160, 0.18);
  /* Semantic */
  --theme-danger: #e11d48;
  --theme-danger-bg: #fff1f3;
  --theme-danger-border: #e11d48;
  --theme-success: #0891a0;
  --theme-warning: #d97706;
  /* Radii (compact shape system) */
  --theme-radius-sm: 8rpx;
  --theme-radius-md: 12rpx;
  --theme-radius-lg: 16rpx;
  --theme-radius-pill: 999rpx;
  --theme-radius-input: 8rpx;
  /* Card morphology */
  --theme-card-border-width: 1px;
  --theme-card-border-style: solid;
  --theme-card-bg-opacity: 1;
  /* Layout */
  --theme-layout-gap: 14rpx;
  --theme-layout-section-gap: 20rpx;
  /* Tab bar */
  --theme-tab-active-bg: #ffffff;
  --theme-tab-height: 96rpx;
  --theme-tab-border-radius: 28rpx;
  --theme-tab-wrapper-bg: rgba(255, 255, 255, 0.96);
  --theme-tab-wrapper-border: rgba(8, 145, 160, 0.14);
  --theme-tab-wrapper-shadow: rgba(8, 60, 70, 0.1);
  --theme-tab-wrapper-padding: 8rpx;
  --theme-tab-text: #5a7682;
  --theme-tab-active-text: #0891a0;
  --theme-tab-shadow-inset: rgba(8, 145, 160, 0.06);
  --theme-tab-border: rgba(8, 145, 160, 0.14);
  --theme-tab-bg: rgba(255, 255, 255, 0.96);
  --theme-tab-shadow: rgba(8, 60, 70, 0.12);
  /* Misc */
  --theme-metric-fill-end: #14b8a6;
  --theme-card-accent-bg-start: #ffffff;
  --theme-card-accent-bg-end: #eaf6f7;
  --theme-card-accent-shadow: rgba(8, 145, 160, 0.1);
  --theme-card-accent-border: rgba(8, 145, 160, 0.22);
  --theme-badge-bg: #e0f4f6;
  --theme-badge-text: #066976;
  /* Chart */
  --theme-chart-bg: #ffffff;
  --theme-chart-grid: #d8e3e6;
  --theme-chart-color-0: #0891a0;
  --theme-chart-color-1: #14b8a6;
  --theme-chart-color-2: #d97706;
  --theme-chart-color-3: #e11d48;
  --theme-chart-color-4: #4f46e5;
  --theme-chart-line-width: 3;
  --theme-chart-dot-radius: 4.5;
  /* Modal */
  --theme-modal-overlay: rgba(8, 25, 35, 0.42);
  --theme-btn-secondary-bg: #ffffff;
  --theme-btn-secondary-border: #0891a0;
  --theme-btn-secondary-text: #0891a0;
  --theme-btn-style: 8rpx;
  /* Settings */
  --theme-summary-chip-bg: #e0f4f6;
  --theme-summary-chip-text: #066976;
  --theme-value-badge-bg: #f0f9fa;
  --theme-value-badge-text: #0891a0;
  --theme-value-badge-unit: #5a7682;
  --theme-empty-border: #d8e3e6;
  --theme-category-tabs-bg: #eaf1f3;
  --theme-category-tab-active-bg: #ffffff;
  --theme-category-tab-active-shadow: rgba(8, 60, 70, 0.06);
  --theme-quick-chip-border: #d8e3e6;
  --theme-menu-accent-bg: rgba(8, 145, 160, 0.06);
}

/* ── NIGHT (Tech Console · Bright Glass Edition · Royal Blue) ── */
[data-theme="night"] {
  --theme-accent: #2563eb;
  --theme-accent-light: #eff6ff;
  --theme-accent-dark: #1d4ed8;
  --theme-accent-contrast: #ffffff;
  --theme-bg: #f1f5f9;
  --theme-bg-image: url('/static/theme/bg-night.svg');
  --theme-bg-image-opacity: 0.4;
  --theme-bg-gradient-start: #e8edf6;
  --theme-bg-gradient-end: #f1f5f9;
  --theme-bg-gradient-settings-start: #e6ebf4;
  --theme-bg-gradient-settings-end: #f1f5f9;
  --theme-surface: rgba(255, 255, 255, 0.78);
  --theme-surface-alt: rgba(248, 250, 252, 0.82);
  --theme-surface-alt-2: rgba(241, 245, 249, 0.76);
  --theme-surface-hover: rgba(255, 255, 255, 0.9);
  --theme-surface-border: rgba(37, 99, 235, 0.16);
  --theme-surface-border-light: rgba(37, 99, 235, 0.08);
  --theme-surface-border-accent: rgba(37, 99, 235, 0.28);
  --theme-text-primary: #0f172a;
  --theme-text-secondary: #475569;
  --theme-text-tertiary: #64748b;
  --theme-text-heading: #020617;
  --theme-hero-bg-start: #ffffff;
  --theme-hero-bg-end: #dbeafe;
  --theme-hero-border: rgba(37, 99, 235, 0.18);
  --theme-hero-text: #0f172a;
  --theme-hero-text-muted: rgba(15, 23, 42, 0.62);
  --theme-hero-btn-bg: rgba(37, 99, 235, 0.08);
  --theme-hero-btn-border: rgba(37, 99, 235, 0.22);
  --theme-hero-overlay: radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.16), transparent 60%);
  --theme-input-bg: rgba(255, 255, 255, 0.8);
  --theme-input-border: rgba(37, 99, 235, 0.18);
  --theme-input-border-focus: #2563eb;
  --theme-input-style: 12rpx;
  --theme-divider: rgba(37, 99, 235, 0.1);
  --theme-divider-light: rgba(37, 99, 235, 0.05);
  --theme-shadow-sm: rgba(15, 23, 42, 0.05);
  --theme-shadow-md: rgba(15, 23, 42, 0.08);
  --theme-shadow-lg: rgba(15, 23, 42, 0.14);
  --theme-shadow-accent: rgba(37, 99, 235, 0.16);
  --theme-danger: #e11d48;
  --theme-danger-bg: #fff1f3;
  --theme-danger-border: #e11d48;
  --theme-success: #10b981;
  --theme-warning: #d97706;
  --theme-radius-sm: 12rpx;
  --theme-radius-md: 18rpx;
  --theme-radius-lg: 22rpx;
  --theme-radius-pill: 999rpx;
  --theme-radius-input: 12rpx;
  --theme-card-border-width: 1px;
  --theme-card-border-style: solid;
  --theme-card-bg-opacity: 0.82;
  --theme-layout-gap: 18rpx;
  --theme-layout-section-gap: 24rpx;
  --theme-tab-active-bg: rgba(37, 99, 235, 0.1);
  --theme-tab-height: 98rpx;
  --theme-tab-border-radius: 26rpx;
  --theme-tab-wrapper-bg: rgba(255, 255, 255, 0.88);
  --theme-tab-wrapper-border: rgba(37, 99, 235, 0.16);
  --theme-tab-wrapper-shadow: rgba(15, 23, 42, 0.08);
  --theme-tab-wrapper-padding: 10rpx;
  --theme-tab-text: #475569;
  --theme-tab-active-text: #2563eb;
  --theme-tab-shadow-inset: rgba(37, 99, 235, 0.05);
  --theme-tab-border: rgba(37, 99, 235, 0.16);
  --theme-tab-bg: rgba(255, 255, 255, 0.88);
  --theme-tab-shadow: rgba(15, 23, 42, 0.1);
  --theme-metric-fill-end: #60a5fa;
  --theme-card-accent-bg-start: rgba(255, 255, 255, 0.84);
  --theme-card-accent-bg-end: rgba(219, 234, 254, 0.78);
  --theme-card-accent-shadow: rgba(37, 99, 235, 0.1);
  --theme-card-accent-border: rgba(37, 99, 235, 0.26);
  --theme-badge-bg: #eff6ff;
  --theme-badge-text: #1d4ed8;
  --theme-chart-bg: rgba(255, 255, 255, 0.8);
  --theme-chart-grid: rgba(37, 99, 235, 0.1);
  --theme-chart-color-0: #2563eb;
  --theme-chart-color-1: #10b981;
  --theme-chart-color-2: #d97706;
  --theme-chart-color-3: #e11d48;
  --theme-chart-color-4: #0ea5e9;
  --theme-chart-line-width: 2.5;
  --theme-chart-dot-radius: 4;
  --theme-modal-overlay: rgba(15, 23, 42, 0.36);
  --theme-btn-secondary-bg: rgba(255, 255, 255, 0.88);
  --theme-btn-secondary-border: #2563eb;
  --theme-btn-secondary-text: #2563eb;
  --theme-btn-style: 12rpx;
  --theme-summary-chip-bg: #eff6ff;
  --theme-summary-chip-text: #1d4ed8;
  --theme-value-badge-bg: rgba(219, 234, 254, 0.78);
  --theme-value-badge-text: #2563eb;
  --theme-value-badge-unit: #475569;
  --theme-empty-border: rgba(37, 99, 235, 0.16);
  --theme-category-tabs-bg: rgba(219, 234, 254, 0.7);
  --theme-category-tab-active-bg: rgba(255, 255, 255, 0.96);
  --theme-category-tab-active-shadow: rgba(15, 23, 42, 0.06);
  --theme-quick-chip-border: rgba(37, 99, 235, 0.18);
  --theme-menu-accent-bg: rgba(37, 99, 235, 0.06);
}

/* ── AMBER (Agricultural / Environmental Monitor) ── */
[data-theme="amber"] {
  --theme-accent: #c8782b;
  --theme-accent-light: #fdf2e6;
  --theme-accent-dark: #b06820;
  --theme-accent-contrast: #ffffff;
  --theme-bg: #faf6f0;
  --theme-bg-image: url('/static/theme/bg-amber.svg');
  --theme-bg-image-opacity: 0.35;
  --theme-bg-gradient-start: #f7efe2;
  --theme-bg-gradient-end: #faf6f0;
  --theme-bg-gradient-settings-start: #f4ecdd;
  --theme-bg-gradient-settings-end: #faf6f0;
  --theme-surface: #fffdf8;
  --theme-surface-alt: #fdf9f2;
  --theme-surface-alt-2: #fcf6ed;
  --theme-surface-hover: #fef8ef;
  --theme-surface-border: rgba(180, 140, 100, 0.18);
  --theme-surface-border-light: rgba(200, 120, 40, 0.07);
  --theme-surface-border-accent: rgba(200, 120, 40, 0.22);
  --theme-text-primary: #2d2218;
  --theme-text-secondary: #8c7458;
  --theme-text-tertiary: #a69078;
  --theme-text-heading: #3d2e20;
  --theme-hero-bg-start: #6b8c3a;
  --theme-hero-bg-end: #3d2a18;
  --theme-hero-border: rgba(255, 255, 255, 0.18);
  --theme-hero-text: #fffaf2;
  --theme-hero-text-muted: rgba(255, 245, 230, 0.72);
  --theme-hero-btn-bg: rgba(255, 255, 255, 0.12);
  --theme-hero-btn-border: rgba(255, 255, 255, 0.18);
  --theme-hero-overlay: none;
  --theme-input-bg: #fdf9f2;
  --theme-input-border: #e0d4c0;
  --theme-input-border-focus: #c8782b;
  --theme-input-style: 16rpx;
  --theme-divider: #f4ecdd;
  --theme-divider-light: #e8dcc8;
  --theme-shadow-sm: rgba(80, 50, 20, 0.06);
  --theme-shadow-md: rgba(80, 50, 20, 0.08);
  --theme-shadow-lg: rgba(60, 35, 10, 0.14);
  --theme-shadow-accent: rgba(200, 120, 40, 0.16);
  --theme-danger: #c04540;
  --theme-danger-bg: #fef5f4;
  --theme-danger-border: #c04540;
  --theme-success: #5da870;
  --theme-warning: #d9a040;
  --theme-radius-sm: 16rpx;
  --theme-radius-md: 24rpx;
  --theme-radius-lg: 32rpx;
  --theme-radius-pill: 999rpx;
  --theme-radius-input: 16rpx;
  --theme-card-border-width: 1px;
  --theme-card-border-style: solid;
  --theme-card-bg-opacity: 1;
  --theme-layout-gap: 22rpx;
  --theme-layout-section-gap: 28rpx;
  --theme-tab-active-bg: #fdf2e6;
  --theme-tab-height: 100rpx;
  --theme-tab-border-radius: 30rpx;
  --theme-tab-wrapper-bg: rgba(255, 253, 248, 0.96);
  --theme-tab-wrapper-border: rgba(180, 140, 100, 0.16);
  --theme-tab-wrapper-shadow: rgba(60, 35, 10, 0.1);
  --theme-tab-wrapper-padding: 12rpx;
  --theme-tab-text: #8c7458;
  --theme-tab-active-text: #c8782b;
  --theme-tab-shadow-inset: rgba(200, 120, 40, 0.05);
  --theme-tab-border: rgba(180, 140, 100, 0.16);
  --theme-tab-bg: rgba(255, 253, 248, 0.96);
  --theme-tab-shadow: rgba(60, 35, 10, 0.1);
  --theme-metric-fill-end: #e8a858;
  --theme-card-accent-bg-start: #fffdf8;
  --theme-card-accent-bg-end: #fef6ed;
  --theme-card-accent-shadow: rgba(200, 120, 40, 0.1);
  --theme-card-accent-border: rgba(200, 120, 40, 0.24);
  --theme-badge-bg: #fdf2e6;
  --theme-badge-text: #c8782b;
  --theme-chart-bg: #fdf9f2;
  --theme-chart-grid: #e8dcc8;
  --theme-chart-color-0: #c8782b;
  --theme-chart-color-1: #5da870;
  --theme-chart-color-2: #4a90c4;
  --theme-chart-color-3: #c04540;
  --theme-chart-color-4: #8b5fc0;
  --theme-chart-line-width: 3;
  --theme-chart-dot-radius: 5;
  --theme-modal-overlay: rgba(30, 20, 10, 0.45);
  --theme-btn-secondary-bg: #fdf9f2;
  --theme-btn-secondary-border: #c8782b;
  --theme-btn-secondary-text: #c8782b;
  --theme-btn-style: 16rpx;
  --theme-summary-chip-bg: #fdf2e6;
  --theme-summary-chip-text: #c8782b;
  --theme-value-badge-bg: #fdf6ed;
  --theme-value-badge-text: #c8782b;
  --theme-value-badge-unit: #8c7458;
  --theme-empty-border: #e0d4c0;
  --theme-category-tabs-bg: #f4ecdd;
  --theme-category-tab-active-bg: #fffdf8;
  --theme-category-tab-active-shadow: rgba(80, 50, 20, 0.05);
  --theme-quick-chip-border: #e0d4c0;
  --theme-menu-accent-bg: rgba(200, 120, 40, 0.06);
}

/* ── STEEL (Enterprise Ops Briefing) ── */
[data-theme="steel"] {
  --theme-accent: #2c5282;
  --theme-accent-light: #e8eff8;
  --theme-accent-dark: #1e3d64;
  --theme-accent-contrast: #ffffff;
  --theme-bg: #f4f6f9;
  --theme-bg-image: url('/static/theme/bg-steel.svg');
  --theme-bg-image-opacity: 0.3;
  --theme-bg-gradient-start: #eaedf2;
  --theme-bg-gradient-end: #f4f6f9;
  --theme-bg-gradient-settings-start: #e8ecf2;
  --theme-bg-gradient-settings-end: #f4f6f9;
  --theme-surface: #ffffff;
  --theme-surface-alt: #f7f9fc;
  --theme-surface-alt-2: #f5f7fb;
  --theme-surface-hover: #f2f5fa;
  --theme-surface-border: rgba(44, 60, 90, 0.1);
  --theme-surface-border-light: rgba(44, 82, 130, 0.05);
  --theme-surface-border-accent: rgba(44, 82, 130, 0.18);
  --theme-text-primary: #1a2332;
  --theme-text-secondary: #4a5a72;
  --theme-text-tertiary: #6b7a95;
  --theme-text-heading: #15202f;
  --theme-hero-bg-start: #1a3650;
  --theme-hero-bg-end: #0f2438;
  --theme-hero-border: rgba(255, 255, 255, 0.15);
  --theme-hero-text: #ffffff;
  --theme-hero-text-muted: rgba(255, 255, 255, 0.65);
  --theme-hero-btn-bg: rgba(255, 255, 255, 0.1);
  --theme-hero-btn-border: rgba(255, 255, 255, 0.14);
  --theme-hero-overlay: none;
  --theme-input-bg: #f7f9fc;
  --theme-input-border: #d0d6e0;
  --theme-input-border-focus: #2c5282;
  --theme-input-style: 6rpx;
  --theme-divider: #e8ecf2;
  --theme-divider-light: #dde3ed;
  --theme-shadow-sm: rgba(20, 30, 50, 0.04);
  --theme-shadow-md: rgba(20, 30, 50, 0.06);
  --theme-shadow-lg: rgba(15, 25, 45, 0.12);
  --theme-shadow-accent: rgba(44, 82, 130, 0.12);
  --theme-danger: #c43840;
  --theme-danger-bg: #fef5f6;
  --theme-danger-border: #c43840;
  --theme-success: #4a8a60;
  --theme-warning: #c88828;
  --theme-radius-sm: 4rpx;
  --theme-radius-md: 8rpx;
  --theme-radius-lg: 12rpx;
  --theme-radius-pill: 999rpx;
  --theme-radius-input: 4rpx;
  --theme-card-border-width: 1px;
  --theme-card-border-style: solid;
  --theme-card-bg-opacity: 1;
  --theme-layout-gap: 10rpx;
  --theme-layout-section-gap: 16rpx;
  --theme-tab-active-bg: #e8eff8;
  --theme-tab-height: 88rpx;
  --theme-tab-border-radius: 12rpx;
  --theme-tab-wrapper-bg: #ffffff;
  --theme-tab-wrapper-border: rgba(44, 60, 90, 0.1);
  --theme-tab-wrapper-shadow: rgba(20, 30, 50, 0.08);
  --theme-tab-wrapper-padding: 4rpx;
  --theme-tab-text: #4a5a72;
  --theme-tab-active-text: #2c5282;
  --theme-tab-shadow-inset: rgba(44, 82, 130, 0.04);
  --theme-tab-border: rgba(44, 60, 90, 0.08);
  --theme-tab-bg: #ffffff;
  --theme-tab-shadow: rgba(20, 30, 50, 0.08);
  --theme-metric-fill-end: #5a8cc0;
  --theme-card-accent-bg-start: #ffffff;
  --theme-card-accent-bg-end: #f5f8fc;
  --theme-card-accent-shadow: rgba(44, 82, 130, 0.08);
  --theme-card-accent-border: rgba(44, 82, 130, 0.2);
  --theme-badge-bg: #e8eff8;
  --theme-badge-text: #2c5282;
  --theme-chart-bg: #f7f9fc;
  --theme-chart-grid: #dde4ef;
  --theme-chart-color-0: #2c5282;
  --theme-chart-color-1: #4a8a60;
  --theme-chart-color-2: #c88828;
  --theme-chart-color-3: #c43840;
  --theme-chart-color-4: #6c50b0;
  --theme-chart-line-width: 2;
  --theme-chart-dot-radius: 3.5;
  --theme-modal-overlay: rgba(10, 18, 32, 0.4);
  --theme-btn-secondary-bg: #f5f7fb;
  --theme-btn-secondary-border: #2c5282;
  --theme-btn-secondary-text: #2c5282;
  --theme-btn-style: 4rpx;
  --theme-summary-chip-bg: #e8eff8;
  --theme-summary-chip-text: #2c5282;
  --theme-value-badge-bg: #f0f3f8;
  --theme-value-badge-text: #2c5282;
  --theme-value-badge-unit: #4a5a72;
  --theme-empty-border: #d0d6e0;
  --theme-category-tabs-bg: #e8ecf2;
  --theme-category-tab-active-bg: #ffffff;
  --theme-category-tab-active-shadow: rgba(20, 30, 50, 0.04);
  --theme-quick-chip-border: #d0d6e0;
  --theme-menu-accent-bg: rgba(44, 82, 130, 0.04);
}

/* ===================================================================
   Layout Presets (structural CSS not covered by color vars)
   =================================================================== */

/* Compact (teal) - tighter spacing, sharper, floating capsule tabs */
[data-theme-layout="compact"] page {
  background-image: var(--theme-bg-image);
  background-size: cover;
  background-attachment: fixed;
}

/* Glass (night) - frosted panels, softer edges, glow tab bar */
[data-theme-layout="glass"] page {
  background-image: var(--theme-bg-image);
  background-size: cover;
  background-attachment: fixed;
}

/* Organic (amber) - generous spacing, soft rounded everything */
[data-theme-layout="organic"] page {
  background-image: var(--theme-bg-image);
  background-size: cover;
  background-attachment: fixed;
}

/* Dense (steel) - minimal gap, thin borders, corporate clean */
[data-theme-layout="dense"] page {
  background-image: var(--theme-bg-image);
  background-size: cover;
  background-attachment: fixed;
}

/* ── Base page styles ── */
page {
  min-height: 100%;
  background-color: var(--theme-bg);
  background-image: var(--theme-bg-image);
  background-size: cover;
  background-attachment: fixed;
  color: var(--theme-text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

button::after {
  border: 0;
}

uni-tabbar {
  display: none !important;
}
</style>
