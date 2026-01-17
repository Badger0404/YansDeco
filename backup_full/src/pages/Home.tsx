import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface HomeProps {
  theme: 'dark' | 'light';
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

  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const accentClass = isLight ? 'text-[#FF6B00]' : 'text-[#FF6B00]';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-gray-400';
  const footerTextClass = isLight ? 'text-black' : 'text-[#FF6B00]';

  const slidesCount = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesCount);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSliderContent = (index: number) => {
    const slideKey = `slide${index + 1}` as const;
    return {
      label: t(`home.slider.${slideKey}.label`),
      title: t(`home.slider.${slideKey}.title`),
      description: t(`home.slider.${slideKey}.description`)
    };
  };

  const currentSlideData = getSliderContent(currentSlide);

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
              
              <div className={`p-8 rounded-2xl backdrop-blur-sm ${isLight ? 'bg-white/20' : 'bg-black/20'}`}>
                <p className={`text-center text-lg italic ${textClass}`}>
                  {t('home.comingSoon')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 w-full px-8 py-6 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8 items-center text-sm">
            <div>
              <Link to="/" className="font-bold tracking-wider">
                <span className={accentClass}>YAN'S</span>
                <span className={textClass}>DECO</span>
              </Link>
              <p className={`mt-2 ${footerTextClass}`}>
                {t('footer.tagline')}
              </p>
            </div>

            <div className="text-center">
              <span className={`block mb-2 font-bold uppercase tracking-widest ${mutedClass}`}>
                {t('footer.quickLinks')}
              </span>
              <span className={textClass}>
                <Link to="/" className={`hover:text-[#FF6B00] transition-colors ${textClass}`}>{t('nav.home')}</Link>
                <span className={accentClass}> • </span>
                <Link to="/catalogue" className={`hover:text-[#FF6B00] transition-colors ${textClass}`}>{t('nav.catalogue')}</Link>
                <span className={accentClass}> • </span>
                <Link to="/calculateurs" className={`hover:text-[#FF6B00] transition-colors ${textClass}`}>{t('nav.calculators')}</Link>
              </span>
            </div>

            <div className="text-right">
              <p className={footerTextClass}>{t('footer.copyright')}</p>
              <p className={`mt-2 ${footerTextClass}`}>
                {t('footer.location')}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
