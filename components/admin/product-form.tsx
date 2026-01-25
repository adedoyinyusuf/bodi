'use client'

import React from "react"

import { useState } from 'react'
import { X } from 'lucide-react'

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
}

export function ProductForm({ onSubmit, isLoading, initialData }: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || {
      title: '',
      description: '',
      long_description: '',
      price: 0,
      category: 'Electronics',
      images: [],
      in_stock: true,
    }
  )
  const [imageUrl, setImageUrl] = useState('')

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
        [name]: parseFloat(value),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
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
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>Audio</option>
            <option>Displays</option>
            <option>Wearables</option>
            <option>Accessories</option>
            <option>Peripherals</option>
            <option>Storage</option>
          </select>
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Product Images</label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={handleAddImage}
              disabled={!imageUrl || formData.images.length >= 5}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              Add
            </button>
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
        disabled={isLoading}
        className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity font-medium"
      >
        {isLoading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  )
}
