import { useRef, useState } from 'react'
import { buildKeywords, youtubeSearchUrl } from '../lib/youtube'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'

const MODES = [
  { key: 'menu', label: '메뉴 연관', emoji: '🍜' },
  { key: 'mood', label: '기분/날씨', emoji: '🌤️' },
  { key: 'random', label: '완전 랜덤', emoji: '🎲' },
]

export default function YoutubeRecommend({ menu, mood, weather, mode: recMode = 'recommended' }) {
  const { addVideoView } = useApp()
  const { user } = useAuth()
  const requestRef = useRef(0)
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState(null)
  const [keywords, setKeywords] = useState([])
  const [source, setSource] = useState(null)
  const [loading, setLoading] = useState(false)

  const pick = async (m) => {
    const requestId = requestRef.current + 1
    requestRef.current = requestId
    setMode(m)
    setKeywords([])
    setSource(null)
    setLoading(true)

    try {
      const data = await api.post('/recommend/videos', {
        mode: m,
        menuId: menu?.id,
        menuName: menu?.name,
        mood,
        weather,
      })
      if (requestRef.current !== requestId) return
      const nextKeywords = Array.isArray(data.keywords) ? data.keywords : []
      setKeywords(nextKeywords.length ? nextKeywords : buildKeywords(m, { menu, mood, weather }))
      setSource(data.source || 'local')
    } catch (err) {
      if (requestRef.current !== requestId) return
      console.error('영상 추천 실패:', err)
      setKeywords(buildKeywords(m, { menu, mood, weather }))
      setSource('local')
    } finally {
      if (requestRef.current === requestId) setLoading(false)
    }
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
            disabled={loading}
            className={`flex-1 text-xs disabled:opacity-60 ${mode === m.key ? 'chip-on' : 'chip-off'}`}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-300 border-t-transparent" />
          Gemini가 영상 검색어 고르는 중...
        </div>
      )}

      {keywords.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2">
            <span className="text-xs">{source === 'ai' ? '✨' : '🔎'}</span>
            <p className="text-xs font-medium text-slate-500">
              {source === 'ai' ? 'Gemini AI 영상 추천' : '로컬 영상 추천'}
            </p>
          </div>
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
            <button
              onClick={() => pick(mode)}
              disabled={!mode || loading}
              className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-50"
            >
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
