import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
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
      WHERE p.id = $1
    `, [id])
    if (rows.length === 0) {
      return NextResponse.json({ data: null }, { status: 404 })
    }
    const product = {
      ...rows[0],
      price: parseFloat(rows[0].price),
      original_price: rows[0].original_price ? parseFloat(rows[0].original_price) : null,
      images: typeof rows[0].images === 'string' ? JSON.parse(rows[0].images) : (rows[0].images || []),
      likes_count: parseInt(rows[0].likes_count) || 0,
      comments_count: parseInt(rows[0].comments_count) || 0,
    }
    return NextResponse.json({ data: product }, { status: 200 })
  } catch (error) {
    console.error('Error fetching product by id:', error)
    return NextResponse.json({ data: null }, { status: 500 })
  }
}
