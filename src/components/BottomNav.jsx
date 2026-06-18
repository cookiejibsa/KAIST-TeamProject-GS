import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'

// 모바일 전용 하단 탭바 (데스크톱에서는 숨김)
export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur-xl md:hidden">
      <ul className="mx-auto flex max-w-md">
        {NAV_ITEMS.map((it) => (
          <li key={it.to} className="flex-1">
            <NavLink
              to={it.to}
              end={it.to === '/'}
              className={({ isActive }) =>
                `relative flex flex-col items-center gap-0.5 py-3 text-xs font-medium transition ${
                  isActive ? 'text-brand-600' : 'text-slate-400'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-0 h-0.5 w-8 rounded-full bg-gradient-to-r from-brand-400 to-brand-500" />
                  )}
                  <span className={`text-xl transition ${isActive ? 'scale-110' : ''}`}>
                    {it.icon}
                  </span>
                  {it.label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
