import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Reveal from './Reveal'

// 홈 → 각 메뉴(랜덤/기록/통계/계정)로 이동하는 사진 타일 (Apple/Meta 스타일 둘러보기 섹션)
// 사진은 Unsplash 직접 URL. 깨지면 그라데이션 + 이모지로 자연스럽게 대체됩니다.
const TILES = [
  {
    to: '/random',
    emoji: '🎰',
    title: '못 고르겠어?',
    desc: '버튼 하나로 완전 랜덤 추천 — 최근 먹은 건 자동 제외',
    cta: '랜덤 돌리기',
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=70',
    gradFrom: 'from-brand-500',
    gradTo: 'to-rose-600',
    span: 'md:col-span-2',
  },
  {
    to: '/history',
    emoji: '📅',
    title: '먹은 기록 달력',
    desc: '매일의 한 끼를 달력에 차곡차곡',
    cta: '기록 보기',
    img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=70',
    gradFrom: 'from-amber-500',
    gradTo: 'to-brand-500',
  },
  {
    to: '/stats',
    emoji: '📊',
    title: '월별 통계 리포트',
    desc: '지출·취향·식단 밸런스 한눈에',
    cta: '통계 보기',
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=70',
    gradFrom: 'from-rose-500',
    gradTo: 'to-amber-500',
  },
  {
    to: '/account',
    emoji: '👤',
    title: '내 계정 만들기',
    desc: '기록을 저장하고 어디서든 이어보기',
    cta: '로그인 / 회원가입',
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=70',
    gradFrom: 'from-orange-500',
    gradTo: 'to-rose-600',
    span: 'md:col-span-2',
  },
]

export default function ExploreGrid() {
  return (
    <section className="space-y-6">
      <Reveal>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
          ✨ 둘러보기
        </span>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">
          추천 말고도, <span className="text-gradient">이런 것도</span> 있어요.
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          눌러서 바로 이동해 보세요.
        </p>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2">
        {TILES.map((t, i) => (
          <Reveal key={t.to} delay={i * 70} className={t.span || ''}>
            <Tile tile={t} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Tile({ tile }) {
  const [broken, setBroken] = useState(false)
  const navigate = useNavigate()
  const go = () => navigate(tile.to)

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          go()
        }
      }}
      className="group relative block h-60 cursor-pointer overflow-hidden rounded-3xl border border-slate-200 shadow-[0_2px_20px_-6px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-18px_rgba(15,23,42,0.35)]"
    >
      {/* 배경: 사진 또는 그라데이션 폴백 */}
      {broken ? (
        <div className={`absolute inset-0 bg-gradient-to-br ${tile.gradFrom} ${tile.gradTo}`} />
      ) : (
        <img
          src={tile.img}
          alt={tile.title}
          loading="lazy"
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      )}

      {/* 가독성용 어두운 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      {/* 콘텐츠 */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
        <span className="mb-2 text-3xl drop-shadow">{tile.emoji}</span>
        <h3 className="text-2xl font-extrabold tracking-tight drop-shadow">{tile.title}</h3>
        <p className="mt-1 max-w-sm text-sm text-white/85 drop-shadow">{tile.desc}</p>
        <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-slate-900 shadow transition group-hover:gap-3 group-hover:bg-white">
          {tile.cta}
          <span className="transition group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </div>
  )
}
