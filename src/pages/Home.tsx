import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Package, ChevronRight } from 'lucide-react';

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

const Home: React.FC<HomeProps> = ({ theme }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isLight = theme === 'light';
  const [currentSlide, setCurrentSlide] = useState(0);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const fetched = useRef(false);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const accentClass = isLight ? 'text-[#FF6B00]' : 'text-[#FF6B00]';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-gray-400';

  const slidesCount = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 5250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
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
    <div className="min-h-screen">
      <main className="min-h-[90vh] flex flex-col justify-center items-center py-12 lg:py-20">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end">
            <div className="flex flex-col justify-between h-[600px] sm:h-[640px] lg:h-[680px] w-full max-w-xl pb-4">
              <div className="relative flex-grow flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentSlide}-${i18n.language}`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ 
                      duration: 0.6, 
                      ease: [0.25, 0.1, 0.25, 1],
                      opacity: { duration: 0.25 }
                    }}
                    className="flex flex-col"
                  >
                    <span className={`text-xs md:text-sm font-bold uppercase tracking-widest ${accentClass} block mb-2`}>
                      {currentSlideData.label}
                    </span>
                    <h1 className={`font-black italic text-4xl md:text-5xl lg:text-6xl uppercase leading-none tracking-tight ${textClass}`}>
                      {currentSlideData.title}
                    </h1>
                    <div className="h-[80px] mt-3">
                      <p className="text-sm md:text-base leading-relaxed max-w-md text-gray-400 line-clamp-3">
                        {currentSlideData.description}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  {Array.from({ length: slidesCount }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide 
                          ? 'bg-[#FF6B00]' 
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={t(`home.slider.slide${index + 1}.label`)}
                    />
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => navigate('/calculateurs')}
                    className="bg-[#FF6B00] text-black px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-[#FF8533] transition-all duration-200"
                  >
                    {t('home.cta.calculate')}
                  </button>
                  <button 
                    onClick={() => navigate('/contact')}
                    className={`border-2 px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                      isLight 
                        ? 'border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white' 
                        : 'border-white/30 text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    {t('home.cta.quote')}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center mt-8 lg:mt-0 h-full">
              <div className="text-center mb-4 sm:mb-6">
                <span className={`text-[10px] sm:text-xs md:text-sm font-medium uppercase tracking-widest ${accentClass}`}>
                  {t('home.popular')}
                </span>
              </div>
              
              {loadingPopular ? (
                <div className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl flex flex-col ${isLight ? 'bg-white/40' : 'bg-black/40'} h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[680px]`}>
                  <div className="aspect-[4/3] w-full bg-black/20 rounded-lg mb-4"></div>
                  <div className="h-6 bg-black/20 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-black/20 rounded mb-2 w-1/2"></div>
                  <div className="h-8 bg-black/20 rounded mt-auto w-1/3"></div>
                </div>
              ) : popularProducts.length > 0 ? (
                <div className="relative h-full">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={popularSlide}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl cursor-pointer flex flex-col h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[680px] ${isLight ? 'bg-white/40' : 'bg-black/40'} hover:bg-[#FF6B00]/20 transition-all duration-300`}
                      onClick={() => navigate(`/product/${popularProducts[popularSlide].id}`)}
                    >
                      <div className="aspect-[4/3] w-full flex items-center justify-center mb-4 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden">
                        {popularProducts[popularSlide].image_url ? (
                          <img
                            src={popularProducts[popularSlide].image_url}
                            alt={getProductName(popularProducts[popularSlide])}
                            className="w-full h-full object-contain p-3"
                            loading="eager"
                          />
                        ) : (
                          <Package className={`w-16 h-16 sm:w-20 sm:h-20 ${mutedClass}`} />
                        )}
                      </div>
                      <div className="flex flex-col flex-grow h-full">
                        <h4 className={`font-black italic text-sm sm:text-base lg:text-lg uppercase tracking-tight mb-2 line-clamp-2 min-h-[3rem] flex-shrink-0 ${textClass}`}>
                          {getProductName(popularProducts[popularSlide])}
                        </h4>
                        <p className={`text-[10px] sm:text-xs ${mutedClass} line-clamp-1 mb-3`}>
                          {popularProducts[popularSlide].brand_name && `Marque: ${popularProducts[popularSlide].brand_name}`}
                        </p>
                        <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${accentClass} mt-auto`}>
                          {popularProducts[popularSlide].price.toFixed(2)} €
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  {popularProducts.length > 1 && (
                    <>
                    <button
                        onClick={() => setPopularSlide((prev) => (prev - 1 + popularProducts.length) % popularProducts.length)}
                        className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full transition-colors ${isLight ? 'bg-white/80 text-black' : 'bg-black/50 text-white'} hover:bg-[#FF6B00] hover:text-black z-10`}
                        aria-label="Produit précédent"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
                      </button>
                      <button
                        onClick={() => setPopularSlide((prev) => (prev + 1) % popularProducts.length)}
                        className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full transition-colors ${isLight ? 'bg-white/80 text-black' : 'bg-black/50 text-white'} hover:bg-[#FF6B00] hover:text-black z-10`}
                        aria-label="Produit suivant"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      
                      <div className="flex justify-center gap-1.5 sm:gap-2 absolute bottom-4 left-0 right-0">
                        {popularProducts.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setPopularSlide(index)}
                            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
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
                <div className={`p-6 sm:p-8 rounded-xl sm:rounded-2xl backdrop-blur-sm ${isLight ? 'bg-white/20' : 'bg-black/20'}`}>
                  <p className={`text-center text-base sm:text-lg italic ${textClass}`}>
                    {t('home.comingSoon')}
                  </p>
                  <button
                    onClick={() => navigate('/catalogue')}
                    className={`mt-3 sm:mt-4 mx-auto flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold uppercase tracking-wide ${accentClass} hover:underline`}
                  >
                    {t('catalogue.products')}
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
