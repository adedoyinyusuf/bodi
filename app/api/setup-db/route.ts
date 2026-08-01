import { query } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// One-time database setup route.
// Protected by a secret token so it can only be triggered intentionally.
// Call: GET /api/setup-db?token=YOUR_SETUP_TOKEN

const STATEMENTS = [
  // 1. Products
  `CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    category VARCHAR(100) DEFAULT 'Electronics',
    images JSONB DEFAULT '[]'::jsonb,
    in_stock BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    badge VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // 2. Orders
  `CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(50) DEFAULT 'pending',
    total NUMERIC(10, 2) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    shipping_address JSONB NOT NULL,
    user_id VARCHAR(255),
    payment_intent VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // 3. Order Items
  `CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_purchase NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // 4. Product Comments
  `CREATE TABLE IF NOT EXISTS product_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // 5. Product Likes
  `CREATE TABLE IF NOT EXISTS product_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
  )`,

  // 6. Contact Messages
  `CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,

  // 7. OTPs (phone auth)
  `CREATE TABLE IF NOT EXISTS otps (
    phone VARCHAR(50) PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
  )`,

  // 8. Seed: Headphones
  `INSERT INTO products (title, description, price, original_price, category, images, in_stock, featured, badge)
   SELECT
     'Acoustic Master Studio Headphones',
     'Professional-grade studio headphones engineered for uncompromised acoustic fidelity, ultra-crisp highs, and deep responsive bass.',
     299.99, 349.99, 'Audio',
     '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
     true, true, 'Best Seller'
   WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'Acoustic Master Studio Headphones')`,

  // 9. Seed: Speaker
  `INSERT INTO products (title, description, price, original_price, category, images, in_stock, featured, badge)
   SELECT
     'Aura Minimalist Wireless Speaker',
     'Sleek aluminum body wireless speaker featuring 360-degree spatial audio and 24-hour battery life.',
     189.00, 219.00, 'Audio',
     '["https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
     true, true, 'New'
   WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'Aura Minimalist Wireless Speaker')`,

  // 10. Seed: Smartwatch
  `INSERT INTO products (title, description, price, original_price, category, images, in_stock, featured, badge)
   SELECT
     'Precision Ergonomic Smartwatch',
     'Titanium case smartwatch with bio-metric health monitoring, dual-band GPS, and sapphire glass display.',
     399.50, 449.00, 'Wearables',
     '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
     true, false, 'Featured'
   WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'Precision Ergonomic Smartwatch')`,
]

export async function GET(request: NextRequest) {
  // Token guard — set SETUP_TOKEN in Vercel env vars
  const token = request.nextUrl.searchParams.get('token')
  const expectedToken = process.env.SETUP_TOKEN || 'wearables-setup-2024'

  if (token !== expectedToken) {
    return NextResponse.json(
      { error: 'Unauthorized. Pass ?token=YOUR_SETUP_TOKEN in the URL.' },
      { status: 401 }
    )
  }

  const results: { statement: number; status: string; error?: string }[] = []

  for (let i = 0; i < STATEMENTS.length; i++) {
    try {
      await query(STATEMENTS[i], [])
      results.push({ statement: i + 1, status: 'ok' })
    } catch (err: any) {
      results.push({ statement: i + 1, status: 'error', error: err.message })
    }
  }

  const hasErrors = results.some(r => r.status === 'error')

  return NextResponse.json({
    success: !hasErrors,
    message: hasErrors
      ? 'Some statements failed — check results below.'
      : '✅ Database schema created and seeded successfully!',
    results,
  })
}
