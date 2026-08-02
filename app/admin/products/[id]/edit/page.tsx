'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { isAdminAuthenticated } from '@/lib/auth'
import { ProductForm } from '@/components/admin/product-form'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [initialData, setInitialData] = useState<any>(null)

  useEffect(() => {
    setIsMounted(true)
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }

    // Fetch the existing product
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`)
        if (!res.ok) throw new Error('Product not found')
        const json = await res.json()
        const p = json.data || json

        // Normalise price & images from DB types
        setInitialData({
          title: p.title || '',
          description: p.description || '',
          long_description: p.long_description || '',
          price: Number(p.price) || 0,
          category: p.category || 'Electronics',
          images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
          in_stock: p.in_stock ?? true,
        })
      } catch (err: any) {
        toast.error('Failed to load product')
        router.push('/admin/products')
      } finally {
        setIsFetching(false)
      }
    }

    fetchProduct()
  }, [id, router])

  if (!isMounted || !isAdminAuthenticated()) return null

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('Product updated successfully!')
        router.push('/admin/products')
      } else {
        const json = await res.json()
        throw new Error(json.error || 'Update failed')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update product')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Edit Product</h1>
        <p className="text-muted-foreground mt-2">Update product details and images</p>
      </div>

      {isFetching ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : initialData ? (
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          initialData={initialData}
          submitLabel="Save Changes"
        />
      ) : null}
    </div>
  )
}
