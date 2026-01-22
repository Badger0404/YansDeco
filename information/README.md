# 🏪 Yan's Deco - E-Commerce Platform

## Премиальная E-commerce платформа для магазинов декоративных и строительных материалов

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Commercial-green)
![Stack](https://img.shields.io/badge/Stack-React_19+Cloudflare-orange)

---

## 📋 Содержание

1. [О проекте](#-о-проекте)
2. [Возможности](#-возможности)
3. [Технологический стек](#-технологический-стек)
4. [Структура проекта](#-структура-проекта)
5. [Установка и запуск](#-установка-запуск)
6. [Деплой](#-деплой)
7. [API документация](#-api-документация)
8. [Кастомизация](#-кастомизация)
9. [База данных](#-база-данных)
10. [Мультиязычность](#-мультиязычность)
11. [Для разработчиков](#-для-разработчиков)
12. [Лицензия](#-лицензия)

---

## 🎯 О проекте

**Yan's Deco** - это готовая e-commerce платформа, построенная на современном стеке технологий Cloudflare. Платформа оптимизирована для магазинов декоративных и строительных материалов, но легко адаптируется под любой тип розничного бизнеса.

### Ключевые преимущества:

- ⚡ **Скорость** - Edge computing на Cloudflare Workers
- 🌍 **Глобальность** - CDN в 300+ городах мира
- 🔒 **Безопасность** - Cloudflare DDoS защита включена
- 💰 **Экономия** - Бесплатный Workers до 100K запросов/день
- 📱 **Mobile-first** - Адаптивный дизайн от начала
- 🎨 **Премиальный UI** - Современный дизайн с неоновым акцентом

---

## ✨ Возможности

### 🛒 E-Commerce функционал

| Функция | Статус | Описание |
|---------|--------|----------|
| Каталог товаров | ✅ Готово | Категории, подкатегории, карточки товаров |
| Корзина | ✅ Готово | Slide-drawer корзина с анимациями |
| Оформление заказа | ✅ Готово | 3-шаговый checkout |
| Фильтры товаров | ⏳ В планах | По цене, бренду, категории |
| Поиск | ⏳ В планах | Полнотекстовый поиск |
| Wishlist | ⏳ В планах | Избранные товары |
| Сравнение товаров | ⏳ В планах | Сравнение характеристик |

### 👥 Пользовательский функционал

| Функция | Статус | Описание |
|---------|--------|----------|
| Регистрация/вход | ✅ Готово | Email + пароль |
| Google OAuth | ⏳ В планах | Авторизация через Google |
| Профиль пользователя | ✅ Готово | Управление аккаунтом |
| История заказов | ✅ Готово | Просмотр прошлых заказов |
| Адреса доставки | ✅ Готово | Множественные адреса |

### 🎨 Управление контентом

| Функция | Статус | Описание |
|---------|--------|----------|
| Главная страница | ✅ Готово | Динамические слайды |
| Страница брендов | ✅ Готово | Полный контроль дизайна |
| Админ-панель | ✅ Готово | Полное управление |
| AI перевод | ✅ Готово | Llama 3.1 для переводов |
| Загрузка изображений | ✅ Готово | Cloudflare R2 Storage |

### 📦 Складской модуль (WMS)

| Функция | Статус | Описание |
|---------|--------|----------|
| Приём товара | ✅ Готово | Stock IN с комментарием |
| Отгрузка товара | ✅ Готово | Stock OUT с комментарием |
| Инвентаризация | ✅ Готово | Просмотр остатков |
| Штрих-код сканер | ✅ Готово | Tesseract.js OCR |
| История операций | ✅ Готово | Лог всех операций |

---

## 🛠 Технологический стек

### Frontend

```
React 19 + TypeScript + Vite
├── Framework: React 19 (latest)
├── Language: TypeScript 5.x
├── Build Tool: Vite 7.x
├── Styling: Tailwind CSS 4.x
├── Animations: Framer Motion 11.x
├── Icons: Lucide React
├── Routing: React Router 6.x
├── i18n: react-i18next 23.x
└── State: React Context + Hooks
```

### Backend (Edge)

```
Cloudflare Workers + Hono
├── Framework: Hono.js 4.x
├── Runtime: Cloudflare Workers
├── Database: Cloudflare D1 (SQLite)
├── Storage: Cloudflare R2 (S3-compatible)
├── AI: Cloudflare Workers AI (Llama 3.1)
├── Auth: JWT tokens
└── API: RESTful endpoints
```

### Инфраструктура

```
Cloudflare Ecosystem
├── Pages: Frontend хостинг
├── Workers: Edge computing
├── D1: Serverless база данных
├── R2: Object storage (без egress fees)
├── AI: Machine learning inference
├── Images: Image optimization
└── Security: DDoS + WAF защита
```

---

## 📁 Структура проекта

```
YansDeco/
├── src/                          # Frontend (React)
│   ├── components/               # Переиспользуемые компоненты
│   │   ├── Header.tsx            # Шапка сайта
│   │   ├── Footer.tsx            # Подвал
│   │   ├── CartDrawer.tsx        # Корзина (slide-out)
│   │   ├── ProductCard.tsx       # Карточка товара
│   │   ├── BrandCard.tsx         # Карточка бренда
│   │   ├── BarcodeScanner.tsx    # WMS сканер
│   │   └── auth/                 # Компоненты авторизации
│   │       └── AuthModal.tsx     # Модалка входа/регистрации
│   ├── pages/                    # Страницы
│   │   ├── Home.tsx              # Главная
│   │   ├── Catalogue.tsx         # Каталог
│   │   ├── Marques.tsx           # Бренды (публичная)
│   │   ├── ProductPage.tsx       # Товар
│   │   ├── Checkout.tsx          # Оформление заказа
│   │   ├── Profile.tsx           # Профиль пользователя
│   │   ├── AdminDashboard.tsx    # Админ-панель
│   │   ├── AdminBrands.tsx       # Управление брендами
│   │   ├── AdminProducts.tsx     # Управление товарами
│   │   ├── AdminWarehouse.tsx    # WMS терминал
│   │   ├── AdminSlogans.tsx      # Управление слайдами
│   │   └── ...
│   ├── context/                  # Глобальное состояние
│   │   ├── CartContext.tsx       # Корзина
│   │   ├── AuthContext.tsx       # Авторизация
│   │   └── ThemeContext.tsx      # Тема (light/dark)
│   ├── hooks/                    # Кастомные хуки
│   ├── i18n/                     # Переводы
│   │   ├── locales/              # Файлы переводов
│   │   │   ├── ru.json
│   │   │   ├── fr.json
│   │   │   └── en.json
│   │   └── i18n.ts
│   ├── utils/                    # Утилиты
│   ├── App.tsx                   # Роутинг
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Глобальные стили
│
├── worker/                       # Backend (Cloudflare Worker)
│   ├── src/
│   │   └── index.ts              # Все API эндпоинты
│   ├── wrangler.toml             # Cloudflare конфиг
│   └── package.json
│
├── dist/                         # Собранный фронтенд
│
├── information/                  # Документация
│   ├── memory2.txt               # Разработческие заметки
│   └── README.md                 # Этот файл
│
├── public/                       # Статические файлы
│   └── favicon.ico
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🚀 Установка и запуск

### Требования

- Node.js 18+
- npm или pnpm
- Cloudflare аккаунт
- Wrangler CLI (`npm install -g wrangler`)

### Локальная разработка

```bash
# 1. Клонировать репозиторий
git clone <repo-url>
cd YansDeco

# 2. Установить зависимости
npm install

# 3. Запустить фронтенд (port 5173)
npm run dev

# 4. В отдельном терминале - запустить Worker
cd worker
npx wrangler dev
```

### Переменные окружения

```bash
# В корне создать .env
VITE_API_URL=http://localhost:8787/api

# В worker/ создать wrangler.toml (см.ниже)
```

### wrangler.toml (worker/)

```toml
name = "yasndeco-api"
main = "src/index.ts"
compatibility_date = "2024-09-23"

[[d1_databases]]
binding = "DB"
database_name = "yasndeco"
database_id = "YOUR_DB_ID"

[[r2_buckets]]
binding = "ASSETS"
bucket_name = "yans-deco-assets"

[vars]
ENV = "development"
```

---

## 📦 Деплой

### Frontend (Cloudflare Pages)

```bash
# Сборка
npm run build

# Деплой на production
npx wrangler pages deploy dist --project-name=yans-deco --branch=production

# Или через GitHub Actions (автоматически при push в main)
```

### Backend (Cloudflare Worker)

```bash
cd worker
npx wrangler deploy
```

### База данных (D1)

```bash
# Применить миграции
npx wrangler d1 execute yasndeco --remote --file=./schema.sql

# Или выполнить команды вручную
npx wrangler d1 execute yasndeco --remote --command="SQL команды"
```

### Полный деплой

```bash
# Frontend
npm run build
npx wrangler pages deploy dist --project-name=yans-deco --branch=production --commit-dirty=true

# Backend
cd worker && npx wrangler deploy
```

---

## 📡 API документация

### Бренды (`/api/brands`)

```http
GET /api/brands                    # Список всех брендов
GET /api/brands/:id                # Один бренд
POST /api/brands                   # Создать бренд
PUT /api/brands/:id                # Обновить бренд
DELETE /api/brands/:id             # Удалить бренд
```

### Товары (`/api/products`)

```http
GET /api/products                  # Список товаров
GET /api/products/:id              # Один товар
GET /api/products/by-barcode/:code # Поиск по штрих-коду
POST /api/products                 # Создать товар
PUT /api/products/:id              # Обновить товар
DELETE /api/products/:id           # Удалить товар
```

### Категории (`/api/categories`)

```http
GET /api/categories                # Все категории
GET /api/categories/:id            # Категория с подкатегориями
POST /api/categories               # Создать
PUT /api/categories/:id            # Обновить
DELETE /api/categories/:id         # Удалить
```

### Заказы (`/api/orders`)

```http
POST /api/orders                   # Создать заказ (авторизован)
GET /api/clients/me/orders         # Мои заказы
```

### Клиенты (`/api/clients`)

```http
POST /api/clients/register         # Регистрация
POST /api/clients/login            # Вход
GET /api/clients/me                # Профиль
PUT /api/clients/me                # Обновить профиль
GET /api/clients/me/addresses      # Мои адреса
POST /api/clients/me/addresses     # Добавить адрес
```

### Слайды (`/api/admin/slides`)

```http
GET /api/admin/slides              # Список слайдов
POST /api/admin/slides             # Создать
PUT /api/admin/slides/:id          # Обновить
DELETE /api/admin/slides/:id       # Удалить
```

### Склад (`/api/admin/stock`)

```http
POST /api/admin/stock/in           # Приём товара
POST /api/admin/stock/out          # Отгрузка товара
```

### Утилиты

```http
GET /api                           # Health check
GET /api/health                    # Полный статус системы
POST /api/translate                # AI перевод (Llama 3.1)
POST /api/upload                   # Загрузка изображений
GET /images/*                      # Сserve изображений из R2
```

---

## 🎨 Кастомизация

### Цветовая схема

Главный акцентный цвет: **#FF6B00** (оранжевый неон)

Изменение в `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#FF6B00',
      'primary-hover': '#FF8533',
    }
  }
}
```

### Логотип и название

```tsx
// src/components/Header.tsx (строка ~100)
<h1 className="font-bold text-xl sm:text-2xl tracking-wide">
  <span className="text-[#FF6B00]">YAN'S</span>
  <span className={isLight ? 'text-black' : 'text-white'}>DECO</span>
</h1>
```

### Тема оформления

Платформа поддерживает **светлую и тёмную темы** с полной адаптацией:

```tsx
// Принудительная тема
<ThemeProvider defaultTheme="dark">
  <App />
</ThemeProvider>

// Автоматическое определение
const isLight = theme === 'light'
```

### Настройки брендов (визуальные)

Каждый бренд настраивается индивидуально:

```typescript
interface BrandVisualSettings {
  // Заливка фона
  bg_light_enabled: boolean;
  bg_light_color: string;      // #FF6B00
  bg_light_opacity: number;    // 0-100%
  
  bg_dark_enabled: boolean;
  bg_dark_color: string;
  bg_dark_opacity: number;
  
  // Рамка
  border_light_enabled: boolean;
  border_light_color: string;
  border_light_opacity: number;
  
  border_dark_enabled: boolean;
  border_dark_color: string;
  border_dark_opacity: number;
  
  // Свечение при наведении
  glow_light_enabled: boolean;
  glow_light_color: string;
  glow_light_opacity: number;
  glow_light_blur: number;     // 5-50px
  
  glow_dark_enabled: boolean;
  glow_dark_color: string;
  glow_dark_opacity: number;
  glow_dark_blur: number;
}
```

---

## 🗄 База данных

### Схема D1 (SQLite)

#### Таблица `brands`

```sql
CREATE TABLE brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  logo_url TEXT,
  description_ru TEXT,
  description_fr TEXT,
  description_en TEXT,
  hide_name INTEGER DEFAULT 0,
  
  -- Заливка фона
  bg_light_color TEXT,
  bg_light_opacity INTEGER DEFAULT 50,
  bg_light_enabled INTEGER DEFAULT 0,
  bg_dark_color TEXT,
  bg_dark_opacity INTEGER DEFAULT 50,
  bg_dark_enabled INTEGER DEFAULT 0,
  
  -- Рамка
  border_light_enabled INTEGER DEFAULT 0,
  border_light_color TEXT,
  border_light_opacity INTEGER DEFAULT 100,
  border_dark_enabled INTEGER DEFAULT 0,
  border_dark_color TEXT,
  border_dark_opacity INTEGER DEFAULT 100,
  
  -- Свечение при наведении
  glow_light_enabled INTEGER DEFAULT 0,
  glow_light_color TEXT,
  glow_light_opacity INTEGER DEFAULT 50,
  glow_light_blur INTEGER DEFAULT 20,
  glow_dark_enabled INTEGER DEFAULT 0,
  glow_dark_color TEXT,
  glow_dark_opacity INTEGER DEFAULT 50,
  glow_dark_blur INTEGER DEFAULT 20,
  
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### Таблица `products`

```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT UNIQUE,
  barcode TEXT,
  price REAL NOT NULL,
  stock INTEGER DEFAULT 0,
  brand_id INTEGER,
  category_id INTEGER,
  image_url TEXT,
  is_popular INTEGER DEFAULT 0,
  announcement_date TEXT,
  
  -- Мультиязычные поля
  name_ru TEXT, name_fr TEXT, name_en TEXT,
  desc_ru TEXT, desc_fr TEXT, desc_en TEXT,
  
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (brand_id) REFERENCES brands(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);
```

#### Таблица `categories`

```sql
CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_ru TEXT, name_fr TEXT, name_en TEXT,
  slug TEXT UNIQUE,
  parent_id INTEGER,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (parent_id) REFERENCES categories(id)
);
```

#### Таблица `slides`

```sql
CREATE TABLE slides (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  "key" TEXT UNIQUE,
  title_ru TEXT, title_fr TEXT, title_en TEXT,
  content_ru TEXT, content_fr TEXT, content_en TEXT,
  image_url TEXT,
  is_active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

#### Таблицы для заказов

```sql
-- Клиенты
CREATE TABLE clients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Заказы
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id INTEGER NOT NULL,
  items TEXT NOT NULL,          -- JSON массив
  total_price REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  shipping_address TEXT,        -- JSON
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Адреса клиентов
CREATE TABLE client_addresses (
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
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Лог операций склада
CREATE TABLE stock_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  operation_type TEXT NOT NULL,  -- 'IN' или 'OUT'
  quantity INTEGER NOT NULL,
  comment TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

---

## 🌍 Мультиязычность

Платформа поддерживает 3 языка:

| Код | Язык | Файл | Статус |
|-----|------|------|--------|
| ru | Русский | `ru.json` | ✅ Полный |
| fr | Французский | `fr.json` | ✅ Полный |
| en | Английский | `en.json` | ✅ Полный |

### Структура переводов

```json
// src/i18n/locales/ru.json
{
  "nav": {
    "home": "Главная",
    "catalogue": "Каталог",
    "brands": "Бренды",
    "services": "Услуги",
    "calculators": "Калькуляторы",
    "contact": "Контакти",
    "legal": "Правовая информация"
  },
  "cart": {
    "title": "Корзина",
    "empty": "Корзина пуста",
    "total": "Итого",
    "checkout": "Оформить заказ"
  },
  "brands": {
    "title": "Наши Бренды",
    "subtitle": "Работаем с лучшими производителями"
  }
}
```

### AI Перевод

Встроенный AI переводчик (Llama 3.1) для быстрого заполнения переводов:

```typescript
// API вызов
POST /api/translate
{
  "text": { "description": "Текст на русском" },
  "sourceLang": "ru",
  "targetLangs": ["fr", "en"]
}
```

---

## 👨‍💻 Для разработчиков

### Добавление новой страницы

1. Создать файл в `src/pages/NewPage.tsx`
2. Добавить роут в `src/App.tsx`
3. Добавить ссылку в навигацию (Header)
4. Добавить переводы в `i18n/locales/*.json`

### Добавление API эндпоинта

```typescript
// worker/src/index.ts

// Новый endpoint
app.get('/api/your-endpoint', async (c) => {
  // Логика
  return c.json({ success: true, data: {...} });
});

// С авторизацией
app.get('/api/protected', async (c) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const clientId = verifyToken(token);
  
  if (!clientId) {
    return c.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  
  // Логика...
});
```

### Стилизация (Tailwind CSS)

Платформа следует принципам:

```tsx
// Премиальный стиль Yan's Deco
className={`
  font-black italic           // Курсивный заголовок
  uppercase tracking-wide     // Заглавные буквы
  text-[#FF6B00]              // Акцентный цвет
  hover:text-[#FF6B00]        // Hover эффект
  transition-colors duration-300
`}
```

### Debug режим

```typescript
// В компонентах
console.log('[ComponentName]', { data });

// В Worker
console.log('[API] Request:', c.req.path);
```

---

## 📊 Производительность

### Метрики

| Метрика | Значение | Инструмент |
|---------|----------|------------|
| First Contentful Paint | ~600ms | Lighthouse |
| Time to Interactive | ~800ms | Lighthouse |
| Lighthouse Score | 95+ | Google Lighthouse |
| Core Web Vitals | Pass | Google Search Console |

### Оптимизации

- ✅ Code splitting автоматически (Vite)
- ✅ Lazy loading изображений
- ✅ Edge caching (Cloudflare)
- ✅ Gzip/Brotli сжатие
- ✅ Минификация CSS/JS
- ⏳ Asset optimization (в планах)

---

## 🔐 Безопасность

- ✅ Cloudflare DDoS Protection
- ✅ Cloudflare WAF
- ✅ HTTPS everywhere
- ✅ CORS настроен
- ✅ SQL injection защита (prepared statements)
- ⏳ Rate limiting (в планах)
- ⏳ 2FA (в планах)

---

## 📈 Roadmap

### Версия 1.1 (Q1 2026)
- [ ] Фильтры товаров в каталоге
- [ ] Поиск товаров
- [ ] Google OAuth
- [ ] Страница товара с отзывами

### Версия 1.2 (Q2 2026)
- [ ] Wishlist
- [ ] Сравнение товаров
- [ ] Email уведомления
- [ ] PWA манифест

### Версия 2.0 (Q3 2026)
- [ ] Оплата онлайн (Stripe/LemonSqueezy)
- [ ] Личный кабинет B2B
- [ ] Оптовые цены
- [ ] API для интеграций

---

## 📞 Поддержка

### Для клиентов

- Документация: `/docs`
- FAQ: `/faq`
- Контакты: `/contact`

### Для разработчиков

- Issues: GitHub Issues
- Email: support@yans-deco.com

---

## 📄 Лицензия

**Коммерческая лицензия**

Этот проект распространяется по коммерческой лицензии. Использование без разрешения запрещено.

### Права лицензиата:

- ✅ Использовать платформу для своего бизнеса
- ✅ Кастомизировать под свои нужды
- ✅ Добавлять новые функции
- ✅ Интегрировать с внешними сервисами

### Ограничения:

- ❌ Перепродажа платформы как есть
- ❌ Распространение без разрешения
- ❌ Использование товарных знаков Yan's Deco

---

## 🎉 Благодарности

- [Cloudflare](https://cloudflare.com) - Инфраструктура
- [React](https://react.dev) - Frontend фреймворк
- [Tailwind CSS](https://tailwindcss.com) - Стилизация
- [Framer Motion](https://www.framer.com/motion/) - Анимации
- [Hono](https://hono.dev) - Edge фреймворк
- [Llama 3.1](https://llama.meta.com) - AI переводы

---

## 📝 Версии

| Версия | Дата | Изменения |
|--------|------|-----------|
| 1.0.0 | 2026-01-22 | Первая версия |

---

**Yan's Deco** - Готовая e-commerce платформа для вашего бизнеса 🚀

Создано с ❤️ и ☕
