// 메뉴 마스터 데이터
// weatherTags: 더움 | 추움 | 비 | 맑음
// moodTags: 피곤함 | 보통 | 활기참 | 기념일
// avgPrice: 1인분 평균가(원) — 예산 필터에 사용
// walk: 보통 접근성(분) — 거리 필터에 사용 (편의점/배달류는 가까움)

export const CATEGORIES = {
  국밥찌개: { emoji: '🍲', label: '국밥/찌개' },
  면류: { emoji: '🍜', label: '면류' },
  한식백반: { emoji: '🍚', label: '한식 백반' },
  분식: { emoji: '🍢', label: '분식' },
  양식: { emoji: '🍝', label: '양식' },
  일식: { emoji: '🍣', label: '일식' },
  중식: { emoji: '🥡', label: '중식' },
  치킨버거: { emoji: '🍗', label: '치킨/버거' },
  샐러드건강: { emoji: '🥗', label: '샐러드/건강식' },
  간편식: { emoji: '🍱', label: '편의점/간편식' },
  카페디저트: { emoji: '🍰', label: '카페/디저트' },
}

export const MENUS = [
  // 국밥/찌개
  { id: 1, name: '돼지국밥', category: '국밥찌개', emoji: '🍲', avgPrice: 9000, walk: 8, weatherTags: ['추움', '비'], moodTags: ['피곤함', '보통'], protein: true },
  { id: 2, name: '순두부찌개', category: '국밥찌개', emoji: '🥘', avgPrice: 9000, walk: 7, weatherTags: ['추움', '비'], moodTags: ['피곤함', '보통'], protein: true },
  { id: 3, name: '김치찌개', category: '국밥찌개', emoji: '🍲', avgPrice: 8000, walk: 6, weatherTags: ['추움', '비', '맑음'], moodTags: ['피곤함', '보통'], protein: true },
  { id: 4, name: '설렁탕', category: '국밥찌개', emoji: '🍜', avgPrice: 11000, walk: 9, weatherTags: ['추움'], moodTags: ['피곤함'], protein: true },
  { id: 5, name: '육개장', category: '국밥찌개', emoji: '🌶️', avgPrice: 10000, walk: 8, weatherTags: ['추움', '비'], moodTags: ['피곤함', '활기참'], protein: true },

  // 면류
  { id: 10, name: '잔치국수', category: '면류', emoji: '🍜', avgPrice: 6000, walk: 6, weatherTags: ['추움', '비'], moodTags: ['보통', '피곤함'], protein: false },
  { id: 11, name: '비빔냉면', category: '면류', emoji: '🥶', avgPrice: 9000, walk: 7, weatherTags: ['더움'], moodTags: ['보통', '활기참'], protein: false },
  { id: 12, name: '물냉면', category: '면류', emoji: '❄️', avgPrice: 9000, walk: 7, weatherTags: ['더움'], moodTags: ['보통'], protein: false },
  { id: 13, name: '칼국수', category: '면류', emoji: '🍲', avgPrice: 8000, walk: 7, weatherTags: ['추움', '비'], moodTags: ['피곤함', '보통'], protein: false },
  { id: 14, name: '쌀국수', category: '면류', emoji: '🍜', avgPrice: 10000, walk: 9, weatherTags: ['추움', '비', '맑음'], moodTags: ['보통', '활기참'], protein: true },

  // 한식 백반
  { id: 20, name: '제육덮밥', category: '한식백반', emoji: '🍚', avgPrice: 8500, walk: 6, weatherTags: ['맑음', '추움'], moodTags: ['보통', '활기참'], protein: true },
  { id: 21, name: '불고기백반', category: '한식백반', emoji: '🥩', avgPrice: 10000, walk: 8, weatherTags: ['맑음', '추움'], moodTags: ['활기참', '기념일'], protein: true },
  { id: 22, name: '비빔밥', category: '한식백반', emoji: '🥗', avgPrice: 9000, walk: 7, weatherTags: ['맑음', '더움'], moodTags: ['보통', '활기참'], protein: false },
  { id: 23, name: '백반정식', category: '한식백반', emoji: '🍱', avgPrice: 9000, walk: 7, weatherTags: ['맑음', '추움', '비'], moodTags: ['보통'], protein: true },

  // 분식
  { id: 30, name: '떡볶이 세트', category: '분식', emoji: '🍢', avgPrice: 6000, walk: 5, weatherTags: ['추움', '비', '맑음'], moodTags: ['피곤함', '보통'], protein: false },
  { id: 31, name: '김밥', category: '분식', emoji: '🍙', avgPrice: 4000, walk: 4, weatherTags: ['맑음', '더움', '추움', '비'], moodTags: ['피곤함', '보통'], protein: false },
  { id: 32, name: '라면', category: '분식', emoji: '🍜', avgPrice: 4500, walk: 4, weatherTags: ['추움', '비'], moodTags: ['피곤함'], protein: false },
  { id: 33, name: '돈까스', category: '분식', emoji: '🍱', avgPrice: 9000, walk: 7, weatherTags: ['맑음', '추움'], moodTags: ['보통', '활기참'], protein: true },

  // 양식
  { id: 40, name: '토마토 파스타', category: '양식', emoji: '🍝', avgPrice: 12000, walk: 9, weatherTags: ['맑음'], moodTags: ['활기참', '기념일'], protein: false },
  { id: 41, name: '크림 파스타', category: '양식', emoji: '🍝', avgPrice: 13000, walk: 9, weatherTags: ['맑음', '추움'], moodTags: ['활기참', '기념일'], protein: false },
  { id: 42, name: '리조또', category: '양식', emoji: '🍚', avgPrice: 13000, walk: 10, weatherTags: ['추움', '비'], moodTags: ['활기참', '기념일'], protein: false },
  { id: 43, name: '스테이크 덮밥', category: '양식', emoji: '🥩', avgPrice: 14000, walk: 10, weatherTags: ['맑음'], moodTags: ['활기참', '기념일'], protein: true },

  // 일식
  { id: 50, name: '초밥 세트', category: '일식', emoji: '🍣', avgPrice: 14000, walk: 10, weatherTags: ['맑음'], moodTags: ['활기참', '기념일'], protein: true },
  { id: 51, name: '연어덮밥', category: '일식', emoji: '🍣', avgPrice: 13000, walk: 9, weatherTags: ['맑음', '더움'], moodTags: ['활기참', '기념일'], protein: true },
  { id: 52, name: '우동', category: '일식', emoji: '🍜', avgPrice: 8000, walk: 7, weatherTags: ['추움', '비'], moodTags: ['피곤함', '보통'], protein: false },
  { id: 53, name: '규동(소고기덮밥)', category: '일식', emoji: '🍚', avgPrice: 9000, walk: 7, weatherTags: ['맑음', '추움'], moodTags: ['보통', '활기참'], protein: true },

  // 중식
  { id: 60, name: '짜장면', category: '중식', emoji: '🥡', avgPrice: 7000, walk: 6, weatherTags: ['맑음', '비'], moodTags: ['피곤함', '보통'], protein: false },
  { id: 61, name: '짬뽕', category: '중식', emoji: '🍜', avgPrice: 9000, walk: 7, weatherTags: ['추움', '비'], moodTags: ['피곤함', '보통'], protein: false },
  { id: 62, name: '볶음밥', category: '중식', emoji: '🍚', avgPrice: 8000, walk: 6, weatherTags: ['맑음', '추움'], moodTags: ['보통', '활기참'], protein: false },
  { id: 63, name: '마라탕', category: '중식', emoji: '🌶️', avgPrice: 11000, walk: 8, weatherTags: ['추움', '비'], moodTags: ['활기참', '보통'], protein: true },

  // 치킨/버거
  { id: 70, name: '치킨버거 세트', category: '치킨버거', emoji: '🍔', avgPrice: 8000, walk: 6, weatherTags: ['맑음', '더움'], moodTags: ['보통', '활기참'], protein: true },
  { id: 71, name: '후라이드 치킨', category: '치킨버거', emoji: '🍗', avgPrice: 13000, walk: 8, weatherTags: ['맑음', '비'], moodTags: ['활기참', '기념일'], protein: true },
  { id: 72, name: '수제버거', category: '치킨버거', emoji: '🍔', avgPrice: 11000, walk: 8, weatherTags: ['맑음', '더움'], moodTags: ['활기참'], protein: true },

  // 샐러드/건강식
  { id: 80, name: '닭가슴살 샐러드', category: '샐러드건강', emoji: '🥗', avgPrice: 10000, walk: 7, weatherTags: ['더움', '맑음'], moodTags: ['활기참', '보통'], protein: true },
  { id: 81, name: '포케 볼', category: '샐러드건강', emoji: '🥗', avgPrice: 12000, walk: 9, weatherTags: ['더움', '맑음'], moodTags: ['활기참'], protein: true },
  { id: 82, name: '두부 샐러드', category: '샐러드건강', emoji: '🥗', avgPrice: 9000, walk: 7, weatherTags: ['더움', '맑음'], moodTags: ['보통', '활기참'], protein: true },

  // 편의점/간편식
  { id: 90, name: '편의점 도시락', category: '간편식', emoji: '🍱', avgPrice: 4500, walk: 3, weatherTags: ['맑음', '더움', '추움', '비'], moodTags: ['피곤함'], protein: true },
  { id: 91, name: '삼각김밥 + 컵라면', category: '간편식', emoji: '🍙', avgPrice: 3500, walk: 3, weatherTags: ['추움', '비'], moodTags: ['피곤함'], protein: false },
  { id: 92, name: '샌드위치', category: '간편식', emoji: '🥪', avgPrice: 4500, walk: 3, weatherTags: ['더움', '맑음'], moodTags: ['피곤함', '보통'], protein: false },

  // 카페/디저트
  { id: 100, name: '브런치 플레이트', category: '카페디저트', emoji: '🍳', avgPrice: 13000, walk: 10, weatherTags: ['맑음'], moodTags: ['활기참', '기념일'], protein: true },
  { id: 101, name: '베이글 + 커피', category: '카페디저트', emoji: '🥯', avgPrice: 8000, walk: 8, weatherTags: ['맑음', '더움'], moodTags: ['보통', '활기참'], protein: false },
]

// 예산 옵션 → 상한가(원). null = 상관없음
export const BUDGETS = [
  { key: 'low', label: '5천 이하', max: 5000 },
  { key: 'mid', label: '1만 이하', max: 10000 },
  { key: 'any', label: '상관없음', max: null },
]

// 거리 옵션 → 상한 도보(분). null = 상관없음
export const DISTANCES = [
  { key: 'near', label: '도보 5분', max: 5 },
  { key: 'mid', label: '도보 10분', max: 10 },
  { key: 'any', label: '상관없음', max: null },
]

export const MOODS = [
  { key: '피곤함', label: '피곤함', emoji: '😮‍💨' },
  { key: '보통', label: '보통', emoji: '🙂' },
  { key: '활기참', label: '활기참', emoji: '😄' },
]

export const WEATHERS = [
  { key: '더움', label: '더움', emoji: '🥵' },
  { key: '추움', label: '추움', emoji: '🥶' },
  { key: '비', label: '비', emoji: '🌧️' },
  { key: '맑음', label: '맑음', emoji: '☀️' },
]

export const getMenuById = (id) => MENUS.find((m) => m.id === id)
