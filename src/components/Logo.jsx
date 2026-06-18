// 서비스 로고: 그라데이션 밥그릇 마크 + 워드마크
export default function Logo({ showText = true, size = 34, className = '' }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 40 40" className="shrink-0" aria-hidden="true">
        <defs>
          <linearGradient id="logoG" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff8a4c" />
            <stop offset="0.6" stopColor="#f54e3a" />
            <stop offset="1" stopColor="#f43f5e" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11.5" fill="url(#logoG)" />
        {/* 김(스팀) */}
        <path d="M16.5 8.5c-1.6 1.4-1.6 3 0 4.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" fill="none" opacity="0.95" />
        <path d="M23.5 8.5c-1.6 1.4-1.6 3 0 4.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" fill="none" opacity="0.95" />
        {/* 그릇 */}
        <rect x="7.5" y="17.8" width="25" height="2.7" rx="1.35" fill="#fff" />
        <path d="M10.5 21.5h19a9.5 9.5 0 0 1-19 0z" fill="#fff" />
      </svg>
      {showText && (
        <span className="text-lg font-extrabold tracking-tight text-slate-900">
          오늘<span className="text-gradient">뭐먹</span>지
        </span>
      )}
    </span>
  )
}
