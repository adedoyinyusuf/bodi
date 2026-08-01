/**
 * Product Intelligence Utilities
 * Helpers for detecting new items, calculating trends, sorting, and badge assignment.
 */

export interface Product {
  id: string
  title: string
  description?: string
  price?: number
  images?: string[]
  likes_count?: number
  comments_count?: number
  created_at?: string
  badge?: string
  category?: string
}

/** Number of days a product is considered "new" */
const NEW_PRODUCT_THRESHOLD_DAYS = 7

/** ---------- Detection ---------- */

export function isNewProduct(product: Product): boolean {
  if (!product.created_at) return false
  const created = new Date(product.created_at).getTime()
  const ageMs = Date.now() - created
  return ageMs < NEW_PRODUCT_THRESHOLD_DAYS * 24 * 60 * 60 * 1000
}

export function isBestseller(product: Product, threshold = 5): boolean {
  return (product.likes_count ?? 0) >= threshold
}

/** Composite trending score: likes are less impactful than comments (engagement) */
export function getTrendingScore(product: Product): number {
  const likes    = product.likes_count ?? 0
  const comments = product.comments_count ?? 0
  // Recency bonus
  const ageBonus = isNewProduct(product) ? 5 : 0
  return likes + comments * 2 + ageBonus
}

export function isTrending(product: Product, threshold = 4): boolean {
  return getTrendingScore(product) >= threshold
}

/** ---------- Sorting ---------- */

export function sortByPopularity(products: Product[]): Product[] {
  return [...products].sort((a, b) => getTrendingScore(b) - getTrendingScore(a))
}

export function sortByRecency(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const at = a.created_at ? new Date(a.created_at).getTime() : 0
    const bt = b.created_at ? new Date(b.created_at).getTime() : 0
    return bt - at
  })
}

export function sortByLikes(products: Product[]): Product[] {
  return [...products].sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0))
}

/** ---------- Filtering ---------- */

export function getNewProducts(products: Product[]): Product[] {
  return products.filter(isNewProduct)
}

export function getBestsellers(products: Product[], threshold = 5): Product[] {
  return sortByLikes(products.filter(p => isBestseller(p, threshold)))
}

export function getTrendingProducts(products: Product[], threshold = 4): Product[] {
  return sortByPopularity(products.filter(p => isTrending(p, threshold)))
}

export function getFeaturedProducts(products: Product[]): Product[] {
  return products.filter(p => p.badge === 'Featured' || p.badge === 'Best Seller' || p.badge === 'New')
}

/** ---------- Badge Assignment ---------- */

export type BadgeVariant = 'new' | 'trending' | 'bestseller' | 'featured' | 'sale' | null

export function getProductBadge(product: Product): BadgeVariant {
  if (isNewProduct(product)) return 'new'
  if (isBestseller(product, 10)) return 'bestseller'
  if (isTrending(product, 6)) return 'trending'
  if (product.badge === 'Featured') return 'featured'
  if (product.badge === 'Sale') return 'sale'
  return null
}

/** ---------- Rating --- */

/**
 * Derive a synthetic 0-5 star rating from engagement data.
 * Real ratings would come from a reviews table.
 */
export function getEngagementRating(product: Product): number {
  const likes    = product.likes_count ?? 0
  const comments = product.comments_count ?? 0
  const score    = likes + comments * 2
  // Map score to 3.0 – 5.0 band
  const capped   = Math.min(score, 30)
  return +(3.0 + (capped / 30) * 2.0).toFixed(1)
}
