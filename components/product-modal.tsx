'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { X, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, ShoppingBag, TrendingUp, Award } from 'lucide-react'
import { getProductComments, addComment } from '@/lib/services/products'
import { useCurrency } from '@/lib/currency-context'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { ProductBadge } from '@/components/new-product-badge'
import { ProductRating } from '@/components/product-rating'
import { getProductBadge, getEngagementRating, isTrending, isBestseller } from '@/lib/product-utils'
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
  created_at?: string
  badge?: string
  category?: string
}

interface ProductModalProps {
  product: Product | null
  onClose: () => void
  isOpen: boolean
  onLike?: (productId: string) => void
}

export function ProductModal({ product, onClose, isOpen, onLike }: ProductModalProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { convertPrice, formatPrice } = useCurrency()
  const { addItem, setIsCartOpen } = useCart()

  useEffect(() => {
    if (isOpen && product) {
      loadComments()
      setCurrentImageIndex(0)
      setIsLiked(false)
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
    addItem({ id: product.id, title: product.title, price: product.price, images: product.images })
    toast.success('Added to bag')
    setIsCartOpen(true)
    onClose()
  }

  const handleAddComment = async () => {
    if (!product || !commentText.trim()) return
    if (!user) {
      toast.error('Please sign in to comment')
      router.push('/auth')
      onClose()
      return
    }

    try {
      const userName  = user.phone || 'Authenticated User'
      const userEmail = user.email || 'no-email@example.com'
      await addComment(product.id, user.id, userName, userEmail, commentText)
      setCommentText('')
      await loadComments()
    } catch (error) {
      console.error('Failed to add comment:', error)
      toast.error('Failed to post comment. Please try again.')
    }
  }

  const handleLike = () => {
    setIsLiked(l => !l)
    onLike?.(product!.id)
  }

  if (!isOpen || !product) return null

  const images = product.images || []
  const currentImage = images[currentImageIndex] || '/placeholder.jpg'
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % Math.max(images.length, 1))
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + Math.max(images.length, 1)) % Math.max(images.length, 1))

  const badgeVariant = getProductBadge(product)
  const rating = getEngagementRating(product)
  const trending = isTrending(product)
  const bestseller = isBestseller(product, 8)

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      {/* Glowing backdrop orb */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, oklch(0.7 0.15 30 / 0.06) 0%, transparent 70%)',
        }}
      />

      <div
        className="relative bg-background rounded-2xl border border-border max-w-4xl w-full max-h-[92vh] overflow-y-auto animate-fade-in-scale"
        style={{ boxShadow: '0 0 60px oklch(0.7 0.15 30 / 0.15), 0 24px 48px black/30' }}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-background/95 backdrop-blur z-10">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold text-foreground">{product.title}</h2>
            {badgeVariant && <ProductBadge variant={badgeVariant} size="sm" />}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-xl transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div
              className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted"
              style={{ boxShadow: '0 0 24px oklch(0.7 0.15 30 / 0.12)' }}
            >
              <Image
                src={currentImage || '/placeholder.svg'}
                alt={product.title || 'Product Image'}
                fill
                className="object-cover"
              />

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
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
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      idx === currentImageIndex
                        ? 'border-primary shadow-[0_0_8px_oklch(0.7_0.15_30_/_0.5)]'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Image src={img || '/placeholder.svg'} alt={`${product.title} ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Social proof indicators */}
            {(trending || bestseller) && (
              <div className="flex gap-2 flex-wrap">
                {bestseller && (
                  <div className="flex items-center gap-1.5 text-amber-600 bg-amber-500/10 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-500/20">
                    <Award className="w-3.5 h-3.5" />
                    Bestseller
                  </div>
                )}
                {trending && (
                  <div className="flex items-center gap-1.5 text-orange-600 bg-orange-500/10 px-3 py-1.5 rounded-full text-xs font-medium border border-orange-500/20">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Trending
                  </div>
                )}
              </div>
            )}

            {/* Price & Status */}
            <div>
              <div
                className="text-4xl font-bold text-primary mb-2"
                style={{ textShadow: '0 0 20px oklch(0.7 0.15 30 / 0.3)' }}
              >
                {formatPrice(convertPrice(product.price))}
              </div>
              <div className="flex items-center gap-3">
                <p className="text-emerald-600 font-medium text-sm">✓ In Stock</p>
                <ProductRating score={rating} count={product.likes_count + 2} size="sm" animated />
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Details */}
            {product.details && (
              <div>
                <h3 className="font-semibold text-foreground mb-2">Details</h3>
                <p className="text-muted-foreground leading-relaxed">{product.details}</p>
              </div>
            )}

            {/* Live activity metrics */}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-live-blink" />
                {((product.likes_count ?? 0) * 12 + 43)} views today
              </span>
              <span>·</span>
              <span>{product.likes_count ?? 0} people liked this</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <button
                onClick={handleAddToBag}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground
                  hover:bg-primary/90 transition-all rounded-xl py-4 font-bold text-lg
                  hover:shadow-[0_0_20px_oklch(0.7_0.15_30_/_0.4)] hover:scale-[1.01]"
              >
                <ShoppingBag className="w-6 h-6" />
                Add to Bag
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleLike}
                  className={`flex-1 flex items-center justify-center gap-2 border rounded-xl py-3 font-medium transition-all ${
                    isLiked
                      ? 'border-rose-400 text-rose-500 bg-rose-500/5'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current scale-110' : ''} transition-transform`} />
                  Like ({product.likes_count + (isLiked ? 1 : 0)})
                </button>

                <button
                  onClick={() => navigator.share?.({ title: product.title, text: product.description })}
                  className="flex-1 flex items-center justify-center gap-2 border border-border hover:bg-muted transition-colors rounded-xl py-3 font-medium"
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
            <MessageCircle className="w-5 h-5 text-primary" />
            Comments ({comments.length})
          </h3>

          {/* Add Comment */}
          <div className="mb-6 space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground
                placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none
                transition-shadow focus:shadow-[0_0_12px_oklch(0.7_0.15_30_/_0.2)]"
              rows={3}
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl py-2.5 font-medium"
            >
              Post Comment
            </button>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {isLoadingComments ? (
              <div className="space-y-3">
                {[1, 2].map(i => (
                  <div key={i} className="h-16 rounded-lg bg-muted animate-shimmer"
                    style={{ background: 'linear-gradient(90deg, var(--muted) 25%, oklch(0.9 0 0 / 0.5) 50%, var(--muted) 75%)', backgroundSize: '200% 100%' }}
                  />
                ))}
              </div>
            ) : comments.length === 0 ? (
              <p className="text-muted-foreground">No comments yet. Be the first to share!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-muted rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-foreground text-sm">{comment.user_id || 'Anonymous'}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{comment.text || comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
