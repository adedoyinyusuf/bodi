-- Schema for Vercel Postgres / PostgreSQL

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
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
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status VARCHAR(50) DEFAULT 'pending',
    total NUMERIC(10, 2) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    shipping_address JSONB NOT NULL,
    user_id VARCHAR(255),
    payment_intent VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_purchase NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Product Comments Table
CREATE TABLE IF NOT EXISTS product_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Product Likes Table
CREATE TABLE IF NOT EXISTS product_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(product_id, user_id)
);

-- 6. Contact Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Sample Products if Table is Empty
INSERT INTO products (title, description, price, original_price, category, images, in_stock, featured, badge)
SELECT 
    'Acoustic Master Studio Headphones',
    'Professional-grade studio headphones engineered for uncompromised acoustic fidelity, ultra-crisp highs, and deep responsive bass.',
    299.99,
    349.99,
    'Audio',
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    true,
    true,
    'Best Seller'
WHERE NOT EXISTS (SELECT 1 FROM products);

INSERT INTO products (title, description, price, original_price, category, images, in_stock, featured, badge)
SELECT 
    'Aura Minimalist Wireless Speaker',
    'Sleek aluminum body wireless speaker featuring 360-degree spatial audio and 24-hour battery life.',
    189.00,
    219.00,
    'Audio',
    '["https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    true,
    true,
    'New'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'Aura Minimalist Wireless Speaker');

INSERT INTO products (title, description, price, original_price, category, images, in_stock, featured, badge)
SELECT 
    'Precision Ergonomic Smartwatch',
    'Titanium case smartwatch with bio-metric health monitoring, dual-band GPS, and sapphire glass display.',
    399.50,
    449.00,
    'Wearables',
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"]'::jsonb,
    true,
    false,
    'Featured'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE title = 'Precision Ergonomic Smartwatch');
