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
    const { title, description, price, category, images, in_stock } = body

    // Log what we're about to write (visible in Vercel function logs)
    console.log('[PUT /api/admin/products]', {
      id,
      price,
      priceAsNumber: Number(price),
      title,
      category,
    })

    const result = await query(
      `UPDATE products
       SET title       = $1,
           description = $2,
           price       = $3,
           category    = $4,
           images      = $5::jsonb,
           in_stock    = $6
       WHERE id = $7
       RETURNING id, title, price, category`,
      [
        title,
        description,
        Number(price),
        category,
        JSON.stringify(images || []),
        in_stock ?? true,
        id,
      ]
    )

    console.log('[PUT /api/admin/products] updated row:', result.rows[0])

    return NextResponse.json({ success: true, updated: result.rows[0] })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
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
