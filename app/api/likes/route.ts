import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ data: [] }, { status: 200 })
  }

  try {
    const { rows } = await query(
      'SELECT * FROM product_likes WHERE product_id = $1',
      [productId]
    )
    return NextResponse.json({ data: rows }, { status: 200 })
  } catch (error) {
    console.error('Error fetching likes:', error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, userId } = await request.json()

    if (!productId || !userId) {
      return NextResponse.json({ error: 'Missing productId or userId' }, { status: 400 })
    }

    const { rows } = await query(
      'SELECT id FROM product_likes WHERE product_id = $1 AND user_id = $2',
      [productId, userId]
    )

    if (rows.length > 0) {
      await query('DELETE FROM product_likes WHERE id = $1', [rows[0].id])
      return NextResponse.json({ liked: false }, { status: 200 })
    } else {
      await query(
        'INSERT INTO product_likes (product_id, user_id) VALUES ($1, $2)',
        [productId, userId]
      )
      return NextResponse.json({ liked: true }, { status: 200 })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json({ error: 'Failed to toggle like' }, { status: 500 })
  }
}
