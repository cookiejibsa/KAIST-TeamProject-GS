import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

// 마우스 위치에 따라 3D로 기울고, 빛(스포트라이트)이 따라다니는 카드
export default function TiltCard({ children, className = '', max = 7, glow = true }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 18 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 18 })

  const spotX = useTransform(px, (v) => `${v * 100}%`)
  const spotY = useTransform(py, (v) => `${v * 100}%`)
  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${spotX} ${spotY}, rgba(249,115,22,0.18), transparent 65%)`

  const onMove = (e) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`relative [transform-style:preserve-3d] ${className}`}
    >
      {children}
      {glow && (
        <motion.div
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
        />
      )}
    </motion.div>
  )
}
