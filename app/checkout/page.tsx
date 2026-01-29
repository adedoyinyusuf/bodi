'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePaystackPayment } from 'react-paystack'
import { useCart } from '@/lib/cart-context'
import { useCurrency } from '@/lib/currency-context'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart()
    const { user } = useAuth()
    const { formatPrice, convertPrice } = useCurrency()
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
    })
    const [loading, setLoading] = useState(false)

    const shippingCost = 10 // Example fixed shipping in USD
    const totalUSD = subtotal + shippingCost
    const displaySubtotal = formatPrice(convertPrice(subtotal))
    const displayShipping = formatPrice(convertPrice(shippingCost))
    const displayTotal = formatPrice(convertPrice(totalUSD))

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Paystack Config
    const config = {
        reference: (new Date()).getTime().toString(),
        email: formData.email,
        amount: Math.round(convertPrice(totalUSD) * 100), // Amount in kobo/cents
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    };

    const initializePayment = usePaystackPayment({
        ...config,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxxxxxx'
    });

    const onSuccess = () => {
        toast.success("Payment Successful! Order placed.")
        clearCart()
        window.location.href = '/' // Or redirect to order history
    };

    const onClose = () => {
        setLoading(false)
    }

    const handlePaystackPayment = async () => {
        if (!formData.email || !formData.address) {
            toast.error("Please fill in all shipping details")
            return
        }

        setLoading(true)
        try {
            // 1. Create Order in Pending state (Backend)
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    total: totalUSD,
                    shippingAddress: formData,
                    email: formData.email,
                    userId: user?.id
                })
            })

            if (!response.ok) throw new Error('Failed to create order')

            // Initialize Paystack Payment
            initializePayment({ onSuccess, onClose })

        } catch (error) {
            console.error(error)
            toast.error('Checkout failed. Please try again.')
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-3xl font-bold mb-4">Your bag is empty</h1>
                <p className="text-muted-foreground mb-8">Add some items before checking out.</p>
                <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Shipping Form */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+234..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="address" className="text-sm font-medium">Address</label>
                                <Input
                                    id="address"
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="123 Street Name"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="city" className="text-sm font-medium">City</label>
                                    <Input
                                        id="city"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="state" className="text-sm font-medium">State</label>
                                    <Input
                                        id="state"
                                        name="state"
                                        required
                                        value={formData.state}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-16 w-16 shrink-0 rounded overflow-hidden bg-secondary">
                                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground">{item.quantity} x {formatPrice(convertPrice(item.price))}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Subtotal</span>
                                    <span>{displaySubtotal}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Shipping</span>
                                    <span>{displayShipping}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total</span>
                                    <span>{displayTotal}</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full h-12 text-lg"
                                onClick={handlePaystackPayment}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ${displayTotal}`
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
