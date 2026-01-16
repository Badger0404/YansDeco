import React, { useState, useEffect, useRef } from 'react';

const words = ["MATÉRIAUX", "PEINTURES", "OUTILS", "SOLUTIONS"];

const HeroSection: React.FC = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedWord, setDisplayedWord] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseDuration = 2000;

  useEffect(() => {
    const word = words[currentWordIndex];
    
    const handleTyping = () => {
      if (isDeleting) {
        setDisplayedWord(word.substring(0, displayedWord.length - 1));
        if (displayedWord.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setDisplayedWord(word.substring(0, displayedWord.length + 1));
        if (displayedWord.length === word.length) {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      }
    };

    const timeout = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timeout);
  }, [currentWordIndex, displayedWord, isDeleting]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block bg-[#FF6B00] text-black px-5 py-1.5 text-xs font-bold uppercase tracking-wider mb-8">
          Conseil Expert
        </span>

        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tight mb-10 leading-[1.15] drop-shadow-lg">
          TOUTE GAMME DE{' '}
          <span className="text-[#FF6B00] inline-block min-w-[200px] text-left">
            {displayedWord}
            <span className="animate-pulse">|</span>
          </span>
        </h2>

        <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light tracking-wide drop-shadow-md">
          Des revêtements aux outils, tout pour vos projets
        </p>

        <div className="flex flex-row items-center justify-center gap-5">
          <button className="bg-[#FF6B00] text-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all rounded-none">
            Calculer Mes Besoins
          </button>
          <button className="border-2 border-white text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all rounded-none">
            Demander Un Devis
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;