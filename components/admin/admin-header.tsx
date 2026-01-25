'use client'

import { useRouter } from 'next/navigation'
import { Bell, User, Settings } from 'lucide-react'
import { clearAdminToken } from '@/lib/auth'

export function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    clearAdminToken()
    router.push('/admin/login')
  }

  return (
    <header className="h-16 bg-white border-b border-border px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">Welcome to Admin</h2>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
          <Bell size={20} className="text-muted-foreground" />
        </button>
        
        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
          <Settings size={20} className="text-muted-foreground" />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold cursor-pointer hover:opacity-80">
          A
        </div>
      </div>
    </header>
  )
}
