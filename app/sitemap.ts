import { MetadataRoute } from 'next'
import { query } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bodiware.vercel.app'

  // Standard static routes
  const routes: MetadataRoute.Sitemap = [
    '',
    '/about',
    '/contact',
    '/auth',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'hourly' : 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }))

  // Fetch products directly from DB for dynamic sitemap indexing
  try {
    const result = await query('SELECT id, created_at FROM products ORDER BY created_at DESC')
    const products = result.rows || []
    const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
      url: `${baseUrl}/#product-${product.id}`,
      lastModified: product.created_at ? new Date(product.created_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }))
    return [...routes, ...productRoutes]
  } catch (e) {
    console.error('Failed to append dynamic products to sitemap:', e)
  }

  return routes
}
