import { Star } from 'lucide-react'

export default function StarRating({ rating, max = 5, size = 14, interactive = false, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          fill={i < Math.round(rating) ? '#FBBF24' : 'none'}
          className={`transition-transform ${
            i < Math.round(rating) ? 'text-amber-400' : 'text-slate-600'
          } ${interactive ? 'cursor-pointer hover:scale-125' : ''}`}
          onClick={() => interactive && onChange && onChange(i + 1)}
        />
      ))}
    </div>
  )
}
