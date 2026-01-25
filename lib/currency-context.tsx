'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCurrencyByCountry, convertPrice } from './currency'

interface CurrencyContextType {
  countryCode: string
  currencyCode: string
  currencySymbol: string
  currencyName: string
  isLoading: boolean
  setCountryCode: (code: string) => void
  convertPrice: (priceInUSD: number) => number
  formatPrice: (price: number) => string
}

const defaultCurrency = getCurrencyByCountry('NG')

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [countryCode, setCountryCode] = useState('NG')
  const [currency, setCurrency] = useState(defaultCurrency)
  const [isLoading, setIsLoading] = useState(true)

  // Detect user's location on mount
  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Try to get country from IP-based geolocation API
        const response = await fetch('/api/currency/location', {
          method: 'GET',
          signal: AbortSignal.timeout(8000), // 8 second timeout
        })
        
        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`)
        }

        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('API returned non-JSON response')
        }

        const data = await response.json()
        
        if (data.countryCode) {
          setCountryCode(data.countryCode)
          setCurrency(getCurrencyByCountry(data.countryCode))
          localStorage.setItem('preferredCountry', data.countryCode)
        }
      } catch (error) {
        console.log('[v0] Location detection failed:', error instanceof Error ? error.message : String(error))
        // Fall back to localStorage or default
        const stored = localStorage.getItem('preferredCountry')
        if (stored) {
          setCountryCode(stored)
          setCurrency(getCurrencyByCountry(stored))
        }
      } finally {
        setIsLoading(false)
      }
    }

    detectLocation()
  }, [])

  const handleSetCountryCode = (code: string) => {
    setCountryCode(code)
    setCurrency(getCurrencyByCountry(code))
    localStorage.setItem('preferredCountry', code)
  }

  const convertPriceValue = (priceInUSD: number): number => {
    return convertPrice(priceInUSD, currency.code)
  }

  const formatPriceValue = (price: number): string => {
    const decimals = ['JPY', 'KRW'].includes(currency.code) ? 0 : 2
    const formatted = price.toFixed(decimals)
    return `${currency.symbol}${formatted}`
  }

  return (
    <CurrencyContext.Provider
      value={{
        countryCode,
        currencyCode: currency.code,
        currencySymbol: currency.symbol,
        currencyName: currency.name,
        isLoading,
        setCountryCode: handleSetCountryCode,
        convertPrice: convertPriceValue,
        formatPrice: formatPriceValue,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within CurrencyProvider')
  }
  return context
}
