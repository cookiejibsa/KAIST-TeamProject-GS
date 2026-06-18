import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../data/menus'
import Reveal from '../components/Reveal'
import CountUp from '../components/motion/CountUp'

// 따뜻한 톤 중심 + 구분용 보조색
const COLORS = ['#f54e3a', '#ff8a4c', '#fbbf24', '#fb7185', '#f59e0b', '#fda4af', '#34d399', '#38bdf8', '#a78bfa', '#facc15', '#fb923c']

const TOOLTIP_STYLE = {
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  color: '#0f172a',
  boxShadow: '0 8px 30px -12px rgba(15,23,42,0.25)',
}

function monthKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default function Stats() {
  const { eatLogs } = useApp()
  const { user } = useAuth()
  const [cursor, setCursor] = useState(new Date())
  const mk = monthKey(cursor)

  const monthLogs = useMemo(() => eatLogs.filter((l) => l.date.startsWith(mk)), [eatLogs, mk])

  const catData = useMemo(() => {
    const counts = {}
    for (const l of monthLogs) counts[l.category] = (counts[l.category] || 0) + 1
    return Object.entries(counts)
      .map(([cat, value]) => ({ name: CATEGORIES[cat]?.label || cat, value }))
      .sort((a, b) => b.value - a.value)
  }, [monthLogs])

  const stats = useMemo(() => {
    const total = monthLogs.length
    const spend = monthLogs.reduce((s, l) => s + (l.price || 0), 0)
    const avg = total ? Math.round(spend / total) : 0
    const top = catData[0]?.name
    const rated = monthLogs.filter((l) => l.rating > 0)
    const avgRating = rated.length
      ? (rated.reduce((s, l) => s + l.rating, 0) / rated.length).toFixed(1)
      : '-'
    return { total, spend, avg, top, avgRating }
  }, [monthLogs, catData])

  const move = (d) => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + d, 1))

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-5 py-24 text-center">
        <span className="text-6xl">📊</span>
        <h1 className="text-2xl font-extrabold">통계는 로그인 후 확인 가능해요</h1>
        <p className="text-sm text-slate-500">기록이 쌓일수록 정확한 월별 분석을 보여드려요.</p>
        <Link to="/account" className="btn-primary px-8 py-3">로그인 / 회원가입</Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Reveal as="header" className="flex items-end justify-between pt-2">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
            📊 월별 리포트
          </span>
          <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            <span className="text-gradient-flow">통계.</span>
          </h1>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <button onClick={() => move(-1)} className="rounded-xl px-2.5 py-1 text-lg text-slate-400 hover:bg-slate-100">
            ‹
          </button>
          <span className="font-semibold">{cursor.getMonth() + 1}월</span>
          <button onClick={() => move(1)} className="rounded-xl px-2.5 py-1 text-lg text-slate-400 hover:bg-slate-100">
            ›
          </button>
        </div>
      </Reveal>

      {monthLogs.length === 0 ? (
        <p className="card px-4 py-16 text-center text-sm text-slate-400">
          이번 달 기록이 아직 없어요
        </p>
      ) : (
        <>
          <Reveal delay={40} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="총 식사" num={stats.total} format={(v) => `${Math.round(v)}끼`} />
            <StatCard label="총 지출" num={stats.spend} format={(v) => `${Math.round(v).toLocaleString()}원`} />
            <StatCard label="끼당 평균" num={stats.avg} format={(v) => `${Math.round(v).toLocaleString()}원`} />
            <StatCard label="평균 만족도" text={`⭐ ${stats.avgRating}`} />
          </Reveal>

          <Reveal delay={80} className="card p-5">
            <h2 className="mb-2 text-sm font-bold text-slate-700">카테고리 분포</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={82}
                    paddingAngle={3}
                    stroke="none"
                    label={(e) => e.name}
                  >
                    {catData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}끼`} contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center text-sm text-slate-500">
              가장 많이 먹은 음식: <b className="text-gradient">{stats.top}</b>
            </p>
          </Reveal>

          <Reveal delay={120} className="card p-5">
            <h2 className="mb-2 text-sm font-bold text-slate-700">카테고리별 횟수</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData} layout="vertical" margin={{ left: 10, right: 16 }}>
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={72}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip
                    formatter={(v) => `${v}끼`}
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ fill: 'rgba(15,23,42,0.04)' }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                    {catData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>
        </>
      )}
    </div>
  )
}

function StatCard({ label, num, format, text }) {
  return (
    <div className="card card-hover p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight">
        {text != null ? text : <CountUp value={num} format={format} />}
      </p>
    </div>
  )
}
