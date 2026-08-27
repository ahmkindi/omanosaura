import { Star, StarHalf } from 'lucide-react'

export function StarRating({
  rating,
  count,
  className = '',
}: {
  rating: number
  count?: number
  className?: string
}) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5

  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} dir="ltr">
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) {
          return (
            <Star
              key={i}
              className="size-4 fill-(--color-secondary) text-(--color-secondary)"
            />
          )
        }
        if (i === full && half) {
          return (
            <span key={i} className="relative">
              <Star className="text-muted-foreground/40 size-4" />
              <StarHalf className="absolute inset-0 size-4 fill-(--color-secondary) text-(--color-secondary)" />
            </span>
          )
        }
        return <Star key={i} className="text-muted-foreground/40 size-4" />
      })}
      {count !== undefined && (
        <span className="text-muted-foreground ms-1 text-xs">({count})</span>
      )}
    </span>
  )
}
