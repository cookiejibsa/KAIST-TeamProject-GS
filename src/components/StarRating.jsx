export default function StarRating({ value = 0, onChange, size = 'text-2xl', readOnly = false }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={readOnly}
          onClick={() => onChange?.(n === value ? 0 : n)}
          className={`${size} transition ${readOnly ? '' : 'active:scale-90'} ${
            n <= value ? 'opacity-100' : 'opacity-25 grayscale'
          }`}
          aria-label={`${n}점`}
        >
          ⭐
        </button>
      ))}
    </div>
  )
}
