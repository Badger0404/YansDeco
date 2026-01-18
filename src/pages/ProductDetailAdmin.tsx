import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ChevronRight,
  Package,
  RefreshCw,
  Check,
  Upload,
  Pencil,
  Globe
} from 'lucide-react';

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

const ProductDetailAdmin: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

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
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`);
      const data = await response.json();
      if (data.success) {
        setProduct(data.data);
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Failed to load product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (product: Product): string => {
    const lang = i18n.language;
    if (lang === 'ru') return product.name_ru || product.name_fr || product.name_en || '';
    if (lang === 'fr') return product.name_fr || product.name_ru || product.name_en || '';
    if (lang === 'en') return product.name_en || product.name_ru || product.name_fr || '';
    return product.name_fr || '';
  };

  const getProductDescription = (product: Product, lang: string): string => {
    const field = lang === 'ru' ? 'desc_ru' : lang === 'fr' ? 'desc_fr' : 'desc_en';
    return (product as any)[field] || '';
  };

  const mutedClass = isLight ? 'text-zinc-500' : 'text-zinc-400';
  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const borderClass = isLight ? 'border-zinc-200' : 'border-zinc-700/50';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 bg-[#FF6B00] text-black rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const descriptionFr = getProductDescription(product, 'fr');
  const descriptionEn = getProductDescription(product, 'en');
  const descriptionRu = getProductDescription(product, 'ru');

  return (
    <div className="min-h-screen">
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLight 
          ? 'bg-white/95 backdrop-blur-md border-gray-200' 
          : 'bg-black/95 backdrop-blur-md border-white/10'
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            {t('admin.backToProducts')}
          </button>
        </div>
      </header>

      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="relative">
                  <div className="aspect-square bg-transparent rounded-3xl overflow-hidden flex items-center justify-center">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={getProductName(product)}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Package className="w-32 h-32 text-zinc-300" />
                        <p className={`mt-4 text-sm ${mutedClass}`}>Aucune image</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6">
                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors hover:border-[#FF6B00]/50 cursor-pointer`}>
                      <Upload className={`w-6 h-6 mx-auto mb-2 ${mutedClass}`} />
                      <p className={`text-xs ${mutedClass}`}>Glissez-déposez pour remplacer</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-6"
              >
                <div>
                  {product.brand_name && (
                    <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B00] mb-2">
                      {product.brand_name}
                    </p>
                  )}
                  <h1 className="font-black italic text-4xl uppercase tracking-tight text-black dark:text-white leading-tight">
                    {getProductName(product)}
                  </h1>
                </div>

                <div className="flex items-baseline gap-3">
                  <p className="text-5xl font-bold text-[#FF6B00]">
                    {product.price?.toFixed(2)} €
                  </p>
                </div>

                <p className={`text-sm ${mutedClass}`}>
                  Réf: <span className="font-mono">{product.sku}</span>
                </p>

                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${borderClass} ${textClass}`}>
                    {product.category_name || 'Sans catégorie'}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${borderClass} ${
                    product.is_popular 
                      ? 'border-[#FF6B00] text-[#FF6B00]' 
                      : 'border-green-500/50 text-green-500'
                  }`}>
                    {product.is_popular ? '⭐ Populaire' : 'Actif'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-sm ${mutedClass}`}>Stock:</span>
                  <span className={`text-lg font-bold ${
                    product.stock > 50 ? 'text-green-500' : 
                    product.stock > 20 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {product.stock} unités
                  </span>
                </div>

                {(descriptionFr || descriptionEn || descriptionRu) && (
                  <div className="pt-4 border-t border-dashed border-zinc-300 dark:border-zinc-700">
                    <h3 className={`font-bold italic text-lg uppercase tracking-wide ${textClass} mb-4`}>
                      Caractéristiques
                    </h3>
                    <ul className="space-y-3">
                      {descriptionFr && (
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                          <span className={`text-sm ${textClass}`}>{descriptionFr}</span>
                        </li>
                      )}
                      {descriptionEn && descriptionEn !== descriptionFr && (
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                          <span className={`text-sm ${textClass}`}>{descriptionEn}</span>
                        </li>
                      )}
                      {descriptionRu && descriptionRu !== descriptionFr && descriptionRu !== descriptionEn && (
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                          <span className={`text-sm ${textClass}`}>{descriptionRu}</span>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="pt-4">
                  <h3 className={`font-bold italic text-lg uppercase tracking-wide ${textClass} mb-4`}>
                    Descriptions
                  </h3>
                  <div className="space-y-4">
                    {[
                      { lang: 'fr', label: 'Français', desc: descriptionFr },
                      { lang: 'en', label: 'English', desc: descriptionEn },
                      { lang: 'ru', label: 'Русский', desc: descriptionRu }
                    ].map((item) => (
                      <div 
                        key={item.lang}
                        className={`p-4 rounded-xl border border-dashed ${borderClass} cursor-pointer hover:border-[#FF6B00]/50 transition-colors`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className={`w-4 h-4 ${mutedClass}`} />
                          <span className={`text-xs font-bold uppercase tracking-wide ${mutedClass}`}>
                            {item.label}
                          </span>
                        </div>
                        <p className={`text-sm ${textClass}`}>
                          {item.desc || 'Pas de description'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FF6B00] text-black font-bold italic uppercase tracking-wide rounded-xl hover:bg-[#FF8533] transition-colors"
                  >
                    <Pencil className="w-5 h-5" />
                    Modifier le produit
                  </button>
                </div>

                <p className={`text-xs ${mutedClass} text-center pt-2`}>
                  Créé le {new Date(product.created_at).toLocaleDateString('fr-FR')}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetailAdmin;
