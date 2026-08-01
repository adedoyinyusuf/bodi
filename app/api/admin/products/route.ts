import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { rows } = await query('SELECT id, title, price, category, in_stock, created_at FROM products ORDER BY created_at DESC')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, price, original_price, category, images, in_stock, featured, badge } = body

    const imagesJson = JSON.stringify(images || [])

    const { rows } = await query(
      `INSERT INTO products (title, description, price, original_price, category, images, in_stock, featured, badge)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, description, price, original_price || null, category, imagesJson, in_stock ?? true, featured ?? false, badge || null]
    )

    return NextResponse.json(rows[0], { status: 201 })
  } catch (error: any) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 })
  }
}
