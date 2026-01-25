import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // Handle cookie setting errors
            }
          },
        },
      }
    )

    // Fetch stats from database
    const [productsRes, messagesRes, likesRes, commentsRes] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
      supabase.from('product_likes').select('id', { count: 'exact', head: true }),
      supabase.from('product_comments').select('id', { count: 'exact', head: true }),
    ])

    return Response.json({
      totalProducts: productsRes.count || 0,
      totalMessages: messagesRes.count || 0,
      totalLikes: likesRes.count || 0,
      totalComments: commentsRes.count || 0,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
