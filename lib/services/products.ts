function normalizeProduct(product: any) {
  return {
    ...product,
    title: product.title || product.name || 'Untitled Product',
    images: typeof product.images === 'string' ? JSON.parse(product.images) : (product.images || []),
    price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
    original_price: typeof product.original_price === 'string' ? parseFloat(product.original_price) : product.original_price,
    likes_count: parseInt(product.likes_count) || 0,
    comments_count: parseInt(product.comments_count) || 0,
  }
}

export async function getProducts() {
  try {
    const baseUrl = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    const res = await fetch(`${baseUrl}/api/products`, { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json()
    return (json.data || []).map(normalizeProduct)
  } catch (err) {
    console.error('Failed to fetch products:', err)
    return []
  }
}

export async function getProductById(id: string) {
  try {
    const baseUrl = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    const res = await fetch(`${baseUrl}/api/products/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    return json.data ? normalizeProduct(json.data) : null
  } catch (err) {
    console.error('Failed to fetch product by id:', err)
    return null
  }
}

export async function getProductComments(productId: string) {
  try {
    const res = await fetch(`/api/comments?productId=${productId}`, { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (err) {
    console.error('Failed to fetch comments:', err)
    return []
  }
}

export async function addComment(productId: string, userId: string, userName: string, userEmail: string, content: string, rating?: number) {
  try {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, userId, userName, userEmail, content, rating }),
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data || null
  } catch (err) {
    console.error('Failed to add comment:', err)
    return null
  }
}

export async function getProductLikes(productId: string) {
  try {
    const res = await fetch(`/api/likes?productId=${productId}`, { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json()
    return json.data || []
  } catch (err) {
    console.error('Failed to fetch likes:', err)
    return []
  }
}

export async function toggleLike(productId: string, userId: string) {
  try {
    await fetch('/api/likes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, userId }),
    })
  } catch (err) {
    console.error('Failed to toggle like:', err)
  }
}
