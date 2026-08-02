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
    default: 'Wearables | Premium Smart Wearables, Audio & Tech Electronics',
    template: '%s | Wearables - Premium Smart Tech',
  },
  description: 'Discover world-class smart wearables, acoustic headphones, high-fidelity wireless audio, and luxury smartwatches. Engineered for performance, elegance, and seamless connectivity.',
  keywords: [
    'smart wearables',
    'wearable technology',
    'smartwatches',
    'wireless audio',
    'noise cancelling headphones',
    'premium tech electronics',
    'bluetooth speakers',
    'fitness trackers',
    'luxury gadgets',
    'tech accessories',
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
    title: 'Wearables | Premium Smart Wearables & High-End Electronics',
    description: 'Experience refined tech design. Curated smartwatches, acoustic headphones, and high-fidelity audio engineered for excellence.',
    url: siteUrl,
    siteName: 'Wearables',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Wearables - Premium Smart Technology & Electronics Catalog',
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
    description: 'Curated premium smart wearables, high-fidelity acoustic audio gear, and cutting-edge tech electronics.',
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
    description: 'Premier destination for luxury smart wearables and high-performance electronics.',
    priceRange: '$$$',
    currenciesAccepted: 'USD, NGN',
    paymentAccepted: 'Credit Card, Debit Card, Online Payment',
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
