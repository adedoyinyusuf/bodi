import { getSupabaseClient } from '@/lib/supabase'

// Helper to normalize product data
function normalizeProduct(product: any) {
  return {
    ...product,
    title: product.title || product.name || 'Untitled Product', // Fallback for legacy data
    images: product.images || [],
  }
}

export async function getProducts() {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return (data || []).map(normalizeProduct)
}

export async function getProductById(id: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  return data
}

export async function getProductComments(productId: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('product_comments')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comments:', error)
    return []
  }

  return data || []
}

export async function addComment(productId: string, userId: string, userName: string, userEmail: string, content: string, rating?: number) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('product_comments')
    .insert([{
      product_id: productId,
      user_id: userId,
      user_name: userName,
      user_email: userEmail,
      content,
      rating
    }])
    .select()

  if (error) {
    console.error('Error adding comment:', error)
    return null
  }

  return data?.[0] || null
}

export async function getProductLikes(productId: string) {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('product_likes')
    .select('*')
    .eq('product_id', productId)

  if (error) {
    console.error('Error fetching likes:', error)
    return []
  }

  return data || []
}

export async function toggleLike(productId: string, userId: string) {
  const supabase = getSupabaseClient()

  // Check if already liked
  const { data: existingLike } = await supabase
    .from('product_likes')
    .select('id')
    .eq('product_id', productId)
    .eq('user_id', userId)
    .single()

  if (existingLike) {
    // Remove like
    await supabase
      .from('product_likes')
      .delete()
      .eq('id', existingLike.id)
  } else {
    // Add like
    await supabase
      .from('product_likes')
      .insert([{ product_id: productId, user_id: userId }])
  }
}
