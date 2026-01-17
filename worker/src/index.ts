import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  DB: D1Database;
  ASSETS: R2Bucket;
  AI: Ai;
}

const app = new Hono<{ Bindings: Env }>();

// CORS
app.use('/*', cors({
  origin: ['http://localhost:5173', 'https://yans-deco.pages.dev', 'https://preview.yans-deco.pages.dev', 'https://*.pages.dev', 'https://yansdeco.com'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Helper function to generate slug
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (char) => {
      const map: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ==================== BRANDS API ====================

// Get all brands
app.get('/api/brands', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id, name, logo_url FROM brands ORDER BY name`
  ).all();
  return c.json({ success: true, data: results });
});

// Create brand
app.post('/api/brands', async (c) => {
  const body = await c.req.json();
  const { name, logo_url } = body;

  const { success, error } = await c.env.DB.prepare(
    `INSERT INTO brands (name, logo_url) VALUES (?, ?)`
  ).bind(name, logo_url || null).run();

  if (!success) {
    return c.json({ success: false, error: error?.message }, { status: 400 });
  }

  const { results } = await c.env.DB.prepare(
    `SELECT * FROM brands WHERE id = LAST_INSERT_ROWID()`
  ).all();

  return c.json({ success: true, data: results[0] });
});

// ==================== PRODUCTS API ====================

// Get all products with translations
app.get('/api/products', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT 
      p.id, p.sku, p.price, p.stock, p.is_popular, p.announcement_date, p.image_url, p.created_at,
      pt_ru.name as name_ru, pt_ru.description as desc_ru,
      pt_fr.name as name_fr, pt_fr.description as desc_fr,
      pt_en.name as name_en, pt_en.description as desc_en,
      b.name as brand_name
    FROM products p
    LEFT JOIN product_translations pt_ru ON p.id = pt_ru.product_id AND pt_ru.lang = 'ru'
    LEFT JOIN product_translations pt_fr ON p.id = pt_fr.product_id AND pt_fr.lang = 'fr'
    LEFT JOIN product_translations pt_en ON p.id = pt_en.product_id AND pt_en.lang = 'en'
    LEFT JOIN brands b ON p.brand_id = b.id
    ORDER BY p.created_at DESC
  `).all();
  return c.json({ success: true, data: results });
});

// Get single product
app.get('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(`
    SELECT 
      p.*,
      pt_ru.name as name_ru, pt_ru.description as desc_ru,
      pt_fr.name as name_fr, pt_fr.description as desc_fr,
      pt_en.name as name_en, pt_en.description as desc_en
    FROM products p
    LEFT JOIN product_translations pt_ru ON p.id = pt_ru.product_id AND pt_ru.lang = 'ru'
    LEFT JOIN product_translations pt_fr ON p.id = pt_fr.product_id AND pt_fr.lang = 'fr'
    LEFT JOIN product_translations pt_en ON p.id = pt_en.product_id AND pt_en.lang = 'en'
    WHERE p.id = ?
  `).bind(id).all();

  if (results.length === 0) {
    return c.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  return c.json({ success: true, data: results[0] });
});

// Create product
app.post('/api/products', async (c) => {
  const body = await c.req.json();
  const {
    sku, price, stock, brand_id, category_id, is_popular, announcement_date, image_url,
    name_ru, desc_ru, name_fr, desc_fr, name_en, desc_en
  } = body;

  try {
    // Start transaction
    await c.env.DB.prepare(`BEGIN TRANSACTION`).run();

    // Insert product
    const insertResult = await c.env.DB.prepare(`
      INSERT INTO products (sku, price, stock, brand_id, category_id, is_popular, announcement_date, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(sku, price, stock || 0, brand_id || null, category_id || null, is_popular ? 1 : 0, announcement_date || null, image_url || null).run();

    const productId = (insertResult.meta.last_row_id as number);

    // Insert translations
    const translations = [
      { lang: 'ru', name: name_ru, desc: desc_ru },
      { lang: 'fr', name: name_fr, desc: desc_fr },
      { lang: 'en', name: name_en, desc: desc_en }
    ];

    for (const t of translations) {
      if (t.name) {
        await c.env.DB.prepare(`
          INSERT INTO product_translations (product_id, lang, name, description, slug)
          VALUES (?, ?, ?, ?, ?)
        `).bind(productId, t.lang, t.name, t.desc || null, generateSlug(t.name)).run();
      }
    }

    await c.env.DB.prepare(`COMMIT`).run();

    return c.json({ success: true, data: { id: productId } });
  } catch (error: any) {
    await c.env.DB.prepare(`ROLLBACK`).run();
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

// Update product
app.put('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const {
    sku, price, stock, brand_id, category_id, is_popular, announcement_date, image_url,
    name_ru, desc_ru, name_fr, desc_fr, name_en, desc_en
  } = body;

  try {
    await c.env.DB.prepare(`BEGIN TRANSACTION`).run();

    // Update product
    await c.env.DB.prepare(`
      UPDATE products 
      SET sku = ?, price = ?, stock = ?, brand_id = ?, category_id = ?, is_popular = ?, 
          announcement_date = ?, image_url = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(sku, price, stock, brand_id || null, category_id || null, is_popular ? 1 : 0, announcement_date || null, image_url || null, id).run();

    // Update translations
    const translations = [
      { lang: 'ru', name: name_ru, desc: desc_ru },
      { lang: 'fr', name: name_fr, desc: desc_fr },
      { lang: 'en', name: name_en, desc: desc_en }
    ];

    for (const t of translations) {
      await c.env.DB.prepare(`
        INSERT INTO product_translations (product_id, lang, name, description, slug)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(product_id, lang) DO UPDATE SET name = ?, description = ?, slug = ?
      `).bind(id, t.lang, t.name, t.desc || null, generateSlug(t.name || ''), t.name, t.desc || null, generateSlug(t.name || '')).run();
    }

    await c.env.DB.prepare(`COMMIT`).run();

    return c.json({ success: true });
  } catch (error: any) {
    await c.env.DB.prepare(`ROLLBACK`).run();
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

// Delete product
app.delete('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  const { success } = await c.env.DB.prepare(`DELETE FROM products WHERE id = ?`).bind(id).run();
  return c.json({ success });
});

// ==================== AI TRANSLATION ====================

app.post('/api/ai/translate', async (c) => {
  const body = await c.req.json();
  const { text, targetLangs } = body;

  if (!text || !targetLangs || !Array.isArray(targetLangs)) {
    return c.json({ success: false, error: 'Missing text or targetLangs' }, { status: 400 });
  }

  if (!c.env.AI) {
    return c.json({ success: false, error: 'AI service is not configured. Please add AI binding in Cloudflare dashboard.' }, 500);
  }

  console.log('AI Request:', text, 'Target langs:', targetLangs);

  const results: Record<string, { name: string; description: string }> = {};

  for (const lang of targetLangs) {
    const userPrompt = `Переведи следующее название и описание на ${lang === 'fr' ? 'французский' : 'английский'} язык:\n${JSON.stringify(text, null, 2)}`;

    try {
      const response = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          {
            role: 'system',
            content: "Ты — эксперт-переводчик в сфере строительных материалов и премиального декора для магазина Yan's Deco. Твоя задача — технически точный и коммерчески привлекательный перевод. Правила: 1. Используй 'Enduit' для декоративной штукатурки. 2. Используй 'Mélange' для смесей. 3. 'Паропроницаемость' переводи как 'Perméabilité à la vapeur d\\'eau' (FR) и 'Breathability' (EN). 4. 'Мокрый шелк' — 'Effet soie humide'. 5. Возвращай только JSON с переводом, без лишнего текста."
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 500
      });

      console.log('AI Response for', lang, ':', response);

      let translated;
      if (typeof response === 'string') {
        translated = JSON.parse(response);
      } else if ('response' in response) {
        try {
          translated = JSON.parse(response.response);
        } catch {
          const cleaned = response.response.replace(/```json\s*|\s*```/g, '');
          translated = JSON.parse(cleaned);
        }
      } else {
        const textContent = typeof response === 'object' ? JSON.stringify(response) : response;
        try {
          translated = JSON.parse(textContent);
        } catch {
          translated = { name: textContent.split('\n')[0]?.replace(/^["']|["']$/g, '') || '', description: '' };
        }
      }

      results[lang] = {
        name: translated.name || '',
        description: (translated.description || '').replace(/\\n/g, '\n')
      };
    } catch (err: any) {
      console.error(`Translation error for ${lang}:`, err);
      return c.json({ success: false, error: err.message }, 500);
    }
  }

  return c.json({ success: true, data: results });
});

// ==================== IMAGE UPLOAD (R2) ====================

app.post('/api/upload', async (c) => {
  console.log('[Upload] Starting upload request...');
  
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'products';

    console.log('[Upload] File received:', file ? file.name : 'null');
    console.log('[Upload] Folder:', folder);

    if (!file) {
      console.log('[Upload] Error: No file provided');
      return c.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    console.log('[Upload] File size:', file.size, 'bytes');
    console.log('[Upload] File type:', file.type);

    const arrayBuffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const path = `${folder}/${fileName}`;

    console.log('[Upload] Uploading to R2:', path);

    await c.env.ASSETS.put(path, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream',
      },
    });

    console.log('[Upload] Success! URL generated');

    const publicUrl = `https://yans-deco-assets.yansdeco.workers.dev/${path}`;

    return c.json({ 
      success: true, 
      data: { 
        url: publicUrl,
        path: path,
        filename: fileName
      }
    });
  } catch (error: any) {
    console.error('[Upload] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// ==================== CATEGORIES API ====================

app.get('/api/categories', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT 
      c.id, c.slug, c.icon, c.image_url, c.parent_id, c.sort_order, c.created_at,
      ct_ru.name as name_ru, ct_ru.description as desc_ru,
      ct_fr.name as name_fr, ct_fr.description as desc_fr,
      ct_en.name as name_en, ct_en.description as desc_en
    FROM categories c
    LEFT JOIN category_translations ct_ru ON c.id = ct_ru.category_id AND ct_ru.lang = 'ru'
    LEFT JOIN category_translations ct_fr ON c.id = ct_fr.category_id AND ct_fr.lang = 'fr'
    LEFT JOIN category_translations ct_en ON c.id = ct_en.category_id AND ct_en.lang = 'en'
    ORDER BY c.sort_order
  `).all();
  return c.json({ success: true, data: results });
});

// Create category
app.post('/api/categories', async (c) => {
  const body = await c.req.json();
  const {
    slug, icon, image_url, parent_id, sort_order,
    name_ru, name_fr, name_en,
    desc_ru, desc_fr, desc_en
  } = body;

  try {
    await c.env.DB.prepare(`BEGIN TRANSACTION`).run();

    const insertResult = await c.env.DB.prepare(`
      INSERT INTO categories (slug, icon, image_url, parent_id, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `).bind(slug, icon || null, image_url || null, parent_id || null, sort_order || 0).run();

    const categoryId = (insertResult.meta.last_row_id as number);

    const translations = [
      { lang: 'ru', name: name_ru, desc: desc_ru },
      { lang: 'fr', name: name_fr, desc: desc_fr },
      { lang: 'en', name: name_en, desc: desc_en }
    ];

    for (const t of translations) {
      if (t.name) {
        await c.env.DB.prepare(`
          INSERT INTO category_translations (category_id, lang, name, description)
          VALUES (?, ?, ?, ?)
        `).bind(categoryId, t.lang, t.name, t.desc || null).run();
      }
    }

    await c.env.DB.prepare(`COMMIT`).run();

    return c.json({ success: true, data: { id: categoryId } });
  } catch (error: any) {
    await c.env.DB.prepare(`ROLLBACK`).run();
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

// Update category
app.put('/api/categories/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const {
    slug, icon, image_url, parent_id, sort_order,
    name_ru, name_fr, name_en,
    desc_ru, desc_fr, desc_en
  } = body;

  try {
    await c.env.DB.prepare(`BEGIN TRANSACTION`).run();

    await c.env.DB.prepare(`
      UPDATE categories 
      SET slug = ?, icon = ?, image_url = ?, parent_id = ?, sort_order = ?
      WHERE id = ?
    `).bind(slug, icon || null, image_url || null, parent_id || null, sort_order || 0, id).run();

    const translations = [
      { lang: 'ru', name: name_ru, desc: desc_ru },
      { lang: 'fr', name: name_fr, desc: desc_fr },
      { lang: 'en', name: name_en, desc: desc_en }
    ];

    for (const t of translations) {
      await c.env.DB.prepare(`
        INSERT INTO category_translations (category_id, lang, name, description)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(category_id, lang) DO UPDATE SET name = ?, description = ?
      `).bind(id, t.lang, t.name, t.desc || null, t.name, t.desc || null).run();
    }

    await c.env.DB.prepare(`COMMIT`).run();

    return c.json({ success: true });
  } catch (error: any) {
    await c.env.DB.prepare(`ROLLBACK`).run();
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

// Delete category
app.delete('/api/categories/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const { success } = await c.env.DB.prepare(`DELETE FROM categories WHERE id = ?`).bind(id).run();
    if (!success) {
      return c.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// ==================== MIGRATION ====================
app.post('/api/migrate', async (c) => {
  const schema = `
-- Products table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sku TEXT UNIQUE NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INTEGER DEFAULT 0,
    brand_id INTEGER,
    category_id INTEGER,
    is_popular INTEGER DEFAULT 0,
    announcement_date TEXT,
    image_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (brand_id) REFERENCES brands(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
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
    image_url TEXT,
    parent_id INTEGER,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Category translations
CREATE TABLE IF NOT EXISTS category_translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    lang TEXT NOT NULL CHECK (lang IN ('ru', 'fr', 'en')),
    name TEXT NOT NULL,
    description TEXT,
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

-- Insert default categories
INSERT INTO categories (slug, icon, sort_order) VALUES 
    ('peinture-finition', '🎨', 1),
    ('colles-mastics', '🧱', 2),
    ('outillage-peintre', '🖌️', 3),
    ('outillage-carreleur', '🔧', 4),
    ('preparation-sols', '🧱', 5),
    ('fixation-visserie', '🔩', 6)
ON CONFLICT(slug) DO NOTHING;
`;

  try {
    const statements = schema.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await c.env.DB.prepare(statement).run();
      }
    }
    
    return c.json({ success: true, message: 'Migration completed' });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

export default app;
