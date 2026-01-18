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
  User
} from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
  description_ru: string | null;
  description_fr: string | null;
  description_en: string | null;
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
  category_name: string | null;
}

const BrandDetail: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
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
      fetchBrand(id);
      fetchProducts(id);
    }
  }, [id]);

  const fetchBrand = async (brandId: string) => {
    try {
      const response = await fetch(`${API_URL}/brands/${brandId}`);
      const data = await response.json();
      if (data.success) {
        setBrand(data.data);
      } else {
        setError('Brand not found');
      }
    } catch (err) {
      console.error('Failed to load brand:', err);
      setError('Failed to load brand');
    }
  };

  const fetchProducts = async (brandId: string) => {
    try {
      const response = await fetch(`${API_URL}/brands/${brandId}/products`);
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

  const getCurrentDescription = () => {
    if (!brand) return '';
    const lang = i18n.language;
    if (lang === 'ru') return brand.description_ru;
    if (lang === 'fr') return brand.description_fr;
    if (lang === 'en') return brand.description_en;
    return brand.description_fr || '';
  };

  const getCurrentName = () => {
    if (!brand) return '';
    const lang = i18n.language;
    if (lang === 'ru') return brand.name;
    if (lang === 'fr') return brand.name;
    if (lang === 'en') return brand.name;
    return brand.name;
  };

  const getProductName = (product: Product) => {
    const lang = i18n.language;
    if (lang === 'ru') return product.name_ru || product.name_fr || product.name_en;
    if (lang === 'fr') return product.name_fr || product.name_ru || product.name_en;
    if (lang === 'en') return product.name_en || product.name_ru || product.name_fr;
    return product.name_fr || '';
  };

  const themeToggle = () => {
    const newTheme = isLight ? 'dark' : 'light';
    localStorage.setItem('site-theme', newTheme);
    setIsLight(!isLight);
    window.dispatchEvent(new Event('themechange'));
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

  if (error || !brand) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-gray-50' : 'bg-black'}`}>
        <div className="text-center">
          <p className={`text-red-500 mb-4 ${textClass}`}>{error}</p>
          <button
            onClick={() => navigate('/admin/brands')}
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
            onClick={() => navigate('/admin/brands')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            {t('admin.backToBrands')}
          </button>
          <div className={`h-4 w-px ${isLight ? 'bg-gray-300' : 'bg-white/10'}`} />
          
          <nav className="hidden md:flex items-center gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  item.id === 'brands'
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
            onClick={themeToggle}
            className={`flex items-center justify-center w-9 h-9 transition-all duration-300 ${
              isLight ? 'text-black hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'
            }`}
          >
            {isLight ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
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
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="w-48 h-48 md:w-64 md:h-64 object-contain"
                />
              ) : (
                <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center bg-transparent">
                  <span className={`text-8xl font-black italic ${textClass} opacity-50`}>
                    {brand.name.charAt(0)}
                  </span>
                </div>
              )}
              
              <div className="flex-1 text-center md:text-left">
                <h1 className={`font-black italic text-4xl md:text-5xl uppercase tracking-tight ${textClass} mb-4`}>
                  {getCurrentName()}
                </h1>
                {getCurrentDescription() && (
                  <p className={`text-lg ${mutedClass} max-w-2xl`}>
                    {getCurrentDescription()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <div className="mb-8">
            <h2 className={`font-bold italic text-2xl uppercase tracking-wide mb-6 ${textClass}`}>
              {t('admin.products.title')}
            </h2>
            
            {products.length === 0 ? (
              <div className={`text-center py-12 border ${borderClass} rounded-xl`}>
                <Package className={`w-12 h-12 mx-auto mb-4 ${mutedClass} opacity-50`} />
                <p className={`text-lg ${mutedClass}`}>
                  {t('admin.brands.noProducts')}
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
                        {product.category_name || 'Sans catégorie'}
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

export default BrandDetail;
