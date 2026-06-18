// 상태 기반 추천 엔진 — 가중치 점수제
// 기획서 로직:
//  - 최근 3일 먹은 카테고리 → 점수 감소 (중복 방지)
//  - 날씨 + 기분 조합 → 카테고리 필터(가산점)
//  - 예산/거리 → 최종 필터링(하드 컷)
//  - 남은 후보 중 가중치 랜덤 선택
import { MENUS } from '../data/menus'

const DAY = 24 * 60 * 60 * 1000

// 최근 N일 안에 먹은 카테고리별 마지막 섭취까지의 일수 맵
export function recentCategoryDays(eatLogs, withinDays = 3) {
  const now = Date.now()
  const map = {}
  for (const log of eatLogs) {
    const t = new Date(log.date).getTime()
    const days = Math.floor((now - t) / DAY)
    if (days < 0 || days > withinDays) continue
    if (map[log.category] === undefined || days < map[log.category]) {
      map[log.category] = days
    }
  }
  return map
}

// 단일 메뉴 점수 계산
export function scoreMenu(menu, inputs, recentMap, excludeIds = []) {
  if (excludeIds.includes(menu.id)) return null

  // --- 하드 필터: 예산 ---
  if (inputs.budgetMax != null && menu.avgPrice > inputs.budgetMax) return null
  // --- 하드 필터: 거리 ---
  if (inputs.distanceMax != null && menu.walk > inputs.distanceMax) return null

  let score = 10 // 기본 점수

  // --- 날씨 가산점 ---
  if (inputs.weather && menu.weatherTags.includes(inputs.weather)) score += 6

  // --- 기분 가산점 ---
  if (inputs.mood && menu.moodTags.includes(inputs.mood)) score += 6

  // --- 중복 방지: 최근 먹은 카테고리 감점 ---
  // 0일전(오늘) -9, 1일전 -6, 2일전 -3, 3일전 -1
  const d = recentMap[menu.category]
  if (d !== undefined) {
    const penalty = [9, 6, 3, 1][d] ?? 0
    score -= penalty
  }

  // 점수가 0 이하로 떨어지면 최소 가중치 보장 (완전 배제는 아님)
  return { menu, score: Math.max(score, 0.5) }
}

// 가중치 랜덤 추첨
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

// 메인 추천 함수
// inputs: { mood, weather, budgetMax, distanceMax }
// 반환: { picked, candidates } — candidates 는 점수순 정렬
export function recommend(inputs, eatLogs = [], excludeIds = []) {
  const recentMap = recentCategoryDays(eatLogs, 3)

  const scored = MENUS.map((m) => scoreMenu(m, inputs, recentMap, excludeIds)).filter(Boolean)

  if (scored.length === 0) {
    return { picked: null, candidates: [], reason: 'no-candidate' }
  }

  const picked = weightedPick(scored)
  const candidates = [...scored].sort((a, b) => b.score - a.score)

  return { picked: picked.menu, score: picked.score, candidates }
}

// 추천 이유 텍스트 생성 (사용자에게 보여줄 한 줄)
export function explainPick(menu, inputs) {
  const bits = []
  if (inputs.weather && menu.weatherTags.includes(inputs.weather)) {
    bits.push(`${inputs.weather} 날씨에 잘 어울려요`)
  }
  if (inputs.mood && menu.moodTags.includes(inputs.mood)) {
    bits.push(`${inputs.mood}한 기분일 때 딱`)
  }
  if (bits.length === 0) bits.push('오늘은 이거 어때요?')
  return bits.join(' · ')
}
