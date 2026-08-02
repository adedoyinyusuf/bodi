'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { isAdminAuthenticated } from '@/lib/auth'
import { Shield, AlertCircle, Database, HardDrive, DollarSign, Percent, Save, RefreshCw, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Rate settings state
  const [mode, setMode] = useState<'live' | 'manual'>('live')
  const [marginPercent, setMarginPercent] = useState<number>(0)
  const [manualRates, setManualRates] = useState<Record<string, number>>({
    NGN: 1600.0,
    USD: 1.0,
    GBP: 0.8,
    EUR: 0.93,
    CAD: 1.38,
    AUD: 1.55,
    JPY: 150.0,
    INR: 83.5,
  })

  useEffect(() => {
    setIsMounted(true)
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }

    // Fetch current currency settings
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings/rates')
        if (res.ok) {
          const json = await res.json()
          if (json.settings) {
            setMode(json.settings.mode || 'live')
            setMarginPercent(json.settings.marginPercent || 0)
            if (json.settings.manualRates) {
              setManualRates(json.settings.manualRates)
            }
          }
        }
      } catch (err) {
        console.error('Failed to load currency settings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [router])

  if (!isMounted || !isAdminAuthenticated()) {
    return null
  }

  const handleRateChange = (code: string, value: string) => {
    const num = parseFloat(value) || 0
    setManualRates((prev) => ({
      ...prev,
      [code]: num,
    }))
  }

  const handleSaveCurrencySettings = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings/rates', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          marginPercent,
          manualRates,
        }),
      })

      if (res.ok) {
        toast.success('Currency & exchange rate settings saved!')
      } else {
        const json = await res.json()
        throw new Error(json.error || 'Failed to save')
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage exchange rates, security, and storage configuration</p>
      </div>

      {/* Currency & Exchange Rate Controls Section */}
      <div className="bg-white rounded-lg border border-border p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <DollarSign size={22} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Currency & Exchange Rate Control</h2>
              <p className="text-xs text-muted-foreground">Manage real-time conversion rates and custom overrides for your store</p>
            </div>
          </div>
          <button
            onClick={handleSaveCurrencySettings}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Rate Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setMode('live')}
                  className={`p-4 rounded-lg border text-left transition-colors flex items-start gap-3 ${
                    mode === 'live'
                      ? 'border-primary bg-primary/5 text-foreground ring-2 ring-primary/20'
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <RefreshCw className={`w-5 h-5 mt-0.5 ${mode === 'live' ? 'text-primary' : ''}`} />
                  <div>
                    <div className="font-semibold text-sm">Live Market Rates (Recommended)</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Fetches live financial rates hourly from global markets.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('manual')}
                  className={`p-4 rounded-lg border text-left transition-colors flex items-start gap-3 ${
                    mode === 'manual'
                      ? 'border-primary bg-primary/5 text-foreground ring-2 ring-primary/20'
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                >
                  <DollarSign className={`w-5 h-5 mt-0.5 ${mode === 'manual' ? 'text-primary' : ''}`} />
                  <div>
                    <div className="font-semibold text-sm">Manual Custom Rates</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Set exact custom rates per currency manually.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Margin Buffer (Live Mode) */}
            {mode === 'live' && (
              <div className="p-4 bg-muted/50 rounded-lg border border-border space-y-2">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-primary" />
                  <label className="text-sm font-medium text-foreground">Margin Buffer % (Optional)</label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Adds a percentage markup on live rates to hedge against currency drops (e.g. enter <code>2</code> for +2%).
                </p>
                <div className="flex items-center gap-2 max-w-xs pt-1">
                  <input
                    type="number"
                    step="0.1"
                    value={marginPercent}
                    onChange={(e) => setMarginPercent(parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-border bg-background rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-muted-foreground">%</span>
                </div>
              </div>
            )}

            {/* Manual Rate Overrides */}
            {mode === 'manual' && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-foreground">Custom Rate Overrides (1 USD = X Currency)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(manualRates).map(([code, val]) => (
                    <div key={code} className="p-3 bg-card border border-border rounded-lg space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground uppercase">{code}</label>
                      <input
                        type="number"
                        step="0.01"
                        value={val}
                        onChange={(e) => handleRateChange(code, e.target.value)}
                        className="w-full px-3 py-1.5 border border-border bg-background rounded-md text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        disabled={code === 'USD'}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Current Session</h3>
                <p className="text-sm text-blue-700 mt-1">You are currently logged in to the admin dashboard.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="font-medium text-foreground mb-3">Password Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set the NEXT_PUBLIC_ADMIN_PASSWORD environment variable in Vercel to change your admin password.
            </p>
            <div className="p-3 bg-accent rounded-lg text-sm font-mono text-foreground">
              NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
            </div>
          </div>
        </div>
      </div>

      {/* Vercel Storage Section */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Database size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Vercel Storage Integration</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <div className="flex items-center gap-3">
              <Database size={18} />
              <span className="text-sm font-medium text-foreground">Vercel Postgres</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span className="text-xs font-medium text-green-600">Active</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <div className="flex items-center gap-3">
              <HardDrive size={18} />
              <span className="text-sm font-medium text-foreground">Vercel Blob Storage</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span className="text-xs font-medium text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
