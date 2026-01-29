'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CurrencySelector } from './currency-selector'

import { CartDrawer } from './cart-drawer'
import { useAuth } from '@/lib/auth-context'
import { User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Navigation() {
  const pathname = usePathname()
  const { user, loading, signOut } = useAuth()

  const links = [
    { href: '/', label: 'Collection' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="font-semibold text-2xl text-foreground tracking-tight">
            Bodi
          </Link>

          <div className="flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pl-4 border-l border-border flex items-center gap-4">
              <CurrencySelector />
              <CartDrawer />

              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                      {user.phone || 'My Account'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth">Sign In</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
