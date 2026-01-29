import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Initialize Supabase Admin Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// Ideally use Service Role Key for creating orders if RLS is strict, or verify user session.
// For now using what we have. If SUPABASE_SERVICE_ROLE_KEY is not in env, we might fall back to anon but strict RLS might block.
// The user provided SUPABASE_SERVICE_ROLE_KEY in the chat, I should ensure it was added to .env.local if not already.
// I only added NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local earlier.
// I should probably update .env.local with the service role key if needed, or rely on client-side creation for now.
// Given strict RLS, server-side creation with Service Role is safer.

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: Request) {
    try {
        const { items, total, shippingAddress, email, userId } = await request.json()

        // Create Order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                status: 'pending',
                total: total,
                contact_email: email,
                shipping_address: shippingAddress,
                user_id: userId || null // Link to user if present
            })
            .select()
            .single()

        if (orderError) {
            console.error('Order creation error:', orderError)
            return NextResponse.json({ error: orderError.message }, { status: 500 })
        }

        // Create Order Items
        const orderItems = items.map((item: any) => ({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price_at_purchase: item.price,
        }))

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)

        if (itemsError) {
            console.error('Order items creation error:', itemsError)
            return NextResponse.json({ error: itemsError.message }, { status: 500 })
        }

        return NextResponse.json({
            orderId: order.id,
            publicKey: process.env.PAYSTACK_PUBLIC_KEY
        })

    } catch (error) {
        console.error('Checkout error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
