import { useState } from 'react'
import { buildKeywords, youtubeSearchUrl } from '../lib/youtube'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const MODES = [
  { key: 'menu', label: '메뉴 연관', emoji: '🍜' },
  { key: 'mood', label: '기분/날씨', emoji: '🌤️' },
  { key: 'random', label: '완전 랜덤', emoji: '🎲' },
]

export default function YoutubeRecommend({ menu, mood, weather, mode: recMode = 'recommended' }) {
  const { addVideoView } = useApp()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(null)
  const [keywords, setKeywords] = useState([])

  const pick = (m) => {
    setMode(m)
    setKeywords(buildKeywords(m, { menu, mood, weather }))
  }

  const handleClick = (kw) => {
    if (user) {
      addVideoView({
        menuId: menu?.id,
        menuName: menu?.name,
        keyword: kw,
        mode: recMode,
        mood: mood || null,
        weather: weather || null,
      })
    }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-ghost w-full">
        🎬 오늘 뭐 보면서 먹지?
      </button>
    )
  }

  return (
    <div className="card animate-pop-in space-y-3 p-4">
      <div className="flex items-center justify-between">
        <p className="font-bold">🎬 같이 볼 영상 추천</p>
        <button onClick={() => setOpen(false)} className="text-sm text-slate-400 hover:text-slate-700">
          닫기
        </button>
      </div>

      <div className="flex gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => pick(m.key)}
            className={`flex-1 text-xs ${mode === m.key ? 'chip-on' : 'chip-off'}`}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      {keywords.length > 0 && (
        <div className="space-y-2">
          {keywords.map((kw) => (
            <a
              key={kw}
              href={youtubeSearchUrl(kw)}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleClick(kw)}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium transition hover:border-brand-300 hover:bg-brand-50"
            >
              <span>🔍 {kw}</span>
              <span className="text-brand-500">▶</span>
            </a>
          ))}
          <div className="flex items-center justify-between pt-1">
            <button onClick={() => pick(mode)} className="text-xs text-slate-400 hover:text-slate-700">
              🔄 다른 검색어 보기
            </button>
            {!user && (
              <span className="text-xs text-slate-400">로그인하면 시청 기록이 저장돼요</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
