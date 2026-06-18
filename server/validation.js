const VALID_MOODS = new Set(['피곤함', '보통', '활기참'])
const VALID_WEATHERS = new Set(['더움', '추움', '비', '맑음'])
const VALID_BUDGETS = new Set(['low', 'mid', 'any'])
const VALID_MODES = new Set(['recommended', 'random', 'manual'])

function cleanString(value, max = 120) {
  if (typeof value !== 'string') return ''
  return value
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, max)
}

function isValidEmail(value) {
  if (typeof value !== 'string' || value.length > 254) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function normalizeEmail(value) {
  return cleanString(value, 254).toLowerCase()
}

function normalizePassword(value) {
  return typeof value === 'string' ? value : ''
}

function toInt(value, fallback = null) {
  const n = Number(value)
  if (!Number.isInteger(n)) return fallback
  return n
}

function clampInt(value, min, max, fallback) {
  const n = toInt(value, fallback)
  if (n == null) return fallback
  return Math.min(max, Math.max(min, n))
}

function isDateString(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const d = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value
}

function todayString() {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

function normalizeEnum(value, validSet) {
  const cleaned = cleanString(value, 40)
  return validSet.has(cleaned) ? cleaned : null
}

function normalizeIdArray(value, maxLength = 50) {
  if (!Array.isArray(value)) return []
  const ids = []
  for (const item of value.slice(0, maxLength)) {
    const id = toInt(item, null)
    if (id != null && id > 0 && !ids.includes(id)) ids.push(id)
  }
  return ids
}

function normalizeCategoryArray(value, validCategories, maxLength = 10) {
  if (!Array.isArray(value)) return []
  const out = []
  for (const item of value.slice(0, maxLength)) {
    const category = cleanString(item, 40)
    if (validCategories.has(category) && !out.includes(category)) out.push(category)
  }
  return out
}

module.exports = {
  VALID_BUDGETS,
  VALID_MODES,
  VALID_MOODS,
  VALID_WEATHERS,
  clampInt,
  cleanString,
  isDateString,
  isValidEmail,
  normalizeCategoryArray,
  normalizeEmail,
  normalizeEnum,
  normalizeIdArray,
  normalizePassword,
  todayString,
  toInt,
}
