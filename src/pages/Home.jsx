import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MENUS, MOODS, WEATHERS, BUDGETS, CATEGORIES } from '../data/menus'
import { recommend, explainPick, recentCategoryDays } from '../lib/recommend'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import RecordSheet from '../components/RecordSheet'
import YoutubeRecommend from '../components/YoutubeRecommend'
import ShareCard from '../components/ShareCard'
import MapLink from '../components/MapLink'
import PhotoMarquee from '../components/PhotoMarquee'
import ExploreGrid from '../components/ExploreGrid'
import MenuHero from '../components/MenuHero'
import Magnetic from '../components/motion/Magnetic'
import TiltCard from '../components/motion/TiltCard'
import Reveal from '../components/Reveal'
import { FOOD_PHOTOS } from '../data/foodPhotos'

const P = Math.ceil(FOOD_PHOTOS.length / 3)
const PHOTO_ROWS = [
  FOOD_PHOTOS.slice(0, P),
  FOOD_PHOTOS.slice(P, 2 * P),
  FOOD_PHOTOS.slice(2 * P),
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function Home() {
  const { eatLogs, addEatLog, lastInputs, setLastInputs } = useApp()
  const { user } = useAuth()
  const pickerRef = useRef(null)

  const [mood, setMood] = useState(lastInputs.mood)
  const [weather, setWeather] = useState(lastInputs.weather)
  const [budget, setBudget] = useState(lastInputs.budget || 'mid')

  const [result, setResult] = useState(null)
  const [rejected, setRejected] = useState([])
  const [aiLoading, setAiLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')

  const budgetMax = BUDGETS.find((b) => b.key === budget)?.max ?? null

  const recommendNow = async () => {
    setRejected([])
    setAiLoading(true)
    setSavedMsg('')
    setLastInputs({ mood, weather, budget })

    try {
      const recentCats = Object.keys(recentCategoryDays(eatLogs, 3))
      const data = await api.post('/recommend/ai', {
        mood,
        weather,
        budgetMax,
        recentCategories: recentCats,
        excludeIds: [],
      })
      const picked = MENUS.find((m) => m.id === data.menuId)
      if (picked) {
        setResult({
          picked,
          aiReason: data.reason,
          photoUrl: data.photoUrl,
          source: data.source,
          fallbackNotice: data.source === 'local'
            ? 'Gemini 호출이 되지 않아 로컬 추천으로 보여드려요.'
            : null,
        })
      } else {
        setResult({
          ...recommend({ mood, weather, budgetMax }, eatLogs, []),
          source: 'local',
          fallbackNotice: 'Gemini 응답 메뉴를 확인하지 못해 로컬 추천으로 보여드려요.',
        })
      }
    } catch {
      // 서버 오류 시 로컬 알고리즘으로 폴백
      setResult({
        ...recommend({ mood, weather, budgetMax }, eatLogs, []),
        source: 'local',
        fallbackNotice: 'Gemini 호출이 되지 않아 로컬 추천으로 보여드려요.',
      })
    } finally {
      setAiLoading(false)
      setTimeout(
        () => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        80
      )
    }
  }

  const reroll = () => {
    if (!result?.picked) return
    const next = [...rejected, result.picked.id]
    setRejected(next)
    setSavedMsg('')
    const local = recommend({ mood, weather, budgetMax }, eatLogs, next)
    setResult(local ? { ...local, source: 'local' } : result)
  }

  const handleSave = async ({ price, rating, date }) => {
    await addEatLog(result.picked, {
      price, rating, date,
      mode: 'recommended',
      mood,
      weather,
      budget,
      aiReason: result.aiReason || null,
    })
    setRecording(false)
    setSavedMsg(`${result.picked.name} 기록 완료! 📅`)
  }

  const goPicker = () => pickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="space-y-20">
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-[84vh] flex-col justify-center">
        <div className="pointer-events-none absolute inset-y-0 left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden">
          <div className="flex h-full flex-col justify-center gap-4">
            <PhotoMarquee photos={PHOTO_ROWS[0]} duration={80} />
            <PhotoMarquee photos={PHOTO_ROWS[1]} reverse duration={95} />
            <PhotoMarquee photos={PHOTO_ROWS[2]} duration={85} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="max-w-3xl">
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
              <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-brand-400" />
              Gemini AI · 30초 개인화 추천
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-6xl font-black leading-[0.95] tracking-tighter text-slate-900 md:text-8xl"
          >
            오늘
            <br />
            <span className="text-gradient-flow">뭐 먹지?</span>
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-md text-lg text-slate-500">
            기분·날씨·예산만 고르면 끝.{' '}
            <span className="font-semibold text-slate-900">Gemini AI</span>가 딱 맞는 한 메뉴를 골라드려요.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <button onClick={goPicker} className="btn-primary px-7 py-4 text-base">
                지금 추천받기 ↓
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link to="/random" className="btn-ghost px-6 py-4 text-base">
                🎰 그냥 랜덤으로
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div variants={item} className="mt-12 flex gap-8 text-sm">
            <HeroStat n={`${MENUS.length}종`} label="메뉴 데이터" />
            <HeroStat n="AI" label="Gemini 추천" />
            <HeroStat n="30초" label="결정 시간" />
          </motion.div>
        </motion.div>

        <button
          onClick={goPicker}
          className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-slate-400 md:flex"
        >
          <span className="text-xs">SCROLL</span>
          <span className="animate-bounce-slow text-lg">↓</span>
        </button>
      </section>

      {/* ===== PICKER ===== */}
      <section ref={pickerRef} className="scroll-mt-28 space-y-8">
        <Reveal>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            지금 <span className="text-gradient">내 상태</span>를 알려줘.
          </h2>
          <p className="mt-2 text-sm text-slate-500">고를수록 AI 추천이 정확해져요. 비워둬도 괜찮아요.</p>
        </Reveal>

        <Reveal delay={80}>
          <div className="card p-5 md:p-7">
            <div className="grid gap-7 md:grid-cols-3">
              <Field title="지금 기분은?">
                <ChipRow items={MOODS} value={mood} onPick={(k) => setMood(k === mood ? null : k)} render={(m) => `${m.emoji} ${m.label}`} />
              </Field>
              <Field title="오늘 날씨는?">
                <ChipRow items={WEATHERS} value={weather} onPick={(k) => setWeather(k === weather ? null : k)} render={(w) => `${w.emoji} ${w.label}`} />
              </Field>
              <Field title="예산은?">
                <ChipRow items={BUDGETS} value={budget} onPick={setBudget} render={(b) => b.label} />
              </Field>
            </div>

            <Magnetic strength={0.2} className="mt-7">
              <button
                onClick={recommendNow}
                disabled={aiLoading}
                className="btn-primary w-full py-4 text-lg disabled:opacity-60"
              >
                {aiLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    AI 추천 중…
                  </span>
                ) : (
                  '✨ AI 메뉴 추천 받기'
                )}
              </button>
            </Magnetic>
          </div>
        </Reveal>

        {result && (
          <div id="result" className="scroll-mt-28">
            <ResultBlock
              result={result}
              inputs={{ mood, weather }}
              user={user}
              onReroll={reroll}
              onRecord={() => setRecording(true)}
              savedMsg={savedMsg}
            />
          </div>
        )}
      </section>

      {/* ===== 둘러보기 ===== */}
      <ExploreGrid />

      {recording && result?.picked && (
        <RecordSheet menu={result.picked} onSave={handleSave} onClose={() => setRecording(false)} />
      )}
    </div>
  )
}

function HeroStat({ n, label }) {
  return (
    <div>
      <p className="text-2xl font-extrabold tracking-tight text-slate-900">{n}</p>
      <p className="text-xs text-slate-400">{label}</p>
    </div>
  )
}

function Field({ title, children }) {
  return (
    <section>
      <h3 className="mb-2.5 text-sm font-bold text-slate-700">{title}</h3>
      {children}
    </section>
  )
}

function ChipRow({ items, value, onPick, render }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it) => (
        <button key={it.key} onClick={() => onPick(it.key)} className={value === it.key ? 'chip-on' : 'chip-off'}>
          {render(it)}
        </button>
      ))}
    </div>
  )
}

function ResultBlock({ result, inputs, user, onReroll, onRecord, savedMsg }) {
  if (!result.picked) {
    return (
      <div className="card animate-pop-in p-8 text-center">
        <p className="text-5xl">😅</p>
        <p className="mt-3 font-semibold">조건에 맞는 메뉴가 없어요</p>
        <p className="mt-1 text-sm text-slate-500">예산 조건을 넓혀보세요</p>
      </div>
    )
  }

  const m = result.picked
  const reason = result.aiReason || explainPick(m, inputs)
  const catLabel = CATEGORIES[m.category]?.label

  return (
    <div className="space-y-3">
      {result.fallbackNotice && (
        <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-medium text-amber-700">
          {result.fallbackNotice}
        </p>
      )}

      <TiltCard className="card animate-pop-in overflow-hidden">
        <MenuHero menu={m} eyebrow="오늘의 추천" subtitle={reason} photoUrl={result.photoUrl} />

        {result.source === 'ai' && (
          <div className="flex items-center gap-1.5 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-amber-50 px-4 py-2">
            <span className="text-xs">✨</span>
            <p className="text-xs font-medium text-brand-700">Gemini AI 추천</p>
          </div>
        )}

        <div className="flex items-center justify-around border-y border-slate-200 bg-slate-50/50 px-4 py-4 text-center text-sm">
          <div>
            <p className="text-xs text-slate-400">카테고리</p>
            <p className="mt-0.5 font-semibold">{catLabel}</p>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <p className="text-xs text-slate-400">평균가</p>
            <p className="mt-0.5 font-semibold">{m.avgPrice.toLocaleString()}원</p>
          </div>
        </div>

        <div className="space-y-2.5 p-4">
          {savedMsg ? (
            <p className="rounded-2xl border border-emerald-200 bg-emerald-50 py-3 text-center text-sm font-semibold text-emerald-600">
              {savedMsg}
            </p>
          ) : user ? (
            <div className="flex gap-2.5">
              <button onClick={onReroll} className="btn-ghost flex-1">
                🔄 다른 거
              </button>
              <button onClick={onRecord} className="btn-primary flex-1">
                ✅ 이거 먹었어요
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2.5">
                <button onClick={onReroll} className="btn-ghost flex-1">
                  🔄 다른 거
                </button>
                <Link to="/account" className="btn-primary flex-1 text-center">
                  🔒 로그인 후 저장
                </Link>
              </div>
              <p className="text-center text-xs text-slate-400">기록을 저장하려면 로그인이 필요해요</p>
            </div>
          )}
          <MapLink menu={m} />
        </div>
      </TiltCard>

      <YoutubeRecommend menu={m} mood={inputs.mood} weather={inputs.weather} mode="recommended" />
      <ShareCard menu={m} mood={inputs.mood} weather={inputs.weather} />
    </div>
  )
}
