// 근처 식당 연동 — Kakao Map JS SDK 키가 없어도 동작하도록
// 카카오맵 검색 결과로 바로 연결 (키 발급 후 SDK 임베드로 확장 가능)
export default function MapLink({ menu }) {
  const query = encodeURIComponent(`${menu.name} 맛집`)
  const kakao = `https://map.kakao.com/?q=${query}`
  const naver = `https://map.naver.com/p/search/${query}`

  return (
    <div className="flex gap-2">
      <a href={kakao} target="_blank" rel="noreferrer" className="btn-ghost flex-1 text-sm">
        📍 카카오맵에서 찾기
      </a>
      <a href={naver} target="_blank" rel="noreferrer" className="btn-ghost flex-1 text-sm">
        🗺️ 네이버지도
      </a>
    </div>
  )
}
