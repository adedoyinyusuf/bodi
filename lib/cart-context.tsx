'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface CartItem {
    id: string
    title: string
    price: number
    image: string
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (product: any) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    totalItems: number
    subtotal: number
    isCartOpen: boolean
    setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isInitialized, setIsInitialized] = useState(false)

    // Load cart from local storage
    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (e) {
                console.error('Failed to parse cart', e)
            }
        }
        setIsInitialized(true)
    }, [])

    // Save cart to local storage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem('cart', JSON.stringify(items))
        }
    }, [items, isInitialized])

    const addItem = (product: any) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [
                ...prev,
                {
                    id: product.id,
                    title: product.title,
                    price: Number(product.price),
                    image: product.images?.[0] || '',
                    quantity: 1,
                },
            ]
        })
        setIsCartOpen(true)
    }

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) return removeItem(id)
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
    const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
