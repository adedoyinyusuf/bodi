import { NextResponse } from 'next'

// Fallback rates if external API is temporarily down
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  NGN: 1550.0,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.36,
  AUD: 1.53,
  JPY: 149.5,
  INR: 83.12,
  BRL: 4.97,
  MXN: 17.05,
  SGD: 1.34,
  HKD: 7.81,
  CHF: 0.88,
  SEK: 10.45,
  NZD: 1.68,
  ZAR: 18.65,
  AED: 3.67,
  SAR: 3.75,
  KRW: 1319.5,
  THB: 35.8,
  TRY: 33.25,
}

export async function GET() {
  try {
    // Open Exchange Rates API (free, reliable, updated hourly, no API key required)
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 }, // Cache on Vercel edge for 1 hour
      signal: AbortSignal.timeout(6000), // 6 second timeout guard
    })

    if (res.ok) {
      const data = await res.json()
      if (data && data.rates) {
        return NextResponse.json({
          success: true,
          rates: data.rates,
          lastUpdated: data.time_last_update_utc || new Date().toISOString(),
          source: 'live',
        })
      }
    }

    throw new Error('Rates API response invalid')
  } catch (error) {
    console.error('Failed to fetch live exchange rates, using fallback:', error)
    return NextResponse.json({
      success: true,
      rates: FALLBACK_RATES,
      lastUpdated: new Date().toISOString(),
      source: 'fallback',
    })
  }
}
