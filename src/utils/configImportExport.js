/**
 * Config Import / Export Utility
 *
 * Handles serialization, deserialization, validation, file download (H5),
 * and file upload (H5) for configuration JSON files.
 */

const EXPORT_VERSION = 1

/**
 * Wrap a config object with export metadata and serialize to pretty JSON.
 * @param {object} config — the live config from getConfig()
 * @returns {string} pretty-printed JSON string
 */
export function serializeConfig(config) {
  const payload = {
    version: EXPORT_VERSION,
    exportedAt: Date.now(),
    appName: config.appName || '',
    themeId: config.themeId || '',
    cloud: { ...(config.cloud || {}) },
    displayPoints: (config.displayPoints || []).map(normalizeExportPoint),
    switchPoints: (config.switchPoints || []).map(normalizeExportPoint),
    thresholdPoints: (config.thresholdPoints || []).map(normalizeExportThreshold)
  }
  return JSON.stringify(payload, null, 2)
}

function normalizeExportPoint(p) {
  return {
    label: p.label || '',
    identifier: p.identifier || '',
    unit: p.unit || '',
    ...(p.alarmThresholdId ? { alarmThresholdId: p.alarmThresholdId } : {})
  }
}

function normalizeExportThreshold(p) {
  return {
    label: p.label || '',
    identifier: p.identifier || '',
    unit: p.unit || '',
    min: p.min ?? 0,
    max: p.max ?? 100,
    step: p.step ?? 1,
    value: p.value ?? 0
  }
}

/**
 * Parse a JSON string and return structured result.
 * @param {string} jsonStr
 * @returns {{ valid: boolean, data: object|null, errors: string[] }}
 */
export function deserializeConfig(jsonStr) {
  if (!jsonStr || !jsonStr.trim()) {
    return { valid: false, data: null, errors: ['文件内容为空'] }
  }

  let data
  try {
    data = JSON.parse(jsonStr)
  } catch (e) {
    return { valid: false, data: null, errors: ['文件格式错误，不是有效的 JSON'] }
  }

  return validateImportData(data)
}

/**
 * Validate that the parsed data has all required fields for import.
 * @param {any} data
 * @returns {{ valid: boolean, data: object|null, errors: string[] }}
 */
export function validateImportData(data) {
  const errors = []

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { valid: false, data: null, errors: ['无效的配置文件'] }
  }

  // version — optional for backward compat
  if (data.version !== undefined && typeof data.version !== 'number') {
    errors.push('version 字段格式错误')
  }

  // appName
  if (data.appName !== undefined && typeof data.appName !== 'string') {
    errors.push('appName 字段格式错误')
  }

  // cloud
  if (!data.cloud || typeof data.cloud !== 'object') {
    errors.push('缺少 cloud 配置')
  } else {
    if (!data.cloud.productId) errors.push('缺少 cloud.productId')
    if (!data.cloud.deviceName) errors.push('缺少 cloud.deviceName')
  }

  // themeId
  if (data.themeId !== undefined && typeof data.themeId !== 'string') {
    errors.push('themeId 字段格式错误')
  }

  // Points arrays
  ;['displayPoints', 'switchPoints', 'thresholdPoints'].forEach((key) => {
    if (data[key] !== undefined && !Array.isArray(data[key])) {
      errors.push(`${key} 格式错误，应为数组`)
    }
  })

  if (errors.length) {
    return { valid: false, data: null, errors }
  }

  return { valid: true, data, errors: [] }
}

/**
 * Generate a filename for the exported config.
 * @returns {string} e.g. cloud-config-20260617143000.json
 */
export function getExportFilename() {
  const pad = (n) => String(n).padStart(2, '0')
  const d = new Date()
  const ts = [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join('')
  return `cloud-config-${ts}.json`
}

/**
 * Trigger a JSON file download in the browser (H5 only).
 * Falls back to uni.showToast on non-H5 platforms.
 * @param {string} jsonStr — the JSON content
 * @param {string} filename — the download filename
 */
export function downloadJsonFile(jsonStr, filename) {
  if (typeof document === 'undefined' || !document.createElement) {
    uni.showToast({ title: '当前平台不支持文件下载', icon: 'none' })
    return
  }

  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  // Append to body so the click fires in Firefox
  document.body.appendChild(anchor)
  anchor.click()
  // Cleanup
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

/**
 * Open a hidden file picker for importing a .json config file (H5 only).
 * @returns {Promise<object|null>} resolves with the parsed config object,
 *   or null if the user cancelled.
 */
export function triggerFileImport() {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined' || !document.createElement) {
      uni.showToast({ title: '当前平台不支持文件导入', icon: 'none' })
      reject(new Error('Unsupported platform'))
      return
    }

    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'

    input.addEventListener('change', (e) => {
      const file = e.target?.files?.[0]
      if (!file) {
        resolve(null)
        cleanup()
        return
      }

      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const parsed = JSON.parse(ev.target.result)
          resolve(parsed)
        } catch (err) {
          uni.showToast({ title: '文件格式错误，不是有效的 JSON', icon: 'none' })
          resolve(null)
        }
        cleanup()
      }
      reader.onerror = () => {
        uni.showToast({ title: '读取文件失败', icon: 'none' })
        resolve(null)
        cleanup()
      }
      reader.readAsText(file, 'UTF-8')
    })

    input.addEventListener('cancel', () => {
      resolve(null)
      cleanup()
    })

    function cleanup() {
      if (input.parentNode) input.parentNode.removeChild(input)
    }

    // Keep a reference so GC doesn't kill the listener
    input.style.display = 'none'
    document.body.appendChild(input)
    input.click()
  })
}
