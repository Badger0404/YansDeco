import React from 'react';

interface MarquesProps {
  theme: 'dark' | 'light';
}

interface Brand {
  name: string;
  logoLetter: string;
}

const brands: Brand[] = [
  { name: 'BOSTIK', logoLetter: 'B' },
  { name: 'SIKA', logoLetter: 'S' },
  { name: 'TOUPRET', logoLetter: 'T' },
  { name: 'PAREXLANKO', logoLetter: 'P' },
  { name: 'L\'OUTIL PARFAIT', logoLetter: 'O' },
];

const Marques: React.FC<MarquesProps> = ({ theme }) => {
  const isLight = theme === 'light';

  const cardClass = `rounded-2xl p-6 transition-all duration-300 cursor-pointer border flex flex-col items-center ${
    isLight 
      ? 'bg-white/40 backdrop-blur-md border-white/20 hover:border-[#FF6B00] hover:bg-white/60' 
      : 'bg-black/40 backdrop-blur-md border-white/10 hover:border-[#FF6B00] hover:bg-black/60'
  }`;

  return (
    <main className="pt-24">
      <section className="py-16 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-black italic text-5xl uppercase tracking-tight mb-4 drop-shadow-lg">
              <span className={isLight ? 'text-black' : 'text-white'}>NOS</span>{' '}
              <span className="text-[#FF6B00]">MARQUES</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-sm leading-relaxed drop-shadow-md ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Nous travaillons avec les plus grandes marques du secteur pour vous garantir qualité et fiabilité.
              <br />
              Des partenariats forts pour des résultats exceptionnels.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {brands.map((brand, index) => (
              <div
                key={index}
                className={`${cardClass} group transform hover:scale-105`}
              >
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                  isLight ? 'bg-white/60' : 'bg-black/60'
                }`}>
                  <span className={`text-3xl font-black italic ${
                    isLight ? 'text-black' : 'text-white'
                  }`}>
                    {brand.logoLetter}
                  </span>
                </div>
                
                <h3 className={`text-center font-bold text-lg uppercase tracking-wide mb-3 ${
                  isLight ? 'text-black' : 'text-white'
                }`}>
                  {brand.name}
                </h3>
                
                <div className="mt-auto flex items-center gap-1 text-[#FF6B00] text-xs font-medium uppercase tracking-wide group-hover:translate-x-1 transition-transform">
                  <span>Voir tous les produits</span>
                  <span className="text-sm">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Marques;