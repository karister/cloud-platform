/**
 * OneNET 物模型（Thing Model）JSON 解析工具
 *
 * 输入：云平台导出的物模型 JSON（包含 properties / events / services 等字段），
 * 输出：根据 properties 中的 identifier / name / accessMode / dataType 字段，
 * 把每个属性分类映射为本应用的三种数据点：
 *
 *   - threshold（阈值）：名称含「阈值」/ 标识符以 v 结尾（mq135v 等约定）
 *   - switch   （开关）：dataType.type 为 bool / boolean
 *   - display  （展示）：其余
 *
 * 只输出 label / identifier / unit / min / max / step 这些本应用真正使用的字段。
 */

const THRESHOLD_NAME_KEYWORDS = ['阈值', 'threshold', 'limit']
const SWITCH_TYPE_KEYWORDS = ['bool', 'boolean']

function isThreshold(name, identifier) {
  const n = String(name || '')
  const id = String(identifier || '')
  if (THRESHOLD_NAME_KEYWORDS.some((kw) => n.toLowerCase().includes(kw.toLowerCase()))) {
    return true
  }
  // 约定：identifier 以 "v" 结尾视为对应属性的阈值（如 mq135 ↔ mq135v）
  if (id.endsWith('v') && id.length > 1 && /\w/.test(id[id.length - 2])) {
    return true
  }
  return false
}

function isSwitch(dataType) {
  const t = String(dataType?.type || '').toLowerCase()
  return SWITCH_TYPE_KEYWORDS.includes(t)
}

function safeNumber(value, fallback) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function normalizeUnit(rawUnit) {
  if (!rawUnit) return ''
  const unit = String(rawUnit).trim()
  // OneNET 物模型里常见的中文单位保持原样；英文字符原样返回
  return unit
}

function classifyProperty(prop) {
  const identifier = String(prop?.identifier || '').trim()
  const name = String(prop?.name || '').trim()
  if (!identifier) return null

  const specs = prop?.dataType?.specs || {}
  const unit = normalizeUnit(specs.unit)
  const dataType = prop?.dataType || {}

  if (isThreshold(name, identifier)) {
    return {
      kind: 'threshold',
      point: {
        label: name || identifier,
        identifier,
        unit,
        min: safeNumber(specs.min, 0),
        max: safeNumber(specs.max, 100),
        step: safeNumber(specs.step, 1) || 1,
        value: safeNumber(specs.min, 0)
      }
    }
  }

  if (isSwitch(dataType)) {
    return {
      kind: 'switch',
      point: {
        label: name || identifier,
        identifier,
        unit
      }
    }
  }

  return {
    kind: 'display',
    point: {
      label: name || identifier,
      identifier,
      unit,
      alarmThresholdId: ''
    }
  }
}

/**
 * 解析物模型 JSON 字符串。
 *
 * @param {string} jsonStr
 * @returns {{
 *   ok: boolean,
 *   error?: string,
 *   total?: number,
 *   display: object[],
 *   switch: object[],
 *   threshold: object[]
 * }}
 */
export function parseThingModel(jsonStr) {
  const result = { ok: false, display: [], switch: [], threshold: [] }
  if (!jsonStr || !String(jsonStr).trim()) {
    return { ...result, error: '请先粘贴物模型 JSON' }
  }

  let data
  try {
    data = JSON.parse(jsonStr)
  } catch (err) {
    return { ...result, error: 'JSON 格式错误：' + (err?.message || '无法解析') }
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ...result, error: '物模型根节点必须是 JSON 对象' }
  }

  const properties = Array.isArray(data.properties) ? data.properties : []
  if (!properties.length) {
    return { ...result, error: '物模型中没有 properties 字段，或属性列表为空' }
  }

  let total = 0
  properties.forEach((prop) => {
    const classified = classifyProperty(prop)
    if (!classified) return
    total += 1
    result[classified.kind].push(classified.point)
  })

  return { ok: true, total, display: result.display, switch: result.switch, threshold: result.threshold }
}

/**
 * 把解析结果合并到现有 draft 上（追加，不覆盖已有项）。
 * 重复 identifier 会被跳过，避免把已有配置覆盖掉。
 *
 * @param {object} draft  - { displayPoints, switchPoints, thresholdPoints }
 * @param {object} parsed - parseThingModel 的输出
 * @returns {{ added: number, skipped: number, byKind: { display: number, switch: number, threshold: number } }}
 */
export function mergeParsedIntoDraft(draft, parsed) {
  const added = { display: 0, switch: 0, threshold: 0 }
  let skipped = 0
  if (!draft || !parsed?.ok) return { added: 0, skipped: 0, byKind: added }

  const keyMap = {
    display: 'displayPoints',
    switch: 'switchPoints',
    threshold: 'thresholdPoints'
  }

  ;['display', 'switch', 'threshold'].forEach((kind) => {
    const targetKey = keyMap[kind]
    const target = Array.isArray(draft[targetKey]) ? draft[targetKey] : (draft[targetKey] = [])
    const existing = new Set(target.map((p) => String(p.identifier)))
    parsed[kind].forEach((point) => {
      if (existing.has(String(point.identifier))) {
        skipped += 1
        return
      }
      target.push(point)
      existing.add(String(point.identifier))
      added[kind] += 1
    })
  })

  return {
    added: added.display + added.switch + added.threshold,
    skipped,
    byKind: added
  }
}
