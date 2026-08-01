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
      'SELECT * FROM product_comments WHERE product_id = $1 ORDER BY created_at DESC',
      [productId]
    )
    return NextResponse.json({ data: rows }, { status: 200 })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, userId, userName, userEmail, content, rating } = await request.json()

    if (!productId || !userId || !content) {
      return NextResponse.json({ error: 'Missing required comment fields' }, { status: 400 })
    }

    const { rows } = await query(
      `INSERT INTO product_comments (product_id, user_id, user_name, user_email, content, rating)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [productId, userId, userName || 'User', userEmail || 'user@example.com', content, rating || 5]
    )

    return NextResponse.json({ data: rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Error adding comment:', error)
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 })
  }
}
