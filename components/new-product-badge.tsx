'use client'

type BadgeVariant = 'new' | 'trending' | 'bestseller' | 'featured' | 'sale'

interface ProductBadgeProps {
  variant: BadgeVariant
  className?: string
  size?: 'sm' | 'md'
}

const badgeConfig: Record<BadgeVariant, {
  label: string
  bgClass: string
  dotClass: string
  glowStyle: React.CSSProperties
}> = {
  new: {
    label: 'New',
    bgClass: 'bg-emerald-500 text-white',
    dotClass: 'bg-white',
    glowStyle: { boxShadow: '0 0 10px 3px oklch(0.72 0.19 162 / 0.6)' },
  },
  trending: {
    label: '🔥 Trending',
    bgClass: 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
    dotClass: 'bg-white',
    glowStyle: { boxShadow: '0 0 10px 3px oklch(0.7 0.22 30 / 0.6)' },
  },
  bestseller: {
    label: '⭐ Bestseller',
    bgClass: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black',
    dotClass: 'bg-black',
    glowStyle: { boxShadow: '0 0 10px 3px oklch(0.78 0.19 75 / 0.6)' },
  },
  featured: {
    label: '✦ Featured',
    bgClass: 'bg-gradient-to-r from-violet-500 to-purple-600 text-white',
    dotClass: 'bg-white',
    glowStyle: { boxShadow: '0 0 10px 3px oklch(0.65 0.22 290 / 0.6)' },
  },
  sale: {
    label: 'Sale',
    bgClass: 'bg-rose-500 text-white',
    dotClass: 'bg-white',
    glowStyle: { boxShadow: '0 0 10px 3px oklch(0.65 0.22 10 / 0.6)' },
  },
}

export function ProductBadge({ variant, className = '', size = 'md' }: ProductBadgeProps) {
  const config = badgeConfig[variant]
  const sizeClass = size === 'sm'
    ? 'text-[10px] px-2 py-0.5 gap-1'
    : 'text-xs px-2.5 py-1 gap-1.5'

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold tracking-wide
        animate-badge-pulse animate-badge-glow select-none
        ${config.bgClass} ${sizeClass} ${className}`}
      style={config.glowStyle}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-live-blink flex-shrink-0 ${config.dotClass}`} />
      {config.label}
    </span>
  )
}
