import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export default function CheckoutSuccessPage() {
    return (
        <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
            <div className="rounded-full bg-green-100 p-6 mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                Thank you for your purchase. Your order has been placed successfully and is being processed. You will receive an email confirmation shortly.
            </p>

            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/">Continue Shopping</Link>
                </Button>
                <Button asChild>
                    <Link href="/account">View Order</Link>
                </Button>
            </div>
        </div>
    )
}
