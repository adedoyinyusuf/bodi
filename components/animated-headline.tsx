'use client'

import { useEffect, useRef, useState } from 'react'

/* ============================================================
   GradientHeadline
   Renders text with an animated flowing gradient effect.
   ============================================================ */
interface GradientHeadlineProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  animate?: boolean
}

export function GradientHeadline({
  children,
  className = '',
  as: Tag = 'h1',
  animate = true,
}: GradientHeadlineProps) {
  return (
    <Tag
      className={`animate-fade-in-up font-display font-bold ${className}`}
      style={{
        background: 'linear-gradient(135deg, #fff 0%, oklch(0.85 0.15 30) 35%, #fff 55%, oklch(0.78 0.19 75) 75%, #fff 100%)',
        backgroundSize: '300% 300%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: animate
          ? 'gradient-shift 5s ease infinite, fade-in-up 0.6s ease both'
          : 'fade-in-up 0.6s ease both',
      }}
    >
      {children}
    </Tag>
  )
}

/* ============================================================
   WordRevealHeadline
   Words slide in one-by-one from below on mount.
   ============================================================ */
interface WordRevealHeadlineProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  staggerMs?: number
  style?: React.CSSProperties
}

export function WordRevealHeadline({
  children,
  className = '',
  as: Tag = 'h1',
  staggerMs = 90,
  style,
}: WordRevealHeadlineProps) {
  const words = children.split(' ')

  return (
    <Tag className={`font-display font-bold overflow-visible ${className}`} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginRight: '0.28em' }}
        >
          <span
            className="inline-block"
            style={{
              animation: `fade-in-up 0.55s cubic-bezier(0.22, 1, 0.36, 1) both`,
              animationDelay: `${i * staggerMs}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  )
}

/* ============================================================
   ShimmerHeadline
   A gloss / shimmer light sweeps across the text on loop.
   ============================================================ */
interface ShimmerHeadlineProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3'
  baseColor?: string
  shimmerColor?: string
}

export function ShimmerHeadline({
  children,
  className = '',
  as: Tag = 'h1',
  baseColor = '#ffffff',
  shimmerColor = 'oklch(0.85 0.15 30)',
}: ShimmerHeadlineProps) {
  return (
    <Tag
      className={`font-display font-bold animate-fade-in-up ${className}`}
      style={{
        background: `linear-gradient(
          105deg,
          ${baseColor} 0%,
          ${baseColor} 35%,
          ${shimmerColor} 50%,
          ${baseColor} 65%,
          ${baseColor} 100%
        )`,
        backgroundSize: '250% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'text-shimmer 3.5s linear infinite, fade-in-up 0.6s ease both',
      }}
    >
      {children}
    </Tag>
  )
}
