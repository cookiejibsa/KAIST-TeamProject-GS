import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import Reveal from '../components/Reveal'
import CountUp from '../components/motion/CountUp'

export default function Account() {
  const { user } = useAuth()
  return user ? <Profile /> : <AuthForm />
}

/* ---------- 로그인 / 회원가입 ---------- */
function AuthForm() {
  const { login, signup } = useAuth()
  const [mode, setMode] = useState('login') // login | signup
  const [form, setForm] = useState({ email: '', password: '', nickname: '' })
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await (mode === 'login' ? login(form) : signup(form))
    if (res?.error) setError(res.error)
  }

  const inputCls =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100'

  return (
    <div className="mx-auto max-w-md">
      <Reveal className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
          👤 계정
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight">
          {mode === 'login' ? (
            <>
              다시 만나서 <span className="text-gradient">반가워요.</span>
            </>
          ) : (
            <>
              혼밥, <span className="text-gradient">함께 기록</span>해요.
            </>
          )}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          기록·통계를 내 계정에 저장하고 어디서든 이어보세요.
        </p>
      </Reveal>

      <Reveal delay={80} className="card p-6">
        {/* 탭 토글 */}
        <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1 text-sm font-semibold">
          {['login', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m)
                setError('')
              }}
              className="relative rounded-xl py-2.5"
            >
              {mode === m && (
                <motion.span
                  layoutId="auth-tab"
                  className="absolute inset-0 rounded-xl bg-white shadow-sm"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <span className={`relative z-10 ${mode === m ? 'text-slate-900' : 'text-slate-400'}`}>
                {m === 'login' ? '로그인' : '회원가입'}
              </span>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          <AnimatePresence initial={false}>
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="block pb-1">
                  <span className="mb-1.5 block text-sm font-medium text-slate-500">닉네임</span>
                  <input
                    value={form.nickname}
                    onChange={set('nickname')}
                    placeholder="혼밥러"
                    className={inputCls}
                  />
                </label>
              </motion.div>
            )}
          </AnimatePresence>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-500">이메일</span>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="me@example.com"
              className={inputCls}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-500">비밀번호</span>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="••••••"
              className={inputCls}
            />
          </label>

          {error && (
            <p className="rounded-xl bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary w-full py-3.5 text-base">
            {mode === 'login' ? '로그인' : '가입하고 시작하기'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          비밀번호는 해시 처리되어 서버에 저장돼요
        </p>
      </Reveal>
    </div>
  )
}

/* ---------- 로그인된 프로필 ---------- */
function Profile() {
  const { user, logout } = useAuth()
  const { eatLogs } = useApp()

  const totalSpend = eatLogs.reduce((s, l) => s + (l.price || 0), 0)
  const uniqueMenus = new Set(eatLogs.map((l) => l.menuId)).size

  return (
    <div className="mx-auto max-w-md space-y-6">
      <Reveal className="card overflow-hidden">
        <div className="relative px-6 py-10 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-amber-50" />
          <div className="relative">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-500 text-3xl font-black text-white shadow-[0_10px_30px_-10px_rgba(245,78,58,0.6)]">
              {user.nickname.slice(0, 1).toUpperCase()}
            </div>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight">{user.nickname}</h1>
            <p className="text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={60} className="grid grid-cols-3 gap-3">
        <ProfileStat label="총 기록" num={eatLogs.length} suffix="끼" />
        <ProfileStat label="먹어본 메뉴" num={uniqueMenus} suffix="종" />
        <ProfileStat label="누적 식비" num={totalSpend} suffix="원" />
      </Reveal>

      <Reveal delay={120}>
        <button onClick={logout} className="btn-ghost w-full py-3.5">
          로그아웃
        </button>
      </Reveal>
    </div>
  )
}

function ProfileStat({ label, num, suffix }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-lg font-extrabold tracking-tight">
        <CountUp value={num} format={(v) => Math.round(v).toLocaleString()} />
        <span className="text-sm">{suffix}</span>
      </p>
      <p className="mt-0.5 text-xs text-slate-400">{label}</p>
    </div>
  )
}
