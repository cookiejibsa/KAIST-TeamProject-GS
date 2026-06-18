import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Background from './components/Background'
import TopNav from './components/TopNav'
import BottomNav from './components/BottomNav'
import Cursor from './components/motion/Cursor'
import ScrollProgress from './components/motion/ScrollProgress'

const Home = lazy(() => import('./pages/Home'))
const CantDecide = lazy(() => import('./pages/CantDecide'))
const History = lazy(() => import('./pages/History'))
const Stats = lazy(() => import('./pages/Stats'))
const Account = lazy(() => import('./pages/Account'))

// 페이지 이동 시 항상 맨 위에서 시작
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()

  return (
    <div className="relative min-h-screen">
      <ScrollToTop />
      <Background />
      <Cursor />
      <ScrollProgress />
      <TopNav />

      <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-8 md:px-8 md:pb-20 md:pt-24">
        {/* key 로 경로마다 새로 마운트 → 진입 애니메이션만 (exit 전환 제거로 라우팅 충돌 방지) */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/random" element={<CantDecide />} />
              <Route path="/history" element={<History />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  )
}

function PageFallback() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
    </div>
  )
}
