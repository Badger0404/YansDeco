import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ChevronRight,
  Package,
  Tag,
  Award,
  Globe,
  Calculator,
  Settings,
  RefreshCw,
  LogOut,
  User,
  Edit
} from 'lucide-react';

interface Category {
  id: number;
  slug: string;
  icon: string | null;
  image_url: string | null;
  parent_id: number | null;
  sort_order: number;
  name_ru: string | null;
  name_fr: string | null;
  name_en: string | null;
  desc_ru: string | null;
  desc_fr: string | null;
  desc_en: string | null;
  created_at: string;
}

interface Product {
  id: number;
  sku: string;
  price: number;
  stock: number;
  image_url: string | null;
  name_ru: string | null;
  name_fr: string | null;
  name_en: string | null;
  brand_name: string | null;
}

const CategoryDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  useEffect(() => {
    if (id) {
      fetchCategory(id);
      fetchProducts(id);
      fetchSubcategories(id);
    }
  }, [id]);

  const fetchCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`${API_URL}/categories/${categoryId}`);
      const data = await response.json();
      if (data.success) {
        setCategory(data.data);
      } else {
        setError('Category not found');
      }
    } catch (err) {
      console.error('Failed to load category:', err);
      setError('Failed to load category');
    }
  };

  const fetchProducts = async (categoryId: string) => {
    try {
      const response = await fetch(`${API_URL}/categories/${categoryId}/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (categoryId: string) => {
    try {
      const response = await fetch(`${API_URL}/categories?parent_id=${categoryId}`);
      const data = await response.json();
      if (data.success) {
        setSubcategories(data.data);
      }
    } catch (err) {
      console.error('Failed to load subcategories:', err);
    }
  };

  const getCurrentDescription = () => {
    if (!category) return '';
    const lang = i18n.language;
    if (lang === 'ru') return category.desc_ru;
    if (lang === 'fr') return category.desc_fr;
    if (lang === 'en') return category.desc_en;
    return category.desc_fr || '';
  };

  const getCurrentName = () => {
    if (!category) return '';
    const lang = i18n.language;
    if (lang === 'ru') return category.name_ru || category.name_fr || category.name_en;
    if (lang === 'fr') return category.name_fr || category.name_ru || category.name_en;
    if (lang === 'en') return category.name_en || category.name_fr || category.name_ru;
    return category.name_fr || '';
  };

  const getCategoryName = (cat: Category) => {
    const lang = i18n.language;
    if (lang === 'ru') return cat.name_ru || cat.name_fr || cat.name_en;
    if (lang === 'fr') return cat.name_fr || cat.name_ru || cat.name_en;
    if (lang === 'en') return cat.name_en || cat.name_fr || cat.name_ru;
    return cat.name_fr || '';
  };

  const getProductName = (product: Product) => {
    const lang = i18n.language;
    if (lang === 'ru') return product.name_ru || product.name_fr || product.name_en;
    if (lang === 'fr') return product.name_fr || product.name_ru || product.name_en;
    if (lang === 'en') return product.name_en || product.name_fr || product.name_ru;
    return product.name_fr || '';
  };

  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const headerBgClass = isLight ? 'bg-white/95 border-gray-200' : 'bg-black/95 border-white/10';

  const adminNavItems = [
    { id: 'products', label: t('admin.sections.products.title'), icon: <Package className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', label: t('admin.sections.categories.title'), icon: <Tag className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', label: t('admin.sections.brands.title'), icon: <Award className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'translations', label: t('admin.sections.translations.title'), icon: <Globe className="w-4 h-4" />, path: '/admin/translations' },
    { id: 'calculators', label: t('admin.sections.calculators.title'), icon: <Calculator className="w-4 h-4" />, path: '/admin/calculators' },
    { id: 'settings', label: t('admin.sections.settings.title'), icon: <Settings className="w-4 h-4" />, path: '/admin/settings' },
  ];

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-gray-50' : 'bg-black'}`}>
        <RefreshCw className={`w-8 h-8 text-[#FF6B00] animate-spin`} />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-gray-50' : 'bg-black'}`}>
        <div className="text-center">
          <p className={`text-red-500 mb-4 ${textClass}`}>{error}</p>
          <button
            onClick={() => navigate('/admin/categories')}
            className="px-4 py-2 bg-[#FF6B00] text-black rounded-lg"
          >
            {t('admin.back')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/categories')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            {t('admin.backToCategories')}
          </button>
          <div className={`h-4 w-px ${isLight ? 'bg-gray-300' : 'bg-white/10'}`} />
          
          <nav className="hidden md:flex items-center gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  item.id === 'categories'
                    ? isLight ? 'bg-[#FF6B00] text-black' : 'bg-[#FF6B00] text-black'
                    : isLight ? 'text-gray-600 hover:bg-gray-100 hover:text-[#FF6B00]' : 'text-zinc-400 hover:bg-white/5 hover:text-[#FF6B00]'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/admin/categories/${id}/edit`)}
            className={`flex items-center gap-2 px-4 py-2 bg-[#FF6B00] text-black rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors`}
          >
            <Edit className="w-4 h-4" />
            {t('admin.categories.edit')}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-black" />
            </div>
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-[#FF6B00]/10 to-transparent rounded-xl flex items-center justify-center overflow-hidden">
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={getCurrentName() || ''}
                    className="w-full h-full object-contain p-4"
                  />
                ) : category.icon ? (
                  <div className="text-6xl">
                    {category.icon}
                  </div>
                ) : (
                  <Tag className={`w-16 h-16 ${mutedClass}`} />
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className={`font-black italic text-3xl md:text-5xl uppercase tracking-tight ${textClass} mb-4`}>
                  {getCurrentName()}
                </h1>
                {getCurrentDescription() && (
                  <p className={`text-lg ${mutedClass} max-w-2xl mb-4`}>
                    {getCurrentDescription()}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span className={`px-3 py-1 rounded-full ${
                    isLight ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {t('admin.content.active')}
                  </span>
                  <span className={mutedClass}>
                    {t('admin.categories.order')}: {category.sort_order}
                  </span>
                  {category.parent_id && (
                    <span className={mutedClass}>
                      Parent ID: {category.parent_id}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Subcategories */}
          {subcategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-12"
            >
              <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-6 ${textClass}`}>
                {t('admin.categories.subcategories')} ({subcategories.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {subcategories.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className={`group relative rounded-xl border ${borderClass} overflow-hidden transition-all duration-300 ${
                      isLight ? 'bg-white hover:shadow-lg' : 'bg-gray-800 hover:border-[#FF6B00]/50'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00]/5 to-transparent rounded-lg flex items-center justify-center">
                          {sub.icon ? (
                            <span className="text-xl">{sub.icon}</span>
                          ) : (
                            <Tag className={`w-6 h-6 ${mutedClass}`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg ${textClass} group-hover:text-[#FF6B00] transition-colors`}>
                            {getCategoryName(sub)}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            isLight ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {t('admin.content.active')}
                          </span>
                        </div>
                      </div>
                      
                      <p className={`text-sm ${mutedClass} mb-4 line-clamp-2`}>
                        {(sub as any)[`desc_${i18n.language}`] || 
                         sub.desc_fr || 
                         'Aucune description'}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {t('admin.categories.order')}: {sub.sort_order}
                        </div>
                        <button
                          onClick={() => navigate(`/admin/categories/${sub.id}`)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLight ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-700 text-gray-400'
                          }`}
                          title={t('admin.categories.view')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Products */}
          <div className="mb-8">
            <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-6 ${textClass}`}>
              {t('admin.products.title')} ({products.length})
            </h2>
            
            {products.length === 0 ? (
              <div className={`text-center py-12 border ${borderClass} rounded-xl`}>
                <Package className={`w-12 h-12 mx-auto mb-4 ${mutedClass} opacity-50`} />
                <p className={`text-lg ${mutedClass}`}>
                  {t('admin.categories.noProducts')}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border ${borderClass} rounded-xl overflow-hidden group`}
                  >
                    <div className="aspect-square bg-transparent flex items-center justify-center p-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={getProductName(product) || 'Product'}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Package className={`w-16 h-16 ${mutedClass} opacity-30`} />
                      )}
                    </div>
                    <div className={`p-4 border-t ${borderClass}`}>
                      <p className={`text-xs ${mutedClass} mb-1`}>
                        {product.brand_name || 'No brand'}
                      </p>
                      <h3 className={`font-bold italic text-lg uppercase tracking-wide mb-2 ${textClass} group-hover:text-[#FF6B00] transition-colors line-clamp-1`}>
                        {getProductName(product)}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className={`text-xl font-bold text-[#FF6B00]`}>
                          {product.price.toFixed(2)} €
                        </span>
                        {product.stock > 0 ? (
                          <span className={`text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full`}>
                            {product.stock} en stock
                          </span>
                        ) : (
                          <span className={`text-xs px-2 py-1 bg-red-500/20 text-red-500 rounded-full`}>
                            Rupture
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryDetail;