import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  DB: D1Database;
  ASSETS: R2Bucket;
  AI: Ai;
  GREEN_API_ID_INSTANCE: string;
  GREEN_API_TOKEN_INSTANCE: string;
  ENV: string;
}

const app = new Hono<{ Bindings: Env }>();

// ============ HELPER FUNCTIONS ============

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'yans-deco-salt-2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

function generateToken(clientId: string): string {
  const payload = `${clientId}.${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
  return btoa(payload);
}

function verifyToken(token: string): string | null {
  try {
    const payload = atob(token);
    const parts = payload.split('.');
    if (parts.length < 2) return null;
    return parts[0];
  } catch {
    return null;
  }
}

// CORS - Allow all origins for testing
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'x-session-id'],
}));

// Health check - API_ALIVE
app.get('/api', (c) => c.text('API_ALIVE'));
app.get('/', (c) => c.text('API_ALIVE'));

// Full health check
app.get('/api/health', async (c) => {
  try {
    let dbStatus = 'ok';
    let r2Status = 'ok';

    // Check D1
    try {
      await c.env.DB.prepare('SELECT 1').first();
    } catch (e) {
      dbStatus = 'error';
    }

    // Check R2 - just verify bucket is accessible
    try {
      await c.env.ASSETS.list({ limit: 1 });
    } catch (e) {
      r2Status = 'error';
    }

    return c.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'ok',
        db: dbStatus,
        r2: r2Status
      }
    });
  } catch (error: any) {
    return c.json({
      success: false,
      status: 'unhealthy',
      error: error.message
}, { status: 500 });
  }
});

// Migration endpoint to fix slogans table
app.post('/api/admin/migrate/slogans', async (c) => {
  try {
    // Drop old table if exists with bad schema
    await c.env.DB.prepare(`DROP TABLE IF EXISTS slogans`).run();
    
    // Create table with proper schema (key quoted, CURRENT_TIMESTAMP for dates)
    await c.env.DB.prepare(`
      CREATE TABLE slogans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        "key" TEXT UNIQUE,
        title_ru TEXT DEFAULT '',
        title_fr TEXT DEFAULT '',
        title_en TEXT DEFAULT '',
        content_ru TEXT DEFAULT '',
        content_fr TEXT DEFAULT '',
        content_en TEXT DEFAULT '',
        image_url TEXT DEFAULT '',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    return c.json({ success: true, message: 'Slogans table recreated' });
  } catch (error: any) {
    console.error('[Migration] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// Serve images from R2
app.get('/images/*', async (c) => {
  const path = c.req.path.replace('/images/', '');
  console.log('[Images] Requested path:', path);

  if (!path) {
    return c.json({ success: false, error: 'Path required' }, { status: 400 });
  }

  try {
    const object = await c.env.ASSETS.get(path);
    console.log('[Images] Found object:', object ? 'yes' : 'no');

    if (!object) {
      return c.json({ success: false, error: 'Image not found', path }, { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new Response(object.body, {
      headers,
    });
  } catch (error: any) {
    console.error('[Images] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// Helper function to generate slug
function generateSlug(text: string): string {
  if (!text) return '';
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

app.get('/api/brands', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id, name, logo_url, description_ru, description_fr, description_en, hide_name, 
     bg_light_color, bg_light_opacity, bg_light_enabled, bg_dark_color, bg_dark_opacity, bg_dark_enabled, 
     border_light_enabled, border_light_color, border_light_opacity, border_dark_enabled, border_dark_color, border_dark_opacity,
     glow_light_enabled, glow_light_color, glow_light_opacity, glow_light_blur,
     glow_dark_enabled, glow_dark_color, glow_dark_opacity, glow_dark_blur
     FROM brands ORDER BY name`
  ).all();
  return c.json({ success: true, data: results });
});

app.get('/api/brands/:id', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(
    `SELECT id, name, logo_url, description_ru, description_fr, description_en, hide_name, 
     bg_light_color, bg_light_opacity, bg_light_enabled, bg_dark_color, bg_dark_opacity, bg_dark_enabled, 
     border_light_enabled, border_light_color, border_light_opacity, border_dark_enabled, border_dark_color, border_dark_opacity,
     glow_light_enabled, glow_light_color, glow_light_opacity, glow_light_blur,
     glow_dark_enabled, glow_dark_color, glow_dark_opacity, glow_dark_blur
     FROM brands WHERE id = ?`
  ).bind(id).all();

  if (results.length === 0) {
    return c.json({ success: false, error: 'Brand not found' }, { status: 404 });
  }

  return c.json({ success: true, data: results[0] });
});

app.get('/api/brands/:id/products', async (c) => {
  const id = c.req.param('id');

  // First check if brand exists
  const { results: brandCheck } = await c.env.DB.prepare(
    `SELECT id FROM brands WHERE id = ?`
  ).bind(id).all();

  if (brandCheck.length === 0) {
    return c.json({ success: false, error: 'Brand not found' }, { status: 404 });
  }

  // Get products for this brand with category info
  const { results: products } = await c.env.DB.prepare(`
    SELECT 
      p.id,
      p.sku,
      p.price,
      p.stock,
      p.image_url,
      p.name_ru,
      p.name_fr,
      p.name_en,
      p.is_popular,
      c.name_fr as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.brand_id = ?
    ORDER BY p.created_at DESC
  `).bind(id).all();

  return c.json({ success: true, data: products });
});

app.post('/api/brands', async (c) => {
  const body = await c.req.json();
  const { 
    name, logo_url, description_ru, description_fr, description_en, hide_name, 
    bg_light_color, bg_light_opacity, bg_light_enabled, bg_dark_color, bg_dark_opacity, bg_dark_enabled, 
    border_light_enabled, border_light_color, border_light_opacity, border_dark_enabled, border_dark_color, border_dark_opacity,
    glow_light_enabled, glow_light_color, glow_light_opacity, glow_light_blur,
    glow_dark_enabled, glow_dark_color, glow_dark_opacity, glow_dark_blur
  } = body;

  if (!name) {
    return c.json({ success: false, error: 'Name is required' }, { status: 400 });
  }

  try {
    const { success, error } = await c.env.DB.prepare(
      `INSERT INTO brands (name, logo_url, description_ru, description_fr, description_en, hide_name, 
       bg_light_color, bg_light_opacity, bg_light_enabled, bg_dark_color, bg_dark_opacity, bg_dark_enabled, 
       border_light_enabled, border_light_color, border_light_opacity, border_dark_enabled, border_dark_color, border_dark_opacity,
       glow_light_enabled, glow_light_color, glow_light_opacity, glow_light_blur,
       glow_dark_enabled, glow_dark_color, glow_dark_opacity, glow_dark_blur) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      name, logo_url || null, description_ru || null, description_fr || null, description_en || null, hide_name ? 1 : 0,
      bg_light_color || null, bg_light_opacity || null, bg_light_enabled ? 1 : 0, bg_dark_color || null, bg_dark_opacity || null, bg_dark_enabled ? 1 : 0,
      border_light_enabled ? 1 : 0, border_light_color || null, border_light_opacity || 100, border_dark_enabled ? 1 : 0, border_dark_color || null, border_dark_opacity || 100,
      glow_light_enabled ? 1 : 0, glow_light_color || null, glow_light_opacity || 50, glow_light_blur || 20,
      glow_dark_enabled ? 1 : 0, glow_dark_color || null, glow_dark_opacity || 50, glow_dark_blur || 20
    ).run();

    if (!success) {
      return c.json({ success: false, error: error?.message }, { status: 400 });
    }

    const { results } = await c.env.DB.prepare(
      `SELECT * FROM brands WHERE id = LAST_INSERT_ROWID()`
    ).all();

    return c.json({ success: true, data: results[0] });
  } catch (error: any) {
    console.error('[Brands POST] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.put('/api/brands/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { 
    name, logo_url, description_ru, description_fr, description_en, hide_name, 
    bg_light_color, bg_light_opacity, bg_light_enabled, bg_dark_color, bg_dark_opacity, bg_dark_enabled, 
    border_light_enabled, border_light_color, border_light_opacity, border_dark_enabled, border_dark_color, border_dark_opacity,
    glow_light_enabled, glow_light_color, glow_light_opacity, glow_light_blur,
    glow_dark_enabled, glow_dark_color, glow_dark_opacity, glow_dark_blur
  } = body;

  if (!name) {
    return c.json({ success: false, error: 'Name is required' }, { status: 400 });
  }

  try {
    await c.env.DB.prepare(
      `UPDATE brands SET name = ?, logo_url = ?, description_ru = ?, description_fr = ?, description_en = ?, hide_name = ?, 
       bg_light_color = ?, bg_light_opacity = ?, bg_light_enabled = ?, bg_dark_color = ?, bg_dark_opacity = ?, bg_dark_enabled = ?, 
       border_light_enabled = ?, border_light_color = ?, border_light_opacity = ?, border_dark_enabled = ?, border_dark_color = ?, border_dark_opacity = ?,
       glow_light_enabled = ?, glow_light_color = ?, glow_light_opacity = ?, glow_light_blur = ?,
       glow_dark_enabled = ?, glow_dark_color = ?, glow_dark_opacity = ?, glow_dark_blur = ?
       WHERE id = ?`
    ).bind(
      name, logo_url || null, description_ru || null, description_fr || null, description_en || null, hide_name ? 1 : 0,
      bg_light_color || null, bg_light_opacity || null, bg_light_enabled ? 1 : 0, bg_dark_color || null, bg_dark_opacity || null, bg_dark_enabled ? 1 : 0,
      border_light_enabled ? 1 : 0, border_light_color || null, border_light_opacity || 100, border_dark_enabled ? 1 : 0, border_dark_color || null, border_dark_opacity || 100,
      glow_light_enabled ? 1 : 0, glow_light_color || null, glow_light_opacity || 50, glow_light_blur || 20,
      glow_dark_enabled ? 1 : 0, glow_dark_color || null, glow_dark_opacity || 50, glow_dark_blur || 20,
      id
    ).run();

    const { results } = await c.env.DB.prepare(
      `SELECT * FROM brands WHERE id = ?`
    ).bind(id).all();

    return c.json({ success: true, data: results[0] });
  } catch (error: any) {
    console.error('[Brands PUT] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.delete('/api/brands/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const { success } = await c.env.DB.prepare(
      `DELETE FROM brands WHERE id = ?`
    ).bind(id).run();

    return c.json({ success });
  } catch (error: any) {
    console.error('[Brands DELETE] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.delete('/api/brands/:id/logo', async (c) => {
  const id = c.req.param('id');
  try {
    await c.env.DB.prepare(`UPDATE brands SET logo_url = NULL WHERE id = ?`)
      .bind(id).run();
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

// ==================== PRODUCTS API ====================

app.get('/api/products', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT 
      p.id, p.sku, p.price, p.stock, p.is_popular, p.announcement_date, p.image_url, p.created_at,
      p.name_ru, p.desc_ru,
      p.name_fr, p.desc_fr,
      p.name_en, p.desc_en,
      b.name as brand_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    ORDER BY p.created_at DESC
  `).all();
  return c.json({ success: true, data: results });
});

app.get('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(`
    SELECT 
      p.id, p.sku, p.price, p.stock, p.is_popular, p.announcement_date, p.image_url, p.created_at,
      p.name_ru, p.desc_ru,
      p.name_fr, p.desc_fr,
      p.name_en, p.desc_en,
      b.name as brand_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.id = ?
  `).bind(id).all();
  return c.json({ success: true, data: results[0] });
});

app.get('/api/admin/products/:id', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(`
    SELECT 
      p.*,
      b.name as brand_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.id = ?
  `).bind(id).all();
  return c.json({ success: true, data: results[0] });
});

app.post('/api/products', async (c) => {
  console.log('[Products] POST /api/products - Starting request');

  let body;
  try {
    body = await c.req.json();
    console.log('[Products] Received body:', JSON.stringify(body, null, 2));
  } catch (parseError: any) {
    console.error('[Products] Failed to parse JSON body:', parseError.message);
    return c.json({ success: false, error: 'Invalid JSON body: ' + parseError.message }, { status: 400 });
  }

  const {
    sku,
    barcode,
    price, stock, brand_id, category_id, is_popular, announcement_date, image_url,
    name_ru, desc_ru, name_fr, desc_fr, name_en, desc_en
  } = body;

  console.log('[Products] Parsed fields:', { sku, barcode, price, stock, brand_id, category_id, is_popular });

  try {
    console.log('[Products] Inserting product with SKU:', sku, 'price:', price);

    const insertResult = await c.env.DB.prepare(`
      INSERT INTO products (sku, barcode, price, stock, brand_id, category_id, is_popular, announcement_date, image_url, name_ru, name_fr, name_en, desc_ru, desc_fr, desc_en)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      sku,
      barcode || null,
      price,
      stock || 0,
      brand_id || null,
      category_id || null,
      is_popular ? 1 : 0,
      announcement_date || null,
      image_url || null,
      name_ru || null,
      name_fr || null,
      name_en || null,
      desc_ru || null,
      desc_fr || null,
      desc_en || null
    ).run();

    console.log('[Products] Insert result:', JSON.stringify(insertResult));
    const productId = (insertResult.meta.last_row_id as number);
    console.log('[Products] Created product with ID:', productId);

    return c.json({ success: true, data: { id: productId } });
  } catch (error: any) {
    console.error('[Products] D1 Error:', error.message);
    console.error('[Products] Full error:', error);
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.put('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const {
    sku, barcode, price, stock, brand_id, category_id, is_popular, announcement_date, image_url,
    name_ru, desc_ru, name_fr, desc_fr, name_en, desc_en
  } = body;

  try {
    const updateResult = await c.env.DB.prepare(`
      UPDATE products 
      SET sku = ?, barcode = ?, price = ?, stock = ?, brand_id = ?, category_id = ?, is_popular = ?, 
          announcement_date = ?, image_url = ?, updated_at = datetime('now'),
          name_ru = ?, name_fr = ?, name_en = ?,
          desc_ru = ?, desc_fr = ?, desc_en = ?
      WHERE id = ?
    `).bind(
      sku, barcode || null, price, stock, brand_id || null, category_id || null, is_popular ? 1 : 0,
      announcement_date || null, image_url || null,
      name_ru || null, name_fr || null, name_en || null,
      desc_ru || null, desc_fr || null, desc_en || null,
      id
    ).run();

    console.log('[Products PUT] Update result:', JSON.stringify(updateResult));
    return c.json({ success: true });
  } catch (error: any) {
    console.error('[Products PUT] D1 Error:', error.message);
    console.error('[Products PUT] Full error:', error);
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.delete('/api/products/:id', async (c) => {
  const id = c.req.param('id');
  const { success } = await c.env.DB.prepare(`DELETE FROM products WHERE id = ?`).bind(id).run();
  return c.json({ success });
});

app.delete('/api/products/:id/image', async (c) => {
  const id = c.req.param('id');
  try {
    await c.env.DB.prepare(`UPDATE products SET image_url = NULL, updated_at = datetime('now') WHERE id = ?`)
      .bind(id).run();
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

// ==================== PRODUCTS API - BARCODE & SKU UPDATE ====================

app.put('/api/products/:id/barcode', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { barcode } = body;

  try {
    await c.env.DB.prepare(`UPDATE products SET barcode = ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(barcode || null, id).run();
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.get('/api/products/by-barcode/:barcode', async (c) => {
  const barcode = c.req.param('barcode');
  const { results } = await c.env.DB.prepare(`
    SELECT p.*, b.name as brand_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.barcode = ?
  `).bind(barcode).all();

  if (results.length === 0) {
    return c.json({ success: false, error: 'Product not found' }, { status: 404 });
  }

  return c.json({ success: true, data: results[0] });
});

// ==================== WAREHOUSE MANAGEMENT API ====================

app.post('/api/admin/stock/in', async (c) => {
  const body = await c.req.json();
  const { product_id, quantity, comment } = body;

  if (!product_id || !quantity || quantity <= 0) {
    return c.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    await c.env.DB.prepare(`UPDATE products SET stock = stock + ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(quantity, product_id).run();

    await c.env.DB.prepare(`
      INSERT INTO stock_logs (product_id, type, quantity, comment)
      VALUES (?, 'IN', ?, ?)
    `).bind(product_id, quantity, comment || null).run();

    const { results } = await c.env.DB.prepare(`SELECT stock FROM products WHERE id = ?`).bind(product_id).all();

    return c.json({ success: true, data: { product_id, new_stock: results[0].stock } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.post('/api/admin/stock/out', async (c) => {
  const body = await c.req.json();
  const { product_id, quantity, comment } = body;

  if (!product_id || !quantity || quantity <= 0) {
    return c.json({ success: false, error: 'Invalid parameters' }, { status: 400 });
  }

  try {
    const { results: productCheck } = await c.env.DB.prepare(`SELECT stock FROM products WHERE id = ?`).bind(product_id).all();
    if (productCheck.length === 0) {
      return c.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const currentStock = productCheck[0].stock;
    if (currentStock < quantity) {
      return c.json({ success: false, error: 'Insufficient stock' }, { status: 400 });
    }

    await c.env.DB.prepare(`UPDATE products SET stock = stock - ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(quantity, product_id).run();

    await c.env.DB.prepare(`
      INSERT INTO stock_logs (product_id, type, quantity, comment)
      VALUES (?, 'OUT', ?, ?)
    `).bind(product_id, quantity, comment || 'Списание').run();

    const { results } = await c.env.DB.prepare(`SELECT stock FROM products WHERE id = ?`).bind(product_id).all();

    return c.json({ success: true, data: { product_id, new_stock: results[0].stock } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.post('/api/admin/stock/cash', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ADMIN.')) {
    return c.json({ success: false, error: 'Admin access required' }, { status: 403 });
  }

  const body = await c.req.json();
  const { product_id, quantity = 1, order_id, total_amount } = body;

  if (!product_id || !order_id) {
    return c.json({ success: false, error: 'Product ID and Order ID are required' }, { status: 400 });
  }

  try {
    const { results: productCheck } = await c.env.DB.prepare(`SELECT stock, price FROM products WHERE id = ?`).bind(product_id).all();
    if (productCheck.length === 0) {
      return c.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const currentStock = productCheck[0].stock;
    if (currentStock < quantity) {
      return c.json({ success: false, error: 'Insufficient stock' }, { status: 400 });
    }

    const amount = total_amount || (productCheck[0].price * quantity);

    await c.env.DB.prepare(`UPDATE products SET stock = stock - ?, updated_at = datetime('now') WHERE id = ?`)
      .bind(quantity, product_id).run();

    await c.env.DB.prepare(`
      INSERT INTO stock_logs (product_id, type, quantity, comment)
      VALUES (?, 'SALE_CASH', ?, ?)
    `).bind(product_id, quantity, `Наличная продажа: ${order_id}`).run();

    await c.env.DB.prepare(`
      INSERT INTO internal_sales (order_id, total_amount)
      VALUES (?, ?)
      ON CONFLICT(order_id) DO UPDATE SET total_amount = excluded.total_amount
    `).bind(order_id, amount).run();

    const { results } = await c.env.DB.prepare(`SELECT stock FROM products WHERE id = ?`).bind(product_id).all();

    return c.json({ success: true, data: { product_id, new_stock: results[0].stock, order_id, amount } });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.get('/api/admin/stock/logs', async (c) => {
  const limit = parseInt(c.req.query('limit') || '100');
  const offset = parseInt(c.req.query('offset') || '0');
  const productId = c.req.query('product_id');

  let query = `
    SELECT sl.*, p.sku, p.name_fr, p.name_ru
    FROM stock_logs sl
    JOIN products p ON sl.product_id = p.id
  `;
  const bindings: any[] = [];

  if (productId) {
    query += ' WHERE sl.product_id = ?';
    bindings.push(productId);
  }

  query += ' ORDER BY sl.created_at DESC LIMIT ? OFFSET ?';
  bindings.push(limit, offset);

  const { results } = await c.env.DB.prepare(query).bind(...bindings).all();

  return c.json({ success: true, data: results });
});

app.get('/api/admin/stock/internal-sales', async (c) => {
  const limit = parseInt(c.req.query('limit') || '100');
  const offset = parseInt(c.req.query('offset') || '0');

  const { results } = await c.env.DB.prepare(`
    SELECT * FROM internal_sales ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

  return c.json({ success: true, data: results });
});

app.get('/api/admin/stock/history/:productId', async (c) => {
  const productId = c.req.param('productId');

  const { results } = await c.env.DB.prepare(`
    SELECT * FROM stock_logs WHERE product_id = ? ORDER BY created_at DESC
  `).bind(productId).all();

  return c.json({ success: true, data: results });
});

// ==================== SERVICES API ====================

app.get('/api/services', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id, key, icon, icon_emoji, icon_url, gradient_from, gradient_to,
            tags_ru, tags_fr, tags_en,
            title_ru, title_fr, title_en,
            subtitle_ru, subtitle_fr, subtitle_en,
            description_ru, description_fr, description_en,
            sort_order, is_active
     FROM services 
     WHERE is_active = 1 
     ORDER BY sort_order`
  ).all();
  return c.json({ success: true, data: results });
});

app.get('/api/admin/services', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT id, key, icon, icon_emoji, icon_url, gradient_from, gradient_to,
            tags_ru, tags_fr, tags_en,
            title_ru, title_fr, title_en,
            subtitle_ru, subtitle_fr, subtitle_en,
            description_ru, description_fr, description_en,
            sort_order, is_active, created_at, updated_at
     FROM services 
     ORDER BY sort_order`
  ).all();
  return c.json({ success: true, data: results });
});

app.get('/api/services/:id', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(
    `SELECT id, key, icon, icon_emoji, icon_url, gradient_from, gradient_to,
            tags_ru, tags_fr, tags_en,
            title_ru, title_fr, title_en,
            subtitle_ru, subtitle_fr, subtitle_en,
            description_ru, description_fr, description_en,
            sort_order, is_active, created_at, updated_at
     FROM services WHERE id = ?`
  ).bind(id).all();

  if (results.length === 0) {
    return c.json({ success: false, error: 'Service not found' }, { status: 404 });
  }

  return c.json({ success: true, data: results[0] });
});

app.post('/api/services', async (c) => {
  try {
    const body = await c.req.json();
    const {
      key, icon, icon_emoji, icon_url, gradient_from, gradient_to,
      tags_ru, tags_fr, tags_en,
      title_ru, title_fr, title_en,
      subtitle_ru, subtitle_fr, subtitle_en,
      description_ru, description_fr, description_en,
      sort_order, is_active
    } = body;

    if (!key) {
      return c.json({ success: false, error: 'Key is required' }, { status: 400 });
    }

    await c.env.DB.prepare(`
      INSERT INTO services (
        key, icon, icon_emoji, icon_url, gradient_from, gradient_to,
        tags_ru, tags_fr, tags_en,
        title_ru, title_fr, title_en,
        subtitle_ru, subtitle_fr, subtitle_en,
        description_ru, description_fr, description_en,
        sort_order, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      key, icon || null, icon_emoji || null, icon_url || null, gradient_from || null, gradient_to || null,
      tags_ru || null, tags_fr || null, tags_en || null,
      title_ru || null, title_fr || null, title_en || null,
      subtitle_ru || null, subtitle_fr || null, subtitle_en || null,
      description_ru || null, description_fr || null, description_en || null,
      sort_order || 0, is_active !== false ? 1 : 0
    ).run();

    const { results } = await c.env.DB.prepare(
      `SELECT * FROM services WHERE id = (SELECT MAX(id) FROM services)`
    ).all();

    return c.json({ success: true, data: results[0] });
  } catch (error: any) {
    console.error('[Services POST] D1 Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.put('/api/services/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const {
      key, icon, icon_emoji, icon_url, gradient_from, gradient_to,
      tags_ru, tags_fr, tags_en,
      title_ru, title_fr, title_en,
      subtitle_ru, subtitle_fr, subtitle_en,
      description_ru, description_fr, description_en,
      sort_order, is_active
    } = body;

    await c.env.DB.prepare(`
      UPDATE services SET
        key = ?, icon = ?, icon_emoji = ?, icon_url = ?, gradient_from = ?, gradient_to = ?,
        tags_ru = ?, tags_fr = ?, tags_en = ?,
        title_ru = ?, title_fr = ?, title_en = ?,
        subtitle_ru = ?, subtitle_fr = ?, subtitle_en = ?,
        description_ru = ?, description_fr = ?, description_en = ?,
        sort_order = ?, is_active = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      key, icon || null, icon_emoji || null, icon_url || null, gradient_from || null, gradient_to || null,
      tags_ru || null, tags_fr || null, tags_en || null,
      title_ru || null, title_fr || null, title_en || null,
      subtitle_ru || null, subtitle_fr || null, subtitle_en || null,
      description_ru || null, description_fr || null, description_en || null,
      sort_order || 0, is_active !== false ? 1 : 0,
      id
    ).run();

    const { results } = await c.env.DB.prepare(
      `SELECT * FROM services WHERE id = ?`
    ).bind(id).all();

    return c.json({ success: true, data: results[0] });
  } catch (error: any) {
    console.error('[Services PUT] D1 Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.delete('/api/services/:id', async (c) => {
  const id = c.req.param('id');
  const { success } = await c.env.DB.prepare(`DELETE FROM services WHERE id = ?`).bind(id).run();
  return c.json({ success });
});

// ==================== BRANDS ====================

app.options('/api/translate', async (c) => {
  return c.json({ success: true });
});

app.post('/api/translate', async (c) => {
  console.log('[TRANSLATE] Request received');
  const body = await c.req.json();
  const { text, description, tags, fields, sourceLang, targetLangs } = body;

  console.log('[TRANSLATE] Body:', { text, description: description?.substring(0, 50), tags, fields, sourceLang, targetLangs });

  // Updated validation: allow text or fields, as long as targetLangs is provided
  if ((!text && !fields) || !Array.isArray(targetLangs) || targetLangs.length === 0) {
    console.log('[TRANSLATE] Validation failed');
    return c.json({ success: false, error: 'Missing text/fields or targetLangs' }, { status: 400 });
  }
  console.log('[TRANSLATE] Validation passed');

  if (!c.env.AI) {
    return c.json({
      success: false,
      error: 'AI service not configured. Add AI binding in Cloudflare dashboard.'
    }, { status: 500 });
  }

  const langNames: Record<string, string> = {
    ru: 'Russian',
    fr: 'French',
    en: 'English'
  };

  const sourceLangName = langNames[sourceLang] || 'Russian';
  const results: any = {};

  for (const lang of targetLangs) {
    const targetLangName = langNames[lang] || 'English';

    try {
      let prompt = '';

      if (fields) {
        prompt = `You are a professional translator for a decoration and building materials store.
Translate from ${sourceLangName} to ${targetLangName}.
Return ONLY valid JSON with the same keys as the input fields.

Fields to translate:
${JSON.stringify(fields, null, 2)}

IMPORTANT:
1. Return ONLY valid JSON.
2. Maintain the exact same keys.
3. Translate the values.
4. No markdown, no explanations, only JSON.`;
      } else if (tags === 'product_name') {
        const hasDescription = description && description.trim().length > 0;

        if (hasDescription) {
          prompt = `You are a professional translator for a building materials store.

Translate from ${sourceLangName} to ${targetLangName}.

### EXAMPLE FORMAT:
Input Name: "Краска белая"
Input Description: "Матовая краска для стен.\nВысокое качество."
Output JSON:
{"name": "Peinture blanche", "description": "Peinture mate pour murs.\\nHaute qualité."}

### YOUR TASK:
Product name:
${text}

Product description:
${description}

IMPORTANT:
1. Return ONLY valid JSON.
2. Use "\\n" for newlines in the description.
3. Translate both "name" and "description".
4. Return format: {"name": "...", "description": "..."}

No markdown, no explanations, only JSON.`;
        } else {
          prompt = `You are a professional translator for a building materials store.

Translate this product name from ${sourceLangName} to ${targetLangName}:
${text}

Return ONLY valid JSON:
{"name": "translated name here"}

No markdown, no explanations, only JSON.`;
        }
      } else if (text && tags) {
        prompt = `You are a professional translator for a decoration and building materials store. 
        
Translate from ${sourceLangName} to ${targetLangName}.

Text to translate:
${text}

Tags (comma-separated list) to translate:
${tags}

Return ONLY valid JSON:
{"description": "...", "tags": "..."}

Keep tags as a comma-separated list in the same order. If no tags, return empty string for tags.`;
      } else if (tags) {
        prompt = `You are a professional translator for a decoration and building materials store. 
        
Translate these tags from ${sourceLangName} to ${targetLangName}:
${tags}

Return ONLY valid JSON:
{"tags": "..."}

Keep tags as a comma-separated list in the same order.`;
      } else {
        prompt = `You are a professional translator for a decoration and building materials store. Translate from ${sourceLangName} to ${targetLangName}. Keep the same tone and format. Return ONLY valid JSON: {"description": "..."}. If there's no description to translate, return empty string for description.`;
      }

      console.log(`[TRANSLATE] Calling AI for ${lang}, has fields:`, !!fields);
      const response = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
        messages: [
          { role: 'system', content: 'You are a professional translator. Return ONLY valid JSON, no markdown, no code blocks.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1024,
      });

      let translated: any = {};

      const getJSON = (str: string) => {
        const match = str.match(/\{[\s\S]*\}/);
        return match ? match[0] : str;
      };

      if (typeof response === 'object' && response.response) {
        const jsonStr = getJSON(response.response);
        try {
          translated = JSON.parse(jsonStr);
        } catch {
          const cleaned = jsonStr.replace(/```json\s*|\s*```/g, '');
          try {
            translated = JSON.parse(cleaned);
          } catch (e) {
            console.error(`[TRANSLATE] Failed to parse JSON for ${lang}:`, e, jsonStr);
          }
        }
      } else {
        const textContent = typeof response === 'object' ? JSON.stringify(response) : response;
        const jsonStr = getJSON(textContent);
        try {
          translated = JSON.parse(jsonStr);
        } catch (e) {
          console.error(`[TRANSLATE] Failed to parse JSON for ${lang}:`, e, jsonStr);
        }
      }

      if (fields) {
        results[lang] = translated;
      } else {
        results[lang] = {
          name: (translated.name || '').trim(),
          description: (translated.description || '').replace(/\\n/g, '\n'),
          tags: translated.tags || ''
        };
      }
    } catch (err: any) {
      return c.json({ success: false, error: err.message }, 500);
    }
  }

  return c.json({ success: true, data: results });
});

// ==================== IMAGE UPLOAD (R2) ====================

app.post('/api/upload', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'products';

    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const path = `${folder}/${fileName}`;

    await c.env.ASSETS.put(path, arrayBuffer, {
      httpMetadata: { contentType: file.type || 'application/octet-stream' },
    });

    const publicUrl = `https://yasndeco-api.andrey-gaffer.workers.dev/images/${path}`;

    return c.json({
      success: true,
      data: { url: publicUrl, path, filename: fileName }
    });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// ==================== CATEGORIES API ====================

app.get('/api/categories', async (c) => {
  const parentId = c.req.query('parent_id');

  let query = `
    WITH RECURSIVE category_tree AS (
      SELECT id, id as root_id FROM categories
      UNION ALL
      SELECT c.id, ct.root_id FROM categories c
      JOIN category_tree ct ON c.parent_id = ct.id
    ),
    product_counts AS (
      SELECT ct.root_id, COUNT(p.id) as count
      FROM category_tree ct
      LEFT JOIN products p ON p.category_id = ct.id
      GROUP BY ct.root_id
    )
    SELECT 
      c.id, c.slug, c.icon, c.image_url, c.parent_id, c.sort_order, c.created_at,
      c.name_ru, c.name_fr, c.name_en,
      c.desc_ru, c.desc_fr, c.desc_en,
      COALESCE(pc.count, 0) as product_count
    FROM categories c
    LEFT JOIN product_counts pc ON c.id = pc.root_id
  `;

  const bindings: any[] = [];

  if (parentId) {
    query += ' WHERE c.parent_id = ?';
    bindings.push(parentId);
  }

  query += ' ORDER BY c.sort_order';

  const { results } = await c.env.DB.prepare(query).bind(...bindings).all();
  return c.json({ success: true, data: results });
});

app.get('/api/categories/:id', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(`
    SELECT 
      id, slug, icon, image_url, parent_id, sort_order, created_at,
      name_ru, name_fr, name_en,
      desc_ru, desc_fr, desc_en
    FROM categories 
    WHERE id = ?
  `).bind(id).all();

  if (results.length === 0) {
    return c.json({ success: false, error: 'Category not found' }, { status: 404 });
  }

  return c.json({ success: true, data: results[0] });
});

app.get('/api/categories/:id/products', async (c) => {
  const id = c.req.param('id');

  // First check if category exists
  const { results: categoryCheck } = await c.env.DB.prepare(
    `SELECT id FROM categories WHERE id = ?`
  ).bind(id).all();

  if (categoryCheck.length === 0) {
    return c.json({ success: false, error: 'Category not found' }, { status: 404 });
  }

  // Get all category IDs (current category and all subcategories)
  const { results: categoryIds } = await c.env.DB.prepare(`
    WITH RECURSIVE category_tree AS (
      SELECT id FROM categories WHERE id = ?
      UNION ALL
      SELECT c.id FROM categories c
      INNER JOIN category_tree ct ON c.parent_id = ct.id
    )
    SELECT id FROM category_tree
  `).bind(id).all();

  const categoryIdList = categoryIds.map((row: any) => row.id);
  const placeholders = categoryIdList.map(() => '?').join(',');

  // Get products for this category and its subcategories
  const { results: products } = await c.env.DB.prepare(`
    SELECT 
      p.id,
      p.sku,
      p.price,
      p.stock,
      p.image_url,
      p.name_ru,
      p.name_fr,
      p.name_en,
      p.is_popular,
      b.name as brand_name
    FROM products p
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.category_id IN (${placeholders})
    ORDER BY p.created_at DESC
  `).bind(...categoryIdList).all();

  return c.json({ success: true, data: products });
});

app.post('/api/categories', async (c) => {
  const body = await c.req.json();
  const { slug, icon, image_url, parent_id, sort_order, name_ru, desc_ru, name_fr, desc_fr, name_en, desc_en } = body;

  try {
    const insertResult = await c.env.DB.prepare(`
      INSERT INTO categories (slug, icon, image_url, parent_id, sort_order, name_ru, name_fr, name_en, desc_ru, desc_fr, desc_en)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      slug,
      icon || null,
      image_url || null,
      parent_id || null,
      sort_order || 0,
      name_ru || null,
      name_fr || null,
      name_en || null,
      desc_ru || null,
      desc_fr || null,
      desc_en || null
    ).run();

    const categoryId = (insertResult.meta.last_row_id as number);

    // Return the created category
    const { results } = await c.env.DB.prepare(`
      SELECT 
        id, slug, icon, image_url, parent_id, sort_order, created_at,
        name_ru, name_fr, name_en,
        desc_ru, desc_fr, desc_en
      FROM categories 
      WHERE id = ?
    `).bind(categoryId).all();

    return c.json({ success: true, data: results[0] });
  } catch (error: any) {
    console.error('[Categories POST] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.put('/api/categories/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { slug, icon, image_url, parent_id, sort_order, name_ru, desc_ru, name_fr, desc_fr, name_en, desc_en } = body;

  try {
    await c.env.DB.prepare(`
      UPDATE categories SET 
        slug = ?, icon = ?, image_url = ?, parent_id = ?, sort_order = ?,
        name_ru = ?, name_fr = ?, name_en = ?,
        desc_ru = ?, desc_fr = ?, desc_en = ?
      WHERE id = ?
    `).bind(
      slug,
      icon || null,
      image_url || null,
      parent_id || null,
      sort_order || 0,
      name_ru || null,
      name_fr || null,
      name_en || null,
      desc_ru || null,
      desc_fr || null,
      desc_en || null,
      id
    ).run();

    // Return the updated category
    const { results } = await c.env.DB.prepare(`
      SELECT 
        id, slug, icon, image_url, parent_id, sort_order, created_at,
        name_ru, name_fr, name_en,
        desc_ru, desc_fr, desc_en
      FROM categories 
      WHERE id = ?
    `).bind(id).all();

    return c.json({ success: true, data: results[0] });
  } catch (error: any) {
    console.error('[Categories PUT] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.delete('/api/categories/:id', async (c) => {
  const id = c.req.param('id');
  const { success } = await c.env.DB.prepare(`DELETE FROM categories WHERE id = ?`).bind(id).run();
  return c.json({ success });
});

// ==================== HERO SLIDES API ====================

app.get('/api/hero-slides', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT id, badge_ru, badge_fr, badge_en, title_ru, title_fr, title_en,
           subtitle_ru, subtitle_fr, subtitle_en, sort_order, is_active
    FROM hero_slides 
    WHERE is_active = 1 
    ORDER BY sort_order
  `).all();
  return c.json({ success: true, data: results });
});

app.get('/api/admin/hero-slides', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT id, badge_ru, badge_fr, badge_en, title_ru, title_fr, title_en,
           subtitle_ru, subtitle_fr, subtitle_en, sort_order, is_active, created_at, updated_at
    FROM hero_slides 
    ORDER BY sort_order
  `).all();
  return c.json({ success: true, data: results });
});

app.post('/api/hero-slides', async (c) => {
  const body = await c.req.json();
  const { badge_ru, badge_fr, badge_en, title_ru, title_fr, title_en, subtitle_ru, subtitle_fr, subtitle_en, sort_order, is_active } = body;

  try {
    const { success } = await c.env.DB.prepare(`
      INSERT INTO hero_slides (badge_ru, badge_fr, badge_en, title_ru, title_fr, title_en, subtitle_ru, subtitle_fr, subtitle_en, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(badge_ru || null, badge_fr || null, badge_en || null, title_ru, title_fr, title_en, subtitle_ru, subtitle_fr, subtitle_en, sort_order || 0, is_active !== false ? 1 : 0).run();

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.put('/api/hero-slides/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { badge_ru, badge_fr, badge_en, title_ru, title_fr, title_en, subtitle_ru, subtitle_fr, subtitle_en, sort_order, is_active } = body;

  try {
    await c.env.DB.prepare(`
      UPDATE hero_slides SET 
        badge_ru = ?, badge_fr = ?, badge_en = ?, title_ru = ?, title_fr = ?, title_en = ?,
        subtitle_ru = ?, subtitle_fr = ?, subtitle_en = ?, sort_order = ?, is_active = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).bind(badge_ru || null, badge_fr || null, badge_en || null, title_ru, title_fr, title_en, subtitle_ru, subtitle_fr, subtitle_en, sort_order || 0, is_active !== false ? 1 : 0, id).run();

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.delete('/api/hero-slides/:id', async (c) => {
  const id = c.req.param('id');
  const { success } = await c.env.DB.prepare(`DELETE FROM hero_slides WHERE id = ?`).bind(id).run();
  return c.json({ success });
});

// ==================== SLIDES (SLOGANS) API ====================

app.get('/api/admin/slides', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT id, "key", slide_index, 
           label_ru, label_fr, label_en,
           title_ru, title_fr, title_en,
           content_ru, content_fr, content_en,
           is_active, created_at, updated_at,
           label_size, label_weight, label_transform, label_tracking, label_color,
           title_size, title_weight, title_italic, title_transform, title_color,
           content_size, content_weight, content_color
    FROM slides 
    ORDER BY slide_index
  `).all();
  return c.json({ success: true, data: results });
});

app.post('/api/admin/slides', async (c) => {
  try {
    const body = await c.req.json();
    const {
      id, key, slide_index,
      label_ru, label_fr, label_en,
      title_ru, title_fr, title_en,
      content_ru, content_fr, content_en,
      is_active,
      label_size, label_weight, label_transform, label_tracking, label_color,
      title_size, title_weight, title_italic, title_transform, title_color,
      content_size, content_weight, content_color
    } = body;

    if (id) {
      await c.env.DB.prepare(`
        UPDATE slides SET
          "key" = ?, slide_index = ?,
          label_ru = ?, label_fr = ?, label_en = ?,
          title_ru = ?, title_fr = ?, title_en = ?,
          content_ru = ?, content_fr = ?, content_en = ?,
          is_active = ?,
          label_size = ?, label_weight = ?, label_transform = ?, label_tracking = ?, label_color = ?,
          title_size = ?, title_weight = ?, title_italic = ?, title_transform = ?, title_color = ?,
          content_size = ?, content_weight = ?, content_color = ?,
          updated_at = datetime('now')
        WHERE id = ?
      `).bind(
        key, slide_index,
        label_ru || '', label_fr || '', label_en || '',
        title_ru || '', title_fr || '', title_en || '',
        content_ru || '', content_fr || '', content_en || '',
        is_active !== false ? 1 : 0,
        label_size || 'text-xs', label_weight || 'font-bold', label_transform || 'uppercase', label_tracking || 'tracking-widest', label_color || '#FF6B00',
        title_size || 'text-4xl', title_weight || 'font-black', title_italic ? 1 : 0, title_transform || 'uppercase', title_color || '#FFFFFF',
        content_size || 'text-sm', content_weight || 'font-normal', content_color || '#9CA3AF',
        id
      ).run();
    } else {
      await c.env.DB.prepare(`
        INSERT INTO slides (
          "key", slide_index,
          label_ru, label_fr, label_en,
          title_ru, title_fr, title_en,
          content_ru, content_fr, content_en,
          is_active,
          label_size, label_weight, label_transform, label_tracking, label_color,
          title_size, title_weight, title_italic, title_transform, title_color,
          content_size, content_weight, content_color
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        key, slide_index,
        label_ru || '', label_fr || '', label_en || '',
        title_ru || '', title_fr || '', title_en || '',
        content_ru || '', content_fr || '', content_en || '',
        is_active !== false ? 1 : 0,
        label_size || 'text-xs', label_weight || 'font-bold', label_transform || 'uppercase', label_tracking || 'tracking-widest', label_color || '#FF6B00',
        title_size || 'text-4xl', title_weight || 'font-black', title_italic ? 1 : 0, title_transform || 'uppercase', title_color || '#FFFFFF',
        content_size || 'text-sm', content_weight || 'font-normal', content_color || '#9CA3AF'
      ).run();
    }

    return c.json({ success: true });
  } catch (error: any) {
    console.error('[Slides POST] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

// Migration endpoint for slides table
app.post('/api/admin/migrate/slides', async (c) => {
  try {
    await c.env.DB.prepare(`DROP TABLE IF EXISTS slides`).run();
    
    await c.env.DB.prepare(`
      CREATE TABLE slides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        "key" TEXT UNIQUE,
        slide_index INTEGER NOT NULL,
        label_ru TEXT DEFAULT '',
        label_fr TEXT DEFAULT '',
        label_en TEXT DEFAULT '',
        title_ru TEXT DEFAULT '',
        title_fr TEXT DEFAULT '',
        title_en TEXT DEFAULT '',
        content_ru TEXT DEFAULT '',
        content_fr TEXT DEFAULT '',
        content_en TEXT DEFAULT '',
        is_active INTEGER DEFAULT 1,
        label_size TEXT DEFAULT 'text-xs',
        label_weight TEXT DEFAULT 'font-bold',
        label_transform TEXT DEFAULT 'uppercase',
        label_tracking TEXT DEFAULT 'tracking-widest',
        label_color TEXT DEFAULT '#FF6B00',
        title_size TEXT DEFAULT 'text-4xl',
        title_weight TEXT DEFAULT 'font-black',
        title_italic INTEGER DEFAULT 0,
        title_transform TEXT DEFAULT 'uppercase',
        title_color TEXT DEFAULT '#FFFFFF',
        content_size TEXT DEFAULT 'text-sm',
        content_weight TEXT DEFAULT 'font-normal',
        content_color TEXT DEFAULT '#9CA3AF',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    return c.json({ success: true, message: 'Slides table created' });
  } catch (error: any) {
    console.error('[Slides Migration] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// ==================== CALCULATOR MATERIALS API ====================

app.get('/api/calculator-materials', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT id, name_ru, name_fr, name_en, consumption, unit, coats, sort_order, is_active
    FROM calculator_materials 
    WHERE is_active = 1 
    ORDER BY sort_order
  `).all();
  return c.json({ success: true, data: results });
});

app.get('/api/admin/calculator-materials', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT id, name_ru, name_fr, name_en, consumption, unit, coats, sort_order, is_active, created_at
    FROM calculator_materials 
    ORDER BY sort_order
  `).all();
  return c.json({ success: true, data: results });
});

app.post('/api/calculator-materials', async (c) => {
  const body = await c.req.json();
  const { name_ru, name_fr, name_en, consumption, unit, coats, sort_order, is_active } = body;

  try {
    const { success } = await c.env.DB.prepare(`
      INSERT INTO calculator_materials (name_ru, name_fr, name_en, consumption, unit, coats, sort_order, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(name_ru, name_fr, name_en, consumption, unit, coats || 1, sort_order || 0, is_active !== false ? 1 : 0).run();

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.put('/api/calculator-materials/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { name_ru, name_fr, name_en, consumption, unit, coats, sort_order, is_active } = body;

  try {
    await c.env.DB.prepare(`
      UPDATE calculator_materials SET 
        name_ru = ?, name_fr = ?, name_en = ?, consumption = ?, unit = ?, coats = ?, sort_order = ?, is_active = ?
      WHERE id = ?
    `).bind(name_ru, name_fr, name_en, consumption, unit, coats || 1, sort_order || 0, is_active !== false ? 1 : 0, id).run();

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

app.delete('/api/calculator-materials/:id', async (c) => {
  const id = c.req.param('id');
  const { success } = await c.env.DB.prepare(`DELETE FROM calculator_materials WHERE id = ?`).bind(id).run();
  return c.json({ success });
});

// ==================== SITE CONFIG API ====================

app.get('/api/site-config', async (c) => {
  const { results } = await c.env.DB.prepare(`
    SELECT key, value_ru, value_fr, value_en, type
    FROM site_config
  `).all();

  const config: Record<string, any> = {};
  results.forEach((item: any) => {
    config[item.key] = {
      ru: item.value_ru,
      fr: item.value_fr,
      en: item.value_en,
      type: item.type
    };
  });

  return c.json({ success: true, data: config });
});

app.post('/api/site-config', async (c) => {
  const body = await c.req.json();
  const { key, value_ru, value_fr, value_en, type } = body;

  try {
    await c.env.DB.prepare(`
      INSERT INTO site_config (key, value_ru, value_fr, value_en, type)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value_ru = ?, value_fr = ?, value_en = ?, type = ?, updated_at = datetime('now')
    `).bind(key, value_ru, value_fr, value_en, type || 'text', value_ru, value_fr, value_en, type || 'text').run();

    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, error: error.message }, { status: 400 });
  }
});

// ==================== MIGRATION ====================
app.post('/api/migrate', async (c) => {
  const schema = `
  CREATE TABLE IF NOT EXISTS brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      logo_url TEXT,
      description_ru TEXT,
      description_fr TEXT,
      description_en TEXT,
      hide_name INTEGER DEFAULT 0,
      bg_light_color TEXT,
      bg_light_opacity INTEGER,
      bg_light_enabled INTEGER DEFAULT 0,
      bg_dark_color TEXT,
      bg_dark_opacity INTEGER,
      bg_dark_enabled INTEGER DEFAULT 0,
      border_light_enabled INTEGER DEFAULT 0,
      border_light_color TEXT,
      border_light_opacity INTEGER DEFAULT 100,
      border_dark_enabled INTEGER DEFAULT 0,
      border_dark_color TEXT,
      border_dark_opacity INTEGER DEFAULT 100,
      created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT,
      image_url TEXT,
      parent_id INTEGER,
      sort_order INTEGER DEFAULT 0,
      name_ru TEXT,
      name_fr TEXT,
      name_en TEXT,
      desc_ru TEXT,
    desc_fr TEXT,
    desc_en TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

  CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT UNIQUE NOT NULL,
      barcode TEXT UNIQUE,
      price DECIMAL(10, 2) NOT NULL DEFAULT 0,
      stock INTEGER DEFAULT 0,
      brand_id INTEGER,
      category_id INTEGER,
      is_popular INTEGER DEFAULT 0,
      announcement_date TEXT,
      image_url TEXT,
      name_ru TEXT,
      name_fr TEXT,
      name_en TEXT,
      desc_ru TEXT,
      desc_fr TEXT,
      desc_en TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (brand_id) REFERENCES brands(id),
      FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
  CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
  CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
  CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);

  CREATE TABLE IF NOT EXISTS stock_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('IN', 'OUT', 'SALE_OFFICIAL', 'SALE_CASH')),
      quantity INTEGER NOT NULL,
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_stock_logs_product ON stock_logs(product_id);
  CREATE INDEX IF NOT EXISTS idx_stock_logs_type ON stock_logs(type);
  CREATE INDEX IF NOT EXISTS idx_stock_logs_created ON stock_logs(created_at);

  CREATE TABLE IF NOT EXISTS internal_sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT UNIQUE NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_internal_sales_order ON internal_sales(order_id);
  CREATE INDEX IF NOT EXISTS idx_internal_sales_created ON internal_sales(created_at);

CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    icon TEXT,
    icon_emoji TEXT,
    icon_url TEXT,
    gradient_from TEXT,
    gradient_to TEXT,
    tags_ru TEXT,
    tags_fr TEXT,
    tags_en TEXT,
    title_ru TEXT,
    title_fr TEXT,
    title_en TEXT,
    subtitle_ru TEXT,
    subtitle_fr TEXT,
    subtitle_en TEXT,
    description_ru TEXT,
    description_fr TEXT,
    description_en TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_services_key ON services(key);
CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order);

CREATE TABLE IF NOT EXISTS hero_slides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    badge_ru TEXT,
    badge_fr TEXT,
    badge_en TEXT,
    title_ru TEXT,
    title_fr TEXT,
    title_en TEXT,
    subtitle_ru TEXT,
    subtitle_fr TEXT,
    subtitle_en TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS calculator_materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ru TEXT NOT NULL,
    name_fr TEXT NOT NULL,
    name_en TEXT NOT NULL,
    consumption REAL NOT NULL,
    unit TEXT NOT NULL,
    coats INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value_ru TEXT,
    value_fr TEXT,
    value_en TEXT,
    type TEXT DEFAULT 'text',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS carts (
    id TEXT PRIMARY KEY,
    user_session TEXT NOT NULL,
    items TEXT NOT NULL DEFAULT '[]',
    total_items INTEGER DEFAULT 0,
    total_price DECIMAL(10, 2) DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    google_id TEXT,
    avatar_url TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    last_login TEXT,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    items TEXT NOT NULL DEFAULT '[]',
    total_price DECIMAL(10, 2) DEFAULT 0,
    status TEXT DEFAULT 'pending',
    shipping_address TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS client_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    type TEXT DEFAULT 'shipping',
    name TEXT,
    address TEXT,
    city TEXT,
    postal_code TEXT,
    country TEXT,
    phone TEXT,
    is_default INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS translations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    namespace TEXT DEFAULT 'common',
    value_ru TEXT,
    value_fr TEXT,
    value_en TEXT,
    description TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_hero_slides_sort ON hero_slides(sort_order);
  CREATE INDEX IF NOT EXISTS idx_calculator_materials_sort ON calculator_materials(sort_order);
  CREATE INDEX IF NOT EXISTS idx_site_config_key ON site_config(key);
  CREATE INDEX IF NOT EXISTS idx_carts_session ON carts(user_session);
  CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
  CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_id);
  CREATE INDEX IF NOT EXISTS idx_client_addresses_client ON client_addresses(client_id);
  CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(key);
  CREATE INDEX IF NOT EXISTS idx_translations_namespace ON translations(namespace);
  `;

  try {
    const statements = schema.split(';').filter(s => s.trim());
    for (const statement of statements) {
      if (statement.trim()) {
        await c.env.DB.prepare(statement).run();
      }
    }

    const existingCategories = await c.env.DB.prepare(`SELECT COUNT(*) as count FROM categories`).all();
    if (existingCategories.results[0].count === 0) {
      await c.env.DB.prepare(`
        INSERT INTO categories (slug, icon, sort_order, name_ru, name_fr, name_en, desc_ru, desc_fr, desc_en) VALUES
        ('peinture-finition', '🎨', 1, 'Краски и отделочные материалы', 'Peintures et finitions', 'Paints and finishes', 'Все виды красок и декоративных покрытий', 'Tous types de peinture et revêtements décoratifs', 'All types of paints and decorative coatings'),
        ('colles-mastics', '🧱', 2, 'Клеи и герметики', 'Colles et mastics', 'Adhesives and sealants', 'Клеевые составы и герметики для всех видов работ', 'Colles et mastics pour tous les types de travaux', 'Adhesives and sealants for all types of work'),
        ('outillage-peintre', '🖌️', 3, 'Инструменты маляра', 'Outils du peintre', 'Painter tools', 'Кисти, валики, шпатели и другой малярный инструмент', 'Pinceaux, rouleaux, spatules et autres outils de peintre', 'Brushes, rollers, spatulas and other painter tools'),
        ('outillage-carreleur', '🔧', 4, 'Инструменты плиточника', 'Outils du carreleur', 'Tiler tools', 'Инструменты для укладки плитки', 'Outils pour la pose de carreaux', 'Tools for tile laying'),
        ('preparation-sols', '🧱', 5, 'Подготовка полов', 'Préparation des sols', 'Floor preparation', 'Материалы для подготовки и выравнивания полов', 'Matériaux pour la préparation et le nivellement des sols', 'Materials for floor preparation and leveling'),
        ('fixation-visserie', '🔩', 6, 'Крепёж и метизы', 'Fixation et visserie', 'Fasteners and hardware', 'Саморезы, дюбели и другой крепёж', 'Vis, chevilles et autre quincaillerie', 'Screws, dowels and other fasteners')
      `).run();
    }

    const existingHeroSlides = await c.env.DB.prepare(`SELECT COUNT(*) as count FROM hero_slides`).all();
    if (existingHeroSlides.results[0].count === 0) {
      await c.env.DB.prepare(`
        INSERT INTO hero_slides (badge_ru, badge_fr, badge_en, title_ru, title_fr, title_en, subtitle_ru, subtitle_fr, subtitle_en, sort_order, is_active) VALUES
        ('Livraison Express disponible', 'Livraison Express disponible', 'Express Delivery Available', 
         'Материалы строительства <span class="text-[#FF6B00]">с быстрой доставкой</span>', 
         'Matériaux de construction <span class="text-[#FF6B00]">avec livraison rapide</span>', 
         'Construction materials <span class="text-[#FF6B00]">with fast delivery</span>', 
         'Базируясь в Гролэ, мы обслуживаем профессионалов и частных лиц в Монморанси и по всему региону Иль-де-Франс. Промышленное качество, местный сервис.',
         "Basé à Groslay, nous servons les professionnels et particuliers à Montmorency et dans toute l'Île-de-France. Qualité industrielle, service local.",
         'Based in Groslay, we serve professionals and individuals in Montmorency and throughout Île-de-France. Industrial quality, local service.', 1, 1),
        ('Qualité Professionnelle', 'Qualité Professionnelle', 'Professional Quality', 
         'МЕСТНЫЙ СЕРВИС <span class="text-[#FF6B00]">В ИЛЬ-ДЕ-ФРАНС</span>', 
         'SERVICE LOCAL <span class="text-[#FF6B00]">EN ÎLE-DE-FRANCE</span>', 
         'LOCAL SERVICE <span class="text-[#FF6B00]">IN ÎLE-DE-FRANCE</span>', 
         'Конкурентоспособные цены для профессионалов и частных лиц', 'Prix compétitifs pour les pros et les particuliers', 'Competitive prices for professionals and individuals', 2, 1),
        ('Conseil Expert', 'Conseil Expert', 'Expert Advice', 
         'ВСЯ ГАММА <span class="text-[#FF6B00]">МАТЕРИАЛОВ</span>', 
         'TOUTE GAMME <span class="text-[#FF6B00]">DE MATÉRIAUX</span>', 
         'FULL RANGE <span class="text-[#FF6B00]">OF MATERIALS</span>', 
         'От покрытий до инструментов - всё для ваших проектов', 'Des revêtements aux outils, tout pour vos projets', 'From coatings to tools, everything for your projects', 3, 1)
      `).run();
    }

    const existingMaterials = await c.env.DB.prepare(`SELECT COUNT(*) as count FROM calculator_materials`).all();
    if (existingMaterials.results[0].count === 0) {
      await c.env.DB.prepare(`
        INSERT INTO calculator_materials (name_ru, name_fr, name_en, consumption, unit, coats, sort_order, is_active) VALUES
        ('Краска акриловая', 'Peinture acrylique', 'Acrylic paint', 0.15, 'litres/m²', 2, 1, 1),
        ('Краска масляная', 'Peinture glycéro', 'Oil paint', 0.12, 'litres/m²', 2, 2, 1),
        ('Грунтовка', 'Sous-couche', 'Primer', 0.10, 'litres/m²', 1, 3, 1),
        ('Плитка настенная', 'Carrelage mural', 'Wall tile', 1.1, 'm²/m²', 1, 4, 1),
        ('Плитка напольная', 'Carrelage sol', 'Floor tile', 1.05, 'm²/m²', 1, 5, 1),
        ('Клей для плитки', 'Colle à carrelage', 'Tile adhesive', 3.5, 'kg/m²', 1, 6, 1),
        ('Выравнивание пола', 'Ragréage sol', 'Floor leveling', 1.5, 'kg/m²/mm', 1, 7, 1),
        ('Шпатлевка для выравнивания', 'Enduit de lissage', 'Leveling putty', 1.0, 'kg/m²/mm', 1, 8, 1),
        ('Ремонтный раствор', 'Mortier de réparation', 'Repair mortar', 1.9, 'kg/m²/mm', 1, 9, 1)
      `).run();
    }

    const existingConfig = await c.env.DB.prepare(`SELECT COUNT(*) as count FROM site_config`).all();
    if (existingConfig.results[0].count === 0) {
      await c.env.DB.prepare(`
        INSERT INTO site_config (key, value_ru, value_fr, value_en, type) VALUES
        ('phone1', '+33 1 23 45 67 89', '+33 1 23 45 67 89', '+33 1 23 45 67 89', 'text'),
        ('phone2', '+33 6 12 34 56 78', '+33 6 12 34 56 78', '+33 6 12 34 56 78', 'text'),
        ('email', 'contact@yansdeco.fr', 'contact@yansdeco.fr', 'contact@yansdeco.fr', 'text'),
        ('address', 'Groslay, Île-de-France', 'Groslay, Île-de-France', 'Groslay, Île-de-France', 'text')
      `).run();
    }

    return c.json({ success: true, message: 'Migration completed' });
  } catch (error: any) {
    console.error('[Migration] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.get('/api/cart', async (c) => {
  const sessionId = c.req.header('X-Session-ID');

  if (!sessionId) {
    return c.json({ success: true, data: { sessionId: '', items: [], totalItems: 0, totalPrice: 0 } });
  }

  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM carts WHERE id = ?
    `).bind(sessionId).all();

    if (results.length > 0) {
      const cart = results[0];
      return c.json({
        success: true,
        data: {
          sessionId,
          items: JSON.parse(cart.items || '[]'),
          totalItems: cart.total_items,
          totalPrice: parseFloat(cart.total_price || '0')
        }
      });
    }

    return c.json({ success: true, data: { sessionId, items: [], totalItems: 0, totalPrice: 0 } });
  } catch (error: any) {
    console.error('[Cart] Get error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.post('/api/cart', async (c) => {
  const sessionId = c.req.header('X-Session-ID');

  if (!sessionId) {
    return c.json({ success: false, error: 'Session ID required' }, { status: 400 });
  }

  try {
    const body = await c.req.json();
    const { items } = body;

    const totalItems = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    const totalPrice = items.reduce((sum: number, item: any) => sum + (item.price * (item.quantity || 1)), 0);

    await c.env.DB.prepare(`
      INSERT INTO carts (id, user_session, items, total_items, total_price, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET
        items = excluded.items,
        total_items = excluded.total_items,
        total_price = excluded.total_price,
        updated_at = datetime('now')
    `).bind(sessionId, sessionId, JSON.stringify(items), totalItems, totalPrice).run();

    return c.json({
      success: true,
      data: { sessionId, items, totalItems, totalPrice }
    });
  } catch (error: any) {
    console.error('[Cart] Save error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.delete('/api/cart', async (c) => {
  const sessionId = c.req.header('X-Session-ID');

  if (!sessionId) {
    return c.json({ success: true, data: { sessionId: '', items: [], totalItems: 0, totalPrice: 0 } });
  }

  try {
    await c.env.DB.prepare(`DELETE FROM carts WHERE id = ?`).bind(sessionId).run();

    return c.json({
      success: true,
      data: { sessionId: '', items: [], totalItems: 0, totalPrice: 0 }
    });
  } catch (error: any) {
    console.error('[Cart] Delete error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// ============ CLIENTS API ============

app.post('/api/clients/register', async (c) => {
  try {
    const body = await c.req.json();
    const { name, phone, email, password } = body;

    if (!name || !email || !password) {
      return c.json({ success: false, error: 'Name, email and password are required' }, { status: 400 });
    }

    const existingClient = await c.env.DB.prepare(
      'SELECT id FROM clients WHERE email = ?'
    ).bind(email).first();

    if (existingClient) {
      return c.json({ success: false, error: 'Email already registered' }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const result = await c.env.DB.prepare(`
      INSERT INTO clients (name, phone, email, password_hash, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).bind(name, phone || null, email, passwordHash).run();

    const clientId = result.meta?.last_row_id;

    const token = generateToken(clientId.toString());

    return c.json({
      success: true,
      data: {
        client: {
          id: clientId,
          name,
          phone,
          email,
          created_at: new Date().toISOString()
        },
        token
      }
    });
  } catch (error: any) {
    console.error('[Client] Register error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.post('/api/clients/login', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
      return c.json({ success: false, error: 'Email and password are required' }, { status: 400 });
    }

    const client = await c.env.DB.prepare(
      'SELECT * FROM clients WHERE email = ? AND is_active = 1'
    ).bind(email).first();

    if (!client) {
      return c.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordValid = await verifyPassword(password, client.password_hash);

    if (!passwordValid) {
      return c.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    await c.env.DB.prepare(`
      UPDATE clients SET last_login = datetime('now') WHERE id = ?
    `).bind(client.id).run();

    const token = generateToken(client.id.toString());

    return c.json({
      success: true,
      data: {
        client: {
          id: client.id,
          name: client.name,
          phone: client.phone,
          email: client.email,
          avatar_url: client.avatar_url,
          created_at: client.created_at,
          last_login: client.last_login
        },
        token
      }
    });
  } catch (error: any) {
    console.error('[Client] Login error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.post('/api/clients/google', async (c) => {
  try {
    const body = await c.req.json();
    const { googleId, name, email, avatarUrl } = body;

    if (!googleId || !email) {
      return c.json({ success: false, error: 'Google ID and email are required' }, { status: 400 });
    }

    let client = await c.env.DB.prepare(
      'SELECT * FROM clients WHERE google_id = ? OR email = ?'
    ).bind(googleId, email).first();

    if (client) {
      await c.env.DB.prepare(`
        UPDATE clients SET last_login = datetime('now'), google_id = ?, avatar_url = ? WHERE id = ?
      `).bind(googleId, avatarUrl || null, client.id).run();
    } else {
      const result = await c.env.DB.prepare(`
        INSERT INTO clients (name, email, google_id, avatar_url, created_at, last_login)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      `).bind(name || email.split('@')[0], email, googleId, avatarUrl || null).run();

      client = {
        id: result.meta?.last_row_id,
        name: name || email.split('@')[0],
        email,
        avatar_url: avatarUrl,
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
    }

    const token = generateToken(client.id.toString());

    return c.json({
      success: true,
      data: {
        client: {
          id: client.id,
          name: client.name,
          phone: client.phone,
          email: client.email,
          avatar_url: client.avatar_url,
          created_at: client.created_at,
          last_login: client.last_login
        },
        token
      }
    });
  } catch (error: any) {
    console.error('[Client] Google auth error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.get('/api/clients/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return c.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clientId = verifyToken(token);
    if (!clientId) {
      return c.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const client = await c.env.DB.prepare(
      'SELECT id, name, phone, email, avatar_url, created_at, last_login FROM clients WHERE id = ? AND is_active = 1'
    ).bind(parseInt(clientId)).first();

    if (!client) {
      return c.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    return c.json({ success: true, data: { client } });
  } catch (error: any) {
    console.error('[Client] Get profile error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.put('/api/clients/me', async (c) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return c.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clientId = verifyToken(token);
    if (!clientId) {
      return c.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const body = await c.req.json();
    const { name, phone } = body;

    await c.env.DB.prepare(`
      UPDATE clients SET name = ?, phone = ? WHERE id = ?
    `).bind(name, phone || null, parseInt(clientId)).run();

    return c.json({ success: true, message: 'Profile updated' });
  } catch (error: any) {
    console.error('[Client] Update profile error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.get('/api/clients/me/orders', async (c) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return c.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clientId = verifyToken(token);
    if (!clientId) {
      return c.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM orders WHERE client_id = ? ORDER BY created_at DESC
    `).bind(parseInt(clientId)).all();

    const orders = results.map((order: any) => ({
      ...order,
      items: JSON.parse(order.items || '[]')
    }));

    return c.json({ success: true, data: { orders } });
  } catch (error: any) {
    console.error('[Client] Get orders error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.get('/api/clients/me/addresses', async (c) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return c.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clientId = verifyToken(token);
    if (!clientId) {
      return c.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const { results } = await c.env.DB.prepare(`
      SELECT * FROM client_addresses WHERE client_id = ? ORDER BY is_default DESC, created_at DESC
    `).bind(parseInt(clientId)).all();

    return c.json({ success: true, data: { addresses: results } });
  } catch (error: any) {
    console.error('[Client] Get addresses error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.post('/api/clients/me/addresses', async (c) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return c.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clientId = verifyToken(token);
    if (!clientId) {
      return c.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const body = await c.req.json();
    const { type, name, address, city, postal_code, country, phone, is_default } = body;

    if (is_default) {
      await c.env.DB.prepare(`
        UPDATE client_addresses SET is_default = 0 WHERE client_id = ?
      `).bind(parseInt(clientId)).run();
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO client_addresses (client_id, type, name, address, city, postal_code, country, phone, is_default, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(parseInt(clientId), type || 'shipping', name, address, city, postal_code, country, phone || null, is_default ? 1 : 0).run();

    return c.json({
      success: true,
      data: {
        address: {
          id: result.meta?.last_row_id,
          client_id: parseInt(clientId),
          type: type || 'shipping',
          name,
          address,
          city,
          postal_code,
          country,
          phone,
          is_default: is_default ? 1 : 0
        }
      }
    });
  } catch (error: any) {
    console.error('[Client] Add address error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.put('/api/clients/me/addresses/:id', async (c) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const addressId = c.req.param('id');

  if (!token) {
    return c.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clientId = verifyToken(token);
    if (!clientId) {
      return c.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const body = await c.req.json();
    const { type, name, address, city, postal_code, country, phone, is_default } = body;

    const existing = await c.env.DB.prepare(`
      SELECT id FROM client_addresses WHERE id = ? AND client_id = ?
    `).bind(parseInt(addressId), parseInt(clientId)).first();

    if (!existing) {
      return c.json({ success: false, error: 'Address not found' }, { status: 404 });
    }

    if (is_default) {
      await c.env.DB.prepare(`
        UPDATE client_addresses SET is_default = 0 WHERE client_id = ?
      `).bind(parseInt(clientId)).run();
    }

    await c.env.DB.prepare(`
      UPDATE client_addresses 
      SET type = ?, name = ?, address = ?, city = ?, postal_code = ?, country = ?, phone = ?, is_default = ?
      WHERE id = ? AND client_id = ?
    `).bind(
      type || 'shipping',
      name,
      address,
      city,
      postal_code,
      country,
      phone || null,
      is_default ? 1 : 0,
      parseInt(addressId),
      parseInt(clientId)
    ).run();

    return c.json({ success: true, message: 'Address updated' });
  } catch (error: any) {
    console.error('[Client] Update address error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.delete('/api/clients/me/addresses/:id', async (c) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const addressId = c.req.param('id');

  if (!token) {
    return c.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clientId = verifyToken(token);
    if (!clientId) {
      return c.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    await c.env.DB.prepare(`
      DELETE FROM client_addresses WHERE id = ? AND client_id = ?
    `).bind(parseInt(addressId), parseInt(clientId)).run();

    return c.json({ success: true, message: 'Address deleted' });
  } catch (error: any) {
    console.error('[Client] Delete address error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.put('/api/clients/me/password', async (c) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return c.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clientId = verifyToken(token);
    if (!clientId) {
      return c.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const body = await c.req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return c.json({ success: false, error: 'Invalid password data' }, { status: 400 });
    }

    const client = await c.env.DB.prepare(`
      SELECT password_hash FROM clients WHERE id = ?
    `).bind(parseInt(clientId)).first();

    if (!client) {
      return c.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const isValid = await verifyPassword(currentPassword, client.password_hash);
    if (!isValid) {
      return c.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);
    await c.env.DB.prepare(`
      UPDATE clients SET password_hash = ? WHERE id = ?
    `).bind(newHash, parseInt(clientId)).run();

    return c.json({ success: true, message: 'Password updated' });
  } catch (error: any) {
    console.error('[Client] Update password error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// ============ ADMIN CLIENTS API ============

app.get('/api/admin/clients', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT c.id, c.name, c.email, c.phone, c.created_at, c.last_login, 
             (SELECT COUNT(*) FROM orders WHERE client_id = c.id) as order_count,
             (SELECT SUM(total_price) FROM orders WHERE client_id = c.id) as total_spent
      FROM clients c
      ORDER BY c.created_at DESC
    `).all();

    return c.json({ success: true, data: { clients: results } });
  } catch (error: any) {
    console.error('[Admin] Get clients error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.get('/api/admin/clients/:id', async (c) => {
  const clientId = c.req.param('id');

  try {
    const client = await c.env.DB.prepare(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM orders WHERE client_id = c.id) as order_count,
             (SELECT SUM(total_price) FROM orders WHERE client_id = c.id) as total_spent
      FROM clients c WHERE c.id = ?
    `).bind(parseInt(clientId)).first();

    if (!client) {
      return c.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const { results: orders } = await c.env.DB.prepare(`
      SELECT * FROM orders WHERE client_id = ? ORDER BY created_at DESC
    `).bind(parseInt(clientId)).all();

    const ordersWithItems = orders.map((order: any) => ({
      ...order,
      items: JSON.parse(order.items || '[]')
    }));

    const { results: addresses } = await c.env.DB.prepare(`
      SELECT * FROM client_addresses WHERE client_id = ? ORDER BY is_default DESC, created_at DESC
    `).bind(parseInt(clientId)).all();

    return c.json({
      success: true,
      data: {
        client,
        orders: ordersWithItems,
        addresses
      }
    });
  } catch (error: any) {
    console.error('[Admin] Get client details error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.post('/api/orders', async (c) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return c.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const clientId = verifyToken(token);
    if (!clientId) {
      return c.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    const body = await c.req.json();
    const { items, totalPrice, shippingAddress, notes } = body;

    const result = await c.env.DB.prepare(`
      INSERT INTO orders (client_id, items, total_price, status, shipping_address, notes, created_at)
      VALUES (?, ?, ?, 'completed', ?, ?, datetime('now'))
    `).bind(parseInt(clientId), JSON.stringify(items), totalPrice, JSON.stringify(shippingAddress), notes || null).run();

    const orderId = result.meta?.last_row_id;

    await c.env.DB.prepare(`DELETE FROM carts WHERE user_session = ?`).bind(`client_${clientId}`).run();

    return c.json({
      success: true,
      data: {
        order: {
          id: orderId,
          items,
          total_price: totalPrice,
          status: 'completed',
          created_at: new Date().toISOString()
        }
      }
    });
  } catch (error: any) {
    console.error('[Order] Create error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// ============ WHATSAPP TEST (Green-API) ============

app.post('/api/notifications/test-whatsapp', async (c) => {
  try {
    const body = await c.req.json();
    const { idInstance, apiTokenInstance, phone } = body;

    if (!idInstance || !apiTokenInstance) {
      return c.json({ success: false, error: 'Missing idInstance or apiTokenInstance' }, { status: 400 });
    }

    // Test message
    const testMessage = `📦 *NOUVELLE COMMANDE - Yan's Deco*
--------------------------
👤 **Client :** Jean Dupont (TEST)
📞 **Tél :** +33 6 00 00 00 00
📍 **Mode :** Livraison à domicile
🏠 **Adresse :** 1 Rue Magnier Bédu, 95410 Groslay

🛒 **Articles :**
1. Colle à carrelage Bostik (25kg) x 4
2. Peinture Dulary Mat (10L) x 2
3. Kit de lissage L'outil Parfait x 1

💰 **TOTAL :** 540,80 € (TTC)
--------------------------
⚙️ *Message système - Ne pas répondre*`;

    // Send via Green-API REST API
    const greenApiUrl = `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

    const chatId = phone ? `${phone.replace(/[^0-9]/g, '')}@c.us` : 'demo@c.us';

    const response = await fetch(greenApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chatId: chatId,
        message: testMessage
      })
    });

    const result = await response.json();

    if (result.idMessage) {
      console.log('[WhatsApp] Test message sent successfully:', result.idMessage);
      return c.json({
        success: true,
        data: {
          messageId: result.idMessage,
          status: 'sent'
        }
      });
    } else {
      console.error('[WhatsApp] Error sending:', result);
      return c.json({ success: false, error: result.message || 'Failed to send WhatsApp message' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('[WhatsApp] Test error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// ============ SYSTEM CHECK (Green-API) ============

app.get('/api/system-check', async (c) => {
  try {
    // Get environment variables
    const greenApiId = c.env.GREEN_API_ID_INSTANCE || '';
    const greenApiToken = c.env.GREEN_API_TOKEN_INSTANCE || '';
    const env = c.env.ENV || 'unknown';

    // Get current time in French format
    const now = new Date();
    const dateTimeFR = now.toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Check D1 Database
    let dbSize = 0;
    let dbStatus = 'OK';
    try {
      const dbResult = await c.env.DB.prepare(`
        SELECT (page_count * page_size) / 1024.0 / 1024.0 as size 
        FROM pragma_page_count(), pragma_page_size()
      `).first();
      dbSize = dbResult?.size || 0;
    } catch (dbError: any) {
      console.error('[SystemCheck] DB error:', dbError.message);
      dbStatus = 'Erreur';
    }

    // Check R2 Storage
    let r2Size = 0;
    let r2Files = 0;
    let r2Status = 'OK';
    try {
      const r2List = await c.env.ASSETS.list({ limit: 1000 });
      r2Files = r2List.objects.length;
      // R2 doesn't have direct size in list, estimate based on common object size
      r2Size = r2Files * 0.5; // Approximate 0.5MB per object
    } catch (r2Error: any) {
      console.error('[SystemCheck] R2 error:', r2Error.message);
      r2Status = 'Erreur';
    }

    // Format message
    const dbStatusIcon = dbStatus === 'OK' ? '✅' : '❌';
    const r2StatusIcon = r2Status === 'OK' ? '✅' : '❌';

    const systemMessage = `🛠 *RAPPORT D'ÉTAT SYSTÈME - Yan's Deco*
--------------------------
📅 **Date/Heure :** ${dateTimeFR}
🗄 **Base de données D1 :** ${dbStatusIcon} ${dbSize.toFixed(2)} MB
📦 **Stockage R2 (Photos) :** ${r2StatusIcon} ${r2Size.toFixed(2)} MB / ${r2Files} fichiers
🆔 **ID Instance :** ${greenApiId}
🌐 **Environnement :** ${env}

📊 **Statut Global :**
- Connexion DB : ${dbStatus}
- Accès Stockage : ${r2Status}
- WhatsApp API : ${greenApiId ? 'Connecté' : 'Non configuré'}

🚀 *Système Yan's Deco opérationnel à 100%*
--------------------------
_Rapport dynamique généré par le Worker_`;

    // Send via Green-API if configured
    let whatsappSent = false;
    if (greenApiId && greenApiToken) {
      try {
        const greenApiUrl = `https://api.green-api.com/waInstance${greenApiId}/sendMessage/${greenApiToken}`;
        const response = await fetch(greenApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatId: 'demo@c.us',
            message: systemMessage
          })
        });
        const whatsappResult = await response.json();
        if (whatsappResult.idMessage) {
          whatsappSent = true;
        }
      } catch (whatsappError: any) {
        console.error('[SystemCheck] WhatsApp error:', whatsappError.message);
      }
    }

    return c.json({
      success: true,
      data: {
        timestamp: dateTimeFR,
        database: {
          status: dbStatus,
          sizeMB: dbSize.toFixed(2)
        },
        storage: {
          status: r2Status,
          sizeMB: r2Size.toFixed(2),
          files: r2Files
        },
        whatsapp: whatsappSent ? 'sent' : 'skipped',
        environment: env
      }
    });
  } catch (error: any) {
    console.error('[SystemCheck] Error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// ============ ADMIN TRANSLATIONS API ============

app.get('/api/admin/translations', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM translations ORDER BY namespace, key
    `).all();

    return c.json({ success: true, data: { translations: results } });
  } catch (error: any) {
    console.error('[Admin] Get translations error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.get('/api/admin/translations/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const translation = await c.env.DB.prepare(`
      SELECT * FROM translations WHERE id = ?
    `).bind(parseInt(id)).first();

    if (!translation) {
      return c.json({ success: false, error: 'Translation not found' }, { status: 404 });
    }

    return c.json({ success: true, data: { translation } });
  } catch (error: any) {
    console.error('[Admin] Get translation error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.post('/api/admin/translations', async (c) => {
  try {
    const body = await c.req.json();
    const { key, namespace, value_ru, value_fr, value_en, description, is_active } = body;

    if (!key) {
      return c.json({ success: false, error: 'Key is required' }, { status: 400 });
    }

    const result = await c.env.DB.prepare(`
      INSERT INTO translations (key, namespace, value_ru, value_fr, value_en, description, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      key,
      namespace || 'common',
      value_ru || '',
      value_fr || '',
      value_en || '',
      description || '',
      is_active !== false ? 1 : 0
    ).run();

    const newId = result.meta?.last_row_id;

    return c.json({
      success: true,
      data: {
        translation: {
          id: newId,
          key,
          namespace: namespace || 'common',
          value_ru: value_ru || '',
          value_fr: value_fr || '',
          value_en: value_en || '',
          description: description || '',
          is_active: is_active !== false ? 1 : 0
        }
      }
    });
  } catch (error: any) {
    console.error('[Admin] Create translation error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.put('/api/admin/translations/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const body = await c.req.json();
    const { key, namespace, value_ru, value_fr, value_en, description, is_active } = body;

    const existing = await c.env.DB.prepare(`
      SELECT id FROM translations WHERE id = ?
    `).bind(parseInt(id)).first();

    if (!existing) {
      return c.json({ success: false, error: 'Translation not found' }, { status: 404 });
    }

    await c.env.DB.prepare(`
      UPDATE translations 
      SET key = ?, namespace = ?, value_ru = ?, value_fr = ?, value_en = ?, 
          description = ?, is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      key,
      namespace || 'common',
      value_ru || '',
      value_fr || '',
      value_en || '',
      description || '',
      is_active !== false ? 1 : 0,
      parseInt(id)
    ).run();

    return c.json({ success: true, message: 'Translation updated' });
  } catch (error: any) {
    console.error('[Admin] Update translation error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

app.delete('/api/admin/translations/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const existing = await c.env.DB.prepare(`
      SELECT id FROM translations WHERE id = ?
    `).bind(parseInt(id)).first();

    if (!existing) {
      return c.json({ success: false, error: 'Translation not found' }, { status: 404 });
    }

    await c.env.DB.prepare(`
      DELETE FROM translations WHERE id = ?
    `).bind(parseInt(id)).run();

    return c.json({ success: true, message: 'Translation deleted' });
  } catch (error: any) {
    console.error('[Admin] Delete translation error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// ============ SLOGANS ============

// Get all slogans (public - only active)
app.get('/api/slogans', async (c) => {
  try {
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS slogans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        "key" TEXT UNIQUE,
        title_ru TEXT DEFAULT '',
        title_fr TEXT DEFAULT '',
        title_en TEXT DEFAULT '',
        content_ru TEXT DEFAULT '',
        content_fr TEXT DEFAULT '',
        content_en TEXT DEFAULT '',
        image_url TEXT DEFAULT '',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    const slogans = await c.env.DB.prepare(`
      SELECT * FROM slogans WHERE is_active = 1 ORDER BY id DESC
    `).all();

    return c.json({
      success: true,
      data: slogans.results
    });
  } catch (error: any) {
    console.error('[Slogans] Get error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// Get all slogans (admin)
app.get('/api/admin/slogans', async (c) => {
  try {
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS slogans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        "key" TEXT UNIQUE,
        title_ru TEXT DEFAULT '',
        title_fr TEXT DEFAULT '',
        title_en TEXT DEFAULT '',
        content_ru TEXT DEFAULT '',
        content_fr TEXT DEFAULT '',
        content_en TEXT DEFAULT '',
        image_url TEXT DEFAULT '',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    const slogans = await c.env.DB.prepare(`
      SELECT * FROM slogans ORDER BY id DESC
    `).all();

    return c.json({
      success: true,
      data: slogans.results
    });
  } catch (error: any) {
    console.error('[Admin] Get slogans error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// Create slogan
app.post('/api/admin/slogans', async (c) => {
  try {
    const body = await c.req.json();
    const { key, title_ru, title_fr, title_en, content_ru, content_fr, content_en, image_url, is_active } = body;

    const result = await c.env.DB.prepare(`
      INSERT INTO slogans ("key", title_ru, title_fr, title_en, content_ru, content_fr, content_en, image_url, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      key || null,
      title_ru || '',
      title_fr || '',
      title_en || '',
      content_ru || '',
      content_fr || '',
      content_en || '',
      image_url || '',
      is_active !== false ? 1 : 0
    ).run();

    return c.json({
      success: true,
      data: { id: result.meta?.last_row_id }
    });
  } catch (error: any) {
    console.error('[Admin] Create slogan error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// Update slogan
app.put('/api/admin/slogans/:id', async (c) => {
  const id = c.req.param('id');
  try {
    const body = await c.req.json();
    const { key, title_ru, title_fr, title_en, content_ru, content_fr, content_en, image_url, is_active } = body;

    await c.env.DB.prepare(`
      UPDATE slogans 
      SET "key" = ?, title_ru = ?, title_fr = ?, title_en = ?, 
          content_ru = ?, content_fr = ?, content_en = ?, 
          image_url = ?, is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      key || null,
      title_ru || '',
      title_fr || '',
      title_en || '',
      content_ru || '',
      content_fr || '',
      content_en || '',
      image_url || '',
      is_active !== false ? 1 : 0,
      parseInt(id)
    ).run();

    return c.json({ success: true, message: 'Slogan updated' });
  } catch (error: any) {
    console.error('[Admin] Update slogan error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// Delete slogan
app.delete('/api/admin/slogans/:id', async (c) => {
  const id = c.req.param('id');
  try {
    await c.env.DB.prepare(`
      DELETE FROM slogans WHERE id = ?
    `).bind(parseInt(id)).run();

    return c.json({ success: true, message: 'Slogan deleted' });
  } catch (error: any) {
    console.error('[Admin] Delete slogan error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// ============ LEGAL DOCUMENTS ============

// Get legal documents (public)
app.get('/api/legal', async (c) => {
  try {
    // Create table if not exists
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS legal_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL UNIQUE,
        content_fr TEXT DEFAULT '',
        content_en TEXT DEFAULT '',
        content_ru TEXT DEFAULT '',
        updated_at TEXT DEFAULT datetime('now')
      )
    `).run();

    // Get all legal documents
    const documents = await c.env.DB.prepare(`
      SELECT type, content_fr, content_en, content_ru, updated_at
      FROM legal_documents
    `).all();

    const result: Record<string, any> = {};

    for (const doc of documents.results as any[]) {
      result[doc.type] = {
        fr: doc.content_fr || '',
        en: doc.content_en || '',
        ru: doc.content_ru || '',
        updated_at: doc.updated_at
      };
    }

    return c.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('[Legal] Get documents error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

// Save legal documents (admin)
app.post('/api/admin/legal', async (c) => {
  try {
    // Create table if not exists
    await c.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS legal_documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL UNIQUE,
        content_fr TEXT DEFAULT '',
        content_en TEXT DEFAULT '',
        content_ru TEXT DEFAULT '',
        updated_at TEXT DEFAULT datetime('now')
      )
    `).run();

    const body = await c.req.json();
    const {
      mentions_fr, mentions_en, mentions_ru,
      cgv_fr, cgv_en, cgv_ru,
      privacy_fr, privacy_en, privacy_ru
    } = body;

    const documents = [
      { type: 'mentions', fr: mentions_fr, en: mentions_en, ru: mentions_ru },
      { type: 'cgv', fr: cgv_fr, en: cgv_en, ru: cgv_ru },
      { type: 'privacy', fr: privacy_fr, en: privacy_en, ru: privacy_ru }
    ];

    for (const doc of documents) {
      await c.env.DB.prepare(`
        INSERT INTO legal_documents (type, content_fr, content_en, content_ru, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'))
        ON CONFLICT(type) DO UPDATE SET
          content_fr = excluded.content_fr,
          content_en = excluded.content_en,
          content_ru = excluded.content_ru,
          updated_at = datetime('now')
      `).bind(doc.type, doc.fr || '', doc.en || '', doc.ru || '').run();
    }

    return c.json({ success: true, message: 'Legal documents saved' });
  } catch (error: any) {
    console.error('[Admin] Save legal error:', error.message);
    return c.json({ success: false, error: error.message }, { status: 500 });
  }
});

export default app;
