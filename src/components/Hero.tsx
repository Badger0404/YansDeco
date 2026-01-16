import React, { useState, useEffect } from 'react';

interface Slide {
  badge: string;
  title: string;
  sub: string;
}

const slides: Slide[] = [
  {
    badge: 'Livraison Express disponible',
    title: "Matériaux de construction <span class='text-[#FF6B00]'>avec livraison rapide</span>",
    sub: "Basé à Groslay, nous servons les professionnels et particuliers à Montmorency et dans toute l'Île-de-France. Qualité industrielle, service local. Nos prix vous surprendront agréablement.",
  },
  {
    badge: 'Qualité Professionnelle',
    title: "SERVICE LOCAL <span class='text-[#FF6B00]'>EN ÎLE-DE-FRANCE</span>",
    sub: "Prix compétitifs pour les pros et les particuliers",
  },
  {
    badge: 'Conseil Expert',
    title: "TOUTE GAMME <span class='text-[#FF6B00]'>DE MATÉRIAUX</span>",
    sub: "Des revêtements aux outils, tout pour vos projets",
  },
];

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsAnimating(false);
      }, 700);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

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
      className="relative min-h-screen flex items-center justify-center pt-20"
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
          <span className="inline-block bg-[#FF6B00] text-black px-5 py-1.5 text-xs font-bold uppercase tracking-wider mb-8">
            {slides[currentSlide].badge}
          </span>

          <h2
            className="text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tight mb-10 leading-[1.1] text-white drop-shadow-lg"
            dangerouslySetInnerHTML={{
              __html: slides[currentSlide].title,
            }}
          />

          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light tracking-wide drop-shadow-md">
            {slides[currentSlide].sub}
          </p>
        </div>

        <div className="flex flex-row items-center justify-center gap-5">
          <button className="bg-[#FF6B00] text-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all rounded-none">
            Calculer Mes Besoins
          </button>
          <button className="border-2 border-white text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all rounded-none">
            Demander Un Devis
          </button>
        </div>

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
      </div>
    </section>
  );
};

export default HeroSection;