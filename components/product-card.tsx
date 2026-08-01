'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, ShoppingBag } from 'lucide-react'
import { useCurrency } from '@/lib/currency-context'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { ProductBadge } from '@/components/new-product-badge'
import { ProductRating } from '@/components/product-rating'
import { getProductBadge, getEngagementRating, type Product } from '@/lib/product-utils'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
  onLike?: (productId: string) => void
}

export function ProductCard({ product, onSelect, onLike }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { convertPrice, formatPrice } = useCurrency()
  const { addItem, setIsCartOpen } = useCart()

  const images = product.images || []
  const currentImage = images[currentImageIndex] || '/placeholder.jpg'
  const convertedPrice = convertPrice(product.price)
  const displayPrice = formatPrice(convertedPrice)
  const badgeVariant = getProductBadge(product)
  const rating = getEngagementRating(product)
  const isNew = badgeVariant === 'new'

  // Auto-cycle images on hover
  useEffect(() => {
    if (!isHovered || images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 1500)
    return () => clearInterval(timer)
  }, [isHovered, images.length])

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setCurrentImageIndex(0)
  }

  const handleAddToBag = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({ id: product.id, title: product.title, price: product.price, images: product.images })
    toast.success('Added to bag')
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(l => !l)
    onLike?.(product.id)
  }

  return (
    <div
      className={`group cursor-pointer rounded-xl border overflow-hidden bg-card flex flex-col h-full
        transition-all duration-300 hover:-translate-y-1
        ${isNew
          ? 'border-emerald-500/40 hover:border-emerald-500/70 hover:shadow-[0_8px_32px_oklch(0.72_0.19_162_/_0.2)]'
          : 'border-border hover:border-primary/40 hover:shadow-[0_8px_32px_oklch(0.7_0.15_30_/_0.15)]'
        }`}
      onClick={() => onSelect(product)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        <Image
          src={currentImage || '/placeholder.svg'}
          alt={product.title?.length > 0 ? product.title : 'Product Image'}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-108"
        />

        {/* Shimmer scan on hover */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none animate-wave-scan"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
            }}
          />
        )}

        {/* Badges row */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {badgeVariant && <ProductBadge variant={badgeVariant} size="sm" />}
        </div>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}

        {/* Quick Add Button */}
        <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <Button
            size="icon"
            className="rounded-full shadow-lg bg-primary text-primary-foreground hover:scale-110 transition-transform"
            style={{ boxShadow: '0 0 12px oklch(0.7 0.15 30 / 0.4)' }}
            onClick={handleAddToBag}
          >
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Rating */}
        <ProductRating score={rating} count={product.likes_count + 2} size="sm" />

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {displayPrice}
          </span>
          <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
            In Stock
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
          <button
            className={`flex items-center gap-1.5 transition-colors ${
              isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'
            }`}
            onClick={handleLike}
          >
            <Heart className={`w-4 h-4 transition-transform ${isLiked ? 'scale-125 fill-current' : ''}`} />
            <span className="text-xs">{product.likes_count + (isLiked ? 1 : 0)}</span>
          </button>

          <button
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs">{product.comments_count}</span>
          </button>

          <button
            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              navigator.clipboard.writeText(`Check out this product: ${product.title} - ${window.location.href}`)
              toast.success('Link copied')
            }}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
