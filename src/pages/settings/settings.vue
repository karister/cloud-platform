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
        <view class="menu-card points-action" @tap="openPoints">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/tab/dashboard-active.png" mode="aspectFit" />
          </view>
          <view class="menu-copy">
            <text class="menu-title">数据点配置</text>
            <text class="menu-desc">
              展示 {{ config.displayPoints.length }} · 开关 {{ config.switchPoints.length }} · 阈值 {{ config.thresholdPoints.length }}
            </text>
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
        <view class="menu-card export-action" @tap.stop="openExportModal">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/tab/settings-active.png" mode="aspectFit" />
          </view>
          <view class="menu-copy">
            <text class="menu-title">配置导出</text>
            <text class="menu-desc">导出为JSON文件</text>
          </view>
          <text class="menu-arrow">导出</text>
        </view>
        <view class="menu-card import-action" @tap.stop="openImport">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/tab/threshold-active.png" mode="aspectFit" />
          </view>
          <view class="menu-copy">
            <text class="menu-title">配置导入</text>
            <text class="menu-desc">从JSON文件恢复配置</text>
          </view>
          <text class="menu-arrow">导入</text>
        </view>
        <view class="menu-card reset-action" @tap.stop="resetToFactory">
          <view class="menu-icon-wrap">
            <image class="menu-icon" src="/static/tab/threshold-active.png" mode="aspectFit" />
          </view>
          <view class="menu-copy">
            <text class="menu-title">恢复出厂设置</text>
            <text class="menu-desc">清除所有配置回到初始状态</text>
          </view>
          <text class="menu-arrow danger-arrow">重置</text>
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
              <input class="input" :value="draft.cloud.productId" @input="draft.cloud.productId = $event.detail.value" placeholder="请输入 OneNET 产品 ID" />
            </label>
            <label class="field">
              <text>Device Name</text>
              <input class="input" :value="draft.cloud.deviceName" @input="draft.cloud.deviceName = $event.detail.value" placeholder="请输入设备名称" />
            </label>
            <label class="field">
              <text>Access Key</text>
              <input
                class="input auth-input"
                :value="draft.cloud.accessKey"
                @input="draft.cloud.accessKey = $event.detail.value"
                placeholder="设备 Access Key (Base64 字符串)"
                password
              />
              <text class="field-tip">在 OneNET 控制台 设备详情 → AccessKey 处获取。</text>
            </label>
            <label class="field">
              <text>Token 有效期（天）</text>
              <input
                class="input"
                type="number"
                :value="draft.cloud.tokenTtlDays"
                @input="onTokenTtlChange($event.detail.value)"
                placeholder="365"
              />
              <text class="field-tip">验证通过后会生成对应有效期的 token，到期前无需重新计算。</text>
            </label>

            <label class="field">
              <text>数据刷新间隔（秒）</text>
              <input
                class="input"
                type="number"
                :value="draft.cloud.pollIntervalSeconds"
                @input="onPollIntervalChange($event.detail.value)"
                placeholder="3"
              />
              <text class="field-tip">全局轮询节奏，所有页面共用。最短 1 秒，过小会被云平台限流。</text>
            </label>

            <!--
              TODO: 临时手动 token 输入框
              当前自动计算的 token 算法与 OneNET 实际返回的 token 不一致，
              临时让用户可以从 OneNET 控制台 / 官方 token 生成工具粘贴一个
              已知的有效 token，覆盖自动计算结果。等算法修好后删除此区块
              以及 buildAuthorization 中的 manualToken 优先逻辑。
            -->
            <label class="field manual-token-field">
              <text>手动 Token（临时调试用）</text>
              <textarea
                class="textarea auth-input"
                :value="draft.cloud.manualToken"
                @input="draft.cloud.manualToken = $event.detail.value"
                placeholder="version=2018-10-31&res=...&et=...&method=md5&sign=..."
              />
              <text class="field-tip">
                临时调试项：填入后会直接作为 Authorization 头发送给 OneNET，
                跳过本地 HMAC 计算。等 token 算法问题修复后此字段会被移除。
              </text>
            </label>

            <view class="cloud-actions">
              <button class="secondary-btn" :disabled="verifying || !canVerify" @tap="verifyAuthorization">
                {{ verifying ? '验证中...' : '验证 token' }}
              </button>
            </view>

            <view v-if="authError" class="cloud-status error">{{ authError }}</view>
            <view v-else-if="authVerifyResult" class="cloud-status success">{{ authVerifyResult }}</view>
            <view v-else-if="draft.cloud.token && draft.cloud.tokenExpiresAt" class="cloud-status info">
              已缓存有效 token，过期时间 {{ formatExpiresAt(draft.cloud.tokenExpiresAt) }}
            </view>
            <view v-else class="cloud-status hint">
              请先填写参数并点击「验证 token」，验证通过再保存配置。
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
            <view class="switch-field">
              <view>
                <text class="field-title">模拟数据模式</text>
                <text class="field-desc">关闭后使用真实云平台接口，调试值仅在模拟模式下生效</text>
              </view>
              <switch :color="debugSwitchColor" :checked="config.cloud.mockMode" @change="toggleMockMode($event.detail.value)" />
            </view>
            <text class="debug-intro">设置各数据点的调试值，保存后模拟数据模式下生效。显示/阈值类数据点输入数值，开关类数据点使用切换按钮。</text>
            <view class="debug-list">
              <view v-for="point in debugDisplayPoints" :key="'debug-dp-' + point.identifier" class="debug-row">
                <view class="debug-info">
                  <text class="debug-label">{{ point.label || point.identifier }}</text>
                  <text class="debug-id">{{ point.identifier }} {{ point.unit }} · 展示数据</text>
                </view>
                <input
                  class="debug-input"
                  type="text"
                  v-model="debugValueMap[point.identifier]"
                  :placeholder="'--'"
                />
              </view>
              <view v-for="point in debugSwitchPoints" :key="'debug-sp-' + point.identifier" class="debug-row">
                <view class="debug-info">
                  <text class="debug-label">{{ point.label || point.identifier }}</text>
                  <text class="debug-id">{{ point.identifier }} · 开关数据</text>
                </view>
                <switch
                  :color="debugSwitchColor"
                  :checked="debugValueMap[point.identifier] === true || debugValueMap[point.identifier] === 1"
                  @change="onDebugSwitchChange(point.identifier, $event.detail.value)"
                />
              </view>
              <view v-for="point in debugThresholdPoints" :key="'debug-tp-' + point.identifier" class="debug-row">
                <view class="debug-info">
                  <text class="debug-label">{{ point.label || point.identifier }}</text>
                  <text class="debug-id">{{ point.identifier }} {{ point.unit }} · 阈值数据</text>
                </view>
                <input
                  class="debug-input"
                  type="text"
                  v-model="debugValueMap[point.identifier]"
                  :placeholder="String(point.value ?? '--')"
                />
              </view>
            </view>
            <view v-if="!hasDebugPoints" class="debug-empty">请先在后台配置中添加数据点。</view>
            <button class="secondary-btn" style="margin-top: 20rpx" @tap="clearDebugValues">清空调试值</button>
          </view>

          <view v-else-if="activeModal === 'points'" class="form">
            <view class="category-tabs">
              <view
                v-for="tab in pointTabDefs"
                :key="tab.key"
                class="category-tab"
                :class="{ active: activePointsTab === tab.key }"
                @tap="activePointsTab = tab.key"
              >
                {{ tab.key === 'quickConfig' ? tab.label : `${tab.label} · ${draft[tab.key].length}` }}
              </view>
            </view>

            <view v-if="activePointsTab !== 'quickConfig'" class="form">
              <view v-if="activePointsTab === 'displayPoints'" class="quick-panel">
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

              <view v-for="(point, index) in draft[activePointsTab]" :key="`${activePointsTab}-${index}`" class="point-row">
                <view class="point-head">
                  <text>数据点 {{ index + 1 }}</text>
                  <button class="remove-btn" @tap="removePoint(index)">删除</button>
                </view>
                <PointFields :point="point" :threshold="activePointsTab === 'thresholdPoints'" />
                <!-- Alarm threshold binding (display points only) -->
                <view v-if="activePointsTab === 'displayPoints'" class="alarm-field">
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

            <view v-else class="quick-config-tab">
              <text class="qc-intro">
                把云平台导出的物模型 JSON 粘贴到下方，点击「提取」自动分类填入展示 / 开关 / 阈值 三个 tab。
              </text>

              <textarea
                class="textarea qc-textarea"
                :value="quickConfigText"
                @input="quickConfigText = $event.detail.value"
                placeholder='{ "version": "1.0", "properties": [...] }'
                maxlength="-1"
              />

              <view class="qc-actions">
                <button class="secondary-btn inline-btn" @tap="parseQuickConfig">提取数据点</button>
                <button class="secondary-btn inline-btn" @tap="loadQuickConfigSample">填入示例</button>
                <button class="secondary-btn inline-btn" :disabled="!quickConfigText" @tap="clearQuickConfig">清空</button>
              </view>

              <view v-if="quickConfigError" class="cloud-status error">{{ quickConfigError }}</view>
              <view v-else-if="quickConfigResult" class="qc-preview">
                <view class="qc-summary">
                  <text class="qc-summary-line">从物模型识别出 {{ quickConfigResult.total }} 个数据点：</text>
                </view>
                <view v-if="quickConfigResult.display.length" class="qc-group">
                  <text class="qc-group-title">展示 ({{ quickConfigResult.display.length }})</text>
                  <text class="qc-group-items">
                    {{ quickConfigResult.display.map(p => `${p.label || p.identifier}`).join('、') }}
                  </text>
                </view>
                <view v-if="quickConfigResult.switch.length" class="qc-group">
                  <text class="qc-group-title">开关 ({{ quickConfigResult.switch.length }})</text>
                  <text class="qc-group-items">
                    {{ quickConfigResult.switch.map(p => `${p.label || p.identifier}`).join('、') }}
                  </text>
                </view>
                <view v-if="quickConfigResult.threshold.length" class="qc-group">
                  <text class="qc-group-title">阈值 ({{ quickConfigResult.threshold.length }})</text>
                  <text class="qc-group-items">
                    {{ quickConfigResult.threshold.map(p => `${p.label || p.identifier}`).join('、') }}
                  </text>
                </view>
                <view v-if="quickConfigMergeResult" class="cloud-status success">
                  {{ quickConfigMergeResult }}
                </view>
                <button
                  class="primary-btn"
                  :disabled="!quickConfigResult || quickConfigResult.total === 0"
                  @tap="applyQuickConfig"
                >
                  应用到配置
                </button>
              </view>
              <view v-else class="cloud-status hint">
                点击「提取数据点」后会在这里显示分类预览；点击「应用到配置」会追加到三个 tab，不会覆盖已有项。
              </view>
            </view>
          </view>
        </scroll-view>

        <view class="modal-footer">
          <button v-if="activeModal === 'debug'" class="primary-btn" @tap="saveDebug">保存调试值</button>
          <button v-else-if="activeModal === 'cloud'" class="primary-btn" :disabled="!canSave" @tap="saveModal">保存配置</button>
          <button v-else class="primary-btn" @tap="saveModal">保存配置</button>
        </view>
      </view>
    </view>

    <AppTabBar current="settings" />

    <!-- ── Export modal ── -->
    <view v-if="showExportModal" class="modal-mask" @tap="closeExportModal">
      <view class="modal" @tap.stop>
        <view class="modal-head">
          <text>导出配置</text>
          <button class="close-btn" @tap="closeExportModal">关闭</button>
        </view>

        <scroll-view scroll-y class="modal-body">
          <view class="form">
            <text class="export-intro">
              将当前云平台连接、数据点和主题设置导出为JSON配置文件，可在其他设备上导入恢复。
            </text>

            <button class="primary-btn" @tap="handleExportDownload">
              下载配置文件 (.json)
            </button>

            <view class="export-divider">
              <view class="export-divider-line"></view>
              <text class="export-divider-text">或发送到邮箱</text>
              <view class="export-divider-line"></view>
            </view>

            <view class="export-email-row">
              <input
                class="export-email-input"
                type="text"
                v-model="exportEmailAddress"
                placeholder="请输入邮箱地址"
                @input="exportEmailError = ''"
              />
              <button
                class="secondary-btn export-send-btn"
                :disabled="emailSending || !exportEmailAddress"
                @tap="handleExportEmail"
              >
                {{ emailSending ? '发送中...' : '发送' }}
              </button>
            </view>
            <text v-if="exportEmailError" class="export-error">{{ exportEmailError }}</text>
          </view>
        </scroll-view>
      </view>
    </view>

    <!-- ── Import confirmation modal ── -->
    <view v-if="showImportConfirm" class="modal-mask" @tap="cancelImport">
      <view class="modal" @tap.stop>
        <view class="modal-head">
          <text>导入配置确认</text>
          <button class="close-btn" @tap="cancelImport">取消</button>
        </view>

        <scroll-view scroll-y class="modal-body">
          <view class="form">
            <text class="import-preview-title">即将导入以下配置：</text>

            <view class="import-preview-card">
              <view class="import-preview-item">
                <text class="import-preview-label">应用名称</text>
                <text class="import-preview-value">{{ importPreviewData.appName || '--' }}</text>
              </view>
              <view class="import-preview-item">
                <text class="import-preview-label">主题风格</text>
                <text class="import-preview-value">{{ importPreviewData.themeName || '--' }}</text>
              </view>
              <view class="import-preview-item">
                <text class="import-preview-label">云平台产品</text>
                <text class="import-preview-value">{{ importPreviewData.productId || '--' }}</text>
              </view>
              <view class="import-preview-item">
                <text class="import-preview-label">运行模式</text>
                <text class="import-preview-value">{{ importPreviewData.mockMode ? '模拟数据' : '真实云平台' }}</text>
              </view>
              <view class="import-preview-item">
                <text class="import-preview-label">展示数据点</text>
                <text class="import-preview-value">{{ importPreviewData.displayCount }} 个</text>
              </view>
              <view class="import-preview-item">
                <text class="import-preview-label">开关数据点</text>
                <text class="import-preview-value">{{ importPreviewData.switchCount }} 个</text>
              </view>
              <view class="import-preview-item">
                <text class="import-preview-label">阈值数据点</text>
                <text class="import-preview-value">{{ importPreviewData.thresholdCount }} 个</text>
              </view>
              <view v-if="importPreviewData.exportedAt" class="import-preview-item">
                <text class="import-preview-label">导出时间</text>
                <text class="import-preview-value import-preview-meta">{{ importPreviewData.formattedTime }}</text>
              </view>
            </view>

            <view class="import-warning">
              <text>当前配置将被覆盖。此操作不可撤销。</text>
            </view>

            <button class="primary-btn import-confirm-btn" @tap="handleConfirmImport">确认导入</button>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import AppTabBar from '../../components/AppTabBar.vue'
import PointFields from '../../components/PointFields.vue'
import { buildGetUrl, createPoint } from '../../utils/defaultConfig'
import { generateOneNetToken } from '../../utils/onenetToken'
import { parseThingModel, mergeParsedIntoDraft } from '../../utils/thingModel'
import { getConfig, saveConfig, getDebugValues, saveDebugValues, clearDebugValues as clearDebugStorage } from '../../utils/storage'
import { THEME_LIST, applyThemeToDOM } from '../../utils/themes'
import { serializeConfig, downloadJsonFile, deserializeConfig, getExportFilename } from '../../utils/configImportExport'
import { sendConfigEmail, isEmailConfigured } from '../../services/emailService'
import { fetchProperties } from '../../services/onenet'
import { dataStore } from '../../stores/dataStore'

const config = ref(getConfig())
const draft = ref(getConfig())
const activeModal = ref('')
// TODO: revert to false before production release
const adminMode = ref(true)
const unlockTapCount = ref(0)
const unlockTimer = ref(null)
const activeRecommendCategory = ref('display')
const activePointsTab = ref('displayPoints')

// 快速配置 tab 的状态
const quickConfigText = ref('')
const quickConfigError = ref('')
const quickConfigResult = ref(null)
const quickConfigMergeResult = ref('')

// 一份精简的物模型示例，方便用户理解 JSON 结构
const QUICK_CONFIG_SAMPLE = `{
  "version": "1.0",
  "properties": [
    { "identifier": "temp",  "name": "温度",     "accessMode": "rw", "dataType": { "type": "int32", "specs": { "max": "100", "min": "0", "step": "1", "unit": "℃" } } },
    { "identifier": "humi",  "name": "湿度",     "accessMode": "rw", "dataType": { "type": "int32", "specs": { "max": "100", "min": "0", "step": "1", "unit": "%"  } } },
    { "identifier": "fan",   "name": "风扇",     "accessMode": "rw", "dataType": { "type": "bool",  "specs": {} } },
    { "identifier": "pump",  "name": "水泵",     "accessMode": "rw", "dataType": { "type": "bool",  "specs": {} } },
    { "identifier": "tempv", "name": "温度阈值", "accessMode": "rw", "dataType": { "type": "int32", "specs": { "max": "100", "min": "0", "step": "1", "unit": "℃" } } },
    { "identifier": "humiv", "name": "湿度阈值", "accessMode": "rw", "dataType": { "type": "int32", "specs": { "max": "100", "min": "0", "step": "1", "unit": "%"  } } }
  ]
}`
const themeSectionOpen = ref(false)
const showPasswordModal = ref(false)
const passwordInput = ref('')
const debugValueMap = reactive({})

// Cloud / Authorization state
const verifying = ref(false)
const authError = ref('')
const authVerifyResult = ref('')

// 表单是否足够发起一次验证请求（手动 token 时可以只填 token + URL 参数）
const canVerify = computed(() => {
  const c = draft.value.cloud
  if (!c) return false
  // TODO: 临时允许只填 manualToken 完成验证；算法修好后移除此分支
  if (typeof c.manualToken === 'string' && c.manualToken.trim()) {
    return Boolean(c.productId && c.deviceName)
  }
  return Boolean(c?.productId && c?.deviceName && c?.accessKey)
})

// 当前 draft 中是否已有有效 token，可以保存到 storage
const canSave = computed(() => {
  const c = draft.value.cloud
  return Boolean(c?.productId && c?.deviceName && c?.accessKey && c?.token && c?.tokenExpiresAt)
})

function onTokenTtlChange(value) {
  // 解析用户输入的天数；非法时回退到默认 365
  const days = Number(value)
  draft.value.cloud.tokenTtlDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 365
  // 修改了有效期后必须重新验证
  if (draft.value.cloud.token) {
    delete draft.value.cloud.token
    delete draft.value.cloud.tokenExpiresAt
    authError.value = ''
    authVerifyResult.value = ''
  }
}

function onPollIntervalChange(value) {
  // 解析用户输入的秒数；非法或小于 1 时回退到默认 3 秒
  const seconds = Number(value)
  draft.value.cloud.pollIntervalSeconds = Number.isFinite(seconds) && seconds >= 1
    ? Math.min(3600, Math.floor(seconds))
    : 3
}

function formatExpiresAt(expiresAtSeconds) {
  if (!Number.isFinite(expiresAtSeconds)) return '--'
  const d = new Date(expiresAtSeconds * 1000)
  return d.toLocaleString('zh-CN', { hour12: false })
}

// Export / Import state
const showExportModal = ref(false)
const exportEmailAddress = ref('')
const exportEmailError = ref('')
const emailSending = ref(false)
const showImportConfirm = ref(false)
const importPreviewData = ref({})
const pendingImportData = ref(null)

const categoryDefs = [
  { key: 'display', label: '展示' },
  { key: 'switch', label: '开关' },
  { key: 'threshold', label: '阈值' }
]

const pointTabDefs = [
  { key: 'displayPoints', label: '展示' },
  { key: 'switchPoints', label: '开关' },
  { key: 'thresholdPoints', label: '阈值' },
  { key: 'quickConfig', label: '快速配置' }
]

function pointTabLabel(key) {
  const item = pointTabDefs.find((entry) => entry.key === key)
  return item?.label || ''
}

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

// Debug panel - reactive for proper two-way binding with v-model
const debugDisplayPoints = computed(() => config.value.displayPoints || [])
const debugSwitchPoints = computed(() => config.value.switchPoints || [])
const debugThresholdPoints = computed(() => config.value.thresholdPoints || [])

const hasDebugPoints = computed(() =>
  debugDisplayPoints.value.length > 0 ||
  debugSwitchPoints.value.length > 0 ||
  debugThresholdPoints.value.length > 0
)

function toggleMockMode(checked) {
  config.value.cloud.mockMode = checked
  saveConfig(config.value)
}

function openDebug() {
  // Populate debugValueMap from saved storage
  const saved = getDebugValues()
  Object.keys(debugValueMap).forEach((k) => delete debugValueMap[k])
  Object.assign(debugValueMap, saved)
  activeModal.value = 'debug'
}

function onDebugSwitchChange(identifier, checked) {
  debugValueMap[identifier] = checked ? 1 : 0
}

function saveDebug() {
  const cleaned = {}
  Object.entries(debugValueMap).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
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
  Object.keys(debugValueMap).forEach((k) => delete debugValueMap[k])
  uni.showToast({ title: '调试值已清空', icon: 'success' })
}

const modalTitle = computed(() => {
  if (activeModal.value === 'points') {
    return `数据点配置 · ${pointTabLabel(activePointsTab.value)}`
  }
  const titles = {
    cloud: '云平台连接配置',
    recommendations: '推荐数据点配置',
    debug: '数据调试'
  }
  return titles[activeModal.value] || ''
})

const currentThemeName = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? theme.name : '默认墨绿'
})

const debugSwitchColor = computed(() => {
  const theme = THEME_LIST.find((t) => t.id === config.value.themeId)
  return theme ? theme.cssVars['--theme-accent'] : '#0dc9b0'
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
  // 默认 token 有效期 365 天；老 config 没有这个字段时给个补默认值
  if (!Number.isFinite(draft.value.cloud.tokenTtlDays) || draft.value.cloud.tokenTtlDays <= 0) {
    draft.value.cloud.tokenTtlDays = 365
  }
  if (!draft.value.cloud.signMethod) {
    draft.value.cloud.signMethod = 'md5'
  }
  // 默认轮询间隔 3 秒；老 config 没有这个字段时给个补默认值
  if (!Number.isFinite(draft.value.cloud.pollIntervalSeconds) || draft.value.cloud.pollIntervalSeconds < 1) {
    draft.value.cloud.pollIntervalSeconds = 3
  }
  // TODO: 临时调试字段 — token 算法修好后删除
  if (typeof draft.value.cloud.manualToken !== 'string') {
    draft.value.cloud.manualToken = ''
  }
  // 清除上一次的验证状态
  authError.value = ''
  authVerifyResult.value = ''
  activeModal.value = 'cloud'
}

function openPoints(defaultTab = 'displayPoints') {
  draft.value = clone(config.value)
  ensureRecommendedPoints(draft.value)
  // 若传入了合法的 tab key，使用它；否则回退到默认展示
  const validTab = pointTabDefs.some((t) => t.key === defaultTab) ? defaultTab : 'displayPoints'
  activePointsTab.value = validTab
  // 重置快速配置 tab 的临时状态
  quickConfigText.value = ''
  quickConfigError.value = ''
  quickConfigResult.value = null
  quickConfigMergeResult.value = ''
  activeModal.value = 'points'
}

function parseQuickConfig() {
  quickConfigError.value = ''
  quickConfigMergeResult.value = ''
  const result = parseThingModel(quickConfigText.value)
  if (!result.ok) {
    quickConfigError.value = result.error
    quickConfigResult.value = null
    return
  }
  quickConfigResult.value = result
}

function applyQuickConfig() {
  if (!quickConfigResult.value) return
  const merged = mergeParsedIntoDraft(draft.value, quickConfigResult.value)
  const parts = []
  if (merged.byKind.display) parts.push(`展示 ${merged.byKind.display}`)
  if (merged.byKind.switch) parts.push(`开关 ${merged.byKind.switch}`)
  if (merged.byKind.threshold) parts.push(`阈值 ${merged.byKind.threshold}`)
  const summary = parts.length ? parts.join(' / ') : '0'
  quickConfigMergeResult.value = `已新增 ${merged.added} 个数据点（${summary}）${merged.skipped ? `，跳过 ${merged.skipped} 个已存在的 identifier` : ''}`
  uni.showToast({
    title: merged.added ? `已新增 ${merged.added} 个数据点` : '没有新数据点',
    icon: merged.added ? 'success' : 'none'
  })
  // 用完清掉文本和结果，避免误重复应用
  quickConfigText.value = ''
  quickConfigResult.value = null
  quickConfigError.value = ''
}

function clearQuickConfig() {
  quickConfigText.value = ''
  quickConfigError.value = ''
  quickConfigResult.value = null
  quickConfigMergeResult.value = ''
}

function loadQuickConfigSample() {
  quickConfigText.value = QUICK_CONFIG_SAMPLE
  quickConfigError.value = ''
  quickConfigResult.value = null
  quickConfigMergeResult.value = ''
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

/**
 * 用当前 draft 配置打一个最小验证请求，检验 token 是否能被 OneNET 接受。
 * 验证成功后将 token 与过期时间写入 draft，等待用户在保存配置时持久化。
 *
 * TODO: 临时支持 manualToken 字段，算法修好后移除该分支
 */
function verifyAuthorization() {
  if (!canVerify.value || verifying.value) return
  verifying.value = true
  authError.value = ''
  authVerifyResult.value = ''

  // 解析 manualToken 中的 et；如果没有就用当前时间 + tokenTtlDays
  const manualToken = (draft.value.cloud.manualToken || '').trim()
  let probeToken = ''
  let tokenExpiresAt = 0

  if (manualToken) {
    // TODO: 临时从 manualToken 解析 et；算法修好后整段移除
    const etMatch = manualToken.match(/et=(\d+)/)
    tokenExpiresAt = etMatch ? Number(etMatch[1]) : Math.floor(Date.now() / 1000) + 365 * 86400
    probeToken = manualToken
  } else {
    // 正常路径：用 draft.cloud 的参数生成 token
    const ttlDays = Number(draft.value.cloud.tokenTtlDays) || 365
    tokenExpiresAt = Math.floor(Date.now() / 1000) + Math.floor(ttlDays * 86400)
    try {
      probeToken = generateOneNetToken({
        productId: draft.value.cloud.productId,
        deviceName: draft.value.cloud.deviceName,
        accessKey: draft.value.cloud.accessKey,
        expirationSeconds: tokenExpiresAt,
        method: draft.value.cloud.signMethod || 'md5'
      })
    } catch (err) {
      verifying.value = false
      authError.value = err?.message || 'token 生成失败，请检查 Access Key 是否合法'
      uni.showToast({ title: 'token 生成失败', icon: 'error' })
      return
    }
  }

  // 构造一份仅替换 cloud 字段的临时配置（保持其它字段以满足 fetchProperties 的全量入参）
  const probeConfig = {
    ...draft.value,
    cloud: {
      ...draft.value.cloud,
      mockMode: false,
      token: probeToken,
      tokenExpiresAt
    }
  }

  fetchProperties(probeConfig).then(() => {
    // 验证通过：把 token 缓存到 draft
    draft.value.cloud.token = probeToken
    draft.value.cloud.tokenExpiresAt = tokenExpiresAt
    authError.value = ''
    authVerifyResult.value = `token 验证通过（${formatExpiresAt(tokenExpiresAt)} 过期）`
    uni.showToast({ title: 'token 验证通过', icon: 'success' })
  }).catch((err) => {
    const msg = err?.message || String(err)
    authVerifyResult.value = ''
    authError.value = msg
    uni.showToast({ title: 'token 验证失败', icon: 'error' })
  }).finally(() => {
    verifying.value = false
  })
}

function addPoint() {
  const kind = activePointsTab.value === 'thresholdPoints' ? 'threshold' : 'display'
  draft.value[activePointsTab.value].push(createPoint(kind))
}

function removePoint(index) {
  draft.value[activePointsTab.value].splice(index, 1)
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
  // 兼容旧版：清理残留的 authorization 字段
  if (nextConfig.cloud && 'authorization' in nextConfig.cloud) {
    delete nextConfig.cloud.authorization
  }
  if (!nextConfig.cloud) return
  // 签名方法默认 md5
  if (!nextConfig.cloud.signMethod) {
    nextConfig.cloud.signMethod = 'md5'
  }
  // token 有效期：缺失或非法值时回退到 365 天
  const ttlDays = Number(nextConfig.cloud.tokenTtlDays)
  nextConfig.cloud.tokenTtlDays = Number.isFinite(ttlDays) && ttlDays > 0 ? Math.floor(ttlDays) : 365
  // 轮询间隔：缺失或非法值时回退到 3 秒，最大 1 小时
  const pollSec = Number(nextConfig.cloud.pollIntervalSeconds)
  nextConfig.cloud.pollIntervalSeconds = Number.isFinite(pollSec) && pollSec >= 1
    ? Math.min(3600, Math.floor(pollSec))
    : 3
  // 必须已经验证通过才允许保存（canSave 已经在按钮 disabled 上把关）
  if (!nextConfig.cloud.token || !nextConfig.cloud.tokenExpiresAt) {
    uni.showToast({ title: '请先验证 token', icon: 'none' })
    return
  }
  // manualToken 字段已经在 draft.cloud 上保留（saveModal 直接 clone）
  // 自动同步 getUrl（与 productId/deviceName 对齐），postUrl 保留默认
  try {
    nextConfig.cloud.getUrl = buildGetUrl(nextConfig.cloud)
  } catch (e) {
    // ignore — keep whatever was there
  }
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
  // 重新拉一次轮询，让新间隔立即生效（start 内部会先 stop 再按新间隔启动）
  dataStore.start()
  closeModal()
  uni.showToast({
    title: '配置已保存',
    icon: 'success'
  })
}

// ── Export / Import handlers ──

function openExportModal() {
  exportEmailAddress.value = ''
  exportEmailError.value = ''
  showExportModal.value = true
}

function closeExportModal() {
  showExportModal.value = false
}

function handleExportDownload() {
  const json = serializeConfig(config.value)
  const filename = getExportFilename()
  downloadJsonFile(json, filename)
  closeExportModal()
  uni.showToast({ title: '配置已导出', icon: 'success' })
}

async function handleExportEmail() {
  const email = exportEmailAddress.value.trim()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    exportEmailError.value = '请输入有效的邮箱地址'
    return
  }

  if (!isEmailConfigured()) {
    exportEmailError.value = '请先配置邮箱服务（Public Key / Service ID / Template ID）'
    return
  }

  emailSending.value = true
  exportEmailError.value = ''

  try {
    const json = serializeConfig(config.value)
    const result = await sendConfigEmail(email, json, config.value.appName, config.value.themeId)
    if (result.success) {
      closeExportModal()
      uni.showToast({ title: '配置已发送到邮箱', icon: 'success' })
    } else {
      exportEmailError.value = result.error || '发送失败，请检查邮箱配置'
    }
  } catch (err) {
    exportEmailError.value = '网络错误，请稍后重试'
  } finally {
    emailSending.value = false
  }
}

function openImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,application/json'
  input.style.display = 'none'

  const cleanup = () => {
    if (input.parentNode) input.parentNode.removeChild(input)
  }

  input.addEventListener('change', (e) => {
    const file = e.target?.files?.[0]
    if (!file) { cleanup(); return }

    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target.result
        const parsed = deserializeConfig(text)
        if (!parsed.valid) {
          uni.showToast({ title: '导入失败: ' + parsed.errors[0], icon: 'none', duration: 3000 })
          return
        }

        const importData = parsed.data
        const theme = THEME_LIST.find((t) => t.id === importData.themeId)

        pendingImportData.value = importData
        importPreviewData.value = {
          appName: importData.appName || '--',
          themeName: theme ? theme.name : (importData.themeId || '默认'),
          productId: importData.cloud?.productId || '--',
          mockMode: importData.cloud?.mockMode !== false,
          displayCount: importData.displayPoints?.length || 0,
          switchCount: importData.switchPoints?.length || 0,
          thresholdCount: importData.thresholdPoints?.length || 0,
          exportedAt: importData.exportedAt,
          formattedTime: importData.exportedAt
            ? new Date(importData.exportedAt).toLocaleString('zh-CN', { hour12: false })
            : ''
        }
        showImportConfirm.value = true
      } catch (err) {
        uni.showToast({ title: '文件解析失败', icon: 'none' })
      } finally {
        cleanup()
      }
    }
    reader.onerror = () => {
      uni.showToast({ title: '读取文件失败', icon: 'error' })
      cleanup()
    }
    reader.readAsText(file)
  })

  document.body.appendChild(input)
  input.click()
}

function cancelImport() {
  showImportConfirm.value = false
  pendingImportData.value = null
}

function handleConfirmImport() {
  if (!pendingImportData.value) return

  const src = pendingImportData.value

  const imported = {
    appName: src.appName || '云平台数据通信',
    themeId: src.themeId || 'amber',
    cloud: {
      productId: src.cloud?.productId || '',
      deviceName: src.cloud?.deviceName || '',
      accessKey: src.cloud?.accessKey || '',
      signMethod: src.cloud?.signMethod || 'md5',
      tokenTtlDays: Number.isFinite(src.cloud?.tokenTtlDays) ? src.cloud.tokenTtlDays : 365,
      pollIntervalSeconds: Number.isFinite(src.cloud?.pollIntervalSeconds) && src.cloud.pollIntervalSeconds >= 1
        ? Math.min(3600, Math.floor(src.cloud.pollIntervalSeconds))
        : 3,
      getUrl: src.cloud?.getUrl || buildGetUrl({
        productId: src.cloud?.productId || '',
        deviceName: src.cloud?.deviceName || ''
      }),
      postUrl: src.cloud?.postUrl || 'https://iot-api.heclouds.com/thingmodel/set-device-desired-property',
      // 旧版导入不带 token，强制清空以避免误用过期/伪造值
      token: '',
      tokenExpiresAt: 0,
      // TODO: 临时调试字段 — token 算法修好后删除
      manualToken: '',
      mockMode: src.cloud?.mockMode !== false
    },
    displayPoints: Array.isArray(src.displayPoints) ? src.displayPoints : [],
    switchPoints: Array.isArray(src.switchPoints) ? src.switchPoints : [],
    thresholdPoints: Array.isArray(src.thresholdPoints) ? src.thresholdPoints : [],
    recommendedPoints: {
      display: [],
      switch: [],
      threshold: []
    }
  }

  saveConfig(imported)
  config.value = getConfig()
  // 让导入的新轮询间隔立即生效
  dataStore.start()

  const themeId = imported.themeId || 'amber'
  applyThemeToDOM(themeId)
  const app = getApp()
  if (app && app.setTheme) {
    app.setTheme(themeId)
  }

  showImportConfirm.value = false
  pendingImportData.value = null

  uni.showToast({ title: '配置已导入并应用', icon: 'success' })
}

function resetToFactory() {
  uni.showModal({
    title: '恢复出厂设置',
    content: '将清除所有配置（云平台连接、数据点、主题、邮箱设置等），回到应用初始状态。此操作不可撤销，确定继续？',
    confirmText: '确认重置',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        try {
          uni.removeStorageSync('cloud_comm_config')
          uni.removeStorageSync('cloud_comm_history')
          uni.removeStorageSync('cloud_comm_debug_values')
          uni.removeStorageSync('cloud_comm_email_config')
        } catch (e) {
          // ignore
        }
        uni.showToast({ title: '已恢复出厂设置', icon: 'success' })
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/settings/settings.vue' })
        }, 800)
      }
    }
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

.menu-card.points-action {
  border-color: rgba(43, 180, 120, 0.18);
  background: linear-gradient(135deg, var(--theme-card-accent-bg-start) 0%, var(--theme-card-accent-bg-end) 100%);
  box-shadow: 0 18rpx 42rpx var(--theme-card-accent-shadow);
}

.menu-card:active {
  transform: scale(0.985);
  opacity: 0.9;
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

/* ── Cloud / Authorization ── */
.field-tip {
  display: block;
  margin-top: 8rpx;
  color: var(--theme-text-tertiary);
  font-size: 22rpx;
  line-height: 1.4;
}

.auth-input {
  font-family: monospace;
  letter-spacing: 1rpx;
}

.cloud-actions {
  display: flex;
  gap: 14rpx;
  margin-top: 8rpx;
}

.cloud-actions .inline-btn {
  flex: 1;
  margin: 0;
}

.cloud-actions .primary-btn.inline-btn {
  width: auto;
}

.cloud-status {
  display: block;
  margin-top: 4rpx;
  padding: 14rpx 18rpx;
  border-radius: var(--theme-radius-input);
  font-size: 23rpx;
  font-weight: 700;
  line-height: 1.4;
  word-break: break-all;
}

.cloud-status.hint {
  background: var(--theme-category-tabs-bg);
  color: var(--theme-text-secondary);
}

.cloud-status.info {
  background: rgba(13, 201, 176, 0.12);
  color: var(--theme-accent);
}

.cloud-status.success {
  background: rgba(13, 201, 176, 0.18);
  color: var(--theme-accent);
}

.cloud-status.error {
  background: var(--theme-danger-bg);
  color: var(--theme-danger);
}

/* TODO: 临时手动 token 输入框样式 — 算法修好后删除整块 */
.manual-token-field .textarea.auth-input {
  min-height: 96rpx;
  font-family: monospace;
  font-size: 22rpx;
  line-height: 1.4;
  word-break: break-all;
}

.manual-token-field .field-tip {
  color: var(--theme-warning, #d97706);
}

/* ── Quick config tab (物模型一键导入) ── */
.quick-config-tab {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.qc-intro {
  display: block;
  color: var(--theme-text-secondary);
  font-size: 24rpx;
  line-height: 1.5;
}

.textarea.qc-textarea {
  min-height: 320rpx;
  font-family: monospace;
  font-size: 22rpx;
  line-height: 1.4;
  white-space: pre;
  word-break: break-all;
}

.qc-actions {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.qc-actions .inline-btn {
  flex: 1;
  margin: 0;
  min-width: 0;
  height: 72rpx;
  line-height: 72rpx;
}

.qc-preview {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 18rpx 20rpx;
  border: 1rpx solid var(--theme-divider-light);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface-alt);
}

.qc-summary-line {
  display: block;
  color: var(--theme-text-primary);
  font-size: 25rpx;
  font-weight: 900;
}

.qc-group {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  padding: 12rpx 0;
  border-top: 1rpx solid var(--theme-divider-light);
}

.qc-group:first-of-type {
  border-top: 0;
}

.qc-group-title {
  color: var(--theme-accent);
  font-size: 23rpx;
  font-weight: 800;
}

.qc-group-items {
  color: var(--theme-text-secondary);
  font-size: 23rpx;
  line-height: 1.45;
  word-break: break-all;
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
  transition: transform 0.12s ease, opacity 0.12s ease;
}

.quick-chip:active {
  transform: scale(0.96);
  opacity: 0.85;
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
  transition: transform 0.12s ease, opacity 0.12s ease;
}

.category-tab:active {
  transform: scale(0.95);
  opacity: 0.85;
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
  transition: transform 0.12s ease, opacity 0.12s ease;
}

.theme-card:active {
  transform: scale(0.97);
  opacity: 0.88;
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

/* ── Export / Import ── */
.export-action {
  border-color: rgba(43, 180, 120, 0.2);
}

.import-action {
  border-color: rgba(60, 130, 220, 0.2);
}

.export-intro {
  display: block;
  margin-bottom: 18rpx;
  color: var(--theme-text-secondary);
  font-size: 25rpx;
  line-height: 1.5;
}

.export-divider {
  display: flex;
  align-items: center;
  gap: 14rpx;
  margin: 6rpx 0;
}

.export-divider-line {
  flex: 1;
  height: 1rpx;
  background: var(--theme-divider);
}

.export-divider-text {
  color: var(--theme-text-tertiary);
  font-size: 23rpx;
  white-space: nowrap;
}

.export-email-row {
  display: flex;
  gap: 14rpx;
  align-items: center;
}

.export-email-input {
  flex: 1;
  height: 76rpx;
  padding: 0 20rpx;
  border: 1rpx solid var(--theme-input-border);
  border-radius: var(--theme-radius-input);
  background: var(--theme-input-bg);
  color: var(--theme-text-primary);
  font-size: 26rpx;
  box-sizing: border-box;
}

.export-send-btn {
  flex-shrink: 0;
  width: 120rpx;
  height: 76rpx;
  margin: 0;
  line-height: 76rpx;
}

.export-send-btn:disabled {
  opacity: 0.45;
}

.export-error {
  display: block;
  color: var(--theme-danger);
  font-size: 23rpx;
  font-weight: 700;
}

.import-preview-title {
  display: block;
  margin-bottom: 14rpx;
  color: var(--theme-text-primary);
  font-size: 27rpx;
  font-weight: 900;
}

.import-preview-card {
  padding: 4rpx 0;
  border: 1rpx solid var(--theme-divider-light);
  border-radius: var(--theme-radius-md);
  background: var(--theme-surface-alt);
  overflow: hidden;
}

.import-preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14rpx;
  padding: 18rpx 20rpx;
  border-bottom: 1rpx solid var(--theme-divider-light);
}

.import-preview-item:last-child {
  border-bottom: none;
}

.import-preview-label {
  color: var(--theme-text-secondary);
  font-size: 25rpx;
  font-weight: 700;
  flex-shrink: 0;
}

.import-preview-value {
  color: var(--theme-text-primary);
  font-size: 25rpx;
  font-weight: 800;
  text-align: right;
  word-break: break-all;
}

.import-preview-meta {
  color: var(--theme-text-tertiary);
  font-size: 23rpx;
}

.import-warning {
  padding: 18rpx 20rpx;
  border: 1rpx solid rgba(225, 29, 72, 0.2);
  border-radius: var(--theme-radius-md);
  background: var(--theme-danger-bg);
  color: var(--theme-danger);
  font-size: 24rpx;
  font-weight: 700;
  text-align: center;
}

.import-confirm-btn {
  margin-top: 8rpx;
}

/* ── Reset to factory ── */
.reset-action {
  border-color: rgba(225, 29, 72, 0.2);
}

.danger-arrow {
  background: var(--theme-danger) !important;
}
</style>
