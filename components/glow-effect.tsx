'use client'

import React from 'react'

type GlowColor = 'primary' | 'amber' | 'emerald' | 'violet' | 'rose' | 'cyan'

interface GlowEffectProps {
  children: React.ReactNode
  color?: GlowColor
  intensity?: 'low' | 'medium' | 'high'
  className?: string
  pulse?: boolean
}

const colorMap: Record<GlowColor, string> = {
  primary: 'oklch(0.7 0.18 30)',
  amber:   'oklch(0.78 0.19 75)',
  emerald: 'oklch(0.72 0.19 162)',
  violet:  'oklch(0.65 0.22 290)',
  rose:    'oklch(0.65 0.22 10)',
  cyan:    'oklch(0.75 0.16 200)',
}

const intensityMap = {
  low:    { spread: '6px',  blur: '18px', opacity: '0.3' },
  medium: { spread: '12px', blur: '32px', opacity: '0.5' },
  high:   { spread: '20px', blur: '56px', opacity: '0.7' },
}

export function GlowEffect({
  children,
  color = 'primary',
  intensity = 'medium',
  className = '',
  pulse = false,
}: GlowEffectProps) {
  const c = colorMap[color]
  const { spread, blur, opacity } = intensityMap[intensity]

  const style: React.CSSProperties = {
    '--glow-color': c + ' / ' + opacity,
    boxShadow: `0 0 ${spread} ${colorMap[color].replace(')', ' / ' + opacity + ')')}, 0 0 ${blur} ${colorMap[color].replace(')', ' / 0.2)')}`,
  } as React.CSSProperties

  return (
    <div
      className={`relative ${pulse ? 'animate-glow-pulse' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  )
}

/* -----------------------------------------------
   GlowText — applies neon text-shadow effect
----------------------------------------------- */
interface GlowTextProps {
  children: React.ReactNode
  color?: GlowColor
  pulse?: boolean
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function GlowText({
  children,
  color = 'primary',
  pulse = false,
  className = '',
  as: Tag = 'span',
}: GlowTextProps) {
  const c = colorMap[color]
  const style: React.CSSProperties = {
    color: c,
    textShadow: `0 0 6px ${c}, 0 0 16px ${c}`,
  }

  return (
    // @ts-ignore
    <Tag className={`${pulse ? 'animate-neon-pulse' : ''} ${className}`} style={style}>
      {children}
    </Tag>
  )
}

/* -----------------------------------------------
   GlowCard — card wrapper with hover glow border
----------------------------------------------- */
interface GlowCardProps {
  children: React.ReactNode
  color?: GlowColor
  className?: string
  onClick?: () => void
}

export function GlowCard({ children, color = 'primary', className = '', onClick }: GlowCardProps) {
  const c = colorMap[color]
  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border border-border transition-all duration-300 cursor-pointer
        hover:border-transparent hover:shadow-[0_0_0_1.5px_var(--glow-b)] hover:shadow-[0_0_20px_4px_var(--glow-b)]
        group ${className}`}
      style={{ '--glow-b': c } as React.CSSProperties}
    >
      {/* Animated border gradient on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(var(--card), var(--card)) padding-box,
                       linear-gradient(135deg, ${c}, transparent 60%) border-box`,
          border: '1.5px solid transparent',
          borderRadius: 'inherit',
        }}
      />
      {children}
    </div>
  )
}
