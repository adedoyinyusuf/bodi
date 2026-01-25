'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { isAdminAuthenticated } from '@/lib/auth'
import { ProductForm } from '@/components/admin/product-form'

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  if (!isAdminAuthenticated()) {
    router.push('/admin/login')
    return null
  }

  const handleSubmit = async (formData: any) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/products')
      }
    } catch (error) {
      console.error('Failed to create product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Add New Product</h1>
        <p className="text-muted-foreground mt-2">Create and configure a new product</p>
      </div>
      <ProductForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  )
}
