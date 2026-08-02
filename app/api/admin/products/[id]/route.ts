import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

// GET /api/admin/products/[id] — fetch single product for editing
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const result = await query('SELECT * FROM products WHERE id = $1', [id])
    if (!result.rows.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ data: result.rows[0] })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PUT /api/admin/products/[id] — update product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { title, description, long_description, price, category, images, in_stock } = body

    await query(
      `UPDATE products
       SET title = $1,
           description = $2,
           long_description = $3,
           price = $4,
           category = $5,
           images = $6::jsonb,
           in_stock = $7
       WHERE id = $8`,
      [
        title,
        description,
        long_description || '',
        Number(price),
        category,
        JSON.stringify(images || []),
        in_stock ?? true,
        id,
      ]
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await query('DELETE FROM products WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product delete error:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
