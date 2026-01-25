import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Get client IP from Vercel headers
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown'
    const cleanIp = typeof ip === 'string' ? ip.split(',')[0].trim() : 'unknown'
    
    // Try using https API with proper error handling
    // Using HTTPS to avoid mixed content issues
    const geoResponse = await fetch(`https://ipapi.co/${cleanIp}/json/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Bodi-Electronics-App/1.0',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })

    if (geoResponse.ok) {
      const contentType = geoResponse.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        const geoData = await geoResponse.json()
        if (geoData.country_code) {
          return NextResponse.json({
            countryCode: geoData.country_code,
            success: true,
          })
        }
      }
    }

    // Return default if detection fails
    return NextResponse.json({
      countryCode: 'NG',
      success: false,
      message: 'Could not detect location, using default',
    })
  } catch (error) {
    console.error('[v0] Error detecting location:', error instanceof Error ? error.message : String(error))
    // Return default on error instead of throwing
    return NextResponse.json({
      countryCode: 'NG',
      success: false,
      message: 'Location detection failed, using default',
    }, { status: 200 })
  }
}
