import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Package, RefreshCw } from 'lucide-react';

interface Product {
  id: number;
  sku: string;
  price: number;
  stock: number;
  brand_id: number | null;
  category_id: number | null;
  is_popular: number;
  image_url: string | null;
  name_ru: string | null;
  name_fr: string | null;
  name_en: string | null;
  desc_ru: string | null;
  desc_fr: string | null;
  desc_en: string | null;
  brand_name: string | null;
  category_name: string | null;
  created_at: string;
}

interface Category {
  id: number;
  slug: string;
  name_ru: string | null;
  name_fr: string | null;
  name_en: string | null;
  desc_ru: string | null;
  desc_fr: string | null;
  desc_en: string | null;
  parent_id: number | null;
}

interface ProductDetailProps {
  theme: 'dark' | 'light';
}

const ProductDetail: React.FC<ProductDetailProps> = ({ theme }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const isLight = theme === 'light';
  const [subcategory, setSubcategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetched = useRef<string>('');

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    const key = `${categoryId}-${subcategoryId}`;
    if (fetched.current === key) return;
    fetched.current = key;
    
    if (categoryId) {
      fetchData(parseInt(categoryId), subcategoryId ? parseInt(subcategoryId) : null);
    }
  }, [categoryId, subcategoryId]);

  const fetchData = async (catId: number, subId: number | null) => {
    setLoading(true);
    setError('');
    try {
      const categoryResponse = await fetch(`${API_URL}/${subId ? `categories/${subId}` : `categories/${catId}`}`);
      const categoryData = await categoryResponse.json();
      if (categoryData.success) {
        setSubcategory(categoryData.data);
      }

      const productsResponse = await fetch(`${API_URL}/categories/${subId || catId}/products`);
      const productsData = await productsResponse.json();
      
      if (productsData.success) {
        setProducts(productsData.data);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoryName = (): string => {
    if (!subcategory) return subcategoryId?.replace(/_/g, ' ') || '';
    const lang = i18n.language;
    if (lang === 'ru') return subcategory.name_ru || subcategory.name_fr || subcategory.name_en || '';
    if (lang === 'fr') return subcategory.name_fr || subcategory.name_ru || subcategory.name_en || '';
    if (lang === 'en') return subcategory.name_en || subcategory.name_ru || subcategory.name_fr || '';
    return subcategory.name_fr || '';
  };

  const getProductName = (product: Product): string => {
    const lang = i18n.language;
    if (lang === 'ru') return product.name_ru || product.name_fr || product.name_en || '';
    if (lang === 'fr') return product.name_fr || product.name_ru || product.name_en || '';
    if (lang === 'en') return product.name_en || product.name_ru || product.name_fr || '';
    return product.name_fr || '';
  };

  const getProductDescription = (product: Product): string => {
    const lang = i18n.language;
    if (lang === 'ru') return product.desc_ru || product.desc_fr || product.desc_en || '';
    if (lang === 'fr') return product.desc_fr || product.desc_ru || product.desc_en || '';
    if (lang === 'en') return product.desc_en || product.desc_ru || product.desc_fr || '';
    return product.desc_fr || '';
  };

  const handleBack = (): void => {
    navigate(-1);
  };

  const handleProductClick = (productId: number): void => {
    navigate(`/product/${productId}`);
  };

  const mutedClass = isLight ? 'text-gray-600' : 'text-gray-400';
  const textClass = isLight ? 'text-black' : 'text-white';

  if (loading) {
    return (
      <main className="min-h-screen pt-4">
        <section className="py-12 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="w-10 h-10 text-[#FF6B00] animate-spin mx-auto" />
                <p className={`mt-4 ${mutedClass}`}>Загрузка товаров...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen pt-4">
        <section className="py-12 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleBack}
              className={`mb-8 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
              }`}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              {t('catalogue.back')}
            </button>
            <div className={`text-center py-12 ${mutedClass}`}>
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const subcategoryName = getSubcategoryName();

  return (
    <main className="min-h-screen pt-4">
      <section className="py-12 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className={`mb-8 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${
              isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            {t('catalogue.back')}
          </button>

          <div className="text-center mb-10">
            <h1 className={`font-black italic text-4xl uppercase tracking-tight mb-2 ${textClass}`}>
              <span className={isLight ? 'text-black' : 'text-white'}>{subcategoryName}</span>
            </h1>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleProductClick(product.id)}
                  className="relative rounded-xl overflow-hidden group cursor-pointer transition-all duration-1000 ease-out hover:scale-[1.05] border border-transparent hover:border-[#FF6B00] bg-transparent"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
                  
                  <div className="relative p-5 cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[#FF6B00] text-xs font-bold uppercase tracking-wide">
                        {product.brand_name || 'YAN\'S DECO'}
                      </span>
                      <span className={`text-lg font-bold ${textClass}`}>
                        {product.price.toFixed(2)} €
                      </span>
                    </div>
                    
                    <h3 className={`font-bold italic text-lg uppercase mb-2 leading-tight ${
                      isLight ? 'text-black' : 'text-white'
                    } group-hover:text-[#FF6B00] transition-colors`}>
                      {getProductName(product)}
                    </h3>
                    
                    <p className={`text-xs mb-4 ${mutedClass} line-clamp-2`}>
                      {getProductDescription(product)}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      {product.stock > 0 ? (
                        <span className={`text-xs px-2 py-1 ${isLight ? 'bg-green-100' : 'bg-green-500/20'} text-green-600 dark:text-green-400 rounded-full`}>
                          {product.stock} en stock
                        </span>
                      ) : (
                        <span className={`text-xs px-2 py-1 ${isLight ? 'bg-red-100' : 'bg-red-500/20'} text-red-600 dark:text-red-400 rounded-full`}>
                          Rupture
                        </span>
                      )}
                      <span className={`text-xs font-medium ${mutedClass} group-hover:text-[#FF6B00] transition-colors flex items-center gap-1`}>
                        <span>Voir le produit</span>
                        <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 rounded-xl ${isLight ? 'bg-white/30' : 'bg-white/5'} border border-white/10 ${mutedClass}`}>
              <Package className={`w-12 h-12 mx-auto mb-4 opacity-50`} />
              <p>Aucun produit disponible dans cette catégorie pour le moment.</p>
              <p className="text-sm mt-2">Revenez bientôt !</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
