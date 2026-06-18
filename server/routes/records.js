const router = require('express').Router()
const db = require('../db')
const { authMiddleware } = require('../middleware/auth')
const { MENUS } = require('../data/menus')
const { uid } = require('../utils')
const {
  VALID_BUDGETS,
  VALID_MODES,
  VALID_MOODS,
  VALID_WEATHERS,
  clampInt,
  cleanString,
  isDateString,
  normalizeEnum,
  todayString,
  toInt,
} = require('../validation')

router.use(authMiddleware)

function mapRecord(r) {
  return {
    id: r.id,
    menuId: r.menu_id,
    name: r.name,
    emoji: r.emoji,
    category: r.category,
    date: r.date,
    price: r.price,
    rating: r.rating,
    mode: r.mode,
    mood: r.mood,
    weather: r.weather,
    budget: r.budget,
    aiReason: r.ai_reason,
    createdAt: r.created_at,
  }
}

// 기록 목록 조회
router.get('/', (req, res) => {
  const rows = db.records.findByUserId(req.user.id)
  res.json({ records: rows.map(mapRecord) })
})

// 기록 추가
router.post('/', (req, res) => {
  const { menuId, date, price, rating, mode, mood, weather, budget, aiReason } = req.body || {}
  const id = toInt(menuId, null)
  const menu = MENUS.find((m) => m.id === id)

  if (!menu) {
    return res.status(400).json({ error: '존재하지 않는 메뉴예요.' })
  }

  const recordDate = cleanString(date, 10)
  if (!isDateString(recordDate) || recordDate > todayString()) {
    return res.status(400).json({ error: '날짜가 올바르지 않아요.' })
  }

  const record = db.records.create({
    id: uid(),
    user_id: req.user.id,
    menu_id: menu.id,
    name: menu.name,
    emoji: menu.emoji,
    category: menu.category,
    date: recordDate,
    price: clampInt(price, 0, 100000, menu.avgPrice),
    rating: clampInt(rating, 0, 5, 0),
    mode: normalizeEnum(mode, VALID_MODES) || 'manual',
    mood: normalizeEnum(mood, VALID_MOODS),
    weather: normalizeEnum(weather, VALID_WEATHERS),
    budget: normalizeEnum(budget, VALID_BUDGETS),
    ai_reason: cleanString(aiReason, 300) || null,
    created_at: new Date().toISOString(),
  })

  res.json({ record: mapRecord(record) })
})

// 기록 삭제
router.delete('/:id', (req, res) => {
  const ok = db.records.delete(req.params.id, req.user.id)
  if (!ok) return res.status(404).json({ error: '기록을 찾을 수 없어요.' })
  res.json({ ok: true })
})

// 별점 수정
router.patch('/:id/rating', (req, res) => {
  const { rating } = req.body || {}
  const value = toInt(rating, null)
  if (value == null || value < 0 || value > 5) {
    return res.status(400).json({ error: '별점은 0점부터 5점까지 가능해요.' })
  }
  const ok = db.records.updateRating(req.params.id, req.user.id, value)
  if (!ok) return res.status(404).json({ error: '기록을 찾을 수 없어요.' })
  res.json({ ok: true })
})

module.exports = router
