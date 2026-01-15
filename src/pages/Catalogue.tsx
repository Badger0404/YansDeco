import React from 'react';

const Catalogue: React.FC = () => {
  const categories = [
    {
      name: 'PEINTURE_FINITION',
      products: '0 PRODUITS',
      image: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
    },
    {
      name: 'COLLES_MASTICS',
      products: '0 PRODUITS',
      image: 'linear-gradient(135deg, #1f1f1f 0%, #333333 100%)'
    },
    {
      name: 'OUTILLAGE_PEINTRE',
      products: '0 PRODUITS',
      image: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
    },
    {
      name: 'OUTILLAGE_CARRELEUR',
      products: '0 PRODUITS',
      image: 'linear-gradient(135deg, #222222 0%, #383838 100%)'
    },
    {
      name: 'PREPARATION_SOLS',
      products: '0 PRODUITS',
      image: 'linear-gradient(135deg, #1c1c1c 0%, #303030 100%)'
    },
    {
      name: 'FIXATION_VISSERIE',
      products: '0 PRODUITS',
      image: 'linear-gradient(135deg, #1e1e1e 0%, #353535 100%)'
    }
  ];

  return (
    <main className="pt-24">
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-black italic text-5xl uppercase tracking-tight mb-4">
              <span className="text-white">NOS</span>{' '}
              <span className="text-[#FF6B00]">RAYONS</span>
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">
              Du bâtiment à la rénovation, toute une gamme de matériaux, outillage et accessoires pour les professionnels et les particuliers.
              <br />
              Des conseils personnalisés pour vous accompagner dans tous vos projets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={index}
                className="relative h-80 rounded-xl overflow-hidden group cursor-pointer"
                style={{
                  background: category.image
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div>
                    <h3 className="font-bold italic text-xl uppercase text-white mb-1 leading-tight">
                      {category.name}
                    </h3>
                    <span className="text-[#FF6B00] text-xs font-medium uppercase tracking-wide">
                      {category.products}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs uppercase tracking-wider group-hover:text-[#FF6B00] transition-colors duration-200">
                    VOIR LES PRODUITS →
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

export default Catalogue;
