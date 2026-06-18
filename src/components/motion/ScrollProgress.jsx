import { motion, useScroll, useSpring } from 'framer-motion'

// 페이지 상단 스크롤 진행 바
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[95] h-0.5 origin-left bg-gradient-to-r from-brand-400 via-rose-500 to-fuchsia-500"
    />
  )
}
