import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

async function ensureSettingsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      key VARCHAR(100) PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

export const DEFAULT_CURRENCY_SETTINGS = {
  mode: 'live', // 'live' | 'manual'
  marginPercent: 0, // e.g. 2 for +2% margin
  manualRates: {
    NGN: 1600.0,
    USD: 1.0,
    GBP: 0.8,
    EUR: 0.93,
    CAD: 1.38,
    AUD: 1.55,
    JPY: 150.0,
    INR: 83.5,
    BRL: 5.0,
    MXN: 17.5,
    SGD: 1.35,
    HKD: 7.82,
    CHF: 0.89,
    SEK: 10.5,
    NZD: 1.69,
    ZAR: 18.7,
    AED: 3.67,
    SAR: 3.75,
    KRW: 1320.0,
    THB: 36.0,
    TRY: 33.5,
  },
}

// GET /api/admin/settings/rates — fetch current rate settings
export async function GET() {
  try {
    await ensureSettingsTable()
    const result = await query("SELECT value FROM settings WHERE key = 'currency_settings'")
    if (result.rows.length > 0) {
      return NextResponse.json({ success: true, settings: result.rows[0].value })
    }
    return NextResponse.json({ success: true, settings: DEFAULT_CURRENCY_SETTINGS })
  } catch (error) {
    console.error('Error fetching currency settings:', error)
    return NextResponse.json({ success: true, settings: DEFAULT_CURRENCY_SETTINGS })
  }
}

// PUT /api/admin/settings/rates — update rate settings
export async function PUT(request: Request) {
  try {
    await ensureSettingsTable()
    const body = await request.json()
    const { mode, marginPercent, manualRates } = body

    const newSettings = {
      mode: mode === 'manual' ? 'manual' : 'live',
      marginPercent: Number(marginPercent) || 0,
      manualRates: manualRates || DEFAULT_CURRENCY_SETTINGS.manualRates,
    }

    await query(
      `INSERT INTO settings (key, value, updated_at)
       VALUES ('currency_settings', $1::jsonb, CURRENT_TIMESTAMP)
       ON CONFLICT (key) DO UPDATE
       SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify(newSettings)]
    )

    return NextResponse.json({ success: true, settings: newSettings })
  } catch (error: any) {
    console.error('Error updating currency settings:', error)
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 })
  }
}
