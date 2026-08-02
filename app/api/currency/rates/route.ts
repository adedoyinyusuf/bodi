import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

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
  let customSettings: any = null

  // 1. Check if admin configured custom rate settings in database
  try {
    const dbRes = await query("SELECT value FROM settings WHERE key = 'currency_settings'")
    if (dbRes.rows.length > 0) {
      customSettings = dbRes.rows[0].value
    }
  } catch (e) {
    // Database check failed or table missing, continue to live/fallback
  }

  // 2. If admin set mode to 100% manual rates, return manual rates directly
  if (customSettings && customSettings.mode === 'manual' && customSettings.manualRates) {
    return NextResponse.json({
      success: true,
      rates: customSettings.manualRates,
      lastUpdated: new Date().toISOString(),
      source: 'manual',
    })
  }

  // 3. Otherwise fetch live market rates & apply admin margin buffer if set
  const marginPercent = Number(customSettings?.marginPercent) || 0

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD', {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    })

    if (res.ok) {
      const data = await res.json()
      if (data && data.rates) {
        let finalRates: Record<string, number> = { ...data.rates }

        // Apply admin margin buffer (e.g. +2% hedge against currency drop)
        if (marginPercent !== 0) {
          const multiplier = 1 + marginPercent / 100
          for (const key in finalRates) {
            if (key !== 'USD') {
              finalRates[key] = Number((finalRates[key] * multiplier).toFixed(4))
            }
          }
        }

        return NextResponse.json({
          success: true,
          rates: finalRates,
          lastUpdated: data.time_last_update_utc || new Date().toISOString(),
          source: marginPercent !== 0 ? `live (+${marginPercent}% margin)` : 'live',
        })
      }
    }
  } catch (error) {
    console.error('Failed to fetch live exchange rates, using fallback:', error)
  }

  // 4. Fallback if live API is unreachable
  let fallbackRates = customSettings?.manualRates || FALLBACK_RATES
  if (marginPercent !== 0) {
    const multiplier = 1 + marginPercent / 100
    const adjusted: Record<string, number> = {}
    for (const k in fallbackRates) {
      adjusted[k] = k === 'USD' ? 1.0 : Number((fallbackRates[k] * multiplier).toFixed(4))
    }
    fallbackRates = adjusted
  }

  return NextResponse.json({
    success: true,
    rates: fallbackRates,
    lastUpdated: new Date().toISOString(),
    source: 'fallback',
  })
}
