import React from 'react';
import { Truck, Warehouse, HardHat, FileText, CheckCircle2 } from 'lucide-react';

interface ServicesProps {
  theme: 'dark' | 'light';
}

interface Service {
  title: string;
  titleOrange: string;
  description: string;
  icon: React.ReactNode;
  tags: string[];
  gradient: string;
}

const services: Service[] = [
  {
    title: 'Livraison',
    titleOrange: 'Rapide',
    description: 'Livraison rapide sur Groslay, et toute l\'Île-de-France. Notre flotte de véhicules équipée pour tous types de chantiers.',
    icon: <Truck className="w-10 h-10" />,
    tags: ['Livraison 24-48h', 'Camions grues'],
    gradient: 'from-orange-500/20'
  },
  {
    title: 'Retrait en',
    titleOrange: 'Magasin',
    description: 'Preparation sous 2h pour les commandes passées en ligne. Service rapide et efficace pour les professionnels et particuliers.',
    icon: <Warehouse className="w-10 h-10" />,
    tags: ['Preparation 2h', 'Aide au chargement'],
    gradient: 'from-blue-500/20'
  },
  {
    title: 'Conseils',
    titleOrange: 'Techniques',
    description: 'Notre équipe vous accompagne dans le choix de vos matériaux. Conseils personnalisés pour tous vos projets.',
    icon: <HardHat className="w-10 h-10" />,
    tags: ['Conseillers techniques', 'Conseils chantier'],
    gradient: 'from-green-500/20'
  },
  {
    title: 'Devis',
    titleOrange: 'Professionnels',
    description: 'Devis gratuit et détaillé pour les professionnels du bâtiment. Tarifs compétitifs et conditions flexibles.',
    icon: <FileText className="w-10 h-10" />,
    tags: ['Tarifs pro', 'Facturation différée'],
    gradient: 'from-purple-500/20'
  },
];

const Services: React.FC<ServicesProps> = ({ theme }) => {
  const isLight = theme === 'light';

  const cardClass = `relative rounded-2xl p-8 transition-all duration-300 cursor-pointer border overflow-hidden ${
    isLight 
      ? 'bg-white/40 backdrop-blur-md border-white/20 hover:border-[#FF6B00]' 
      : 'bg-black/40 backdrop-blur-md border-white/10 hover:border-[#FF6B00]'
  }`;

  const iconBgClass = isLight ? 'bg-white/60' : 'bg-black/60';
  const textClass = isLight ? 'text-black' : 'text-white';
  const descClass = isLight ? 'text-gray-700' : 'text-gray-300';

  return (
    <main className="pt-24">
      <section className="py-16 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-black italic text-5xl uppercase tracking-tight mb-4 drop-shadow-lg">
              <span className={isLight ? 'text-black' : 'text-white'}>NOS</span>{' '}
              <span className="text-[#FF6B00]">SERVICES</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-sm leading-relaxed drop-shadow-md ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}>
              Des services complets pour accompagner tous vos projets de construction et rénovation.
              <br />
              L\'expertise YAN\'S DECO à votre service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`${cardClass} group transform hover:scale-[1.02]`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className={`inline-flex p-4 rounded-2xl ${iconBgClass} mb-6 text-[#FF6B00]`}>
                    {service.icon}
                  </div>
                  
                  <h3 className={`font-black italic text-3xl uppercase tracking-tight mb-2 ${textClass}`}>
                    {service.title}{' '}
                    <span className="text-[#FF6B00]">{service.titleOrange}</span>
                  </h3>
                  
                  <p className={`text-sm leading-relaxed mb-6 ${descClass}`}>
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    {service.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;