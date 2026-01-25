'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CurrencySelector } from './currency-selector'

export function Navigation() {
  const pathname = usePathname()
  
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
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pl-4 border-l border-border">
              <CurrencySelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
