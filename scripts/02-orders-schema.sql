-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, shipped, delivered, cancelled
  total DECIMAL(10, 2) NOT NULL,
  payment_reference TEXT,
  shipping_address JSONB,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 1,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  metadata JSONB
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
-- Users can view their own orders
CREATE POLICY "Users can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own orders (usually via server action or API, but good to have)
CREATE POLICY "Users can create their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Anon users can create orders (for guest checkout, if we support it later, but initially user said "user sign with just phone")
-- For now, let's allow authenticated insert. 
-- Wait, the flow is "add to bag -> checkout -> paystack".
-- If we want guest checkout, we might need to relax this or use a service role for creation.
-- Let's allow public insert for now to facilitate the Paystack webhook/callback creation flow if it comes from client, 
-- or restrict to service role if it comes from backend.
-- Best practice: Client creates order with 'pending' status? Or Backend creates it?
-- Let's stick to: Authenticated users or Service Role.

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );
