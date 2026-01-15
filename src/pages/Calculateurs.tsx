import React from 'react';

const Calculateurs: React.FC = () => {
  const calculators = [
    {
      title: 'MiMo-V2',
      description: 'Calculateur de consommation de matériaux pour vos projets de construction et rénovation.',
      status: 'Bientôt disponible'
    },
    {
      title: 'Calculateur de surface',
      description: 'Estimez la surface à couvrir pour vos revêtements de sol et muraux.',
      status: 'En développement'
    },
    {
      title: 'Calculateur de quantité',
      description: 'Déterminez la quantité exacte de matériaux nécessaire pour votre chantier.',
      status: 'En développement'
    }
  ];

  return (
    <main className="pt-24">
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 uppercase tracking-wider">
            Calculateurs
          </h1>
          <p className="text-gray-400 mb-12 max-w-2xl">
            Outils pratiques pour estimer vos besoins en matériaux et optimiser vos projets.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {calculators.map((calc, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 p-8 hover:border-[#FF6B00] transition-colors duration-200 group"
              >
                <div className="w-16 h-16 bg-gray-700 mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400 group-hover:text-[#FF6B00] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide group-hover:text-[#FF6B00] transition-colors">
                  {calc.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {calc.description}
                </p>
                <span className="text-[#FF6B00] text-sm font-medium uppercase tracking-wide">
                  {calc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Calculateurs;
