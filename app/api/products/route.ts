import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { rows } = await query('SELECT * FROM products ORDER BY created_at DESC')
    const products = rows.map((row: any) => ({
      ...row,
      price: parseFloat(row.price),
      original_price: row.original_price ? parseFloat(row.original_price) : null,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || []),
    }))
    return NextResponse.json({ data: products }, { status: 200 })
  } catch (error) {
    console.error('API error fetching products:', error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}
