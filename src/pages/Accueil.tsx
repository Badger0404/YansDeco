import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Product {
  id: number;
  name_ru: string | null;
  name_fr: string | null;
  name_en: string | null;
  image_url: string | null;
  price: number;
  is_popular: number;
}

interface AccueilProps {
  theme: 'dark' | 'light';
}

const Accueil: React.FC<AccueilProps> = ({ theme }) => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const isLight = theme === 'light';

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      const response = await fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/products');
      const data = await response.json();
      if (data.success) {
        const popularProducts = data.data.filter((product: Product) => product.is_popular === 1).slice(0, 8);
        setProducts(popularProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (product: Product) => {
    const lang = i18n.language;
    switch (lang) {
      case 'ru': return product.name_ru || 'Без названия';
      case 'en': return product.name_en || 'Untitled';
      default: return product.name_fr || 'Sans titre';
    }
  };

  if (loading) {
    return (
      <main>
        <section className={`py-20 transition-colors duration-500 ${
          isLight ? 'bg-transparent' : 'bg-transparent'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className={`text-3xl font-bold uppercase tracking-wider ${
                isLight ? 'text-black' : 'text-white'
              }`}>Chargement...</div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className={`py-20 transition-colors duration-500 ${
        isLight ? 'bg-transparent' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className={`text-3xl font-bold mb-10 text-center uppercase tracking-wider ${
            isLight ? 'text-black' : 'text-white'
          }`}>
            {t('accueil.popular')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <Link 
                  key={product.id} 
                  to={`/catalogue/null/null/${product.id}`}
                  className={`aspect-square flex flex-col items-center justify-center border transition-all duration-300 hover:scale-[1.02] ${
                    isLight 
                      ? 'bg-white/80 backdrop-blur-md border-gray-200 shadow-lg hover:shadow-xl' 
                      : 'bg-black/50 backdrop-blur-md border-gray-700 hover:border-[#FF6B00]'
                  }`}
                >
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={getProductName(product)}
                      className="w-16 h-16 object-cover rounded mb-2"
                    />
                  )}
                  <span className={`text-xs text-center px-2 ${
                    isLight ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {getProductName(product)}
                  </span>
                  <span className={`text-sm font-bold mt-1 ${
                    isLight ? 'text-[#FF6B00]' : 'text-[#FF6B00]'
                  }`}>
                    {product.price.toFixed(2)}€
                  </span>
                </Link>
              ))
            ) : (
              // Fallback to placeholder items if no popular products
              [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className={`aspect-square flex items-center justify-center border ${
                  isLight 
                    ? 'bg-white/80 backdrop-blur-md border-gray-200 shadow-lg' 
                    : 'bg-black/50 backdrop-blur-md border-gray-700'
                }`}>
                  <span className={`text-sm ${isLight ? 'text-gray-600' : 'text-gray-500'}`}>Produit {item}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Accueil;