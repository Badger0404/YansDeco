import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';

interface MarquesProps {
  theme: 'dark' | 'light';
}

interface Brand {
  name: string;
  logoPath: string;
  imageUrl?: string;
}

const brands: Brand[] = [
  { name: 'BOSTIK', logoPath: '/assets/brands/bostik.svg' },
  { name: 'SIKA', logoPath: '/assets/brands/sika.svg' },
  { name: 'TOUPRET', logoPath: '/assets/brands/toupret.svg' },
  { name: 'PAREXLANKO', logoPath: '/assets/brands/parexlanko.svg' },
  { name: 'L\'OUTIL PARFAIT', logoPath: '/assets/brands/loutilparfait.svg' },
];

const Marques: React.FC<MarquesProps> = ({ theme }) => {
  const { t } = useTranslation();
  const isLight = theme === 'light';

  const cardClass = `rounded-2xl p-6 transition-all duration-1000 cursor-pointer border border-transparent hover:border-[#FF6B00] flex flex-col items-center bg-transparent group hover:scale-[1.05]`;

  const renderBrandImage = (brand: Brand) => {
    const hasCustomImage = brand.imageUrl && brand.imageUrl.trim() !== '';
    
    if (hasCustomImage) {
      return (
        <img
          src={brand.imageUrl}
          alt={`Logo ${brand.name}`}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
          }}
        />
      );
    }

    return (
      <div className={`fallback-icon w-full h-full flex items-center justify-center transition-colors duration-300 ${
        isLight ? 'text-[#FF6B00]' : 'text-white'
      }`}>
        <Building2 className="w-16 h-16" strokeWidth={1.5} />
      </div>
    );
  };

  return (
    <main className="min-h-screen pt-4">
      <section className="py-16 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-black italic text-5xl uppercase tracking-tight mb-4 drop-shadow-lg">
              <span className={isLight ? 'text-black' : 'text-white'}>{t('marques.title').split(' ')[0]}</span>{' '}
              <span className="text-[#FF6B00]">{t('marques.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-sm leading-relaxed drop-shadow-md ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {t('marques.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {brands.map((brand, index) => (
              <div
                key={index}
                className={cardClass}
              >
                <div className="w-24 h-24 flex items-center justify-center mb-4">
                  {renderBrandImage(brand)}
                </div>
                
                <h3 className={`text-center font-bold text-lg uppercase tracking-wide mb-3 transition-colors duration-300 ${
                  isLight ? 'text-black' : 'text-white'
                }`}>
                  {brand.name}
                </h3>
                
                <div className={`mt-auto flex items-center gap-1 text-xs font-medium uppercase tracking-wide group-hover:translate-x-1 transition-all duration-300 ${isLight ? 'text-gray-900' : 'text-white'} group-hover:text-[#FF6B00]`}>
                  <span>{t('marques.viewAll')}</span>
                  <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
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
