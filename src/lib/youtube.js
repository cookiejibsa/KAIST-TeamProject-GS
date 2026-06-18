// 유튜브 검색어 생성 로직
import { CATEGORIES } from '../data/menus'
import { MENU_SUFFIXES, MOOD_WEATHER_KEYWORDS, RANDOM_POOL } from '../data/youtubeKeywords'

function sample(arr, n) {
  const copy = [...arr]
  const out = []
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  }
  return out
}

// mode: 'menu' | 'mood' | 'random'
export function buildKeywords(mode, { menu, mood, weather } = {}) {
  if (mode === 'menu' && menu) {
    const base = CATEGORIES[menu.category]?.label?.split('/')[0] || menu.name
    // 메뉴명 + 카테고리 기반 조합
    const pool = [
      `${menu.name} ${MENU_SUFFIXES[0]}`,
      `${menu.name} ${MENU_SUFFIXES[1]}`,
      `${base} ${MENU_SUFFIXES[2]}`,
      `${base} ${MENU_SUFFIXES[3]}`,
    ]
    return sample(pool, 3)
  }

  if (mode === 'mood') {
    const key = `${mood}|${weather}`
    const list = MOOD_WEATHER_KEYWORDS[key]
    if (list) return [...list]
    // 매핑 없으면 랜덤 fallback
    return sample(RANDOM_POOL, 3)
  }

  // random
  return sample(RANDOM_POOL, 3)
}

export function youtubeSearchUrl(keyword) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}`
}
