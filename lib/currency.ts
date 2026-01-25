'use client'

// Mapping of country codes to currencies
const COUNTRY_CURRENCY_MAP: { [key: string]: { code: string; symbol: string; name: string } } = {
  NG: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  US: { code: 'USD', symbol: '$', name: 'US Dollar' },
  GB: { code: 'GBP', symbol: '£', name: 'British Pound' },
  EU: { code: 'EUR', symbol: '€', name: 'Euro' },
  CA: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  AU: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  JP: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  IN: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  BR: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  MX: { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  SG: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  HK: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  CH: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  SE: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  NZ: { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  ZA: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  AE: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  SA: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  KR: { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  TH: { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  TR: { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
}

// Exchange rates (base USD = 1.0)
const EXCHANGE_RATES: { [key: string]: number } = {
  NGN: 1550.0,
  USD: 1.0,
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

export function getCurrencyByCountry(countryCode: string): { code: string; symbol: string; name: string } {
  return COUNTRY_CURRENCY_MAP[countryCode?.toUpperCase()] || { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' }
}

export function convertPrice(priceInUSD: number, targetCurrency: string): number {
  const rate = EXCHANGE_RATES[targetCurrency] || 1.0
  return priceInUSD * rate
}

export function formatPrice(price: number, currencyCode: string, currencySymbol: string): string {
  // Format based on currency code for proper decimal places
  let decimals = 2
  if (['JPY', 'KRW'].includes(currencyCode)) {
    decimals = 0
  }

  const formatted = price.toFixed(decimals)
  
  // Place symbol based on currency convention
  if (['JPY', 'KRW', 'INR', 'THB', 'BRL'].includes(currencyCode)) {
    return `${currencySymbol}${formatted}`
  }
  return `${currencySymbol}${formatted}`
}

export function getPriceDisplay(priceInUSD: number, countryCode: string): string {
  const currency = getCurrencyByCountry(countryCode)
  const convertedPrice = convertPrice(priceInUSD, currency.code)
  return formatPrice(convertedPrice, currency.code, currency.symbol)
}

export const DEFAULT_CURRENCY = 'USD'
export const DEFAULT_COUNTRY = 'US'
