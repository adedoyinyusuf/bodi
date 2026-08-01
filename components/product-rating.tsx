'use client'

import { Star, StarHalf } from 'lucide-react'

interface ProductRatingProps {
  score: number       // 0 – 5, allows decimals
  count?: number      // number of reviews
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  animated?: boolean
}

export function ProductRating({
  score,
  count,
  size = 'md',
  showCount = true,
  animated = false,
}: ProductRatingProps) {
  const clamped = Math.min(5, Math.max(0, score))
  const full    = Math.floor(clamped)
  const hasHalf = clamped - full >= 0.5
  const empty   = 5 - full - (hasHalf ? 1 : 0)

  const iconSize = size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-5 h-5'
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'

  return (
    <div className={`flex items-center gap-1.5 ${textSize}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: full }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`${iconSize} fill-amber-400 text-amber-400 ${animated ? 'animate-star-fill' : ''}`}
            style={animated ? { animationDelay: `${i * 0.07}s` } : undefined}
          />
        ))}
        {hasHalf && (
          <StarHalf
            className={`${iconSize} fill-amber-400 text-amber-400 ${animated ? 'animate-star-fill' : ''}`}
            style={animated ? { animationDelay: `${full * 0.07}s` } : undefined}
          />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`${iconSize} text-muted-foreground/40`}
          />
        ))}
      </div>
      <span className="font-semibold text-foreground tabular-nums">{clamped.toFixed(1)}</span>
      {showCount && count !== undefined && (
        <span className="text-muted-foreground">({count.toLocaleString()})</span>
      )}
    </div>
  )
}
