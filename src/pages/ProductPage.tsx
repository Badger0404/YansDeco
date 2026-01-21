import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Check, ChevronRight, Package, RefreshCw, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

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

interface ProductPageProps {
  theme: 'dark' | 'light';
}

const ProductPage: React.FC<ProductPageProps> = ({ theme }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const productId = params.id;
  const isLight = theme === 'light';
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem } = useCart();
  const fetched = useRef<string>('');

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    const key = productId || '';
    if (fetched.current === key) return;
    fetched.current = key;
    
    if (productId) {
      fetchProduct(productId);
    } else {
      setError('Product ID not found');
      setLoading(false);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching product:', id);
      const response = await fetch(`${API_URL}/products/${id}`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      if (data.success) {
        setProduct(data.data);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Failed to load product:', err);
      setError('Failed to load product. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (): string => {
    if (!product) return '';
    const lang = i18n.language;
    if (lang === 'ru') return product.name_ru || product.name_fr || product.name_en || '';
    if (lang === 'fr') return product.name_fr || product.name_ru || product.name_en || '';
    if (lang === 'en') return product.name_en || product.name_ru || product.name_fr || '';
    return product.name_fr || '';
  };

  const getProductDescription = (): string => {
    if (!product) return '';
    const lang = i18n.language;
    if (lang === 'ru') return product.desc_ru || product.desc_fr || product.desc_en || '';
    if (lang === 'fr') return product.desc_fr || product.desc_ru || product.desc_en || '';
    if (lang === 'en') return product.desc_en || product.desc_ru || product.desc_fr || '';
    return product.desc_fr || '';
  };

  const handleBack = (): void => {
    navigate(-1);
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
                <p className={`mt-4 ${mutedClass}`}>Загрузка товара...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !product) {
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
              <p className="text-red-500">{error || 'Product not found'}</p>
              <p className="text-sm mt-2">Product ID: {productId}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const productName = getProductName();
  const productDescription = getProductDescription();

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="aspect-square flex items-center justify-center p-8">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={productName}
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Package className="w-20 h-20 text-gray-300" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col"
              >
                <div className="mb-4">
                  <span className="text-[#FF6B00] text-sm font-bold uppercase tracking-wide">
                    {product.brand_name || 'YAN\'S DECO'}
                  </span>
                </div>

                <h1 className={`font-black italic text-3xl uppercase tracking-tight mb-4 ${textClass}`}>
                  {productName}
                </h1>

                <p className="text-2xl font-bold text-[#FF6B00] mb-6">
                  {product.price?.toFixed(2)} €
                </p>

                <p className={`text-sm leading-relaxed mb-6 ${mutedClass}`}>
                  {productDescription || 'Aucune description disponible.'}
                </p>

                <div className="mb-8">
                  <h3 className={`font-bold italic text-lg uppercase mb-4 ${textClass}`}>
                    {t('contact.features')}
                  </h3>
                  <ul className="space-y-2">
                    <li className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                      <Check className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                      Réf: {product.sku}
                    </li>
                    <li className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                      <Check className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                      Stock: {product.stock} unités
                    </li>
                    {product.category_name && (
                      <li className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                        <Check className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                        Catégorie: {product.category_name}
                      </li>
                    )}
                    {product.is_popular === 1 && (
                      <li className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                        <Check className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                        ⭐ Produit populaire
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-auto">
                  {product && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className={`text-sm uppercase tracking-wide ${mutedClass}`}>
                          {t('cart.quantity')}:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className={`p-2 rounded-lg transition-colors ${
                              isLight 
                                ? 'bg-gray-100 hover:bg-gray-200 text-black' 
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className={`w-12 text-center font-bold text-lg ${textClass}`}>
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            className={`p-2 rounded-lg transition-colors ${
                              isLight 
                                ? 'bg-gray-100 hover:bg-gray-200 text-black' 
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className={`text-sm ${mutedClass}`}>
                          ({product.stock} {t('contact.stock')})
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            addItem({
                              id: product.id,
                              name: getProductName(),
                              price: product.price,
                              image_url: product.image_url,
                              quantity: quantity,
                              sku: product.sku
                            });
                            setAddedToCart(true);
                            setTimeout(() => setAddedToCart(false), 2000);
                          }}
                          className="flex-1 bg-[#FF6B00] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#FF8533] transition-all duration-200 flex items-center justify-center gap-3"
                        >
                          {addedToCart ? (
                            <>
                              <Check className="w-5 h-5" />
                              {t('cart.added')}
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-5 h-5" />
                              {t('contact.addToCart')}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
