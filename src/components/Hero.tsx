import React, { useState, useEffect } from 'react';

interface Slide {
  badge: string;
  title: string;
  sub: string;
}

const slides: Slide[] = [
  {
    badge: 'CONSEIL EXPERT',
    title: "TOUTE GAMME <span class='text-[#FF6B00]'>DE MATÉRIAUX</span>",
    sub: "Des revêtements aux outils, tout pour vos projets",
  },
  {
    badge: 'QUALITÉ PROFESSIONNELLE',
    title: "SERVICE LOCAL <span class='text-[#FF6B00]'>EN ÎLE-DE-FRANCE</span>",
    sub: "Prix compétitifs pour les pros et les particuliers",
  },
  {
    badge: 'QUALITÉ PROFESSIONNELLE',
    title: "SERVICE LOCAL <span class='text-[#FF6B00]'>DE MATERFRANCE</span>",
    sub: "Prix compétitifs aux outils, tout pour particuliers",
  },
];

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 700);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index: number) => {
    if (index !== currentSlide) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsAnimating(false);
      }, 700);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black dark:bg-black light:bg-white pt-20 bg-splash-texture">
      <div className="absolute inset-0 bg-grid-pattern"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`transition-opacity duration-700 ${
            isAnimating ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <span className="inline-block bg-[#FF6B00] text-black px-5 py-1.5 text-xs font-bold uppercase tracking-wider mb-8">
            {slides[currentSlide].badge}
          </span>

          <h2
            className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tight mb-10 leading-[1.15] dark:text-white light:text-black"
            dangerouslySetInnerHTML={{
              __html: slides[currentSlide].title,
            }}
          />

          <p className="text-lg md:text-xl text-gray-400 dark:text-gray-400 light:text-gray-600 mb-12 max-w-2xl mx-auto font-light tracking-wide">
            {slides[currentSlide].sub}
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-5">
          <button className="bg-[#FF6B00] text-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all rounded-none">
            Calculer Mes Besoins
          </button>
          <button className="border-2 border-white dark:border-white light:border-black text-white dark:text-white light:text-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black light:hover:bg-black light:hover:text-white transition-all rounded-none">
            Demander Un Devis
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 mt-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-[#FF6B00] h-2 rounded-none'
                  : 'bg-gray-600 dark:bg-gray-600 light:bg-gray-300 h-2 rounded-full'
              } ${index === currentSlide ? 'w-8' : 'w-2'}`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
