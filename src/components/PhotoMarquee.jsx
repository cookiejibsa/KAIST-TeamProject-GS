// 실제 음식 사진이 가로로 끊김 없이 흐르는 마퀴 (한 줄)
// duration 으로 속도 조절 (클수록 느림)
export default function PhotoMarquee({ photos, reverse = false, duration = 70 }) {
  const track = [...photos, ...photos]
  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex shrink-0 gap-4 pr-4 ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map((src, i) => (
          <div
            key={i}
            className="h-36 w-52 shrink-0 overflow-hidden rounded-3xl border border-white shadow-[0_10px_30px_-12px_rgba(15,23,42,0.25)] md:h-44 md:w-64"
          >
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}
