// 화면 전체 뒤에 깔리는 은은한 배경 (밝은 화이트 + 따뜻한 글로우)
export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* 따뜻한 코랄/앰버 글로우 */}
      <div className="absolute -left-40 -top-48 h-[30rem] w-[30rem] rounded-full bg-brand-200/40 blur-[130px]" />
      <div className="absolute right-[-12rem] top-1/4 h-[26rem] w-[26rem] rounded-full bg-amber-200/40 blur-[130px]" />
      <div className="absolute bottom-[-10rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-rose-100/60 blur-[130px]" />

      {/* 상단 살짝 비치는 워시 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(245,78,58,0.06),transparent_55%)]" />
    </div>
  )
}
