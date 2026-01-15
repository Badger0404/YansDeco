import React from 'react';

const Marques: React.FC = () => {
  const brands = [
    'Bostik', 'Sika', 'Weber', 'Knauf', 'Isover', 'Placo',
    'Roulean', 'Castorama', 'Leroy Merlin', 'Point.P',
    'Big Mat', 'Vm Materials', 'AkzoNobel', 'Farrow & Ball'
  ];

  return (
    <main className="pt-24">
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 uppercase tracking-wider">
            Marques
          </h1>
          <p className="text-gray-400 mb-12 max-w-2xl">
            Nous travaillons avec les plus grandes marques du secteur pour vous garantir qualité et fiabilité.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-gray-800 aspect-square flex items-center justify-center border border-gray-700 p-4 hover:border-[#FF6B00] transition-colors duration-200 group cursor-pointer"
              >
                <div className="flex items-center justify-center w-full h-full bg-gray-700">
                  <span className="text-gray-400 font-bold text-center group-hover:text-[#FF6B00] transition-colors">
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
