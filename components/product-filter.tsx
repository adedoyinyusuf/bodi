'use client'

import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ProductFilterProps {
    onSearch: (query: string) => void
    onCategoryChange: (category: string) => void
    selectedCategory: string
    categories: string[]
}

export function ProductFilter({ onSearch, onCategoryChange, selectedCategory, categories }: ProductFilterProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    className="pl-10"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => onCategoryChange('all')}
                    className="rounded-full"
                    size="sm"
                >
                    All
                </Button>
                {categories.map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        onClick={() => onCategoryChange(category)}
                        className="rounded-full capitalize"
                        size="sm"
                    >
                        {category}
                    </Button>
                ))}
            </div>
        </div>
    )
}
