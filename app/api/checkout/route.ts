import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const merchantId = process.env.OPAY_MERCHANT_ID
    const secretKey = process.env.OPAY_SECRET_KEY
    const publicKey = process.env.OPAY_PUBLIC_KEY
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    try {
        const { items, total, shippingAddress, email, userId, fullName } = await request.json()

        // 1. Create Order in Pending state
        const addressJson = JSON.stringify({ ...shippingAddress, fullName })
        const { rows: orderRows } = await query(
            `INSERT INTO orders (status, total, contact_email, shipping_address, user_id)
             VALUES ('pending', $1, $2, $3, $4)
             RETURNING *`,
            [total, email, addressJson, userId || null]
        )

        const order = orderRows[0]

        // 2. Create Order Items
        if (items && Array.isArray(items)) {
            for (const item of items) {
                // Ensure product_id is valid UUID or null
                const productId = typeof item.id === 'string' && item.id.length === 36 ? item.id : null
                await query(
                    `INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
                     VALUES ($1, $2, $3, $4)`,
                    [order.id, productId, item.quantity, item.price]
                )
            }
        }

        // 3. Initialize OPay Payment
        const reference = `BODI-${order.id}-${Date.now()}`
        const amountKobo = Math.round(total * 100).toString()

        const payload = {
            country: 'NG',
            reference: reference,
            amount: {
                total: amountKobo,
                currency: 'NGN'
            },
            returnUrl: `${baseUrl}/checkout/success`,
            userInfo: {
                userEmail: email,
                userId: userId || 'guest',
                userMobile: shippingAddress.phone,
                userName: fullName
            },
            product: {
                description: `Bodi Store Order #${order.id}`,
                name: 'Bodi Products'
            }
        }

        let cashierUrl = `${baseUrl}/checkout/success`

        if (publicKey && merchantId) {
            try {
                const opayResponse = await fetch('https://cashierapi.opayweb.com/api/v3/cashier/initialize', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${publicKey}`,
                        'MerchantId': merchantId
                    },
                    body: JSON.stringify(payload)
                })

                const opayData = await opayResponse.json()
                if (opayData?.data?.cashierUrl || opayData?.data?.url) {
                    cashierUrl = opayData.data.cashierUrl || opayData.data.url
                }
            } catch (e) {
                console.error('OPay API call error:', e)
            }
        }

        // Update order with reference
        await query('UPDATE orders SET payment_intent = $1 WHERE id = $2', [reference, order.id])

        return NextResponse.json({
            orderId: order.id,
            cashierUrl
        })

    } catch (error: any) {
        console.error('Checkout error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
