'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface User {
  id: string
  email?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (userData: User) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('wearables_user_session')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (e) {
      console.error('Failed to load user session', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = (userData: User) => {
    setUser(userData)
    try {
      localStorage.setItem('wearables_user_session', JSON.stringify(userData))
    } catch (e) {
      console.error('Failed to save user session', e)
    }
  }

  const signOut = async () => {
    setUser(null)
    try {
      localStorage.removeItem('wearables_user_session')
    } catch (e) {
      console.error('Failed to clear user session', e)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
