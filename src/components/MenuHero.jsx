import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getFoodPhoto } from '../data/foodPhotos'

// 추천/랜덤 결과 카드의 상단 — 실제 음식 사진을 배경으로 깔고 이모지 + 메뉴명을 올림
export default function MenuHero({
  menu,
  eyebrow,
  subtitle,
  photoUrl: aiPhotoUrl,          // AI가 골라준 사진 URL (없으면 카테고리 기본 사진)
  gradFrom = 'from-brand-400',
  gradTo = 'to-rose-500',
}) {
  const [broken, setBroken] = useState(false)
  useEffect(() => setBroken(false), [menu.id, aiPhotoUrl])
  const photo = aiPhotoUrl || getFoodPhoto(menu)

  return (
    <div className="relative h-72 overflow-hidden">
      {broken ? (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradFrom} ${gradTo}`} />
      ) : (
        <img
          key={menu.id}
          src={photo}
          alt={menu.name}
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      {/* 가독성용 어두운 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
        {eyebrow && (
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/80">{eyebrow}</p>
        )}
        <motion.p
          key={menu.id}
          initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="my-2 text-7xl drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
        >
          {menu.emoji}
        </motion.p>
        <p className="text-5xl font-black tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          {menu.name}
        </p>
        {subtitle && <p className="mt-3 text-sm text-white/90 drop-shadow">{subtitle}</p>}
      </div>
    </div>
  )
}
