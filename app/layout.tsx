import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { CurrencyProvider } from '@/lib/currency-context'
import { Toaster } from '@/components/ui/sonner'
import { CartProvider } from '@/lib/cart-context'
import { AuthProvider } from '@/lib/auth-context'
import { NotificationProvider } from '@/components/notification-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const _playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "800"] });

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bodiware.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Wearables | Premium Laptops, Desktops, Smart Wearables & High-End Tech',
    template: '%s | Wearables - High-End Tech & Electronics',
  },
  description: 'Shop premium laptops, all-in-one desktops, high-end computers, electronic readers, smart wearables, acoustic headphones, and luxury consumer electronics.',
  keywords: [
    // Laptops & Computers
    'laptops',
    'computers',
    'all-in-one desktops',
    'highend laptops and desktops',
    'high performance computers',
    'gaming laptops',
    'pro ultrabooks',
    'desktop workstations',
    'flagship PCs',
    
    // E-Readers & Tablets
    'electronic readers',
    'e-readers',
    'e-ink devices',
    'digital e-readers',

    // Wearables & Audio
    'smart wearables',
    'wearable technology',
    'smartwatches',
    'wireless audio',
    'noise cancelling headphones',
    'acoustic headphones',
    'bluetooth speakers',
    'fitness trackers',
    'health monitoring wearables',

    // Consumer Electronics & Tech Store
    'premium tech electronics',
    'luxury gadgets',
    'tech accessories',
    'smart home devices',
    'high-end consumer electronics',
    'tech deals 2026',
    'best electronics store',
  ],
  authors: [{ name: 'Wearables Inc.' }],
  creator: 'Wearables',
  publisher: 'Wearables',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Wearables | Premium Laptops, High-End Desktops & Smart Tech',
    description: 'Explore high-performance laptops, all-in-one desktops, electronic readers, smartwatches, and high-fidelity audio electronics.',
    url: siteUrl,
    siteName: 'Wearables',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Wearables - Premium Laptops, Desktops, Electronic Readers & Smart Tech',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wearables | Premium Smart Wearables & Audio Tech',
    description: 'Elevated tech discovery. Premium smartwatches, audio devices, and innovative gadgets.',
    images: [`${siteUrl}/og-image.jpg`],
    creator: '@wearables',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#09090b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Schema.org Structured Data (JSON-LD) for Search Engine Rich Snippets
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Wearables',
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description: 'Curated premium laptops, all-in-one desktops, electronic readers, smart wearables, acoustic headphones, and cutting-edge tech electronics.',
    sameAs: [
      'https://twitter.com/wearables',
      'https://instagram.com/wearables',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Wearables',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Wearables',
    url: siteUrl,
    description: 'Premier online store for laptops, all-in-one desktops, high-end PCs, electronic readers, smart wearables, and high-performance electronics.',
    priceRange: '$$$',
    currenciesAccepted: 'USD, NGN',
    paymentAccepted: 'Credit Card, Debit Card, Online Payment',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tech & Electronics Catalog',
      itemListElement: [
        { '@type': 'OfferCatalog', name: 'Laptops & Computers' },
        { '@type': 'OfferCatalog', name: 'All-in-One Desktops' },
        { '@type': 'OfferCatalog', name: 'High-End Laptops & Desktops' },
        { '@type': 'OfferCatalog', name: 'Electronic Readers' },
        { '@type': 'OfferCatalog', name: 'Smart Wearables & Smartwatches' },
        { '@type': 'OfferCatalog', name: 'Wireless & Studio Audio' },
      ],
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
      </head>
      <body suppressHydrationWarning className={`font-sans antialiased flex flex-col min-h-screen`}>
        <CurrencyProvider>
          <CartProvider>
            <AuthProvider>
              <NotificationProvider>
                <Navigation />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </NotificationProvider>
            </AuthProvider>
          </CartProvider>
        </CurrencyProvider>
        <Analytics />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
