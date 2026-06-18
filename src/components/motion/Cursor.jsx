import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// 마우스를 부드럽게 따라다니는 글로우 커서 (데스크톱 전용, 네이티브 커서는 유지)
export default function Cursor() {
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.5 })
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.5 })
  const glowX = useSpring(x, { stiffness: 120, damping: 25, mass: 1 })
  const glowY = useSpring(y, { stiffness: 120, damping: 25, mass: 1 })
  const [hot, setHot] = useState(false)

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const el = e.target
      setHot(!!(el.closest('a, button, [role="button"], input, label')))
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="absolute -ml-20 -mt-20 h-40 w-40 rounded-full bg-brand-400/15 blur-3xl"
      />
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{ scale: hot ? 1.7 : 1, opacity: hot ? 1 : 0.7 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="absolute -ml-4 -mt-4 h-8 w-8 rounded-full border-2 border-brand-400/70"
      />
      <motion.div
        style={{ x, y }}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-brand-500"
      />
    </div>
  )
}
