'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { isAdminAuthenticated } from '@/lib/auth'
import { Shield, Key, AlertCircle } from 'lucide-react'

export default function AdminSettingsPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage admin dashboard settings</p>
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
                <p className="text-xs text-blue-600 mt-2">Session stored in browser storage.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <h3 className="font-medium text-foreground mb-3">Password Management</h3>
            <p className="text-sm text-muted-foreground mb-4">
              To change your admin password, set the NEXT_PUBLIC_ADMIN_PASSWORD environment variable and restart the application.
            </p>
            <div className="p-3 bg-accent rounded-lg text-sm font-mono text-foreground">
              NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
            </div>
          </div>
        </div>
      </div>

      {/* Database Section */}
      <div className="bg-white rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key size={24} className="text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Database</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
            <span className="text-sm font-medium text-foreground">Supabase Connection</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600" />
              <span className="text-xs font-medium text-green-600">Connected</span>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium text-amber-900 mb-2">Environment Variables Required</h4>
            <ul className="text-xs text-amber-700 space-y-1">
              <li>• NEXT_PUBLIC_SUPABASE_URL</li>
              <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>• NEXT_PUBLIC_ADMIN_PASSWORD (optional)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">System Information</h2>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Environment</span>
            <span className="font-medium text-foreground">{process.env.NODE_ENV}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Admin Dashboard</span>
            <span className="font-medium text-foreground">v1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-medium text-foreground">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h2>
        <p className="text-sm text-red-700 mb-4">
          Be careful with these actions. They may have irreversible consequences.
        </p>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
          onClick={() => {
            if (confirm('Are you sure you want to clear all sessions?')) {
              // Handle clear sessions logic
            }
          }}
        >
          Clear All Sessions
        </button>
      </div>
    </div>
  )
}
