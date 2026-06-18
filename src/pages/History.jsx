import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../data/menus'
import StarRating from '../components/StarRating'
import Reveal from '../components/Reveal'
import { youtubeSearchUrl } from '../lib/youtube'

const WEEK = ['일', '월', '화', '수', '목', '금', '토']

function ymd(d) {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

const MODE_LABELS = {
  recommended: { text: 'AI 추천', color: 'bg-brand-100 text-brand-700' },
  random:      { text: '랜덤', color: 'bg-amber-100 text-amber-700' },
  manual:      { text: '직접 기록', color: 'bg-slate-100 text-slate-500' },
}

const MOOD_EMOJI = { 피곤함: '😮‍💨', 보통: '🙂', 활기참: '😄', 기념일: '🎉' }
const WEATHER_EMOJI = { 더움: '🥵', 추움: '🥶', 비: '🌧️', 맑음: '☀️' }

export default function History() {
  const { eatLogs, videoViews, removeEatLog } = useApp()
  const { user } = useAuth()
  const [tab, setTab] = useState('eat')
  const [cursor, setCursor] = useState(new Date())
  const [selected, setSelected] = useState(ymd(new Date()))

  const year = cursor.getFullYear()
  const month = cursor.getMonth()

  const logsByDate = useMemo(() => {
    const map = {}
    for (const l of eatLogs) (map[l.date] ||= []).push(l)
    return map
  }, [eatLogs])

  const cells = useMemo(() => {
    const first = new Date(year, month, 1)
    const startPad = first.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const arr = []
    for (let i = 0; i < startPad; i++) arr.push(null)
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d))
    return arr
  }, [year, month])

  const balanceMsg = useMemo(() => {
    const now = Date.now()
    const week = eatLogs.filter((l) => (now - new Date(l.date).getTime()) / 86400000 <= 7)
    if (week.length < 3) return null
    const proteinCount = week.filter((l) =>
      ['국밥찌개', '한식백반', '일식', '치킨버거', '샐러드건강'].includes(l.category)
    ).length
    const ratio = proteinCount / week.length
    if (ratio < 0.3) return { tone: 'warn', text: '이번 주 단백질이 부족해요 🥩 고기·생선 한 끼 어때요?' }
    if (ratio > 0.7) return { tone: 'ok', text: '이번 주 단백질 잘 챙기고 있어요 💪' }
    return { tone: 'ok', text: '이번 주 식단 밸런스가 괜찮아요 👍' }
  }, [eatLogs])

  const move = (delta) => setCursor(new Date(year, month + delta, 1))
  const dayLogs = logsByDate[selected] || []

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-5 py-24 text-center">
        <span className="text-6xl">📅</span>
        <h1 className="text-2xl font-extrabold">식사 기록은 로그인 후 확인 가능해요</h1>
        <p className="text-sm text-slate-500">계정을 만들면 먹은 기록과 영상 기록이 저장돼요.</p>
        <Link to="/account" className="btn-primary px-8 py-3">로그인 / 회원가입</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Reveal as="header" className="pt-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
          📅 히스토리
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          <span className="text-gradient-flow">내 기록.</span>
        </h1>
      </Reveal>

      {/* 탭 */}
      <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-sm font-semibold">
        {[['eat', '🍽 식사 기록'], ['video', '🎬 영상 기록']].map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative rounded-xl py-2.5 transition ${tab === t ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'eat' && (
        <>
          {balanceMsg && (
            <Reveal
              delay={40}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                balanceMsg.tone === 'warn'
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {balanceMsg.text}
            </Reveal>
          )}

          <Reveal delay={80} className="card p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between">
              <button onClick={() => move(-1)} className="rounded-xl px-3 py-1 text-xl text-slate-400 hover:bg-slate-100">‹</button>
              <p className="font-bold">{year}년 {month + 1}월</p>
              <button onClick={() => move(1)} className="rounded-xl px-3 py-1 text-xl text-slate-400 hover:bg-slate-100">›</button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs text-slate-400">
              {WEEK.map((w) => <div key={w} className="py-1">{w}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {cells.map((d, i) => {
                if (!d) return <div key={i} />
                const key = ymd(d)
                const logs = logsByDate[key] || []
                const isSel = key === selected
                const isToday = key === ymd(new Date())
                return (
                  <button
                    key={key}
                    onClick={() => setSelected(key)}
                    className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition ${
                      isSel
                        ? 'bg-gradient-to-br from-brand-400 to-brand-500 text-white shadow-[0_8px_20px_-8px_rgba(245,78,58,0.7)]'
                        : isToday ? 'bg-brand-50'
                        : 'hover:bg-slate-100'
                    }`}
                  >
                    <span className={isToday && !isSel ? 'font-bold text-brand-500' : ''}>{d.getDate()}</span>
                    {logs.length > 0 && (
                      <span className="text-[10px] leading-none">{logs.slice(0, 2).map((l) => l.emoji).join('')}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </Reveal>

          <div>
            <h2 className="mb-3 text-sm font-bold text-slate-700">
              {selected} 기록 {dayLogs.length > 0 && `· ${dayLogs.length}끼`}
            </h2>
            {dayLogs.length === 0 ? (
              <p className="card px-4 py-10 text-center text-sm text-slate-400">이 날의 기록이 없어요</p>
            ) : (
              <ul className="space-y-2.5">
                {dayLogs.map((l) => (
                  <li key={l.id} className="card card-hover flex items-start gap-3 p-3.5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-3xl">
                      {l.emoji}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{l.name}</p>
                      <p className="text-xs text-slate-400">
                        {CATEGORIES[l.category]?.label} · {l.price?.toLocaleString()}원
                      </p>
                      {/* 추천 컨텍스트 배지 */}
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {l.mode && MODE_LABELS[l.mode] && (
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${MODE_LABELS[l.mode].color}`}>
                            {MODE_LABELS[l.mode].text}
                          </span>
                        )}
                        {l.mood && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                            {MOOD_EMOJI[l.mood] || ''} {l.mood}
                          </span>
                        )}
                        {l.weather && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                            {WEATHER_EMOJI[l.weather] || ''} {l.weather}
                          </span>
                        )}
                        {l.aiReason && (
                          <span className="w-full text-[11px] text-slate-400 italic mt-0.5">"{l.aiReason}"</span>
                        )}
                      </div>
                      {l.rating > 0 && <StarRating value={l.rating} size="text-sm" readOnly />}
                    </div>
                    <button
                      onClick={() => removeEatLog(l.id)}
                      className="rounded-lg px-2 py-1 text-sm text-slate-400 transition hover:bg-slate-100 hover:text-brand-500"
                      aria-label="삭제"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {tab === 'video' && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">클릭해서 검색한 YouTube 키워드가 저장돼요.</p>
          {videoViews.length === 0 ? (
            <p className="card px-4 py-16 text-center text-sm text-slate-400">
              아직 영상 기록이 없어요
            </p>
          ) : (
            <ul className="space-y-2.5">
              {videoViews.map((v) => (
                <li key={v.id} className="card card-hover flex items-center gap-3 p-3.5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-2xl">🎬</span>
                  <div className="flex-1 min-w-0">
                    <a
                      href={youtubeSearchUrl(v.keyword)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-brand-600 hover:underline"
                    >
                      {v.keyword}
                    </a>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {v.menuName && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                          🍽 {v.menuName}
                        </span>
                      )}
                      {v.mode && MODE_LABELS[v.mode] && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${MODE_LABELS[v.mode].color}`}>
                          {MODE_LABELS[v.mode].text}
                        </span>
                      )}
                      {v.mood && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                          {MOOD_EMOJI[v.mood] || ''} {v.mood}
                        </span>
                      )}
                      {v.weather && (
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">
                          {WEATHER_EMOJI[v.weather] || ''} {v.weather}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(v.viewedAt).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
