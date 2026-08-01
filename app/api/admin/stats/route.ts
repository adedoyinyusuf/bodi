import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [productsRes, messagesRes, likesRes, commentsRes] = await Promise.all([
      query('SELECT COUNT(*)::int as count FROM products'),
      query('SELECT COUNT(*)::int as count FROM messages'),
      query('SELECT COUNT(*)::int as count FROM product_likes'),
      query('SELECT COUNT(*)::int as count FROM product_comments'),
    ])

    return NextResponse.json({
      totalProducts: productsRes.rows[0]?.count || 0,
      totalMessages: messagesRes.rows[0]?.count || 0,
      totalLikes: likesRes.rows[0]?.count || 0,
      totalComments: commentsRes.rows[0]?.count || 0,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({
      totalProducts: 0,
      totalMessages: 0,
      totalLikes: 0,
      totalComments: 0,
    })
  }
}
