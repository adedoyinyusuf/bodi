'use client'

import { useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

interface Review {
  id: number
  name: string
  location: string
  rating: number
  text: string
  product: string
  date: string
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Adeola F.',
    location: 'Lagos, Nigeria',
    rating: 5,
    text: 'Absolutely mind-blowing quality. The Acoustic Headphones are worth every naira. Best purchase I\'ve made this year!',
    product: 'Acoustic Master Studio Headphones',
    date: 'July 2026',
  },
  {
    id: 2,
    name: 'Chukwuemeka O.',
    location: 'Abuja, Nigeria',
    rating: 5,
    text: 'The Smartwatch exceeded my expectations. Battery life is incredible and the sapphire display is stunning.',
    product: 'Precision Ergonomic Smartwatch',
    date: 'July 2026',
  },
  {
    id: 3,
    name: 'Fatima B.',
    location: 'Kano, Nigeria',
    rating: 5,
    text: 'The Aura Speaker fills my entire room with crystal clear audio. The 360° sound is no joke. Highly recommend!',
    product: 'Aura Minimalist Wireless Speaker',
    date: 'June 2026',
  },
  {
    id: 4,
    name: 'David M.',
    location: 'Port Harcourt, Nigeria',
    rating: 4,
    text: 'Wearables has the best premium tech collection I\'ve found in Nigeria. Fast shipping and great packaging.',
    product: 'Various Products',
    date: 'June 2026',
  },
]

export function ReviewsHighlight() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const navigate = useCallback((dir: 'next' | 'prev') => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIdx(prev =>
        dir === 'next'
          ? (prev + 1) % reviews.length
          : (prev - 1 + reviews.length) % reviews.length
      )
      setIsAnimating(false)
    }, 250)
  }, [isAnimating])

  useEffect(() => {
    const timer = setInterval(() => navigate('next'), 6000)
    return () => clearInterval(timer)
  }, [navigate])

  const review = reviews[currentIdx]

  return (
    <div className="relative">
      {/* Review Card */}
      <div
        className={`bg-card border border-border rounded-2xl p-8 transition-all duration-300 ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{
          boxShadow: '0 4px 32px oklch(0.7 0.15 30 / 0.08)',
        }}
      >
        {/* Quote icon */}
        <Quote className="w-8 h-8 text-primary/30 mb-4" />

        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Review text */}
        <p className="text-foreground text-lg leading-relaxed italic mb-6">
          "{review.text}"
        </p>

        {/* Reviewer info */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-foreground">{review.name}</p>
            <p className="text-sm text-muted-foreground">{review.location}</p>
            <p className="text-xs text-primary/70 mt-0.5">{review.product}</p>
          </div>
          <span className="text-xs text-muted-foreground">{review.date}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => navigate('prev')}
          className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentIdx
                  ? 'w-6 h-2 bg-primary'
                  : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => navigate('next')}
          className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
