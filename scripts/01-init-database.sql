-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  long_description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(2, 1) DEFAULT 4.5,
  review_count INT DEFAULT 0,
  images TEXT[] NOT NULL,
  category TEXT,
  specs JSONB,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS product_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Create comments table
CREATE TABLE IF NOT EXISTS product_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  content TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_product_likes_product_id ON product_likes(product_id);
CREATE INDEX IF NOT EXISTS idx_product_likes_user_id ON product_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_product_comments_product_id ON product_comments(product_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public read)
CREATE POLICY "Products are public" ON products FOR SELECT USING (true);

-- RLS Policies for product_likes (users can see all, insert/delete own)
CREATE POLICY "Likes are viewable by everyone" ON product_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own likes" ON product_likes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own likes" ON product_likes FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for product_comments (public read, authenticated insert)
CREATE POLICY "Comments are viewable by everyone" ON product_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments" ON product_comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON product_comments FOR UPDATE 
  USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON product_comments FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for contact_messages (anyone can insert, only admin can read)
CREATE POLICY "Anyone can insert messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- Insert sample products
INSERT INTO products (title, description, long_description, price, images, category, specs, rating, review_count) VALUES
('Premium Wireless Headphones', 'High-quality sound with noise cancellation', 'Experience immersive audio with our premium wireless headphones. Features active noise cancellation, 30-hour battery life, and premium comfort design.', 299.99, 
  ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800'],
  'Audio', '{"driver": "40mm", "frequency": "20Hz-20kHz", "impedance": "32 Ohms", "weight": "250g"}'::jsonb, 4.8, 324),

('4K Portable Monitor', 'Ultra-thin 15.6" display with USB-C connectivity', 'Portable 4K monitor perfect for professionals on the go. Features USB-C connectivity, built-in speakers, and stunning color accuracy.', 599.99,
  ARRAY['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800', 'https://images.unsplash.com/photo-1521318898646-19c3cecab87b?w=800', 'https://images.unsplash.com/photo-1588872657840-18bfbe5b8873?w=800'],
  'Displays', '{"resolution": "3840x2160", "size": "15.6\"", "brightness": "500 nits", "weight": "1.1kg"}'::jsonb, 4.6, 189),

('Smart Watch Pro', 'Next-gen fitness tracking and notifications', 'Advanced smartwatch with health monitoring, fitness tracking, and seamless smartphone integration. Water-resistant and long battery life.', 399.99,
  ARRAY['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 'https://images.unsplash.com/photo-1523269865099-fa4c3f3d4e0d?w=800', 'https://images.unsplash.com/photo-1516433713520-8b3a3e5a3f60?w=800'],
  'Wearables', '{"battery": "5 days", "display": "AMOLED 1.4\"", "water_resistance": "5ATM", "weight": "35g"}'::jsonb, 4.7, 512),

('USB-C Hub Pro', '7-in-1 connectivity solution for modern devices', 'All-in-one connectivity hub with HDMI, USB 3.0, SD card reader, and power delivery up to 100W.', 79.99,
  ARRAY['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800', 'https://images.unsplash.com/photo-1644488149786-eba8e9b50b8d?w=800'],
  'Accessories', '{"ports": "7", "power_delivery": "100W", "compatibility": "USB-C devices", "weight": "80g"}'::jsonb, 4.4, 256),

('Mechanical Keyboard RGB', 'Premium gaming keyboard with hot-swap switches', 'High-performance mechanical keyboard with customizable RGB lighting, programmable macros, and ultra-responsive switches.', 159.99,
  ARRAY['https://images.unsplash.com/photo-1587829191301-4631d3d43a1a?w=800', 'https://images.unsplash.com/photo-1587829191301-4631d3d43a1a?w=800', 'https://images.unsplash.com/photo-1594292054857-1de7f8f6b2fd?w=800'],
  'Peripherals', '{"switches": "Hot-swap mechanical", "rgb": "Per-key RGB", "battery": "Type-C rechargeable", "weight": "450g"}'::jsonb, 4.9, 678),

('Wireless Charging Pad', 'Fast 15W charging for compatible devices', 'Sleek wireless charging pad with fast charging capability, temperature control, and LED indicator for device status.', 49.99,
  ARRAY['https://images.unsplash.com/photo-1591513191122-4c5f3e2a1d9c?w=800', 'https://images.unsplash.com/photo-1609042355129-fafb3bc8f90b?w=800'],
  'Accessories', '{"power": "15W", "compatibility": "Qi-enabled devices", "cable": "USB-C", "material": "Premium plastic"}'::jsonb, 4.5, 145),

('Noise Cancelling Earbuds', 'Compact true wireless earbuds with ANC technology', 'Truly wireless earbuds with advanced noise cancellation, 8-hour battery per charge, and premium sound quality.', 249.99,
  ARRAY['https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'],
  'Audio', '{"driver": "10mm", "anc": "Active noise cancellation", "battery": "8 hours", "water_resistance": "IPX4"}'::jsonb, 4.7, 423),

('Pro Gaming Mouse', 'Precision sensor with 16,000 DPI capability', 'Advanced gaming mouse with precision sensor, ergonomic design, and customizable buttons for competitive gaming.', 129.99,
  ARRAY['https://images.unsplash.com/photo-1527814050087-3793815479db?w=800', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
  'Peripherals', '{"dpi": "16000", "polling_rate": "1000Hz", "buttons": "8", "weight": "95g"}'::jsonb, 4.6, 389),

('Portable SSD 1TB', 'Fast external storage with Type-C connectivity', 'High-speed portable solid-state drive with 1TB capacity, compact design, and blazing-fast data transfer speeds.', 189.99,
  ARRAY['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800', 'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800'],
  'Storage', '{"capacity": "1TB", "speed": "Up to 1050MB/s", "interface": "USB 3.2 Gen 2", "weight": "110g"}'::jsonb, 4.8, 512);
