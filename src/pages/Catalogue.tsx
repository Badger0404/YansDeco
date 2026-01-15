import React from 'react';

const Catalogue: React.FC = () => {
  const categories = [
    'Revêtements de sol',
    'Carrelage',
    'Peinture',
    'Outillage',
    'Matériaux de construction',
    'Isolation',
    'Plomberie',
    'Électricité'
  ];

  return (
    <main className="pt-24">
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 uppercase tracking-wider">
            Catalogue
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-4 py-2 bg-gray-800 text-gray-300 text-sm font-medium uppercase tracking-wide border border-gray-700 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors duration-200"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
              <div
                key={item}
                className="bg-gray-800 aspect-square flex flex-col items-center justify-center border border-gray-700 p-4 hover:border-[#FF6B00] transition-colors duration-200 group cursor-pointer"
              >
                <div className="w-20 h-20 bg-gray-700 mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-400 text-sm text-center group-hover:text-white transition-colors">
                  Produit {item}
                </span>
                <span className="text-[#FF6B00] font-bold mt-2">-- €</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Catalogue;
