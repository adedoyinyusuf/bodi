'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react'
import { getProductComments, addComment } from '@/lib/services/products'
import { useCurrency } from '@/lib/currency-context'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  likes_count: number
  comments_count: number
  details?: string
}

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  isOpen: boolean
  onLike?: (productId: string) => void
}

export function ProductModal({ product, onClose, isOpen, onLike }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const { convertPrice, formatPrice } = useCurrency()
  const { addItem, setIsCartOpen } = useCart()

  useEffect(() => {
    if (isOpen && product) {
      loadComments()
      setCurrentImageIndex(0)
    }
  }, [product, isOpen])

  const loadComments = async () => {
    if (!product) return
    setIsLoadingComments(true)
    const data = await getProductComments(product.id)
    setComments(data)
    setIsLoadingComments(false)
  }

  const handleAddToBag = () => {
    if (!product) return
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      images: product.images
    })
    toast.success('Added to bag')
    setIsCartOpen(true)
    onClose()
  }

  const handleAddComment = async () => {
    if (!product || !commentText.trim()) return

    // In a real app, you'd get the user from auth context
    const userId = 'anonymous'

    await addComment(product.id, userId, 'Anonymous User', 'anon@example.com', commentText)

    setCommentText('')
    await loadComments()
  }

  if (!isOpen || !product) return null

  const images = product.images || []
  const currentImage = images[currentImageIndex] || '/placeholder.jpg'

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % Math.max(images.length, 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background rounded-xl border border-border max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur">
          <h2 className="text-2xl font-bold text-foreground">{product.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
              <Image
                src={currentImage || "/placeholder.svg"}
                alt={product.title || 'Product Image'}
                fill
                className="object-cover"
              />

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                    {currentImageIndex + 1}/{images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${idx === currentImageIndex ? 'border-primary' : 'border-border'
                      }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.title || 'Product'} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Price & Status */}
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                {formatPrice(convertPrice(product.price))}
              </div>
              <p className="text-green-600 font-medium">In Stock</p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Details */}
            {product.details && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Details</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.details}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <button
                onClick={handleAddToBag}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg py-4 font-bold text-lg"
              >
                <ShoppingBag className="w-6 h-6" />
                Add to Bag
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => onLike?.(product.id)}
                  className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-muted transition-colors rounded-lg py-3 font-medium"
                >
                  <Heart className="w-5 h-5" />
                  Like ({product.likes_count})
                </button>

                <button
                  onClick={() => navigator.share({ title: product.title, text: product.description })}
                  className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-muted transition-colors rounded-lg py-3 font-medium"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Comments ({comments.length})
          </h3>

          {/* Add Comment */}
          <div className="mb-6 space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg py-2 font-medium"
            >
              Post Comment
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {isLoadingComments ? (
              <p className="text-muted-foreground">Loading comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-muted-foreground">No comments yet. Be the first to share!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-foreground text-sm">
                      {comment.user_id || 'Anonymous'}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
