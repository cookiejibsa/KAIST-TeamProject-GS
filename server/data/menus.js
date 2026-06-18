// 프론트엔드 src/data/menus.js 의 CommonJS 버전 (서버 전용)
const CATEGORIES = {
  국밥찌개: { emoji: '🍲', label: '국밥/찌개' },
  면류:     { emoji: '🍜', label: '면류' },
  한식백반: { emoji: '🍚', label: '한식 백반' },
  분식:     { emoji: '🍢', label: '분식' },
  양식:     { emoji: '🍝', label: '양식' },
  일식:     { emoji: '🍣', label: '일식' },
  중식:     { emoji: '🥡', label: '중식' },
  치킨버거: { emoji: '🍗', label: '치킨/버거' },
  샐러드건강: { emoji: '🥗', label: '샐러드/건강식' },
  간편식:   { emoji: '🍱', label: '편의점/간편식' },
  카페디저트: { emoji: '🍰', label: '카페/디저트' },
}

const MENUS = [
  // 국밥/찌개
  { id: 1,  name: '돼지국밥',       category: '국밥찌개', emoji: '🍲', avgPrice: 9000,  weatherTags: ['추움','비'],           moodTags: ['피곤함','보통'] },
  { id: 2,  name: '순두부찌개',      category: '국밥찌개', emoji: '🥘', avgPrice: 9000,  weatherTags: ['추움','비'],           moodTags: ['피곤함','보통'] },
  { id: 3,  name: '김치찌개',       category: '국밥찌개', emoji: '🍲', avgPrice: 8000,  weatherTags: ['추움','비','맑음'],    moodTags: ['피곤함','보통'] },
  { id: 4,  name: '설렁탕',        category: '국밥찌개', emoji: '🍜', avgPrice: 11000, weatherTags: ['추움'],               moodTags: ['피곤함'] },
  { id: 5,  name: '육개장',        category: '국밥찌개', emoji: '🌶️', avgPrice: 10000, weatherTags: ['추움','비'],           moodTags: ['피곤함','활기참'] },
  // 면류
  { id: 10, name: '잔치국수',       category: '면류', emoji: '🍜', avgPrice: 6000,  weatherTags: ['추움','비'],           moodTags: ['보통','피곤함'] },
  { id: 11, name: '비빔냉면',       category: '면류', emoji: '🥶', avgPrice: 9000,  weatherTags: ['더움'],               moodTags: ['보통','활기참'] },
  { id: 12, name: '물냉면',        category: '면류', emoji: '❄️', avgPrice: 9000,  weatherTags: ['더움'],               moodTags: ['보통'] },
  { id: 13, name: '칼국수',        category: '면류', emoji: '🍲', avgPrice: 8000,  weatherTags: ['추움','비'],           moodTags: ['피곤함','보통'] },
  { id: 14, name: '쌀국수',        category: '면류', emoji: '🍜', avgPrice: 10000, weatherTags: ['추움','비','맑음'],    moodTags: ['보통','활기참'] },
  // 한식 백반
  { id: 20, name: '제육덮밥',       category: '한식백반', emoji: '🍚', avgPrice: 8500,  weatherTags: ['맑음','추움'],         moodTags: ['보통','활기참'] },
  { id: 21, name: '불고기백반',      category: '한식백반', emoji: '🥩', avgPrice: 10000, weatherTags: ['맑음','추움'],         moodTags: ['활기참','기념일'] },
  { id: 22, name: '비빔밥',        category: '한식백반', emoji: '🥗', avgPrice: 9000,  weatherTags: ['맑음','더움'],         moodTags: ['보통','활기참'] },
  { id: 23, name: '백반정식',       category: '한식백반', emoji: '🍱', avgPrice: 9000,  weatherTags: ['맑음','추움','비'],    moodTags: ['보통'] },
  // 분식
  { id: 30, name: '떡볶이 세트',    category: '분식', emoji: '🍢', avgPrice: 6000,  weatherTags: ['추움','비','맑음'],    moodTags: ['피곤함','보통'] },
  { id: 31, name: '김밥',         category: '분식', emoji: '🍙', avgPrice: 4000,  weatherTags: ['맑음','더움','추움','비'], moodTags: ['피곤함','보통'] },
  { id: 32, name: '라면',         category: '분식', emoji: '🍜', avgPrice: 4500,  weatherTags: ['추움','비'],           moodTags: ['피곤함'] },
  { id: 33, name: '돈까스',        category: '분식', emoji: '🍱', avgPrice: 9000,  weatherTags: ['맑음','추움'],         moodTags: ['보통','활기참'] },
  // 양식
  { id: 40, name: '토마토 파스타',   category: '양식', emoji: '🍝', avgPrice: 12000, weatherTags: ['맑음'],               moodTags: ['활기참','기념일'] },
  { id: 41, name: '크림 파스타',    category: '양식', emoji: '🍝', avgPrice: 13000, weatherTags: ['맑음','추움'],         moodTags: ['활기참','기념일'] },
  { id: 42, name: '리조또',        category: '양식', emoji: '🍚', avgPrice: 13000, weatherTags: ['추움','비'],           moodTags: ['활기참','기념일'] },
  { id: 43, name: '스테이크 덮밥',   category: '양식', emoji: '🥩', avgPrice: 14000, weatherTags: ['맑음'],               moodTags: ['활기참','기념일'] },
  // 일식
  { id: 50, name: '초밥 세트',      category: '일식', emoji: '🍣', avgPrice: 14000, weatherTags: ['맑음'],               moodTags: ['활기참','기념일'] },
  { id: 51, name: '연어덮밥',       category: '일식', emoji: '🍣', avgPrice: 13000, weatherTags: ['맑음','더움'],         moodTags: ['활기참','기념일'] },
  { id: 52, name: '우동',         category: '일식', emoji: '🍜', avgPrice: 8000,  weatherTags: ['추움','비'],           moodTags: ['피곤함','보통'] },
  { id: 53, name: '규동(소고기덮밥)', category: '일식', emoji: '🍚', avgPrice: 9000,  weatherTags: ['맑음','추움'],         moodTags: ['보통','활기참'] },
  // 중식
  { id: 60, name: '짜장면',        category: '중식', emoji: '🥡', avgPrice: 7000,  weatherTags: ['맑음','비'],           moodTags: ['피곤함','보통'] },
  { id: 61, name: '짬뽕',         category: '중식', emoji: '🍜', avgPrice: 9000,  weatherTags: ['추움','비'],           moodTags: ['피곤함','보통'] },
  { id: 62, name: '볶음밥',        category: '중식', emoji: '🍚', avgPrice: 8000,  weatherTags: ['맑음','추움'],         moodTags: ['보통','활기참'] },
  { id: 63, name: '마라탕',        category: '중식', emoji: '🌶️', avgPrice: 11000, weatherTags: ['추움','비'],           moodTags: ['활기참','보통'] },
  // 치킨/버거
  { id: 70, name: '치킨버거 세트',   category: '치킨버거', emoji: '🍔', avgPrice: 8000,  weatherTags: ['맑음','더움'],         moodTags: ['보통','활기참'] },
  { id: 71, name: '후라이드 치킨',   category: '치킨버거', emoji: '🍗', avgPrice: 13000, weatherTags: ['맑음','비'],           moodTags: ['활기참','기념일'] },
  { id: 72, name: '수제버거',       category: '치킨버거', emoji: '🍔', avgPrice: 11000, weatherTags: ['맑음','더움'],         moodTags: ['활기참'] },
  // 샐러드/건강식
  { id: 80, name: '닭가슴살 샐러드', category: '샐러드건강', emoji: '🥗', avgPrice: 10000, weatherTags: ['더움','맑음'],         moodTags: ['활기참','보통'] },
  { id: 81, name: '포케 볼',       category: '샐러드건강', emoji: '🥗', avgPrice: 12000, weatherTags: ['더움','맑음'],         moodTags: ['활기참'] },
  { id: 82, name: '두부 샐러드',    category: '샐러드건강', emoji: '🥗', avgPrice: 9000,  weatherTags: ['더움','맑음'],         moodTags: ['보통','활기참'] },
  // 편의점/간편식
  { id: 90, name: '편의점 도시락',   category: '간편식', emoji: '🍱', avgPrice: 4500,  weatherTags: ['맑음','더움','추움','비'], moodTags: ['피곤함'] },
  { id: 91, name: '삼각김밥 + 컵라면', category: '간편식', emoji: '🍙', avgPrice: 3500, weatherTags: ['추움','비'],           moodTags: ['피곤함'] },
  { id: 92, name: '샌드위치',       category: '간편식', emoji: '🥪', avgPrice: 4500,  weatherTags: ['더움','맑음'],         moodTags: ['피곤함','보통'] },
  // 카페/디저트
  { id: 100, name: '브런치 플레이트', category: '카페디저트', emoji: '🍳', avgPrice: 13000, weatherTags: ['맑음'],             moodTags: ['활기참','기념일'] },
  { id: 101, name: '베이글 + 커피',  category: '카페디저트', emoji: '🥯', avgPrice: 8000,  weatherTags: ['맑음','더움'],       moodTags: ['보통','활기참'] },
]

const BUDGETS = [
  { key: 'low', label: '5천 이하', max: 5000 },
  { key: 'mid', label: '1만 이하', max: 10000 },
  { key: 'any', label: '상관없음', max: null },
]

module.exports = { MENUS, CATEGORIES, BUDGETS }
