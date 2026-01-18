import { 
  Brand, 
  Category, 
  Product, 
  Service, 
  PageContent, 
  SiteConfig,
  SupportedLanguages,
  createLocalizedString
} from '../types/localization';

const API_BASE = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiService {
  private language: SupportedLanguages = 'fr';

  setLanguage(lang: SupportedLanguages) {
    this.language = lang;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept-Language': this.language,
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getBrands(): Promise<Brand[]> {
    try {
      const response = await this.request<ApiResponse<any[]>>('/brands');
      return response.data.map((item: any, index: number) => ({
        id: String(item.id),
        name: createLocalizedString(item.name, item.name, item.name),
        slug: item.name?.toLowerCase().replace(/\s+/g, '-') || `brand-${item.id}`,
        logoPath: item.logo_url || undefined,
        imageUrl: item.logo_url || undefined,
        order: index,
        isActive: true,
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.created_at || new Date().toISOString()
      }));
    } catch {
      return [];
    }
  }

  async getBrandById(id: string): Promise<Brand | null> {
    try {
      const response = await this.request<ApiResponse<any>>(`/brands/${id}`);
      const item = response.data;
      return {
        id: String(item.id),
        name: createLocalizedString(item.name, item.name, item.name),
        slug: item.name?.toLowerCase().replace(/\s+/g, '-') || `brand-${item.id}`,
        logoPath: item.logo_url || undefined,
        imageUrl: item.logo_url || undefined,
        order: 0,
        isActive: true,
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.created_at || new Date().toISOString()
      };
    } catch {
      return null;
    }
  }

  async getCategories(): Promise<Category[]> {
    try {
      const response = await this.request<ApiResponse<any[]>>('/categories');
      return response.data.map((item: any, index: number) => ({
        id: String(item.id),
        name: createLocalizedString(item.name_fr || '', item.name_en || '', item.name_ru || ''),
        slug: item.slug || '',
        icon: item.icon || undefined,
        imageUrl: item.image_url || undefined,
        parentId: item.parent_id ? String(item.parent_id) : undefined,
        order: item.sort_order || index,
        isActive: true,
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.created_at || new Date().toISOString()
      }));
    } catch {
      return [];
    }
  }

  async getProducts(): Promise<ApiResponse<Product[]>> {
    try {
      const response = await this.request<ApiResponse<any[]>>('/products');
      
      return {
        data: response.data.map((item: any) => ({
          id: String(item.id),
          sku: item.sku || '',
          name: createLocalizedString(item.name_fr || '', item.name_en || '', item.name_ru || ''),
          description: createLocalizedString(item.desc_fr || '', item.desc_en || '', item.desc_ru || ''),
          slug: (item.sku || `product-${item.id}`).toLowerCase().replace(/\s+/g, '-'),
          price: item.price || 0,
          imageUrl: item.image_url || undefined,
          categoryId: item.category_id ? String(item.category_id) : '',
          brandId: item.brand_id ? String(item.brand_id) : '',
          stockQuantity: item.stock || 0,
          inStock: (item.stock || 0) > 0,
          order: 0,
          isActive: true,
          createdAt: item.created_at || new Date().toISOString(),
          updatedAt: item.created_at || new Date().toISOString()
        })),
        success: true
      };
    } catch {
      return { data: [], success: false };
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await this.request<ApiResponse<any>>(`/products/${id}`);
      const item = response.data;
      return {
        id: String(item.id),
        sku: item.sku || '',
        name: createLocalizedString(item.name_fr || '', item.name_en || '', item.name_ru || ''),
        description: createLocalizedString(item.desc_fr || '', item.desc_en || '', item.desc_ru || ''),
        slug: (item.sku || `product-${item.id}`).toLowerCase().replace(/\s+/g, '-'),
        price: item.price || 0,
        imageUrl: item.image_url || undefined,
        categoryId: item.category_id ? String(item.category_id) : '',
        brandId: item.brand_id ? String(item.brand_id) : '',
        stockQuantity: item.stock || 0,
        inStock: (item.stock || 0) > 0,
        order: 0,
        isActive: true,
        createdAt: item.created_at || new Date().toISOString(),
        updatedAt: item.created_at || new Date().toISOString()
      };
    } catch {
      return null;
    }
  }

  async getServices(): Promise<Service[]> {
    return [];
  }

  async getPageContent(): Promise<PageContent | null> {
    return null;
  }

  async getSiteConfig(): Promise<SiteConfig> {
    return {
      companyName: createLocalizedString("Yan's Deco", "Yan's Deco", "Yan's Deco"),
      tagline: createLocalizedString('', '', ''),
      phone1: '',
      phone2: '',
      email: '',
      address: createLocalizedString('', '', ''),
      workingHours: {
        mondayFriday: createLocalizedString('', '', ''),
        saturday: createLocalizedString('', '', ''),
        sunday: createLocalizedString('', '', ''),
        closed: createLocalizedString('', '', '')
      }
    };
  }

  async syncTranslations(): Promise<{ success: boolean; updated: number }> {
    return { success: false, updated: 0 };
  }

  async updateTranslation(): Promise<{ success: boolean }> {
    return { success: false };
  }
}

export const api = new ApiService();

export default api;
