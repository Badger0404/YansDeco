import React from 'react';

interface AccueilProps {
  theme: 'dark' | 'light';
}

const Accueil: React.FC<AccueilProps> = ({ theme }) => {
  const isLight = theme === 'light';

  return (
    <main>
      <section className={`py-20 transition-colors duration-500 ${
        isLight ? 'bg-transparent' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className={`text-3xl font-bold mb-10 text-center uppercase tracking-wider ${
            isLight ? 'text-black' : 'text-white'
          }`}>
            Populaires
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div key={item} className={`aspect-square flex items-center justify-center border ${
              isLight 
                ? 'bg-white/80 backdrop-blur-md border-gray-200 shadow-lg' 
                : 'bg-black/50 backdrop-blur-md border-gray-700'
              }`}>
                <span className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-500'}`}>Produit {item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Accueil;