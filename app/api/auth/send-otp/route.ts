import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json({ error: 'Please enter a valid phone number' }, { status: 400 })
    }

    const cleanPhone = phone.trim()
    
    // Generate a random 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Set 5-minute expiry
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    // Save/Upsert OTP into Vercel Postgres
    try {
      await query(
        `INSERT INTO otps (phone, code, expires_at)
         VALUES ($1, $2, $3)
         ON CONFLICT (phone) DO UPDATE SET code = $2, expires_at = $3`,
        [cleanPhone, otpCode, expiresAt]
      )
    } catch (dbErr) {
      console.warn('Vercel Postgres OTP save warning:', dbErr)
    }

    // Check for Termii SMS Key
    const termiiKey = process.env.TERMII_API_KEY
    if (termiiKey) {
      try {
        await fetch('https://api.ng.termii.com/api/sms/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: cleanPhone,
            from: 'Wearables',
            sms: `Your Wearables verification code is ${otpCode}. Valid for 5 minutes.`,
            type: 'plain',
            channel: 'generic',
            api_key: termiiKey,
          }),
        })
      } catch (smsErr) {
        console.error('Termii SMS API error:', smsErr)
      }
    } else {
      console.log(`[SMS OTP Test Mode] Generated OTP code for ${cleanPhone}: ${otpCode}`)
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${cleanPhone}`,
      // In development mode when no SMS gateway key is configured, return debug code
      debugCode: !termiiKey ? otpCode : undefined
    })
  } catch (error: any) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: error.message || 'Failed to send OTP' }, { status: 500 })
  }
}
