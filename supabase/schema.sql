

-- Brands table
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio TEXT,
  logo_url TEXT,
  whatsapp TEXT,
  instagram TEXT,
  telegram TEXT,
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial','active','expired','cancelled')),
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'standard', 'pro')),
  is_verified BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  subscription_ends_at TIMESTAMPTZ,
  theme_settings JSONB DEFAULT '{"theme": "light", "primaryColor": "#ffffff", "fontFamily": "Inter"}'::jsonb,
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  total_amount NUMERIC(12,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  items JSONB NOT NULL, -- Array of products ordered
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_brand_id ON orders(brand_id);
CREATE INDEX idx_orders_status ON orders(status);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  image_url TEXT,
  quantity INT DEFAULT -1,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_active ON products(is_active);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Brands policies
CREATE POLICY "Brands are viewable by everyone"
  ON brands FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own brand"
  ON brands FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand"
  ON brands FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brand"
  ON brands FOR DELETE
  USING (auth.uid() = user_id);

-- Products policies
CREATE POLICY "Active products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Brand owners can insert products"
  ON products FOR INSERT
  WITH CHECK (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

CREATE POLICY "Brand owners can update products"
  ON products FOR UPDATE
  USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

CREATE POLICY "Brand owners can delete products"
  ON products FOR DELETE
  USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete own product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Enable RLS for Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sellers can view own orders"
  ON orders FOR SELECT
  USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

CREATE POLICY "Sellers can update own orders"
  ON orders FOR UPDATE
  USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));

-- Analytics table
CREATE TABLE analytic_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL, -- 'page_view', 'product_click', 'whatsapp_click', 'transfer_click'
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_brand_id ON analytic_events(brand_id);
CREATE INDEX idx_analytics_event_type ON analytic_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytic_events(created_at);

ALTER TABLE analytic_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytic events"
  ON analytic_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Sellers can view own analytics"
  ON analytic_events FOR SELECT
  USING (brand_id IN (SELECT id FROM brands WHERE user_id = auth.uid()));
