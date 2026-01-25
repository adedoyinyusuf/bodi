'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import { Package, MessageSquare, TrendingUp, Users } from 'lucide-react'

interface Stats {
  totalProducts: number
  totalMessages: number
  totalLikes: number
  totalComments: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    if (!isAdminAuthenticated()) {
      router.push('/admin/login')
      return
    }

    // Fetch stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Messages',
      value: stats?.totalMessages || 0,
      icon: MessageSquare,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Likes',
      value: stats?.totalLikes || 0,
      icon: TrendingUp,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Total Comments',
      value: stats?.totalComments || 0,
      icon: Users,
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your admin dashboard. Monitor and manage your products and content.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <div key={index} className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">{card.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className={`${card.iconColor} w-6 h-6`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/products/new"
              className="block px-4 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity text-center font-medium"
            >
              Add New Product
            </a>
            <a
              href="/admin/products"
              className="block px-4 py-3 bg-accent text-foreground rounded-lg hover:opacity-80 transition-opacity text-center font-medium"
            >
              Manage Products
            </a>
            <a
              href="/admin/messages"
              className="block px-4 py-3 bg-accent text-foreground rounded-lg hover:opacity-80 transition-opacity text-center font-medium"
            >
              View Messages
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">System Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Database</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">API</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                <span className="text-sm font-medium text-green-600">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Storage</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600" />
                <span className="text-sm font-medium text-green-600">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
