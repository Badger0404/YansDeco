import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface MarquesProps {
  theme: 'dark' | 'light';
}

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
  description_ru: string | null;
  description_fr: string | null;
  description_en: string | null;
  product_count?: number;
  hide_name?: boolean;
}

const Marques: React.FC<MarquesProps> = ({ theme }) => {
  const { t } = useTranslation();
  const isLight = theme === 'light';
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_URL}/brands`);
      const data = await response.json();
      if (data.success) {
        const brandsWithCounts = await Promise.all(
          data.data.map(async (brand: Brand) => {
            try {
              const productsResponse = await fetch(`${API_URL}/brands/${brand.id}/products`);
              const productsData = await productsResponse.json();
              return {
                ...brand,
                product_count: productsData.success ? productsData.data.length : 0
              };
            } catch {
              return { ...brand, product_count: 0 };
            }
          })
        );
        setBrands(brandsWithCounts);
      }
    } catch (err) {
      console.error('Failed to load brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const getBrandName = (brand: Brand) => {
    return brand.name;
  };

  const mutedClass = isLight ? 'text-gray-600' : 'text-gray-400';

  if (loading) {
    return (
      <main className="min-h-screen pt-4 flex items-center justify-center">
        <div className={`text-center ${isLight ? 'text-black' : 'text-white'}`}>
          <p>Chargement...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-4">
      <section className="py-16 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
            <h1 className="font-black italic text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-4 drop-shadow-lg">
              <span className={isLight ? 'text-black' : 'text-white'}>{t('brands.title').split(' ')[0]}</span>{' '}
              <span className="text-[#FF6B00]">{t('brands.title').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed drop-shadow-md ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {t('brands.subtitle')}
            </p>
          </div>

          {brands.length === 0 ? (
            <div className={`text-center py-12 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
              <p>Aucune marque disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {brands.map((brand) => (
                <a
                  key={brand.id}
                  href={`/marques/${brand.id}`}
                  className={`
                    group relative flex flex-col items-center justify-center
                    h-[160px] sm:h-[180px] md:h-[200px]
                    p-2 sm:p-3 md:p-4
                    rounded-lg sm:rounded-xl
                    border transition-all duration-300
                    ${isLight 
                      ? 'border-gray-200 hover:border-[#FF6B00] bg-transparent' 
                      : 'border-white/10 hover:border-[#FF6B00] bg-transparent'
                    }
                    hover:shadow-[0_0_20px_rgba(255,107,0,0.2)]
                  `}
                >
                  {brand.logo_url && brand.logo_url.trim() !== '' && (
                    <img
                      src={brand.logo_url}
                      alt={`Logo ${brand.name}`}
                      className="
                        max-h-[80px] sm:max-h-[95px] md:max-h-[110px]
                        w-auto object-contain
                        mb-2 sm:mb-2 md:mb-3
                        transition-transform duration-300
                        group-hover:scale-105
                      "
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}

                  {!brand.hide_name && (
                    <>
                      <h3 className={`
                        text-center font-bold uppercase tracking-wide
                        text-xs sm:text-sm md:text-base
                        transition-colors duration-300
                        ${isLight ? 'text-black' : 'text-white'}
                        group-hover:text-[#FF6B00]
                      `}>
                        {getBrandName(brand)}
                      </h3>

                      {brand.product_count !== undefined && brand.product_count > 0 && (
                        <span className={`text-[10px] sm:text-xs ${mutedClass} mt-1`}>
                          {brand.product_count} {brand.product_count === 1 ? 'produit' : 'produits'}
                        </span>
                      )}
                    </>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Marques;
