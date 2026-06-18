import { useEffect, useRef, useState } from 'react'
import { useInView, animate } from 'framer-motion'

// 화면에 들어오면 0 → value 로 굴러가는 숫자
export default function CountUp({
  value,
  duration = 1.3,
  format = (v) => Math.round(v).toLocaleString(),
  className = '',
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const [text, setText] = useState(format(0))

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(format(v)),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  )
}
