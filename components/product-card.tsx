'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, ShoppingBag } from 'lucide-react'
import { useCurrency } from '@/lib/currency-context'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner' // Assuming sonner is installed as per package.json

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  likes_count: number
  comments_count: number
}

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
  onLike?: (productId: string) => void
}

export function ProductCard({ product, onSelect, onLike }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const { convertPrice, formatPrice } = useCurrency()
  const { addItem, setIsCartOpen } = useCart()

  const images = product.images || []
  const currentImage = images[currentImageIndex] || '/placeholder.jpg'
  const convertedPrice = convertPrice(product.price)
  const displayPrice = formatPrice(convertedPrice)

  // Auto-cycle images on hover
  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCurrentImageIndex(0)
  }

  // Cycle images every 1.5 seconds when hovered
  useEffect(() => {
    if (!isHovered || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 1500)

    return () => clearInterval(timer)
  }, [isHovered, images.length])

  const handleAddToBag = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images
    })
    toast.success('Added to bag')
  }

  return (
    <div
      className="group cursor-pointer rounded-lg border border-border overflow-hidden bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/50 flex flex-col h-full"
      onClick={() => onSelect(product)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        <Image
          src={currentImage || "/placeholder.svg"}
          alt={(product.title && product.title.length > 0) ? product.title : 'Product Image'} // Explicit fallback
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}

        {/* Quick Add Button */}
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            size="icon"
            className="rounded-full shadow-lg bg-primary text-primary-foreground hover:scale-110 transition-transform"
            onClick={handleAddToBag}
          >
            <ShoppingBag className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground line-clamp-1">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {displayPrice}
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            In Stock
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
          <button
            className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onLike?.(product.id)
            }}
          >
            <Heart className="w-4 h-4" />
            <span className="text-xs">{product.likes_count}</span>
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
              const url = window.location.href
              navigator.clipboard.writeText(`Check out this product: ${product.title} - ${url}`)
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
