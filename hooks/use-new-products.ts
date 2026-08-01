'use client'

import { useEffect, useRef } from 'react'
import { useNotification } from '@/components/notification-provider'
import { Product } from '@/lib/product-utils'

const POLL_INTERVAL_MS = 30_000

export function useNewProducts(
  products: Product[],
  onViewProduct?: (id: string) => void
) {
  const { notify } = useNotification()
  const lastKnownIdsRef = useRef<Set<string>>(new Set())
  const hasInitialized = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (!products.length) return

    const currentIds = new Set(products.map(p => p.id))

    if (!hasInitialized.current) {
      // First load — seed the ref, send a welcome notification
      lastKnownIdsRef.current = currentIds
      hasInitialized.current = true

      // Check for trending items on initial load
      const trendingProduct = [...products].sort(
        (a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0)
      )[0]

      if (trendingProduct && (trendingProduct.likes_count ?? 0) > 0) {
        setTimeout(() => {
          notify({
            type: 'trending',
            title: 'Trending right now 🔥',
            message: `"${trendingProduct.title}" is the most popular item in store.`,
            actionLabel: 'View product',
            onAction: onViewProduct ? () => onViewProduct(trendingProduct.id) : undefined,
          })
        }, 3000) // small delay so page settles first
      }
      return
    }

    // Subsequent updates — find genuinely new products
    const newProducts = products.filter(p => !lastKnownIdsRef.current.has(p.id))
    lastKnownIdsRef.current = currentIds

    if (newProducts.length > 0) {
      const first = newProducts[0]
      notify({
        type: 'new_product',
        title: `New arrival! ✨`,
        message: `"${first.title}" just landed in the store.`,
        actionLabel: 'Check it out',
        onAction: onViewProduct ? () => onViewProduct(first.id) : undefined,
      })
    }
  }, [products, notify, onViewProduct])

  // Poll for product refreshes from the parent — parent controls the interval
  // This hook intentionally does NOT do its own fetch; products are passed in.
  // The parent passes updated products on each poll cycle.
  return { pollingIntervalMs: POLL_INTERVAL_MS }
}
