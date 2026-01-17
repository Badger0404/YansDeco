import React from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Warehouse, HardHat, FileText, CheckCircle2 } from 'lucide-react';

interface ServicesProps {
  theme: 'dark' | 'light';
}

interface Service {
  key: 'livraison' | 'retrait' | 'conseils' | 'devis';
  icon: React.ReactNode;
  tags: string[];
  gradient: string;
}

const services: Service[] = [
  {
    key: 'livraison',
    icon: <Truck className="w-10 h-10" />,
    tags: ['Livraison 24-48h', 'Camions grues'],
    gradient: 'from-orange-500/20'
  },
  {
    key: 'retrait',
    icon: <Warehouse className="w-10 h-10" />,
    tags: ['Preparation 2h', 'Aide au chargement'],
    gradient: 'from-blue-500/20'
  },
  {
    key: 'conseils',
    icon: <HardHat className="w-10 h-10" />,
    tags: ['Conseillers techniques', 'Conseils chantier'],
    gradient: 'from-green-500/20'
  },
  {
    key: 'devis',
    icon: <FileText className="w-10 h-10" />,
    tags: ['Tarifs pro', 'Facturation différée'],
    gradient: 'from-purple-500/20'
  },
];

const Services: React.FC<ServicesProps> = ({ theme }) => {
  const { t } = useTranslation();
  const isLight = theme === 'light';

  const cardClass = `relative rounded-2xl p-8 transition-all duration-300 cursor-pointer overflow-hidden ${
    isLight 
      ? 'bg-white/0 hover:bg-white/30' 
      : 'bg-transparent hover:bg-white/5'
  }`;

  const iconBgClass = isLight ? 'bg-white/30' : 'bg-white/5';
  const textClass = isLight ? 'text-black' : 'text-white';
  const descClass = isLight ? 'text-gray-700' : 'text-gray-300';

  return (
    <main className="min-h-screen pt-4">
      <section className="py-16 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-black italic text-5xl uppercase tracking-tight mb-4 drop-shadow-lg">
              <span className={isLight ? 'text-black' : 'text-white'}>{t('services.title').split(' ')[0]}</span>{' '}
              <span className="text-[#FF6B00]">{t('services.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-sm leading-relaxed drop-shadow-md ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {t('services.subtitle')}
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
                    {t(`services.${service.key}.title`)}{' '}
                    <span className="text-[#FF6B00]">{t(`services.${service.key}.desc`)}</span>
                  </h3>
                  
                  <p className={`text-sm leading-relaxed mb-6 ${descClass}`}>
                    {t(`services.${service.key}.desc`)}
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
