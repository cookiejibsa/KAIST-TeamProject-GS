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
} = require('../validation')

const VALID_CATEGORIES = new Set(Object.keys(CATEGORIES))

let genAI = null

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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const result = await model.generateContent(prompt)
    const raw = result.response.text().trim()

    const clean = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/, '').trim()
    const parsed = JSON.parse(clean)

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

module.exports = router
