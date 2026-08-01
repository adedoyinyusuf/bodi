'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingBag, Eye } from 'lucide-react'
import { useCurrency } from '@/lib/currency-context'
import { useCart } from '@/lib/cart-context'
import { ProductBadge } from '@/components/new-product-badge'
import { ProductRating } from '@/components/product-rating'
import { toast } from 'sonner'

interface FeaturedProduct {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  badge?: string
  likes_count?: number
  comments_count?: number
  created_at?: string
}

interface FeaturedCarouselProps {
  products: FeaturedProduct[]
  onSelect: (product: FeaturedProduct) => void
}

function getBadgeVariant(product: FeaturedProduct) {
  const likesCount = product.likes_count ?? 0
  const commentsCount = product.comments_count ?? 0
  const score = likesCount + commentsCount * 2

  if (product.badge === 'New' || product.badge === 'Best Seller') {
    const createdAt = product.created_at ? new Date(product.created_at) : null
    const isNew = createdAt && (Date.now() - createdAt.getTime()) < 7 * 24 * 60 * 60 * 1000
    if (isNew) return 'new' as const
  }
  if (score >= 15 || product.badge === 'Best Seller') return 'bestseller' as const
  if (score >= 8) return 'trending' as const
  if (product.badge === 'Featured') return 'featured' as const
  return null
}

export function FeaturedCarousel({ products, onSelect }: FeaturedCarouselProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()
  const { convertPrice, formatPrice } = useCurrency()
  const { addItem } = useCart()

  const goTo = useCallback((idx: number) => {
    if (isTransitioning || idx === activeIdx) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveIdx(idx)
      setIsTransitioning(false)
    }, 350)
  }, [isTransitioning, activeIdx])

  const next = useCallback(() => goTo((activeIdx + 1) % products.length), [goTo, activeIdx, products.length])
  const prev = useCallback(() => goTo((activeIdx - 1 + products.length) % products.length), [goTo, activeIdx, products.length])

  useEffect(() => {
    if (isPaused || products.length <= 1) return
    intervalRef.current = setInterval(next, 5000)
    return () => clearInterval(intervalRef.current)
  }, [next, isPaused, products.length])

  if (!products.length) return null

  const product = products[activeIdx]
  const image = product.images?.[0] || '/placeholder.svg'
  const price = formatPrice(convertPrice(product.price))
  const badgeVariant = getBadgeVariant(product)
  const engagementScore = ((product.likes_count ?? 0) + (product.comments_count ?? 0)) / 10
  const rating = Math.min(5, 3.5 + engagementScore)

  const handleAddToBag = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({ id: product.id, title: product.title, price: product.price, images: product.images })
    toast.success('Added to bag!')
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ minHeight: 420 }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background image */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
      >
        <Image
          src={image}
          alt={product.title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Glowing accent orb */}
      <div
        className="absolute top-8 right-16 w-48 h-48 rounded-full blur-3xl opacity-30 animate-float-slow pointer-events-none"
        style={{ background: 'radial-gradient(circle, oklch(0.7 0.18 30), transparent)' }}
      />

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col justify-end h-full p-8 md:p-12 min-h-[420px] transition-all duration-500 ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="max-w-xl space-y-4">
          {/* Badge */}
          {badgeVariant && (
            <div className="animate-fade-in-up">
              <ProductBadge variant={badgeVariant} />
            </div>
          )}

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight animate-fade-in-up delay-100">
            {product.title}
          </h2>

          {/* Description */}
          <p className="text-white/80 line-clamp-2 text-sm md:text-base animate-fade-in-up delay-200">
            {product.description}
          </p>

          {/* Rating & social stats */}
          <div className="flex items-center gap-4 animate-fade-in-up delay-300">
            <ProductRating score={rating} count={(product.likes_count ?? 0) + 4} size="sm" />
            <span className="text-white/60 text-sm flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {((product.likes_count ?? 0) * 12 + 43)} views
            </span>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center gap-4 animate-fade-in-up delay-300">
            <span className="text-3xl font-bold text-white" style={{ textShadow: '0 0 20px oklch(0.7 0.15 30 / 0.6)' }}>
              {price}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); handleAddToBag(e) }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm
                bg-primary text-primary-foreground hover:scale-105 transition-transform
                shadow-[0_0_16px_oklch(0.7_0.15_30_/_0.4)]"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Bag
            </button>
            <button
              onClick={() => onSelect(product)}
              className="px-5 py-2.5 rounded-full font-semibold text-sm border border-white/30
                text-white hover:bg-white/10 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {products.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full
              bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/10
              transition-all hover:scale-110"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full
              bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/10
              transition-all hover:scale-110"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Slide indicators */}
      {products.length > 1 && (
        <div className="absolute bottom-6 right-8 z-20 flex gap-2">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? 'w-6 h-2 bg-white shadow-[0_0_8px_white]'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
