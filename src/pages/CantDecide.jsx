import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MENUS, CATEGORIES } from '../data/menus'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import RecordSheet from '../components/RecordSheet'
import MapLink from '../components/MapLink'
import MenuHero from '../components/MenuHero'
import YoutubeRecommend from '../components/YoutubeRecommend'
import Reveal from '../components/Reveal'
import Magnetic from '../components/motion/Magnetic'

const DAY = 24 * 60 * 60 * 1000

export default function CantDecide() {
  const { eatLogs, addEatLog } = useApp()
  const { user } = useAuth()
  const [menu, setMenu] = useState(null)
  const [rejected, setRejected] = useState([])
  const [recording, setRecording] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [anim, setAnim] = useState('')

  const recentMenuIds = eatLogs
    .filter((l) => (Date.now() - new Date(l.date).getTime()) / DAY <= 2)
    .map((l) => l.menuId)

  const pickRandom = (extraExclude = []) => {
    const exclude = new Set([...recentMenuIds, ...rejected, ...extraExclude])
    let pool = MENUS.filter((m) => !exclude.has(m.id))
    if (pool.length === 0) pool = MENUS
    setMenu(pool[Math.floor(Math.random() * pool.length)])
    setSavedMsg('')
  }

  const start = () => {
    setRejected([])
    pickRandom([])
  }

  const skip = () => {
    if (!menu) return
    setAnim('skip')
    const next = [...rejected, menu.id]
    setRejected(next)
    setTimeout(() => {
      pickRandom(next)
      setAnim('')
    }, 200)
  }

  const handleSave = async ({ price, rating, date }) => {
    await addEatLog(menu, { price, rating, date, mode: 'random' })
    setRecording(false)
    setSavedMsg(`${menu.name} 기록 완료! 📅`)
  }

  return (
    <div className="space-y-8">
      <Reveal as="header" className="pt-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
          🎰 결정 장애 모드
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
          <span className="text-gradient-flow">못 고르겠어.</span>
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          버튼 하나로 완전 랜덤. 최근 먹은 건 자동으로 빼줄게요.
        </p>
      </Reveal>

      {!menu ? (
        <Reveal delay={80} className="card flex flex-col items-center gap-5 px-6 py-20 text-center">
          <span className="animate-float text-7xl">🤔</span>
          <p className="font-semibold text-slate-500">아무거나 골라줄게요</p>
          <Magnetic>
            <button onClick={start} className="btn-primary px-10 py-4 text-lg">
              🎲 랜덤으로 뽑기
            </button>
          </Magnetic>
        </Reveal>
      ) : (
        <>
          <div
            className={`card overflow-hidden transition duration-200 ${
              anim === 'skip' ? 'translate-x-10 rotate-6 opacity-0' : 'animate-pop-in'
            }`}
          >
            <MenuHero
              menu={menu}
              subtitle={`${CATEGORIES[menu.category]?.label} · ${menu.avgPrice.toLocaleString()}원`}
              gradFrom="from-amber-400"
              gradTo="to-rose-500"
            />
            <div className="space-y-2.5 p-4">
              {savedMsg ? (
                <p className="rounded-2xl border border-emerald-200 bg-emerald-50 py-3 text-center text-sm font-semibold text-emerald-600">
                  {savedMsg}
                </p>
              ) : user ? (
                <div className="flex gap-2.5">
                  <button onClick={skip} className="btn-ghost flex-1 py-4">
                    👎 이것도 싫어
                  </button>
                  <button onClick={() => setRecording(true)} className="btn-primary flex-1 py-4">
                    😋 이걸로!
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2.5">
                    <button onClick={skip} className="btn-ghost flex-1 py-4">
                      👎 이것도 싫어
                    </button>
                    <Link to="/account" className="btn-primary flex-1 py-4 text-center">
                      🔒 로그인 후 저장
                    </Link>
                  </div>
                  <p className="text-center text-xs text-slate-400">기록을 저장하려면 로그인이 필요해요</p>
                </div>
              )}
              <MapLink menu={menu} />
            </div>
          </div>

          <p className="text-center text-xs text-slate-400">지금까지 {rejected.length}개 넘김</p>

          <YoutubeRecommend menu={menu} mode="random" />
        </>
      )}

      {recording && menu && (
        <RecordSheet menu={menu} onSave={handleSave} onClose={() => setRecording(false)} />
      )}
    </div>
  )
}
