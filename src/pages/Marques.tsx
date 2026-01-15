import React from 'react';

interface MarquesProps {
  theme: 'dark' | 'light';
}

const Marques: React.FC<MarquesProps> = ({ theme }) => {
  const isLight = theme === 'light';
  const brands = [
    'Bostik', 'Sika', 'Weber', 'Knauf', 'Isover', 'Placo',
    'Roulean', 'Castorama', 'Leroy Merlin', 'Point.P',
    'Big Mat', 'Vm Materials', 'AkzoNobel', 'Farrow & Ball'
  ];

  const cardClass = `aspect-square flex items-center justify-center p-4 transition-colors duration-200 group cursor-pointer ${
    isLight 
      ? 'bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg hover:border-[#FF6B00]' 
      : 'bg-gray-800 border border-gray-700 hover:border-[#FF6B00]'
  }`;

  return (
    <main className="pt-24">
      <section className={`py-16 transition-colors duration-500 ${
        isLight ? 'bg-transparent' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wider ${
            isLight ? 'text-black' : 'text-white'
          }`}>
            Marques
          </h1>
          <p className={`mb-12 max-w-2xl ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
            Nous travaillons avec les plus grandes marques du secteur pour vous garantir qualité et fiabilité.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {brands.map((brand, index) => (
              <div key={index} className={cardClass}>
                <div className={`flex items-center justify-center w-full h-full ${
                  isLight ? 'bg-gray-100' : 'bg-gray-700'
                }`}>
                  <span className={`font-bold text-center transition-colors ${
                    isLight ? 'text-gray-700 group-hover:text-[#FF6B00]' : 'text-gray-400 group-hover:text-[#FF6B00]'
                  }`}>
                    {brand}
                  </span>
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