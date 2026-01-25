'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/product-card'
import { ProductModal } from '@/components/product-modal'
import { getProducts, toggleLike } from '@/lib/services/products'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  likes_count: number
  comments_count: number
  details?: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    loadProducts()
  }, [])
  
  const loadProducts = async () => {
    setIsLoading(true)
    try {
      const data = await getProducts()
      setProducts(data)
    } catch (error) {
      console.error('Failed to load products:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }
  
  const handleLike = async (productId: string) => {
    // In a real app, get userId from auth context
    const userId = 'anonymous'
    await toggleLike(productId, userId)
    
    // Reload products to get updated counts
    await loadProducts()
  }
  
  return (
    <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background via-background to-muted py-16 md:py-32 px-4">
          <div className="max-w-7xl mx-auto text-center space-y-6">
            <p className="text-sm md:text-base uppercase tracking-widest text-muted-foreground font-semibold">
              Essential Technology
            </p>
            <h1 className="text-6xl md:text-7xl font-display font-bold text-foreground text-balance leading-tight">
              Look Smart, Stand Out in the Crowd, the Bodi Treatment You Deserve
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-balance font-light leading-relaxed">
              Explore our curated collection. Add items to your Interest List and inquire directly via WhatsApp.
            </p>
            <div className="pt-4">
              <a href="#collection" className="inline-block px-8 md:px-12 py-4 bg-foreground text-background font-semibold rounded-full hover:opacity-90 transition-opacity">
                View Collection
              </a>
            </div>
          </div>
        </section>
        
        {/* Collection Grid */}
        <section id="collection" className="max-w-7xl mx-auto px-4 py-12 md:py-20">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center min-h-96">
              <p className="text-muted-foreground text-lg">No products available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleProductSelect}
                  onLike={handleLike}
                />
              ))}
            </div>
          )}
        </section>
      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
      />
    </main>
  )
}
