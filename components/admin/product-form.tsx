'use client'

import React from "react"
import { useState } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { PRODUCT_CATEGORY_GROUPS } from '@/lib/categories'

interface ProductFormData {
  title: string
  description: string
  long_description: string
  price: number
  category: string
  images: string[]
  in_stock: boolean
}

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>
  isLoading: boolean
  initialData?: ProductFormData
  submitLabel?: string
}

export function ProductForm({ onSubmit, isLoading, initialData, submitLabel = 'Create Product' }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      title: '',
      description: '',
      long_description: '',
      price: 0,
      category: PRODUCT_CATEGORY_GROUPS[0].subcategories[0],
      images: [],
      in_stock: true,
    }
  )
  const [imageUrl, setImageUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      })
    } else if (name === 'price') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (formData.images.length >= 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    setUploading(true)
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      })

      const newBlob = await response.json()
      if (newBlob.url) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, newBlob.url],
        }))
        toast.success('Image uploaded to Vercel Blob!')
      } else {
        throw new Error(newBlob.error || 'Upload failed')
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleAddImage = () => {
    if (imageUrl && formData.images.length < 5) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl],
      })
      setImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-border p-6 space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Product Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter product title"
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Short Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief product description"
          rows={2}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      {/* Long Description */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Detailed Description</label>
        <textarea
          name="long_description"
          value={formData.long_description}
          onChange={handleChange}
          placeholder="Detailed product information"
          rows={4}
          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Price and Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {PRODUCT_CATEGORY_GROUPS.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Images with Vercel Blob Upload */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Product Images (Vercel Blob Storage)</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste image URL..."
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleAddImage}
              disabled={!imageUrl || formData.images.length >= 5}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Add URL
            </button>
            <label className="cursor-pointer px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              {uploading ? <Loader2 className="animate-spin h-4 w-4" /> : <Upload className="h-4 w-4" />}
              <span>Upload</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploading || formData.images.length >= 5} />
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-5 gap-2">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground">{formData.images.length}/5 images</p>
        </div>
      </div>

      {/* In Stock */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="in_stock"
          checked={formData.in_stock}
          onChange={handleChange}
          className="w-4 h-4 rounded border-border"
        />
        <label className="text-sm font-medium text-foreground">Product is in stock</label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || uploading}
        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
      >
        {isLoading ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
