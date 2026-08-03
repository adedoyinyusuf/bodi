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
  type Product,
} from '@/lib/product-utils'
import { useNewProducts } from '@/hooks/use-new-products'
import { useAuth } from '@/lib/auth-context'
import { Sparkles, TrendingUp, Zap, ShieldCheck, Truck, Star, ArrowRight, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

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
          HERO SECTION — Professional White Theme & Marketing Animations
      ───────────────────────────────────────────────── */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden bg-white">
        
        {/* Subtle mesh background grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #ffffff 1px)`,
            backgroundSize: `40px 40px`,
            backgroundPosition: `0 0, 20px 20px`,
          }}
        />

        {/* Ambient soft light glows */}
        <div
          className="absolute -top-24 right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none animate-float-slow opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(255, 255, 255, 0) 70%)' }}
        />
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none animate-float-slow delay-1000 opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(251, 146, 60, 0.12) 0%, rgba(255, 255, 255, 0) 70%)' }}
        />
        <div
          className="absolute top-[40%] left-[30%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none animate-float-slow delay-500 opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, rgba(255, 255, 255, 0) 70%)' }}
        />

        {/* Floating Interactive Badge Card (Left) */}
        <div className="hidden lg:flex items-center gap-3 absolute top-28 left-8 p-3.5 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/50 pointer-events-auto hover:scale-105 transition-transform animate-float-slow z-20">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold text-lg">
            ⚡
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">2026 Flagship Series</p>
            <p className="text-[11px] text-slate-500">Same-Day Express Dispatch</p>
          </div>
        </div>

        {/* Floating Interactive Badge Card (Right) */}
        <div className="hidden lg:flex items-center gap-3 absolute bottom-24 right-10 p-3.5 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/50 pointer-events-auto hover:scale-105 transition-transform animate-float-slow delay-1000 z-20">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-lg">
            🛡️
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-900">Official 2-Year Warranty</p>
            <p className="text-[11px] text-slate-500">100% Authentic Guaranteed</p>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-7 z-10">
          
          {/* Marketing Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/5 border border-slate-200/80 text-slate-800 text-xs md:text-sm font-semibold tracking-wide shadow-sm animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>PREMIUM WEARABLE TECHNOLOGY</span>
            <span className="px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-700 text-[10px] font-bold uppercase">2026 Edition</span>
          </div>

          {/* Main Headline — Clean white theme with metallic gradient emphasis */}
          <WordRevealHeadline
            className="text-5xl md:text-7xl lg:text-8xl text-slate-950 font-black tracking-tight text-balance leading-[1.05]"
            staggerMs={80}
          >
            Wear Your Excellence
          </WordRevealHeadline>

          {/* Shimmer sub-headline */}
          <ShimmerHeadline
            as="h2"
            className="text-2xl md:text-3xl font-bold tracking-tight text-balance"
            baseColor="#334155"
            shimmerColor="#2563eb"
          >
            Crafted for those who lead and innovate.
          </ShimmerHeadline>

          <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto text-balance font-normal leading-relaxed animate-fade-in-up delay-200">
            Discover a curated world of high-performance smart timepieces, studio headphones,
            and flagship mobile gear — engineered with fine-art precision.
          </p>

          {/* Marketing Value Props Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs md:text-sm text-slate-600 font-medium animate-fade-in-up delay-250">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
              <Truck className="w-4 h-4 text-slate-700" />
              <span>Free Worldwide Shipping</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full">
              <ShieldCheck className="w-4 h-4 text-slate-700" />
              <span>2-Year Warranty</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/60 rounded-full">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold">4.9/5 Rating (2,400+ Reviews)</span>
            </div>
          </div>

          {/* Marketing Call-to-Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up delay-300">
            <a
              href="#collection"
              className="inline-flex items-center gap-2.5 px-8 md:px-10 py-4 bg-slate-950 text-white font-semibold rounded-full
                hover:bg-slate-900 hover:scale-105 transition-all shadow-xl shadow-slate-950/20 hover:shadow-slate-950/30"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>View Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#trending"
              className="inline-flex items-center gap-2.5 px-8 py-4 border border-slate-300/80 bg-white/80 backdrop-blur text-slate-800 rounded-full
                hover:bg-slate-50 hover:border-slate-400 transition-all font-semibold shadow-sm"
            >
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>See Trending</span>
            </a>
          </div>

          {/* Social Proof Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto pt-8 animate-fade-in-up delay-500">
            {[
              { label: 'Products', value: products.length || '—' },
              { label: 'Happy Customers', value: '2.4K+' },
              { label: 'Cities Served', value: '12+' },
            ].map(stat => (
              <div 
                key={stat.label} 
                className="p-4 bg-white/90 border border-slate-200/80 rounded-2xl text-center shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
              >
                <p className="text-xl md:text-2xl font-bold text-slate-950 tracking-tight">{stat.value}</p>
                <p className="text-[11px] md:text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
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
