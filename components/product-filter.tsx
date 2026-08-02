'use client'

import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PRODUCT_CATEGORY_GROUPS } from '@/lib/categories'

interface ProductFilterProps {
  onSearch: (query: string) => void
  onCategoryChange: (category: string) => void
  selectedCategory: string
  categories: string[]
}

export function ProductFilter({
  onSearch,
  onCategoryChange,
  selectedCategory,
  categories,
}: ProductFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
      {/* Search Input */}
      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products by title, category..."
          className="pl-10 rounded-full"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Category Dropdown + Pill Selector */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Filter className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-full text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="all">All Categories</option>
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

        {/* Quick Reset Pill if category selected */}
        {selectedCategory !== 'all' && (
          <Button
            variant="ghost"
            onClick={() => onCategoryChange('all')}
            className="rounded-full text-xs"
            size="sm"
          >
            Clear Filter
          </Button>
        )}
      </div>
    </div>
  )
}
