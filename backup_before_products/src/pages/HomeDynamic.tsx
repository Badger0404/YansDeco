import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { Brand, Category } from '../types/localization';
import { useLocalized, getLang } from '../hooks/useLocalized';

const Home: React.FC = () => {
  const { i18n } = useTranslation();
  const { currentLang, getLang: tObj } = useLocalized();
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        api.setLanguage(currentLang);
        
        const [brandsData, categoriesData] = await Promise.all([
          api.getBrands(),
          api.getCategories()
        ]);
        
        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentLang]);

  const slides = [
    {
      label: tObj({
        fr: 'LIVRAISON EXPRESS DISPONIBLE',
        en: 'EXPRESS DELIVERY AVAILABLE',
        ru: 'ДОСТУПНА ЭКСПРЕСС-ДОСТАВКА'
      }),
      title: tObj({
        fr: 'MATÉRIAUX DE CONSTRUCTION AVEC LIVRAISON RAPIDE',
        en: 'CONSTRUCTION MATERIALS WITH FAST DELIVERY',
        ru: 'СТРОИТЕЛЬНЫЕ МАТЕРИАЛЫ С БЫСТРОЙ ДОСТАВКОЙ'
      }),
      description: tObj({
        fr: "Basé à Groslay, nous servons les professionnels et particuliers à Montmorency et dans toute l'Île-de-France. Qualité industrielle, service local.",
        en: "Based in Groslay, we serve professionals and individuals in Montmorency and throughout Île-de-France. Industrial quality, local service.",
        ru: 'Базируясь в Гролэ, мы обслуживаем профессионалов и частных лиц в Монморанси и по всему региону Иль-де-Франс.'
      })
    }
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6B00]" />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden">
      <main className="h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <AnimatePresence mode="wait">
                {slides.map((slide, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B00] block mb-3">
                      {slide.label}
                    </span>
                    <h1 className="font-black italic text-5xl uppercase leading-none tracking-tight text-white">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-sm leading-relaxed max-w-lg text-gray-400">
                      {slide.description}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex gap-4 mt-8">
                <button className="bg-[#FF6B00] text-black px-8 py-4 text-sm font-bold uppercase rounded-xl">
                  {i18n.t('home.cta.calculate')}
                </button>
                <button className="border-2 border-white/30 text-white px-8 py-4 text-sm font-bold uppercase rounded-xl">
                  {i18n.t('home.cta.quote')}
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-[#FF6B00] mb-6">
                ★ {i18n.t('brands.title')}
              </h2>
              
              <div className="grid grid-cols-3 gap-4">
                {brands.slice(0, 6).map((brand) => (
                  <div
                    key={brand.id}
                    className="aspect-square rounded-xl border border-transparent hover:border-[#FF6B00] transition-all duration-500 flex items-center justify-center bg-transparent"
                  >
                    <img
                      src={brand.imageUrl || brand.logoPath}
                      alt={getLang(brand.name)}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 px-8 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8 text-sm">
          <div>
            <h3 className="font-bold tracking-wider">
              <span className="text-[#FF6B00]">YAN'S</span>
              <span className="text-white">DECO</span>
            </h3>
            <p className="mt-2 text-white">
              {i18n.t('footer.tagline')}
            </p>
          </div>

          <div className="text-center">
            <span className="block mb-2 font-bold uppercase tracking-widest text-gray-400">
              {i18n.t('footer.quickLinks')}
            </span>
            <div className="text-white">
              {categories.slice(0, 3).map((category) => (
                <span key={category.id}>
                  {getLang(category.name)}
                  <span className="text-[#FF6B00]"> • </span>
                </span>
              ))}
            </div>
          </div>

          <div className="text-right text-white">
            <p>{i18n.t('footer.copyright')}</p>
            <p className="mt-2 text-[#FF6B00]">
              {i18n.t('footer.location')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
