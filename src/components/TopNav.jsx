import { Fragment } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { NAV_ITEMS } from './navItems'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

// 데스크톱: 화면 상단 전체를 가로지르는 넓은 헤더 바 (Apple/Meta 스타일)
export default function TopNav() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const isActive = (to) => (to === '/' ? pathname === '/' : pathname.startsWith(to))
  const links = NAV_ITEMS.filter((it) => it.to !== '/account')

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 26, delay: 0.05 }}
      className="fixed inset-x-0 top-0 z-50 hidden border-b border-slate-200 bg-white/80 backdrop-blur-xl md:block"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-8">
        <NavLink to="/" aria-label="홈">
          <Logo />
        </NavLink>

        <nav className="flex items-center">
          {links.map((it, idx) => {
            const active = isActive(it.to)
            return (
              <Fragment key={it.to}>
                {idx > 0 && <span className="mx-1 h-3.5 w-px bg-slate-200" />}
                <NavLink to={it.to} className="relative px-5 py-2 text-sm font-semibold">
                  <span className={active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}>
                    {it.label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-4 -bottom-[9px] h-0.5 rounded-full bg-gradient-to-r from-brand-400 to-brand-500"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </NavLink>
              </Fragment>
            )
          })}
        </nav>

        {user ? (
          <NavLink
            to="/account"
            className={`flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-sm font-semibold transition ${
              isActive('/account')
                ? 'border-brand-200 bg-brand-50 text-brand-600'
                : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-500 text-xs font-bold text-white">
              {user.nickname.slice(0, 1).toUpperCase()}
            </span>
            {user.nickname}
          </NavLink>
        ) : (
          <NavLink
            to="/account"
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              isActive('/account')
                ? 'bg-brand-500 text-white'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            로그인
          </NavLink>
        )}
      </div>
    </motion.header>
  )
}
