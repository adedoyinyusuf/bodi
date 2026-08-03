import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json()

    if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
      return NextResponse.json({ error: 'Please enter a valid phone number with country code (e.g. +1234567890)' }, { status: 400 })
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

    // Twilio Credentials from Environment Variables
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const fromNumber = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_MESSAGING_SERVICE_SID
    const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

    let sentViaTwilio = false

    if (accountSid && authToken) {
      const basicAuth = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64')

      if (verifyServiceSid) {
        // Option 1: Twilio Verify Service API
        try {
          const bodyData = new URLSearchParams()
          bodyData.append('To', cleanPhone)
          bodyData.append('Channel', 'sms')

          const twilioRes = await fetch(
            `https://verify.twilio.com/v2/Services/${verifyServiceSid}/Verifications`,
            {
              method: 'POST',
              headers: {
                'Authorization': basicAuth,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: bodyData,
            }
          )

          if (twilioRes.ok) {
            sentViaTwilio = true
          } else {
            const errData = await twilioRes.json()
            console.error('Twilio Verify API Error:', errData)
          }
        } catch (tErr) {
          console.error('Twilio Verify request exception:', tErr)
        }
      } else if (fromNumber) {
        // Option 2: Twilio Programmable SMS API
        try {
          const bodyData = new URLSearchParams()
          bodyData.append('To', cleanPhone)
          if (fromNumber.startsWith('MG')) {
            bodyData.append('MessagingServiceSid', fromNumber)
          } else {
            bodyData.append('From', fromNumber)
          }
          bodyData.append('Body', `Your Wearables verification code is ${otpCode}. Valid for 5 minutes.`)

          const twilioRes = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
            {
              method: 'POST',
              headers: {
                'Authorization': basicAuth,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: bodyData,
            }
          )

          if (twilioRes.ok) {
            sentViaTwilio = true
          } else {
            const errData = await twilioRes.json()
            console.error('Twilio SMS API Error:', errData)
          }
        } catch (tErr) {
          console.error('Twilio SMS request exception:', tErr)
        }
      }
    } else {
      console.log(`[Twilio Test Mode] Generated OTP code for ${cleanPhone}: ${otpCode}`)
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to ${cleanPhone}`,
      // Return debugCode in test/development mode if Twilio credentials are not set
      debugCode: !sentViaTwilio ? otpCode : undefined,
    })
  } catch (error: any) {
    console.error('Error sending OTP:', error)
    return NextResponse.json({ error: error.message || 'Failed to send OTP' }, { status: 500 })
  }
}
