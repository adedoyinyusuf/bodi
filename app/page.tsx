'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ProductCard } from '@/components/product-card'
import { ProductModal } from '@/components/product-modal'
import { ProductFilter } from '@/components/product-filter'
import { FeaturedCarousel } from '@/components/featured-carousel'
import { SocialProofWidget } from '@/components/social-proof-widget'
import { ReviewsHighlight } from '@/components/reviews-highlight'
import { GlowText } from '@/components/glow-effect'
import { WordRevealHeadline, ShimmerHeadline } from '@/components/animated-headline'
import { getProducts, toggleLike } from '@/lib/services/products'
import {
  sortByPopularity,
  sortByRecency,
  getFeaturedProducts,
  getTrendingProducts,
  getEngagementRating,
} from '@/lib/product-utils'
import { useNewProducts } from '@/hooks/use-new-products'
import { useAuth } from '@/lib/auth-context'
import { Sparkles, TrendingUp, Zap } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  title: string
  name?: string
  description: string
  price: number
  images: string[]
  likes_count: number
  comments_count: number
  details?: string
  category?: string
  created_at?: string
  badge?: string
}

const POLL_INTERVAL_MS = 30_000

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean))
    return Array.from(cats) as string[]
  }, [products])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        (product.title || product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchQuery, selectedCategory])

  // Derived smart lists
  const featuredProducts  = useMemo(() => getFeaturedProducts(products).slice(0, 5), [products])
  const trendingProducts  = useMemo(() => getTrendingProducts(products, 0).slice(0, 4), [products])

  const loadProducts = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true)
    try {
      const data = await getProducts()
      setProducts(data as Product[])
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      if (!silent) setIsLoading(false)
    }
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  // Poll for new products every 30 seconds (silent refresh)
  useEffect(() => {
    const timer = setInterval(() => loadProducts(true), POLL_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [loadProducts])

  // New products detection + notification
  const handleViewProduct = useCallback((id: string) => {
    const product = products.find(p => p.id === id)
    if (product) { setSelectedProduct(product); setIsModalOpen(true) }
  }, [products])

  useNewProducts(products, handleViewProduct)

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleLike = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to like products')
      router.push('/auth')
      return
    }
    try {
      await toggleLike(productId, user.id)
      await loadProducts(true)
    } catch (error) {
      toast.error('Failed to toggle like. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden">

      {/* ─────────────────────────────────────────────────
          HERO SECTION — full-bleed with animated orbs
      ───────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-36 px-4 overflow-hidden">

        {/* Animated gradient background */}
        <div
          className="absolute inset-0 pointer-events-none animate-gradient-shift"
          style={{
            background: 'linear-gradient(135deg, oklch(0.12 0 0), oklch(0.18 0.03 30), oklch(0.14 0.06 60), oklch(0.12 0 0))',
            backgroundSize: '300% 300%',
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-[-80px] right-[-60px] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none animate-float-slow"
          style={{ background: 'radial-gradient(circle, oklch(0.7 0.15 30 / 0.15), transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-60px] left-[-80px] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none animate-float-slow delay-1000"
          style={{ background: 'radial-gradient(circle, oklch(0.65 0.22 290 / 0.1), transparent 70%)' }}
        />
        <div
          className="absolute top-[30%] left-[45%] w-[200px] h-[200px] rounded-full blur-2xl pointer-events-none animate-float-slow delay-500"
          style={{ background: 'radial-gradient(circle, oklch(0.72 0.19 162 / 0.08), transparent 70%)' }}
        />

        {/* Decorative rotating ring */}
        <div
          className="absolute top-12 right-24 w-32 h-32 rounded-full border border-white/5 animate-spin-slow pointer-events-none"
        />

        <div className="relative max-w-7xl mx-auto text-center space-y-6 z-10">
          <div className="animate-fade-in-up">
            <p className="text-sm md:text-base uppercase tracking-widest text-white/50 font-semibold flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 animate-badge-pulse" />
              Premium Wearable Technology
              <Zap className="w-4 h-4 text-amber-400 animate-badge-pulse delay-200" />
            </p>
          </div>

          {/* Main headline — word-by-word reveal */}
          <WordRevealHeadline
            className="text-5xl md:text-7xl text-white text-balance leading-[1.08] tracking-tight"
            staggerMs={80}
          >
            Wear Your Excellence
          </WordRevealHeadline>

          {/* Shimmer sub-headline */}
          <ShimmerHeadline
            as="h2"
            className="text-2xl md:text-3xl tracking-wide"
            baseColor="rgba(255,255,255,0.55)"
            shimmerColor="oklch(0.82 0.16 30)"
          >
            Crafted for those who lead.
          </ShimmerHeadline>

          <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto text-balance font-light leading-relaxed animate-fade-in-up delay-200">
            Discover a curated world of premium wearable technology — from smart timepieces
            to immersive audio — engineered for those who refuse to settle for ordinary.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up delay-300">
            <a
              href="#collection"
              className="inline-flex items-center gap-2 px-8 md:px-12 py-4 bg-primary text-primary-foreground font-semibold rounded-full
                hover:scale-105 transition-transform hover:shadow-[0_0_24px_oklch(0.7_0.15_30_/_0.5)]"
            >
              <Sparkles className="w-5 h-5" />
              View Collection
            </a>
            <a
              href="#trending"
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-full
                hover:bg-white/5 transition-colors font-medium"
            >
              <TrendingUp className="w-5 h-5" />
              See Trending
            </a>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 md:gap-16 pt-8 animate-fade-in-up delay-500">
            {[
              { label: 'Products', value: products.length || '—' },
              { label: 'Happy Customers', value: '2.4K+' },
              { label: 'Cities Served', value: '12+' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────
          FEATURED CAROUSEL
      ───────────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
          </div>
          <FeaturedCarousel
            products={featuredProducts}
            onSelect={handleProductSelect}
          />
        </section>
      )}

      {/* ─────────────────────────────────────────────────
          TRENDING THIS WEEK
      ───────────────────────────────────────────────── */}
      {trendingProducts.length > 0 && (
        <section id="trending" className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h2 className="text-2xl font-bold text-foreground">Trending This Week</h2>
            <span className="text-xs bg-orange-500/10 text-orange-600 border border-orange-500/20 px-2.5 py-1 rounded-full font-medium">
              Hot 🔥
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={handleProductSelect}
                onLike={handleLike}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────
          FULL COLLECTION GRID
      ───────────────────────────────────────────────── */}
      <section id="collection" className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-foreground">All Products</h2>
          {!isLoading && (
            <span className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
              {filteredProducts.length} items
            </span>
          )}
        </div>

        <ProductFilter
          onSearch={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          selectedCategory={selectedCategory}
          categories={categories}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="h-80 rounded-xl animate-shimmer"
                style={{
                  background: 'linear-gradient(90deg, var(--muted) 25%, oklch(0.9 0 0 / 0.4) 50%, var(--muted) 75%)',
                  backgroundSize: '200% 100%',
                }}
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="text-center space-y-2">
              <p className="text-4xl">🔍</p>
              <p className="text-muted-foreground text-lg">No products found</p>
              <button
                className="text-sm text-primary hover:underline mt-2"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all') }}
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredProducts.map((product, idx) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(idx * 0.06, 0.4)}s` }}
              >
                <ProductCard
                  product={product}
                  onSelect={handleProductSelect}
                  onLike={handleLike}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────
          SOCIAL PROOF + REVIEWS SECTION
      ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Stats + copy */}
          <div className="space-y-8 animate-slide-in-left">
            <div>
              <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-3">
                What Our Customers Say
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                Loved by thousands<br />across Nigeria
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed">
                Real reviews from verified buyers who've experienced the Wearables difference.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '4.9', label: 'Average Rating', sub: 'From 400+ reviews' },
                { value: '98%', label: 'Satisfied', sub: 'Would recommend us' },
                { value: '2.4K', label: 'Customers', sub: 'Across 12 cities' },
                { value: '< 48h', label: 'Delivery', sub: 'To most cities' },
              ].map(stat => (
                <div key={stat.label} className="bg-muted rounded-xl p-4">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="font-medium text-sm text-foreground mt-0.5">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Reviews Carousel */}
          <div className="animate-slide-in-right">
            <ReviewsHighlight />
          </div>
        </div>
      </section>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedProduct(null) }}
        onLike={handleLike}
      />

      {/* Live social proof widget (fixed bottom-left) */}
      <SocialProofWidget />
    </main>
  )
}
