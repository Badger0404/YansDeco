-- Yan's Deco D1 Database Schema
-- Run this in Cloudflare Dashboard > D1 > Query

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INTEGER DEFAULT 0,
    brand_id INTEGER,
    is_popular INTEGER DEFAULT 0,
    announcement_date TEXT,
    image_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

-- Product translations
CREATE TABLE IF NOT EXISTS product_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    lang TEXT NOT NULL CHECK (lang IN ('ru', 'fr', 'en')),
    name TEXT NOT NULL,
    description TEXT,
    slug TEXT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE(product_id, lang)
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    parent_id INTEGER,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Category translations
CREATE TABLE IF NOT EXISTS category_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    lang TEXT NOT NULL CHECK (lang IN ('ru', 'fr', 'en')),
    name TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE(category_id, lang)
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Brand translations
CREATE TABLE IF NOT EXISTS brand_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand_id INTEGER NOT NULL,
    lang TEXT NOT NULL CHECK (lang IN ('ru', 'fr', 'en')),
    name TEXT NOT NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
    UNIQUE(brand_id, lang)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_popular ON products(is_popular);
CREATE INDEX IF NOT EXISTS idx_products_announcement ON products(announcement_date);
CREATE INDEX IF NOT EXISTS idx_product_translations_product ON product_translations(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- Insert default brands
INSERT INTO brands (name, logo_url) VALUES 
    ('BOSTIK', NULL),
    ('SIKA', NULL),
    ('TOUPRET', NULL),
    ('PAREXLANKO', NULL),
    ("L'OUTIL PARFAIT", NULL)
ON CONFLICT(name) DO NOTHING;

-- Insert default categories with French names
INSERT INTO categories (slug, icon, sort_order) VALUES 
    ('peinture-finition', '🎨', 1),
    ('colles-mastics', '🧱', 2),
    ('outillage-peintre', '🖌️', 3),
    ('outillage-carreleur', '🔧', 4),
    ('preparation-sols', '🧱', 5),
    ('fixation-visserie', '🔩', 6)
ON CONFLICT(slug) DO NOTHING;
