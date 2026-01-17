export type SupportedLanguages = 'fr' | 'en' | 'ru';

export interface LocalizedString {
  fr: string;
  en: string;
  ru: string;
}

export const createLocalizedString = (fr: string, en: string = fr, ru: string = fr): LocalizedString => ({
  fr,
  en: en || fr,
  ru: ru || fr
});

export const isLocalizedString = (value: unknown): value is LocalizedString => {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return 'fr' in obj && 'en' in obj && 'ru' in obj;
};

export interface Brand {
  id: string;
  name: LocalizedString;
  slug: string;
  logoPath?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: LocalizedString;
  slug: string;
  icon?: string;
  imageUrl?: string;
  parentId?: string;
  order: number;
  isActive: boolean;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Subcategory extends Category {
  categoryId: string;
}

export interface Product {
  id: string;
  name: LocalizedString;
  slug: string;
  description: LocalizedString;
  shortDescription?: LocalizedString;
  brandId?: string;
  categoryId: string;
  subcategoryId?: string;
  price: number;
  priceUnit?: string;
  sku?: string;
  imageUrl?: string;
  images?: string[];
  specifications?: Record<string, LocalizedString>;
  isActive: boolean;
  inStock: boolean;
  stockQuantity?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: LocalizedString;
  slug: string;
  description: LocalizedString;
  icon?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PageContent {
  id: string;
  slug: string;
  title: LocalizedString;
  content: LocalizedString;
  seoTitle?: LocalizedString;
  seoDescription?: LocalizedString;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteConfig {
  companyName: LocalizedString;
  tagline: LocalizedString;
  phone1: string;
  phone2: string;
  email: string;
  address: LocalizedString;
  workingHours: {
    mondayFriday: LocalizedString;
    saturday: LocalizedString;
    sunday: LocalizedString;
    closed: LocalizedString;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    vk?: string;
  };
}
