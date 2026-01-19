import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

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
}

const Marques: React.FC<MarquesProps> = ({ theme }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLight = theme === 'light';
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
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

  const cardClass = `rounded-2xl p-6 transition-all duration-1000 cursor-pointer border border-transparent hover:border-[#FF6B00] flex flex-col items-center bg-transparent group hover:scale-[1.05]`;

  const renderBrandImage = (brand: Brand) => {
    if (brand.logo_url && brand.logo_url.trim() !== '') {
      return (
        <img
          src={brand.logo_url}
          alt={`Logo ${brand.name}`}
          className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }
    return null;
  };

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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  className={cardClass}
                  onClick={() => navigate(`/marques/${brand.id}`)}
                >
                  <div className="w-24 h-24 flex items-center justify-center mb-4">
                    {renderBrandImage(brand)}
                  </div>
                  
                  <h3 className={`text-center font-bold text-lg uppercase tracking-wide mb-2 transition-colors duration-300 ${
                    isLight ? 'text-black' : 'text-white'
                  }`}>
                    {getBrandName(brand)}
                  </h3>
                  
                  {brand.product_count !== undefined && brand.product_count > 0 && (
                    <span className={`text-xs ${mutedClass} mb-2`}>
                      {brand.product_count} {brand.product_count === 1 ? 'produit' : 'produits'}
                    </span>
                  )}
                  
                  <div className={`mt-auto flex items-center gap-1 text-xs font-medium uppercase tracking-wide group-hover:translate-x-1 transition-all duration-300 ${isLight ? 'text-gray-900' : 'text-white'} group-hover:text-[#FF6B00]`}>
                    <span>{t('brands.viewAll')}</span>
                    <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Marques;
