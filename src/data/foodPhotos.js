// 히어로 배경에 흐르는 실제 음식 사진 (Unsplash 직접 URL, 모두 응답 확인됨)
const IDS = [
  '1504674900247-0877df9cc836',
  '1565299624946-b28f40a0ae38',
  '1568901346375-23c9450c58cd',
  '1546833999-b9f581a1996d',
  '1567620905732-2d1ec7ab7445',
  '1551782450-a2132b4ba21d',
  '1473093295043-cdd812d0e601',
  '1540189549336-e6e99c3679fe',
  '1546069901-ba9599a7e63c',
  '1498837167922-ddd27525d352',
  '1565958011703-44f9829ba187',
  '1482049016688-2d3e1b311543',
  '1432139555190-58524dae6a55',
  '1467003909585-2f8a72700288',
  '1414235077428-338989a2e8c0',
  '1565895405138-6c3a1555da6a',
  '1484723091739-30a097e8f929',
  '1476224203421-9ac39bcb3327',
]

export const FOOD_PHOTOS = IDS.map(
  (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=500&q=60`
)

const photo = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=65`

// 카테고리별 실제 음식 사진 (추천/랜덤 결과 카드 배경) — 모두 응답 확인됨
export const CATEGORY_PHOTOS = {
  국밥찌개: photo('1547592180-85f173990554'),
  면류: photo('1546833999-b9f581a1996d'),
  한식백반: photo('1498654896293-37aacf113fd9'),
  분식: photo('1635363638580-c2809d049eee'),
  양식: photo('1473093295043-cdd812d0e601'),
  일식: photo('1579871494447-9811cf80d66c'),
  중식: photo('1525755662778-989d0524087e'),
  치킨버거: photo('1568901346375-23c9450c58cd'),
  샐러드건강: photo('1546069901-ba9599a7e63c'),
  간편식: photo('1528735602780-2552fd46c7af'),
  카페디저트: photo('1533089860892-a7c6f0a88666'),
}

// 메뉴에 맞는 배경 사진 (카테고리 기반, 없으면 일반 음식 사진)
export function getFoodPhoto(menu) {
  return CATEGORY_PHOTOS[menu?.category] || FOOD_PHOTOS[0]
}
