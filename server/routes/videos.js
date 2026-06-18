const router = require('express').Router()
const db = require('../db')
const { authMiddleware } = require('../middleware/auth')
const { MENUS } = require('../data/menus')
const { uid } = require('../utils')
const {
  VALID_MODES,
  VALID_MOODS,
  VALID_WEATHERS,
  cleanString,
  normalizeEnum,
  toInt,
} = require('../validation')

router.use(authMiddleware)

function mapVideo(v) {
  return {
    id: v.id,
    menuId: v.menu_id,
    menuName: v.menu_name,
    keyword: v.keyword,
    mode: v.mode,
    mood: v.mood,
    weather: v.weather,
    viewedAt: v.viewed_at,
  }
}

// 시청 기록 조회
router.get('/', (req, res) => {
  const rows = db.videos.findByUserId(req.user.id)
  res.json({ videos: rows.map(mapVideo) })
})

// 시청 기록 저장
router.post('/', (req, res) => {
  const { menuId, menuName, keyword, mode, mood, weather } = req.body || {}
  const cleanKeyword = cleanString(keyword, 100)

  if (!cleanKeyword) return res.status(400).json({ error: '검색어(keyword)가 필요해요.' })

  const id = toInt(menuId, null)
  const menu = id ? MENUS.find((m) => m.id === id) : null

  db.videos.create({
    id: uid(),
    user_id: req.user.id,
    menu_id: menu?.id || null,
    menu_name: menu?.name || cleanString(menuName, 50) || null,
    keyword: cleanKeyword,
    mode: normalizeEnum(mode, VALID_MODES),
    mood: normalizeEnum(mood, VALID_MOODS),
    weather: normalizeEnum(weather, VALID_WEATHERS),
    viewed_at: new Date().toISOString(),
  })

  res.json({ ok: true })
})

module.exports = router
