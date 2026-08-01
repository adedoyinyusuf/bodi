'use client'

import { useState, useEffect, useCallback } from 'react'
import { ShoppingBag, TrendingUp, Star, Eye } from 'lucide-react'

interface Activity {
  id: number
  icon: React.ReactNode
  text: string
  time: string
  type: 'purchase' | 'trending' | 'review' | 'view'
}

const activities: Activity[] = [
  { id: 1, icon: <ShoppingBag className="w-3.5 h-3.5" />, text: 'Someone in Lagos just purchased Acoustic Headphones', time: '2m ago', type: 'purchase' },
  { id: 2, icon: <TrendingUp  className="w-3.5 h-3.5" />, text: 'Precision Smartwatch is trending this week', time: '5m ago', type: 'trending' },
  { id: 3, icon: <Star        className="w-3.5 h-3.5" />, text: 'New 5★ review: "Absolutely incredible quality!"', time: '8m ago', type: 'review' },
  { id: 4, icon: <ShoppingBag className="w-3.5 h-3.5" />, text: 'Someone in Abuja just purchased Aura Speaker', time: '11m ago', type: 'purchase' },
  { id: 5, icon: <Eye         className="w-3.5 h-3.5" />, text: '47 people are viewing this store right now', time: 'live', type: 'view' },
  { id: 6, icon: <Star        className="w-3.5 h-3.5" />, text: '"Best smartwatch I\'ve ever owned." — Verified Buyer', time: '18m ago', type: 'review' },
  { id: 7, icon: <TrendingUp  className="w-3.5 h-3.5" />, text: 'Aura Speaker sold 12 units today', time: '22m ago', type: 'trending' },
  { id: 8, icon: <ShoppingBag className="w-3.5 h-3.5" />, text: 'Someone in Port Harcourt just purchased Smartwatch', time: '25m ago', type: 'purchase' },
]

const typeStyle: Record<Activity['type'], string> = {
  purchase: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  trending: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  review:   'bg-amber-500/10  text-amber-600  border-amber-500/20',
  view:     'bg-blue-500/10   text-blue-600   border-blue-500/20',
}

interface SocialProofWidgetProps {
  className?: string
}

export function SocialProofWidget({ className = '' }: SocialProofWidgetProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  const advance = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setCurrentIdx(prev => (prev + 1) % activities.length)
      setVisible(true)
    }, 300)
  }, [])

  useEffect(() => {
    const timer = setInterval(advance, 4000)
    return () => clearInterval(timer)
  }, [advance])

  const activity = activities[currentIdx]

  return (
    <div className={`fixed bottom-6 left-6 z-40 max-w-[320px] ${className}`}>
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md
          bg-background/90 shadow-lg text-sm transition-all duration-300
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
          ${typeStyle[activity.type]}`}
      >
        {/* Live dot */}
        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-current animate-live-blink" />

        {/* Icon */}
        <span className="flex-shrink-0">{activity.icon}</span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="leading-snug line-clamp-2 font-medium">{activity.text}</p>
          <p className="text-xs opacity-70 mt-0.5">{activity.time}</p>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1 justify-center mt-2">
        {activities.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentIdx(i); setVisible(true) }}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIdx ? 'w-4 bg-primary' : 'w-1 bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
