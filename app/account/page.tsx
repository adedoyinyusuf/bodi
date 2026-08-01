'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useCurrency } from '@/lib/currency-context'
import { Loader2, Package } from 'lucide-react'

export default function AccountPage() {
    const { user, loading: authLoading, signOut } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const { formatPrice, convertPrice } = useCurrency()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        async function fetchOrders() {
            if (!user) return
            try {
                const res = await fetch('/api/orders')
                if (res.ok) {
                    const json = await res.json()
                    setOrders(json.data || [])
                }
            } catch (error) {
                console.error('Error fetching orders:', error)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            fetchOrders()
        }
    }, [user])

    if (authLoading || (loading && user)) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!user) return null

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Account</h1>
                    <p className="text-muted-foreground">Welcome back, {user.email || user.phone || 'User'}</p>
                </div>
                <Button onClick={() => signOut()}>Sign Out</Button>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Order History</h2>

                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <Package className="h-12 w-12 mb-4 opacity-50" />
                            <p>No orders found.</p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href="/">Start Shopping</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order) => (
                            <Card key={order.id}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                                            <CardDescription>
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </CardDescription>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">
                                                {formatPrice(convertPrice(order.total))}
                                            </div>
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize
                        ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {(order.order_items || []).map((item: any, idx: number) => (
                                            <div key={idx} className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {item.quantity}x {item.title || 'Product'}
                                                </span>
                                                <span>{formatPrice(convertPrice(item.price_at_purchase))}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
