import React from 'react';

const Services: React.FC = () => {
  const services = [
    {
      title: 'Livraison',
      description: 'Livraison sur vos chantiers en Île-de-France. Camions-grues, porteurs et utilitaires disponibles.',
      icon: '🚚'
    },
    {
      title: 'Coupe de matériaux',
      description: 'Service de coupe de plaques de plâtre, isolants et panneaux sur mesure selon vos dimensions.',
      icon: '✂️'
    },
    {
      title: 'Conseil personnalisé',
      description: 'Équipe d\'experts à votre disposition pour vous guider dans vos choix techniques et esthétiques.',
      icon: '💡'
    },
    {
      title: 'Devis gratuit',
      description: 'Analyse de vos besoins et établissement de devis détaillés sous 24h.',
      icon: '📋'
    },
    {
      title: 'Click & Collect',
      description: 'Commandez en ligne et retirez vos matériaux dans l\'heure qui suit dans l\'entrepôt de votre choix.',
      icon: '🖱️'
    },
    {
      title: 'Location de matériel',
      description: 'Louez le matériel nécessaire à vos travaux : mini-pelles, bétonnières, échafaudages...',
      icon: '🔧'
    }
  ];

  return (
    <main className="pt-24">
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 uppercase tracking-wider">
            Services
          </h1>
          <p className="text-gray-400 mb-12 max-w-2xl">
            Des services complets pour accompagner tous vos projets de construction et rénovation.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 p-8 hover:border-[#FF6B00] transition-colors duration-200 group"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide group-hover:text-[#FF6B00] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;
