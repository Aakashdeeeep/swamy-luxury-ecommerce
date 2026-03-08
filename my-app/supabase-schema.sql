-- ============================================================
-- Swamy Jewellery — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Categories
CREATE TABLE categories (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,          -- e.g. "Necklaces", "Bangles"
  slug        TEXT NOT NULL UNIQUE,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 2. Products
CREATE TABLE products (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  category_id   UUID REFERENCES categories(id) ON DELETE SET NULL,
  material      TEXT,                        -- "22K Gold", "18K Rose Gold"
  material_type TEXT DEFAULT 'gold',          -- "gold", "silver", "diamond"
  weight        TEXT,                        -- "48.5g"
  net_weight    TEXT,                        -- "45.2g"
  price         TEXT,                        -- "₹ 3,45,000"
  badge         TEXT DEFAULT '',             -- "New Arrival", "Best Seller"
  certification TEXT DEFAULT '916',          -- "916", "IGI"
  cert_icon     TEXT DEFAULT 'verified',     -- "verified", "diamond"
  description   TEXT DEFAULT '',
  is_published  BOOLEAN DEFAULT true,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 3. Product Images (multiple images per product)
CREATE TABLE product_images (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  url         TEXT NOT NULL,
  sort_order  INT DEFAULT 0,
  is_primary  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 4. Product Specs (key-value pairs per product)
CREATE TABLE product_specs (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  label       TEXT NOT NULL,                 -- "Metal", "Gross Weight"
  value       TEXT NOT NULL,                 -- "22K Gold (916 Hallmark)", "55.0 grams"
  sort_order  INT DEFAULT 0
);

-- 5. Collections (home page horizontal scroll)
CREATE TABLE collections (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  subtitle    TEXT,
  description TEXT,
  image_url   TEXT,
  link        TEXT DEFAULT '/collections',   -- where clicking leads
  sort_order  INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 6. Schemes (savings schemes page)
CREATE TABLE schemes (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT NOT NULL,
  subtitle     TEXT,
  description  TEXT,
  benefits     JSONB DEFAULT '[]',           -- ["benefit1", "benefit2"]
  image_url    TEXT,
  is_published BOOLEAN DEFAULT true,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security (RLS)
-- Public: read-only on published items
-- Admin: full CRUD (via service_role key in admin app)
-- ============================================================

ALTER TABLE categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE products       ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections    ENABLE ROW LEVEL SECURITY;
ALTER TABLE schemes        ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon role)
CREATE POLICY "Public read categories"  ON categories  FOR SELECT USING (true);
CREATE POLICY "Public read products"    ON products    FOR SELECT USING (is_published = true);
CREATE POLICY "Public read images"      ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read specs"       ON product_specs  FOR SELECT USING (true);
CREATE POLICY "Public read collections" ON collections FOR SELECT USING (is_published = true);
CREATE POLICY "Public read schemes"     ON schemes     FOR SELECT USING (is_published = true);

-- Admin full-access policies (authenticated role)
CREATE POLICY "Admin full categories"  ON categories  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full products"    ON products    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full images"      ON product_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full specs"       ON product_specs  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full collections" ON collections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full schemes"     ON schemes     FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket for product images (run these too!)
-- ============================================================

-- Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view images
CREATE POLICY "Public read product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Allow logged-in admins to upload
CREATE POLICY "Auth upload product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow logged-in admins to update
CREATE POLICY "Auth update product-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow logged-in admins to delete
CREATE POLICY "Auth delete product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX idx_products_category  ON products(category_id);
CREATE INDEX idx_products_slug      ON products(slug);
CREATE INDEX idx_products_published ON products(is_published);
CREATE INDEX idx_images_product     ON product_images(product_id);
CREATE INDEX idx_specs_product      ON product_specs(product_id);

-- ============================================================
-- Seed data (optional — matches your current hardcoded data)
-- ============================================================

-- Categories
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Necklaces',   'necklaces',   1),
  ('Bangles',     'bangles',     2),
  ('Earrings',    'earrings',    3),
  ('Bridal Sets', 'bridal-sets', 4),
  ('Rings',       'rings',       5);

-- Collections
INSERT INTO collections (title, subtitle, description, image_url, link, sort_order) VALUES
  ('Bridal Collection',  'The Royal Vow',    'A celebration of eternal love',       'https://lh3.googleusercontent.com/aida-public/AB6AXuDhyuL7ZGl73F5G3exhfB2eoWFQYn9QZJCD2Wh9EYPr3HA155EhKD9J2q3e72oExdlVE4g2eIl6g1N0fpQfu4jfFkP_qz4SpIxIv3cb3HUHjdqZONa_ALi8YFlV5UV2zdNTp3c0V5Ox3N6uCvzPs5g7O4afkYy4gGozbWb5jqunq6OPJyDtnZLQ2by1_kY5bJ6_csvG-Nc31UuIkQ1BV4Qu68IBGV8xCmoVIgDXVeF28u7uI6QHicWGhCOjAA-sFvhSCSfTGpdn4fFE', '/collections', 1),
  ('Gold Jewellery',     'Traditional 22K',  'Heritage craftsmanship in pure gold', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBh4bk0drqq8isBLlkKGh8uz4I7saGFelABygjwom-qSPNGiqySDajDTTfdij2EfzqeZJIj-E54D7vW_Ym7e0iYYebKNfseULhb7ymGASn0R9vrFP1L1f-62mOPXNAmE9ROnDrhjKt2NNToBYKdkxckuwrhAfH01zJGeSkKCNeyUMDNJQx3cxl21OUxclWz68c7qplBHO2iysz3Z5odG0BM7MSKWWquQ8G5OfV2BEo0nysx2HdGBdD9x1GugsuPFSgqBcoXWI7gmVs', '/collections/gold', 2),
  ('Diamond Jewellery',  'IGI Certified',    'Brilliance beyond measure',           'https://lh3.googleusercontent.com/aida-public/AB6AXuCMsZsbbfrcrdS9rJ_AcZ1LGzmdpKcEl0OCAFSivxPkOolpZIoixtFMpYaQJCsc41DcTmLaRQNFYD44WTeT0X-gb_8yQuREwRcj1y4tIHmWdtT1Xjg3v0jb35zKv5vWDICNzF78H4zxO6qYV7A8q94Oe2tXTwKwXOgLoAK2KB1Jx7k7N3-usGpi2ZJGLEKD5rX3bqUHsEdawL_0AGMEw-q_EDWncfBmhpOm5KuRuoF8q17azSx8NV8I64xN152i16xVAnchTQZVE33W', '/collections/diamond', 3),
  ('Pure Silver',        'Divine Articles',  'Sacred artistry in silver',           'https://lh3.googleusercontent.com/aida-public/AB6AXuABlK03xJZabUm8hHXTU7-MI0xi9n4t8j2B2RU7ynAmgc9WMg1zfq3RmLWpq4VvO9wqIC8E0wLf-DAL-Ax-pzkviEn57dCxe3k4pNetucbfq95QPZybA2A5mT19EEMGrST8dU5whTk1OR-cJz-3IJsk_IOBlGSn7XZ5WbsetEWGDCeBUBoho4R44FrMgpB6bWHvDLzjxhXUTwk9gP8Uiu4OBf_CqUmaKu5rzQV7YGNmaNKXJ8OnPRIBRKICzjmVYFI4NLJaaiis8En6', '/collections/silver', 4);
