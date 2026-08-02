import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us | Wearables Support & Inquiries',
  description: 'Have questions about smartwatches, acoustic headphones, or luxury tech products? Reach out to Wearables support team via email, phone, or WhatsApp.',
  keywords: ['contact wearables', 'customer support', 'tech support', 'whatsapp support'],
  alternates: {
    canonical: 'https://bodiware.vercel.app/contact',
  },
  openGraph: {
    title: 'Contact Us | Wearables Support & Inquiries',
    description: 'Reach out to Wearables customer support team via email, phone, or direct WhatsApp messaging.',
    url: 'https://bodiware.vercel.app/contact',
    type: 'website',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Wearables',
    url: 'https://bodiware.vercel.app/contact',
    description: 'Get in touch with Wearables customer support and product specialists.',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      {children}
    </>
  )
}
