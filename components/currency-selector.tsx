'use client'

import { useCurrency } from '@/lib/currency-context'
import { Globe } from 'lucide-react'
import { Suspense } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria (NGN)' },
  { code: 'US', name: 'United States (USD)' },
  { code: 'GB', name: 'United Kingdom (GBP)' },
  { code: 'EU', name: 'Europe (EUR)' },
  { code: 'CA', name: 'Canada (CAD)' },
  { code: 'AU', name: 'Australia (AUD)' },
  { code: 'JP', name: 'Japan (JPY)' },
  { code: 'IN', name: 'India (INR)' },
  { code: 'BR', name: 'Brazil (BRL)' },
  { code: 'MX', name: 'Mexico (MXN)' },
  { code: 'SG', name: 'Singapore (SGD)' },
  { code: 'HK', name: 'Hong Kong (HKD)' },
  { code: 'CH', name: 'Switzerland (CHF)' },
  { code: 'SE', name: 'Sweden (SEK)' },
  { code: 'NZ', name: 'New Zealand (NZD)' },
  { code: 'ZA', name: 'South Africa (ZAR)' },
  { code: 'AE', name: 'UAE (AED)' },
  { code: 'SA', name: 'Saudi Arabia (SAR)' },
  { code: 'KR', name: 'South Korea (KRW)' },
  { code: 'TH', name: 'Thailand (THB)' },
  { code: 'TR', name: 'Turkey (TRY)' },
]

function CurrencySelectorContent() {
  const { countryCode, setCountryCode } = useCurrency()

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-muted-foreground" />
      <Select value={countryCode} onValueChange={setCountryCode}>
        <SelectTrigger className="w-[200px] text-sm">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export function CurrencySelector() {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-2 w-[200px] h-10 bg-muted rounded animate-pulse" />
    }>
      <CurrencySelectorContent />
    </Suspense>
  )
}
