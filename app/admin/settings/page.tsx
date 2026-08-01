'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { isAdminAuthenticated } from '@/lib/auth'
import { Shield, Key, AlertCircle, Database, HardDrive } from 'lucide-react'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
    }
  }, [router])

  if (!isMounted || !isAdminAuthenticated()) {
    return null
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage admin dashboard & Vercel storage configuration</p>
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

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2">Vercel Auto-Configured Environment Variables</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• POSTGRES_URL (Set automatically when attaching Vercel Postgres)</li>
              <li>• BLOB_READ_WRITE_TOKEN (Set automatically when attaching Vercel Blob)</li>
              <li>• OPAY_PUBLIC_KEY & OPAY_MERCHANT_ID (For OPay checkout)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
