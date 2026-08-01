import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    await query('DELETE FROM messages WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Message delete error:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
