import { getSupabaseClient } from '@/lib/supabase'

function logServiceError(label: string, error: any) {
  if (error) {
    let errorMsg = '';
    if (error && typeof error === 'object') {
      errorMsg = error.message || (typeof error.toString === 'function' ? error.toString() : '') || JSON.stringify(error);
      if (error.details) {
        errorMsg += ` (${error.details})`;
      }
    } else {
      errorMsg = String(error);
    }
    console.error(`${label} ${errorMsg}`, error);
  }
}

// Helper to normalize product data
function normalizeProduct(product: any) {
  return {
    ...product,
    title: product.title || product.name || 'Untitled Product', // Fallback for legacy data
    images: product.images || [],
  }
}

export async function getProducts() {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      logServiceError('Error fetching products:', error)
      return []
    }

    return (data || []).map(normalizeProduct)
  } catch (err) {
    logServiceError('Failed to connect to Supabase database (check NEXT_PUBLIC_SUPABASE_URL):', err)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      logServiceError('Error fetching product:', error)
      return null
    }

    return normalizeProduct(data)
  } catch (err) {
    logServiceError('Failed to connect to Supabase database:', err)
    return null
  }
}

export async function getProductComments(productId: string) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('product_comments')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })

    if (error) {
      logServiceError('Error fetching comments:', error)
      return []
    }

    return data || []
  } catch (err) {
    logServiceError('Failed to fetch comments:', err)
    return []
  }
}

export async function addComment(productId: string, userId: string, userName: string, userEmail: string, content: string, rating?: number) {
  try {
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
      logServiceError('Error adding comment:', error)
      return null
    }

    return data?.[0] || null
  } catch (err) {
    logServiceError('Failed to add comment:', err)
    return null
  }
}

export async function getProductLikes(productId: string) {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('product_likes')
      .select('*')
      .eq('product_id', productId)

    if (error) {
      logServiceError('Error fetching likes:', error)
      return []
    }

    return data || []
  } catch (err) {
    logServiceError('Failed to fetch likes:', err)
    return []
  }
}

export async function toggleLike(productId: string, userId: string) {
  try {
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
  } catch (err) {
    logServiceError('Failed to toggle like:', err)
  }
}
