import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { rows } = await query('SELECT * FROM messages ORDER BY created_at DESC')
    return NextResponse.json(rows)
  } catch (error) {
    console.error('Messages fetch error:', error)
    return NextResponse.json([], { status: 200 })
  }
}
