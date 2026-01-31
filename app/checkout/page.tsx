'use client'

import dynamic from 'next/dynamic'
import { Loader2 } from 'lucide-react'

const CheckoutContent = dynamic(() => import('@/components/checkout-content'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2 text-muted-foreground">Loading checkout...</p>
            </div>
        </div>
    )
})

export default function CheckoutPage() {
    return <CheckoutContent />
}
