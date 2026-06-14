export function formatValue(value, unit = '') {
  if (value === undefined || value === null || value === '') return '--'
  if (typeof value === 'number') return `${Number(value.toFixed(2))}${unit}`
  if (typeof value === 'boolean') return value ? '开启' : '关闭'
  return `${value}${unit}`
}

export function formatTime(timestamp) {
  if (!timestamp) return '--'
  const date = new Date(timestamp)
  const pad = (value) => String(value).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
