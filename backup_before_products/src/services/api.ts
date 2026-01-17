import { 
  Brand, 
  Category, 
  Product, 
  Service, 
  PageContent, 
  SiteConfig,
  SupportedLanguages 
} from '../types/localization';

interface ImportMeta {
  env: {
    VITE_API_URL?: string;
  };
}

const API_BASE = (import.meta as unknown as ImportMeta).env?.VITE_API_URL || '/api/v1';

interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
  success: boolean;
  message?: string;
}

interface GetProductsParams {
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: 'price_asc' | 'price_desc' | 'name' | 'newest';
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

  async getBrands(activeOnly: boolean = true): Promise<Brand[]> {
    const params = activeOnly ? '?isActive=true' : '';
    const response = await this.request<ApiResponse<Brand[]>>(`/brands${params}`);
    return response.data;
  }

  async getBrandBySlug(slug: string): Promise<Brand | null> {
    try {
      const response = await this.request<ApiResponse<Brand>>(`/brands/slug/${slug}`);
      return response.data;
    } catch {
      return null;
    }
  }

  async getCategories(parentId?: string, activeOnly: boolean = true): Promise<Category[]> {
    const params = new URLSearchParams();
    if (parentId) params.append('parentId', parentId);
    if (activeOnly) params.append('isActive', 'true');
    
    const query = params.toString() ? `?${params.toString()}` : '';
    const response = await this.request<ApiResponse<Category[]>>(`/categories${query}`);
    return response.data;
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await this.request<ApiResponse<Category>>(`/categories/slug/${slug}`);
      return response.data;
    } catch {
      return null;
    }
  }

  async getProducts(params: GetProductsParams = {}): Promise<ApiResponse<Product[]>> {
    const searchParams = new URLSearchParams();
    
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.subcategoryId) searchParams.append('subcategoryId', params.subcategoryId);
    if (params.brandId) searchParams.append('brandId', params.brandId);
    if (params.search) searchParams.append('search', params.search);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));
    if (params.sort) searchParams.append('sort', params.sort);
    
    searchParams.append('lang', this.language);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<ApiResponse<Product[]>>(`/products${query}`);
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await this.request<ApiResponse<Product>>(`/products/${id}?lang=${this.language}`);
      return response.data;
    } catch {
      return null;
    }
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const response = await this.request<ApiResponse<Product>>(`/products/slug/${slug}?lang=${this.language}`);
      return response.data;
    } catch {
      return null;
    }
  }

  async getServices(activeOnly: boolean = true): Promise<Service[]> {
    const params = activeOnly ? '?isActive=true' : '';
    const response = await this.request<ApiResponse<Service[]>>(`/services${params}`);
    return response.data;
  }

  async getPageContent(slug: string): Promise<PageContent | null> {
    try {
      const response = await this.request<ApiResponse<PageContent>>(`/pages/${slug}?lang=${this.language}`);
      return response.data;
    } catch {
      return null;
    }
  }

  async getSiteConfig(): Promise<SiteConfig> {
    const response = await this.request<ApiResponse<SiteConfig>>('/config?lang=' + this.language);
    return response.data;
  }

  async syncTranslations(): Promise<{ success: boolean; updated: number }> {
    const response = await this.request<{ success: boolean; updated: number }>('/admin/sync-translations', {
      method: 'POST',
    });
    return response;
  }

  async updateTranslation(
    key: string, 
    language: SupportedLanguages, 
    value: string
  ): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/admin/translations', {
      method: 'PUT',
      body: JSON.stringify({ key, language, value }),
    });
  }
}

export const api = new ApiService();

export default api;
