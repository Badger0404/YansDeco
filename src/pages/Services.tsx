import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Truck, Warehouse, HardHat, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Service {
  id: number;
  key: string;
  icon: string | null;
  icon_emoji: string | null;
  gradient_from: string | null;
  gradient_to: string | null;
  tags_ru: string | null;
  tags_fr: string | null;
  tags_en: string | null;
  title_ru: string | null;
  title_fr: string | null;
  title_en: string | null;
  subtitle_ru: string | null;
  subtitle_fr: string | null;
  subtitle_en: string | null;
  description_ru: string | null;
  description_fr: string | null;
  description_en: string | null;
  sort_order: number;
  is_active: number;
}

interface ServicesProps {
  theme: 'dark' | 'light';
}

const iconMap: Record<string, React.ReactNode> = {
  'livraison': <Truck className="w-10 h-10" />,
  'retrait': <Warehouse className="w-10 h-10" />,
  'conseils': <HardHat className="w-10 h-10" />,
  'devis': <FileText className="w-10 h-10" />
};

const Services: React.FC<ServicesProps> = ({ theme }) => {
  const { t, i18n } = useTranslation();
  const isLight = theme === 'light';
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/services`);
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      } else {
        setError('Failed to load services');
      }
    } catch (err) {
      console.error('Failed to load services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const getServiceTitle = (service: Service): string => {
    const lang = i18n.language;
    if (lang === 'ru') return service.title_ru || service.title_fr || service.title_en || '';
    if (lang === 'fr') return service.title_fr || service.title_ru || service.title_en || '';
    if (lang === 'en') return service.title_en || service.title_ru || service.title_fr || '';
    return service.title_fr || '';
  };

  const getServiceSubtitle = (service: Service): string => {
    const lang = i18n.language;
    if (lang === 'ru') return service.subtitle_ru || service.subtitle_fr || service.subtitle_en || '';
    if (lang === 'fr') return service.subtitle_fr || service.subtitle_ru || service.subtitle_en || '';
    if (lang === 'en') return service.subtitle_en || service.subtitle_ru || service.subtitle_fr || '';
    return service.subtitle_fr || '';
  };

  const getServiceDescription = (service: Service): string => {
    const lang = i18n.language;
    if (lang === 'ru') return service.description_ru || service.description_fr || service.description_en || '';
    if (lang === 'fr') return service.description_fr || service.description_ru || service.description_en || '';
    if (lang === 'en') return service.description_en || service.description_ru || service.description_fr || '';
    return service.description_fr || '';
  };

  const getServiceTags = (service: Service): string[] => {
    const lang = i18n.language;
    if (lang === 'ru') return service.tags_ru?.split(',').map(s => s.trim()) || [];
    if (lang === 'fr') return service.tags_fr?.split(',').map(s => s.trim()) || [];
    if (lang === 'en') return service.tags_en?.split(',').map(s => s.trim()) || [];
    return service.tags_fr?.split(',').map(s => s.trim()) || [];
  };

  const cardClass = `relative rounded-2xl p-8 transition-all duration-300 cursor-pointer overflow-hidden ${
    isLight 
      ? 'bg-white/0 hover:bg-white/30' 
      : 'bg-transparent hover:bg-white/5'
  }`;

  const iconBgClass = isLight ? 'bg-white/30' : 'bg-white/5';
  const textClass = isLight ? 'text-black' : 'text-white';
  const descClass = isLight ? 'text-gray-700' : 'text-gray-300';

  if (loading) {
    return (
      <main className="min-h-screen pt-4">
        <section className="py-16 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Truck className="w-12 h-12 mx-auto mb-4 animate-pulse text-[#FF6B00]" />
                <p className={isLight ? 'text-black' : 'text-white'}>Chargement...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen pt-4">
        <section className="py-16 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-500">{error}</p>
              <button
                onClick={fetchServices}
                className="mt-4 px-4 py-2 bg-[#FF6B00] text-black rounded-lg"
              >
                Retry
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-4">
      <section className="py-16 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h1 className="font-black italic text-5xl uppercase tracking-tight mb-4 drop-shadow-lg">
                <span className={isLight ? 'text-black' : 'text-white'}>{t('services.title').split(' ')[0]}</span>{' '}
                <span className="text-[#FF6B00]">{t('services.title').split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className={`max-w-2xl mx-auto text-sm leading-relaxed drop-shadow-md ${descClass}`}>
                {t('services.subtitle')}
              </p>
            </div>

            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`${cardClass} group transform hover:scale-[1.02]`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient_from || 'from-gray-500/20'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    
                    <div className="relative z-10">
                      <div className={`inline-flex p-4 rounded-2xl ${iconBgClass} mb-6 text-[#FF6B00]`}>
                        {service.icon_emoji ? (
                          <span className="text-4xl">{service.icon_emoji}</span>
                        ) : (
                          iconMap[service.key] || <Truck className="w-10 h-10" />
                        )}
                      </div>
                      
                      <h3 className={`font-black italic text-3xl uppercase tracking-tight mb-2 ${textClass}`}>
                        {getServiceTitle(service)}{' '}
                        <span className="text-[#FF6B00]">{getServiceSubtitle(service)}</span>
                      </h3>
                      
                      <p className={`text-sm leading-relaxed mb-6 ${descClass}`}>
                        {getServiceDescription(service)}
                      </p>
                      
                      <div className="flex flex-wrap gap-3">
                        {getServiceTags(service).map((tag, tagIndex) => (
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
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-12 ${descClass}`}>
                <Truck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Services bientôt disponibles</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Services;
