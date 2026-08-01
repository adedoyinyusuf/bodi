'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { X, Sparkles, TrendingUp, Bell } from 'lucide-react'

/* ---------- Types ---------- */

interface Notification {
  id: string
  type: 'new_product' | 'trending' | 'general'
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

interface NotificationContextValue {
  notify: (n: Omit<Notification, 'id'>) => void
}

const NotificationContext = createContext<NotificationContextValue>({ notify: () => {} })

export function useNotification() {
  return useContext(NotificationContext)
}

/* ---------- Config ---------- */

const typeConfig = {
  new_product: {
    icon: <Sparkles className="w-4 h-4 text-emerald-400" />,
    borderColor: 'border-emerald-500/30',
    bgAccent: 'bg-emerald-500/10',
    glowStyle: { boxShadow: '0 0 20px oklch(0.72 0.19 162 / 0.2)' },
  },
  trending: {
    icon: <TrendingUp className="w-4 h-4 text-orange-400" />,
    borderColor: 'border-orange-500/30',
    bgAccent: 'bg-orange-500/10',
    glowStyle: { boxShadow: '0 0 20px oklch(0.7 0.22 30 / 0.2)' },
  },
  general: {
    icon: <Bell className="w-4 h-4 text-primary" />,
    borderColor: 'border-primary/30',
    bgAccent: 'bg-primary/10',
    glowStyle: { boxShadow: '0 0 20px oklch(0.7 0.15 30 / 0.15)' },
  },
}

/* ---------- Portal Overlay ----------
   Rendered via createPortal so it is appended directly to <body>,
   completely outside the React component tree hierarchy.
   This prevents the overlay from shifting Radix UI's internal ID counter,
   which was causing SSR/client hydration mismatches (aria-controls mismatch).
---------------------------------------- */
function NotificationOverlay({
  notifications,
  dismiss,
}: {
  notifications: Notification[]
  dismiss: (id: string) => void
}) {
  const [mounted, setMounted] = useState(false)

  // Only mount portal after hydration is complete to avoid SSR mismatch
  useEffect(() => { setMounted(true) }, [])

  if (!mounted || notifications.length === 0) return null

  return createPortal(
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 w-80 pointer-events-none">
      {notifications.map((notif) => {
        const config = typeConfig[notif.type]
        return (
          <div
            key={notif.id}
            className={`animate-notification-enter pointer-events-auto
              bg-background/95 backdrop-blur-md border ${config.borderColor}
              rounded-xl p-4 shadow-xl`}
            style={config.glowStyle}
          >
            <div className="flex items-start gap-3">
              {/* Icon badge */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full ${config.bgAccent} flex items-center justify-center`}>
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{notif.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{notif.message}</p>
                {notif.actionLabel && notif.onAction && (
                  <button
                    onClick={notif.onAction}
                    className="mt-2 text-xs font-medium text-primary hover:underline"
                  >
                    {notif.actionLabel} →
                  </button>
                )}
              </div>

              {/* Dismiss */}
              <button
                onClick={() => dismiss(notif.id)}
                className="flex-shrink-0 p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
      })}
    </div>,
    document.body
  )
}

/* ---------- Provider ----------
   Provides only the context value to the tree.
   The overlay is rendered via a portal outside the tree entirely.
---------------------------------------- */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const nextIdRef = useRef(0)

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const notify = useCallback((n: Omit<Notification, 'id'>) => {
    const id = `notif-${++nextIdRef.current}`
    setNotifications(prev => [...prev.slice(-2), { ...n, id }]) // max 3 visible
    setTimeout(() => dismiss(id), 6000)
  }, [dismiss])

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <NotificationOverlay notifications={notifications} dismiss={dismiss} />
    </NotificationContext.Provider>
  )
}
