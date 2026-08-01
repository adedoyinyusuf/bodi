import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { rows } = await query(
      'INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    )

    return NextResponse.json(
      {
        success: true,
        data: rows[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('API error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { rows } = await query('SELECT * FROM messages ORDER BY created_at DESC')
    return NextResponse.json({ data: rows }, { status: 200 })
  } catch (error) {
    console.error('API error fetching messages:', error)
    return NextResponse.json({ data: [] }, { status: 200 })
  }
}
