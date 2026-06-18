import { useState } from 'react'

// 친구에게 오늘 메뉴 한 줄 공유 (Web Share API → 실패 시 클립보드 복사)
export default function ShareCard({ menu, mood, weather }) {
  const [copied, setCopied] = useState(false)

  const text = `오늘 혼밥 메뉴는 ${menu.emoji} ${menu.name}! ${
    weather ? `(${weather} 날씨, ` : '('
  }${mood || '오늘'} 기분) 🍽️ #오늘뭐먹지`

  const share = async () => {
    const shareData = { title: '오늘 뭐 먹지', text, url: window.location.origin }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        /* 취소 시 폴백으로 진행 */
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${window.location.origin}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button onClick={share} className="btn-ghost w-full">
      {copied ? '✅ 복사됐어요!' : '🤝 친구에게 오늘 메뉴 공유'}
    </button>
  )
}
