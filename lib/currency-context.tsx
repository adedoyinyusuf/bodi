'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { getCurrencyByCountry, convertPrice } from './currency'

interface CurrencyContextType {
  countryCode: string
  currencyCode: string
  currencySymbol: string
  currencyName: string
  isLoading: boolean
  rates?: Record<string, number>
  setCountryCode: (code: string) => void
  convertPrice: (priceInUSD: number) => number
  formatPrice: (price: number) => string
}

const defaultCurrency = getCurrencyByCountry('NG')

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [countryCode, setCountryCode] = useState('NG')
  const [currency, setCurrency] = useState(defaultCurrency)
  const [rates, setRates] = useState<Record<string, number> | undefined>()
  const [isLoading, setIsLoading] = useState(true)

  // Fetch live exchange rates & detect user location on mount
  useEffect(() => {
    const initCurrency = async () => {
      // 1. Fetch real-time exchange rates
      try {
        const ratesRes = await fetch('/api/currency/rates', {
          signal: AbortSignal.timeout(6000),
        })
        if (ratesRes.ok) {
          const ratesData = await ratesRes.json()
          if (ratesData.rates) {
            setRates(ratesData.rates)
          }
        }
      } catch (e) {
        console.log('[Currency] Rates fetch fallback to default:', e)
      }

      // 2. Detect location
      try {
        const response = await fetch('/api/currency/location', {
          method: 'GET',
          signal: AbortSignal.timeout(6000),
        })

        if (response.ok) {
          const contentType = response.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            if (data.countryCode) {
              setCountryCode(data.countryCode)
              setCurrency(getCurrencyByCountry(data.countryCode))
              localStorage.setItem('preferredCountry', data.countryCode)
            }
          }
        }
      } catch (error) {
        console.log('[Currency] Location detection fallback:', error)
        const stored = localStorage.getItem('preferredCountry')
        if (stored) {
          setCountryCode(stored)
          setCurrency(getCurrencyByCountry(stored))
        }
      } finally {
        setIsLoading(false)
      }
    }

    initCurrency()
  }, [])

  const handleSetCountryCode = (code: string) => {
    setCountryCode(code)
    setCurrency(getCurrencyByCountry(code))
    localStorage.setItem('preferredCountry', code)
  }

  const convertPriceValue = (priceInUSD: number | string): number => {
    return convertPrice(Number(priceInUSD), currency.code, rates)
  }

  const formatPriceValue = (price: number | string): string => {
    const decimals = ['JPY', 'KRW'].includes(currency.code) ? 0 : 2
    const formatted = Number(price).toFixed(decimals)
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
        rates,
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
