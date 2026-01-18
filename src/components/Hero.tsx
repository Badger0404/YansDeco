import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Slide {
  id: number;
  badge_ru: string | null;
  badge_fr: string | null;
  badge_en: string | null;
  title_ru: string;
  title_fr: string;
  title_en: string;
  subtitle_ru: string | null;
  subtitle_fr: string | null;
  subtitle_en: string | null;
  sort_order: number;
  is_active: number;
}

const HeroSection: React.FC = () => {
  const { i18n } = useTranslation();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/hero-slides');
      const data = await response.json();
      if (data.success) {
        setSlides(data.data);
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
  };

  const getSlideContent = (slide: Slide) => {
    const lang = i18n.language;
    return {
      badge: (slide as any)[`badge_${lang}`] || slide.badge_fr || '',
      title: (slide as any)[`title_${lang}`] || slide.title_fr || '',
      subtitle: (slide as any)[`subtitle_${lang}`] || slide.subtitle_fr || ''
    };
  };

  useEffect(() => {
    if (isPaused || slides.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 700);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handleDotClick = (index: number) => {
    if (index === currentSlide) return;
    
    setIsPaused(true);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
      setIsPaused(false);
    }, 700);
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center pt-32"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-opacity duration-700 ${
            isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}
          style={{
            transitionProperty: 'opacity, transform',
          }}
        >
          {slides.length > 0 && (
            <>
              <span className="inline-block bg-[#FF6B00] text-black px-5 py-1.5 text-xs font-bold uppercase tracking-wider mb-8">
                {getSlideContent(slides[currentSlide]).badge}
              </span>

              <h2
                className="text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tight mb-10 leading-[1.1] text-white drop-shadow-lg"
                dangerouslySetInnerHTML={{
                  __html: getSlideContent(slides[currentSlide]).title,
                }}
              />

              <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light tracking-wide drop-shadow-md">
                {getSlideContent(slides[currentSlide]).subtitle}
              </p>
            </>
          )}
        </div>

        <div className="flex flex-row items-center justify-center gap-5">
          <button className="bg-[#FF6B00] text-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all rounded-none">
            Calculer Mes Besoins
          </button>
          <button className="border-2 border-white text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all rounded-none">
            Demander Un Devis
          </button>
        </div>

        {slides.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-[#FF6B00] h-2 rounded-none w-8'
                    : 'bg-gray-500 hover:bg-gray-400 h-2 rounded-full w-2'
                }`}
                aria-label={`Aller au slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;