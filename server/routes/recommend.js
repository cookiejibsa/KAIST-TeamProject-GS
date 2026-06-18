const router = require('express').Router()
const { MENUS, CATEGORIES } = require('../data/menus')
const { PHOTO_POOL, photoUrl } = require('../data/photos')
const { recommend, explainPick } = require('../lib/recommend')
const {
  VALID_MOODS,
  VALID_WEATHERS,
  clampInt,
  cleanString,
  normalizeCategoryArray,
  normalizeEnum,
  normalizeIdArray,
  toInt,
} = require('../validation')

const VALID_CATEGORIES = new Set(Object.keys(CATEGORIES))
const VALID_VIDEO_MODES = new Set(['menu', 'mood', 'random'])

const MENU_SUFFIXES = ['먹방', '레시피', '맛집 추천', '꿀조합', '혼밥 브이로그']
const MOOD_WEATHER_KEYWORDS = {
  '피곤함|비': ['빗소리 ASMR', '퇴근 후 브이로그', '힐링 음악 모음'],
  '피곤함|추움': ['따뜻한 힐링 영상', '겨울 감성 브이로그', '잔잔한 피아노'],
  '피곤함|더움': ['시원한 자연 영상', '여름밤 ASMR', '에어컨 켜고 보는 영상'],
  '피곤함|맑음': ['멍 때리기 좋은 영상', '햇살 카페 브이로그', '로파이 힐링'],
  '보통|비': ['비 오는 날 플레이리스트', '카페 브이로그', '잔잔한 인디 음악'],
  '보통|추움': ['겨울 플레이리스트', '집순이 브이로그', '따뜻한 노래 모음'],
  '보통|더움': ['여름 시티팝', '바다 브이로그', '청량한 플레이리스트'],
  '보통|맑음': ['주말 브이로그', '드라이브 플레이리스트', '산책 영상'],
  '활기참|비': ['신나는 팝송 모음', '운동 플레이리스트', '비 오는 날 드라이브'],
  '활기참|추움': ['겨울 여행 브이로그', '신나는 K-POP', '운동 동기부여'],
  '활기참|더움': ['여름 페스티벌 영상', '서핑 브이로그', '신나는 EDM'],
  '활기참|맑음': ['여행 브이로그', '운동 루틴', '에너지 넘치는 팝송'],
}
const RANDOM_VIDEO_POOL = [
  '10분 미스터리',
  '레트로 광고 모음',
  '소름돋는 과학 상식',
  '세계 음식 다큐',
  '게임 하이라이트 모음',
  '우주 다큐멘터리',
  '역사 속 오늘',
  '몰랐던 잡학 상식',
  '명장면 모음 ZIP',
  '여행지 추천 영상',
  '캠핑 브이로그',
  '미니멀 라이프',
  '책 추천 영상',
]

let genAI = null
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

try {
  if (process.env.GEMINI_API_KEY) {
    const { GoogleGenerativeAI } = require('@google/generative-ai')
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    console.log('✅ Gemini AI 초기화 완료')
  } else {
    console.log('⚠️  GEMINI_API_KEY 없음 — 로컬 알고리즘으로 폴백')
  }
} catch (e) {
  console.error('Gemini 초기화 실패:', e.message)
}

router.post('/ai', async (req, res) => {
  const {
    mood: rawMood,
    weather: rawWeather,
    budgetMax: rawBudgetMax,
    recentCategories: rawRecentCategories = [],
    excludeIds: rawExcludeIds = [],
  } = req.body || {}

  const mood = normalizeEnum(rawMood, VALID_MOODS)
  const weather = normalizeEnum(rawWeather, VALID_WEATHERS)
  const budgetMax = rawBudgetMax == null ? null : clampInt(rawBudgetMax, 0, 100000, null)
  const recentCategories = normalizeCategoryArray(rawRecentCategories, VALID_CATEGORIES)
  const excludeIds = normalizeIdArray(rawExcludeIds)

  if (!genAI) {
    return localFallback(req, res, { mood, weather, budgetMax, recentCategories, excludeIds })
  }

  let candidates = MENUS.filter((m) => !excludeIds.includes(m.id))
  if (budgetMax != null) candidates = candidates.filter((m) => m.avgPrice <= budgetMax)
  if (candidates.length === 0) candidates = MENUS.filter((m) => !excludeIds.includes(m.id))
  if (candidates.length === 0) candidates = MENUS

  const menuList = candidates.map((m) => ({
    id: m.id,
    name: m.name,
    category: m.category,
    avgPrice: m.avgPrice,
    weatherTags: m.weatherTags,
    moodTags: m.moodTags,
  }))

  // 사진 풀을 간략하게 전달 (ID + 설명)
  const photoList = PHOTO_POOL.map((p) => `${p.id}: ${p.desc}`).join('\n')

  const prompt = `당신은 혼밥(혼자 먹는 밥) 메뉴 추천 전문가입니다.
아래 사용자 상태와 메뉴 목록을 보고, 가장 적합한 메뉴 하나를 골라주세요.
또한 아래 사진 목록 중 추천 메뉴에 가장 잘 어울리는 사진 ID 하나도 골라주세요.

사용자 상태:
- 기분(mood): ${mood || '없음'}
- 날씨(weather): ${weather || '없음'}
- 예산 상한: ${budgetMax ? budgetMax + '원' : '제한 없음'}
- 최근 3일 내 먹은 카테고리(가능하면 피해주세요): ${recentCategories.length ? recentCategories.join(', ') : '없음'}

선택 가능한 메뉴 목록:
${JSON.stringify(menuList)}

선택 가능한 사진 목록 (ID: 설명):
${photoList}

선택 규칙:
1. 예산(avgPrice ≤ budgetMax)을 반드시 지켜주세요
2. weatherTags와 moodTags에 현재 상태가 포함된 메뉴를 우선 고려하세요
3. 최근 먹은 카테고리는 최대한 피해주세요
4. 사진은 추천 메뉴의 분위기와 재료가 가장 잘 맞는 것을 골라주세요
5. 이유는 반드시 한국어로 1~2문장으로 작성해 주세요

아래 형식의 JSON만 응답하세요. 마크다운이나 코드블록 없이 순수 JSON만:
{"menuId": <숫자>, "reason": "<한국어 추천 이유 1~2문장>", "photoId": "<사진 ID>"}`

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
    const result = await model.generateContent(prompt)
    const parsed = parseJsonObject(result.response.text())

    const reason = cleanString(parsed.reason, 220)
    if (!parsed.menuId || !reason) throw new Error('Invalid AI response format')

    const menu = MENUS.find((m) => m.id === Number(parsed.menuId))
    if (!menu) throw new Error(`Unknown menuId: ${parsed.menuId}`)

    // photoId가 실제 풀에 있는지 검증, 없으면 카테고리 기본 사진으로
    const validPhoto = PHOTO_POOL.find((p) => p.id === cleanString(parsed.photoId, 80))
    const finalPhotoUrl = validPhoto ? photoUrl(validPhoto.id) : null

    return res.json({
      menuId: menu.id,
      reason,
      photoUrl: finalPhotoUrl,
      source: 'ai',
    })
  } catch (err) {
    console.error('Gemini 추천 실패, 로컬 폴백:', err.message)
    return localFallback(req, res, { mood, weather, budgetMax, recentCategories, excludeIds })
  }
})

router.post('/videos', async (req, res) => {
  const {
    mode: rawMode,
    menuId: rawMenuId,
    menuName: rawMenuName,
    mood: rawMood,
    weather: rawWeather,
  } = req.body || {}

  const mode = normalizeEnum(rawMode, VALID_VIDEO_MODES) || 'menu'
  const mood = normalizeEnum(rawMood, VALID_MOODS)
  const weather = normalizeEnum(rawWeather, VALID_WEATHERS)
  const menuId = toInt(rawMenuId, null)
  const menu = menuId ? MENUS.find((m) => m.id === menuId) : null
  const menuName = menu?.name || cleanString(rawMenuName, 50)
  const categoryLabel = menu ? CATEGORIES[menu.category]?.label : null

  const localKeywords = videoFallbackKeywords(mode, { menu, menuName, mood, weather })

  if (!genAI) {
    return res.json({ keywords: localKeywords, source: 'local' })
  }

  const prompt = `당신은 혼밥할 때 같이 볼 유튜브 검색어를 추천하는 큐레이터입니다.
아래 상황에 맞춰 유튜브 검색창에 바로 넣기 좋은 한국어 검색어 3개를 추천하세요.

상황:
- 추천 모드: ${mode}
- 음식 메뉴: ${menuName || '없음'}
- 음식 카테고리: ${categoryLabel || '없음'}
- 기분: ${mood || '없음'}
- 날씨: ${weather || '없음'}

추천 기준:
1. mode가 menu면 음식과 잘 어울리는 먹방, 맛집, 레시피, 브이로그 검색어를 우선하세요.
2. mode가 mood면 기분과 날씨에 맞는 플레이리스트, 브이로그, ASMR, 다큐 검색어를 우선하세요.
3. mode가 random이면 식사하면서 가볍게 보기 좋은 흥미로운 영상 검색어를 추천하세요.
4. 검색어는 2~7단어로 자연스럽고, 중복 없이, 선정적이거나 자극적인 표현은 피하세요.

아래 형식의 JSON만 응답하세요. 마크다운이나 코드블록 없이 순수 JSON만:
{"keywords":["검색어1","검색어2","검색어3"]}`

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
    const result = await model.generateContent(prompt)
    const parsed = parseJsonObject(result.response.text())
    const aiKeywords = normalizeKeywords(parsed.keywords)
    if (aiKeywords.length === 0) throw new Error('Invalid AI video keyword response')

    return res.json({
      keywords: mergeKeywords(aiKeywords, localKeywords),
      source: 'ai',
    })
  } catch (err) {
    console.error('Gemini 영상 추천 실패, 로컬 폴백:', err.message)
    return res.json({ keywords: localKeywords, source: 'local' })
  }
})

function localFallback(req, res, { mood, weather, budgetMax, recentCategories, excludeIds }) {
  const result = recommend({ mood, weather, budgetMax }, recentCategories, excludeIds)

  if (!result.picked) {
    return res.status(404).json({ error: '조건에 맞는 메뉴가 없어요. 예산을 넓혀보세요.' })
  }

  res.json({
    menuId: result.picked.id,
    reason: explainPick(result.picked, { mood, weather }),
    photoUrl: null, // 로컬 폴백은 카테고리 기본 사진 사용
    source: 'local',
  })
}

function parseJsonObject(raw) {
  const clean = String(raw || '')
    .trim()
    .replace(/^```json?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim()

  try {
    return JSON.parse(clean)
  } catch {
    const match = clean.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('AI response did not include JSON')
    return JSON.parse(match[0])
  }
}

function sample(arr, count) {
  const copy = [...arr]
  const out = []
  while (out.length < count && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  }
  return out
}

function normalizeKeywords(value) {
  if (!Array.isArray(value)) return []
  const keywords = []
  for (const item of value) {
    const keyword = cleanString(item, 80)
    if (keyword && !keywords.includes(keyword)) keywords.push(keyword)
    if (keywords.length === 3) break
  }
  return keywords
}

function mergeKeywords(primary, fallback) {
  return normalizeKeywords([...primary, ...fallback])
}

function videoFallbackKeywords(mode, { menu, menuName, mood, weather }) {
  if (mode === 'menu' && (menu || menuName)) {
    const name = menu?.name || menuName
    const base = menu ? CATEGORIES[menu.category]?.label?.split('/')[0] || name : name
    return sample([
      `${name} ${MENU_SUFFIXES[0]}`,
      `${name} ${MENU_SUFFIXES[1]}`,
      `${name} ${MENU_SUFFIXES[2]}`,
      `${base} ${MENU_SUFFIXES[3]}`,
      `${base} ${MENU_SUFFIXES[4]}`,
    ], 3)
  }

  if (mode === 'mood') {
    const mapped = MOOD_WEATHER_KEYWORDS[`${mood}|${weather}`]
    if (mapped) return [...mapped]
  }

  return sample(RANDOM_VIDEO_POOL, 3)
}

module.exports = router
