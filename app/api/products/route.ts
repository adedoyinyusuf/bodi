import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { rows } = await query(`
      SELECT p.*,
        COALESCE(l.likes_count, 0)::integer AS likes_count,
        COALESCE(c.comments_count, 0)::integer AS comments_count
      FROM products p
      LEFT JOIN (
        SELECT product_id, COUNT(*) AS likes_count
        FROM product_likes
        GROUP BY product_id
      ) l ON p.id = l.product_id
      LEFT JOIN (
        SELECT product_id, COUNT(*) AS comments_count
        FROM product_comments
        GROUP BY product_id
      ) c ON p.id = c.product_id
      ORDER BY p.created_at DESC
    `)
    const products = rows.map((row: any) => ({
      ...row,
      price: parseFloat(row.price),
      original_price: row.original_price ? parseFloat(row.original_price) : null,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
      likes_count: parseInt(row.likes_count) || 0,
      comments_count: parseInt(row.comments_count) || 0,
    }))
    return NextResponse.json({ data: products }, { status: 200 })
  } catch (error) {
    console.error('API error fetching products:', error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}
