import React from 'react';

const Accueil: React.FC = () => {
  return (
    <main>
      <section className="relative min-h-screen flex items-center justify-center bg-black pt-20 bg-splash-texture">
        <div className="absolute inset-0 bg-grid-pattern"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#FF6B00] text-black px-5 py-1.5 text-xs font-bold uppercase tracking-wider mb-8">
            Conseil Expert
          </span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tight mb-10 leading-[1.15] text-white">
            TOUTE GAMME
            <br />
            <span className="text-[#FF6B00] italic">DE MATÉRIAUX</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-light tracking-wide">
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

      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-10 text-center uppercase tracking-wider">
            Populaires
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="bg-gray-800 aspect-square flex items-center justify-center border border-gray-700">
                <span className="text-gray-500 text-sm">Produit {item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Accueil;
