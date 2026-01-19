import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package,
  ArrowLeft
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

interface BrandPublicProps {
  theme: 'dark' | 'light';
}

const BrandPublic: React.FC<BrandPublicProps> = ({ theme }) => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const isLight = theme === 'light';

  const [brand, setBrand] = useState<Brand | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

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

  const getProductName = (product: Product) => {
    const lang = i18n.language;
    if (lang === 'ru') return product.name_ru || product.name_fr || product.name_en;
    if (lang === 'fr') return product.name_fr || product.name_ru || product.name_en;
    if (lang === 'en') return product.name_en || product.name_ru || product.name_fr;
    return product.name_fr || '';
  };

  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-gray-200' : 'border-white/10';

  if (loading) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-gray-50' : 'bg-black'}`}>
        <div className="text-center">
          <Package className={`w-8 h-8 mx-auto mb-4 text-[#FF6B00] animate-spin`} />
          <p className={textClass}>Chargement...</p>
        </div>
      </main>
    );
  }

  if (error || !brand) {
    return (
      <main className={`min-h-screen flex items-center justify-center ${isLight ? 'bg-gray-50' : 'bg-black'}`}>
        <div className="text-center">
          <p className={`text-red-500 mb-4 ${textClass}`}>{error}</p>
          <Link to="/marques" className="px-4 py-2 bg-[#FF6B00] text-black rounded-lg">
            {t('admin.back')}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
          to="/marques"
          className={`inline-flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-wide hover:text-[#FF6B00] transition-colors ${textClass}`}
        >
          <ArrowLeft className="w-4 h-4" />
          {t('brands.back')}
        </Link>

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
                {brand.name}
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
            {t('brands.productsTitle')}
          </h2>
          
          {products.length === 0 ? (
            <div className={`text-center py-12 border ${borderClass} rounded-xl`}>
              <Package className={`w-12 h-12 mx-auto mb-4 ${mutedClass} opacity-50`} />
              <p className={`text-lg ${mutedClass}`}>
                {t('brands.noProducts')}
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
                >
                  <Link
                    to={`/product/${product.id}`}
                    className={`block border ${borderClass} rounded-xl overflow-hidden group hover:border-[#FF6B00] transition-colors`}
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
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default BrandPublic;
