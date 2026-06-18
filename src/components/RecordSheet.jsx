import { useState } from 'react'
import StarRating from './StarRating'
import { todayStr } from '../lib/storage'

// "이거 먹었어요" 기록 입력 바텀시트
export default function RecordSheet({ menu, onSave, onClose }) {
  const [price, setPrice] = useState(menu.avgPrice)
  const [rating, setRating] = useState(0)
  const [date, setDate] = useState(todayStr())

  const inputCls =
    'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-brand-400 focus:ring-4 focus:ring-brand-100'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-pop-in rounded-t-[2rem] border border-slate-200 bg-white p-5 pb-9 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-200" />
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-brand-100 to-amber-100 text-4xl">
            {menu.emoji}
          </span>
          <div>
            <p className="text-lg font-bold">{menu.name}</p>
            <p className="text-sm text-slate-400">먹은 기록 남기기</p>
          </div>
        </div>

        <label className="mb-3 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-500">날짜</span>
          <input
            type="date"
            value={date}
            max={todayStr()}
            onChange={(e) => setDate(e.target.value)}
            className={inputCls}
          />
        </label>

        <label className="mb-3 block">
          <span className="mb-1.5 block text-sm font-medium text-slate-500">가격 (원)</span>
          <input
            type="number"
            inputMode="numeric"
            value={price}
            step={500}
            min={0}
            onChange={(e) => setPrice(Number(e.target.value))}
            className={inputCls}
          />
        </label>

        <div className="mb-6">
          <span className="mb-1.5 block text-sm font-medium text-slate-500">만족도</span>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">
            취소
          </button>
          <button onClick={() => onSave({ price, rating, date })} className="btn-primary flex-1">
            기록 저장
          </button>
        </div>
      </div>
    </div>
  )
}
