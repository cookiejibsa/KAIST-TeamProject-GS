// 로컬 추천 폴백 로직 (Gemini API 실패 시 사용)
const { MENUS } = require('../data/menus')

function scoreMenu(menu, inputs, recentCategories, excludeIds = []) {
  if (excludeIds.includes(menu.id)) return null
  if (inputs.budgetMax != null && menu.avgPrice > inputs.budgetMax) return null

  let score = 10
  if (inputs.weather && menu.weatherTags.includes(inputs.weather)) score += 6
  if (inputs.mood && menu.moodTags.includes(inputs.mood)) score += 6

  if (recentCategories.includes(menu.category)) score -= 6

  return { menu, score: Math.max(score, 0.5) }
}

function weightedPick(scored) {
  const total = scored.reduce((s, x) => s + x.score, 0)
  if (total <= 0) return scored[Math.floor(Math.random() * scored.length)]
  let r = Math.random() * total
  for (const x of scored) {
    r -= x.score
    if (r <= 0) return x
  }
  return scored[scored.length - 1]
}

function recommend(inputs, recentCategories = [], excludeIds = []) {
  const scored = MENUS
    .map((m) => scoreMenu(m, inputs, recentCategories, excludeIds))
    .filter(Boolean)

  if (scored.length === 0) return { picked: null }

  const picked = weightedPick(scored)
  return { picked: picked.menu, score: picked.score }
}

function explainPick(menu, inputs) {
  const bits = []
  if (inputs.weather && menu.weatherTags.includes(inputs.weather)) {
    bits.push(`${inputs.weather} 날씨에 잘 어울려요`)
  }
  if (inputs.mood && menu.moodTags.includes(inputs.mood)) {
    bits.push(`${inputs.mood}한 기분일 때 딱이에요`)
  }
  if (bits.length === 0) bits.push('오늘은 이거 어때요?')
  return bits.join(' · ')
}

module.exports = { recommend, explainPick }
