'use client'

import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { useCurrency } from '@/lib/currency-context'

export function CartDrawer() {
    const { items, removeItem, updateQuantity, subtotal, isCartOpen, setIsCartOpen } = useCart()
    const { formatPrice, convertPrice } = useCurrency()

    // Helper to display price
    const displayPrice = (price: number) => {
        return formatPrice(convertPrice(price))
    }

    return (
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingBag className="h-5 w-5" />
                    {items.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                            {items.reduce((acc, item) => acc + item.quantity, 0)}
                        </span>
                    )}
                    <span className="sr-only">Open cart</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Shopping Bag ({items.length})</SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
                            <div className="space-y-1">
                                <p className="font-medium">Your bag is empty</p>
                                <p className="text-sm text-muted-foreground">
                                    Add some items to start checking out
                                </p>
                            </div>
                            <Button variant="secondary" onClick={() => setIsCartOpen(false)}>
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-secondary/50">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between">
                                        <div className="space-y-1">
                                            <h3 className="font-medium leading-none">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {displayPrice(item.price)}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon-sm"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon-sm"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeItem(item.id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="border-t pt-4">
                        <div className="w-full space-y-4">
                            <div className="flex items-center justify-between font-medium">
                                <span>Subtotal</span>
                                <span>{displayPrice(subtotal)}</span>
                            </div>
                            <div className="grid gap-2">
                                <Button className="w-full" asChild>
                                    <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                                        Checkout
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full" onClick={() => setIsCartOpen(false)}>
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
