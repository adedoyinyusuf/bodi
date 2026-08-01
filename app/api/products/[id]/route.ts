import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const { rows } = await query('SELECT * FROM products WHERE id = $1', [id])
    if (rows.length === 0) {
      return NextResponse.json({ data: null }, { status: 404 })
    }
    const product = {
      ...rows[0],
      price: parseFloat(rows[0].price),
      original_price: rows[0].original_price ? parseFloat(rows[0].original_price) : null,
      images: typeof rows[0].images === 'string' ? JSON.parse(rows[0].images) : (rows[0].images || []),
    }
    return NextResponse.json({ data: product }, { status: 200 })
  } catch (error) {
    console.error('Error fetching product by id:', error)
    return NextResponse.json({ data: null }, { status: 500 })
  }
}
