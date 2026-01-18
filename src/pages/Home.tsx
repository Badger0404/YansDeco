import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Package, RefreshCw, ChevronRight } from 'lucide-react';

interface HomeProps {
  theme: 'dark' | 'light';
}

interface Product {
  id: number;
  name_fr: string | null;
  name_ru: string | null;
  name_en: string | null;
  desc_fr: string | null;
  desc_ru: string | null;
  desc_en: string | null;
  price: number;
  image_url: string | null;
  sku: string;
  is_popular: number;
  brand_name: string | null;
}

const slideVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const Home: React.FC<HomeProps> = ({ theme }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isLight = theme === 'light';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const accentClass = isLight ? 'text-[#FF6B00]' : 'text-[#FF6B00]';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-gray-400';

  const slidesCount = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();
      if (data.success) {
        const popular = data.data.filter((p: Product) => p.is_popular === 1);
        setPopularProducts(popular.slice(0, 4));
      }
    } catch (err) {
      console.error('Failed to load popular products:', err);
    } finally {
      setLoadingPopular(false);
    }
  };

  const getProductName = (product: Product) => {
    const lang = i18n.language;
    if (lang === 'ru') return product.name_ru || product.name_fr || product.name_en || 'Товар';
    if (lang === 'en') return product.name_en || product.name_fr || product.name_ru || 'Product';
    return product.name_fr || product.name_ru || product.name_en || 'Produit';
  };

  const getSliderContent = (index: number) => {
    const slideKey = `slide${index + 1}` as const;
    return {
      label: t(`home.slider.${slideKey}.label`),
      title: t(`home.slider.${slideKey}.title`),
      description: t(`home.slider.${slideKey}.description`)
    };
  };

  const currentSlideData = getSliderContent(currentSlide);

  const [popularSlide, setPopularSlide] = useState(0);

  useEffect(() => {
    if (popularProducts.length <= 1) return;
    
    const interval = setInterval(() => {
      setPopularSlide((prev) => (prev + 1) % popularProducts.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [popularProducts.length]);

  return (
    <div className="h-screen overflow-hidden">
      <main className="h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentSlide}-${i18n.language}`}
                    variants={slideVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    <span className={`text-xs font-bold uppercase tracking-widest ${accentClass} block mb-3`}>
                      {currentSlideData.label}
                    </span>
                    <h1 className={`font-black italic text-5xl lg:text-6xl uppercase leading-none tracking-tight ${textClass}`}>
                      {currentSlideData.title}
                    </h1>
                    <p className={`mt-4 text-sm leading-relaxed max-w-lg ${mutedClass}`}>
                      {currentSlideData.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <button 
                  onClick={() => navigate('/calculateurs')}
                  className="bg-[#FF6B00] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#FF8533] transition-all duration-200"
                >
                  {t('home.cta.calculate')}
                </button>
                <button 
                  onClick={() => navigate('/contact')}
                  className={`border-2 px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-200 ${
                    isLight 
                      ? 'border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white' 
                      : 'border-white/30 text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {t('home.cta.quote')}
                </button>
              </div>

              <div className="flex gap-2 mt-6">
                {Array.from({ length: slidesCount }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      index === currentSlide 
                        ? 'bg-[#FF6B00]' 
                        : 'bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={t(`home.slider.slide${index + 1}.label`)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <div className="text-center mb-6">
                <span className={`text-sm font-medium uppercase tracking-widest ${accentClass}`}>
                  {t('home.popular')}
                </span>
              </div>
              
              {loadingPopular ? (
                <div className={`p-8 rounded-2xl backdrop-blur-sm flex items-center justify-center ${isLight ? 'bg-white/20' : 'bg-black/20'}`}>
                  <RefreshCw className={`w-8 h-8 text-[#FF6B00] animate-spin`} />
                </div>
              ) : popularProducts.length > 0 ? (
                <div className="relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={popularSlide}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className={`p-6 rounded-2xl cursor-pointer ${isLight ? 'bg-white/40' : 'bg-black/40'} hover:bg-[#FF6B00]/20 transition-all duration-300`}
                      onClick={() => navigate(`/product/${popularProducts[popularSlide].id}`)}
                    >
                      <div className="aspect-square flex items-center justify-center mb-4">
                        {popularProducts[popularSlide].image_url ? (
                          <img
                            src={popularProducts[popularSlide].image_url}
                            alt={getProductName(popularProducts[popularSlide])}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <Package className={`w-20 h-20 ${mutedClass}`} />
                        )}
                      </div>
                      <h4 className={`font-black italic text-xl uppercase tracking-tight mb-2 ${textClass}`}>
                        {getProductName(popularProducts[popularSlide])}
                      </h4>
                      <p className={`text-sm ${mutedClass} line-clamp-2 mb-3`}>
                        {popularProducts[popularSlide].brand_name && `Marque: ${popularProducts[popularSlide].brand_name}`}
                      </p>
                      <p className={`text-2xl font-bold ${accentClass}`}>
                        {popularProducts[popularSlide].price.toFixed(2)} €
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  
                  {popularProducts.length > 1 && (
                    <>
                      <button
                        onClick={() => setPopularSlide((prev) => (prev - 1 + popularProducts.length) % popularProducts.length)}
                        className={`absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isLight ? 'bg-white/80 text-black' : 'bg-black/50 text-white'} hover:bg-[#FF6B00] hover:text-black`}
                        aria-label="Produit précédent"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                      </button>
                      <button
                        onClick={() => setPopularSlide((prev) => (prev + 1) % popularProducts.length)}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isLight ? 'bg-white/80 text-black' : 'bg-black/50 text-white'} hover:bg-[#FF6B00] hover:text-black`}
                        aria-label="Produit suivant"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      
                      <div className="flex justify-center gap-2 mt-4">
                        {popularProducts.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setPopularSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              index === popularSlide 
                                ? 'bg-[#FF6B00]' 
                                : 'bg-white/30 hover:bg-white/50'
                            }`}
                            aria-label={`Voir le produit ${index + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className={`p-8 rounded-2xl backdrop-blur-sm ${isLight ? 'bg-white/20' : 'bg-black/20'}`}>
                  <p className={`text-center text-lg italic ${textClass}`}>
                    {t('home.comingSoon')}
                  </p>
                  <button
                    onClick={() => navigate('/catalogue')}
                    className={`mt-4 mx-auto flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${accentClass} hover:underline`}
                  >
                    {t('catalogue.products')}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
