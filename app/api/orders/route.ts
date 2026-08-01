import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { rows: orders } = await query('SELECT * FROM orders ORDER BY created_at DESC')
    return NextResponse.json({ data: orders }, { status: 200 })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}
