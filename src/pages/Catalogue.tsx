import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, RefreshCw, Package } from 'lucide-react';

interface Category {
  id: number;
  slug: string;
  name_ru: string | null;
  name_fr: string | null;
  name_en: string | null;
  desc_ru: string | null;
  desc_fr: string | null;
  desc_en: string | null;
  icon: string | null;
  image_url: string | null;
  parent_id: number | null;
  children?: Category[];
  product_count?: number;
}

interface CatalogueProps {
  theme: 'dark' | 'light';
}

const Catalogue: React.FC<CatalogueProps> = ({ theme }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const isLight = theme === 'light';
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const fetched = useRef(false);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching categories...');
      const response = await fetch(`${API_URL}/categories`);
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Categories data:', data);
      if (data.success) {
        setCategories(data.data);
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Failed to load categories. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (category: Category): string => {
    const lang = i18n.language;
    if (lang === 'ru') return category.name_ru || category.name_fr || category.name_en || `Категория ${category.id}`;
    if (lang === 'fr') return category.name_fr || category.name_ru || category.name_en || `Catégorie ${category.id}`;
    if (lang === 'en') return category.name_en || category.name_ru || category.name_fr || `Category ${category.id}`;
    return category.name_fr || `Category ${category.id}`;
  };

  const getCategoryDescription = (category: Category): string => {
    const lang = i18n.language;
    if (lang === 'ru') return category.desc_ru || category.desc_fr || category.desc_en || '';
    if (lang === 'fr') return category.desc_fr || category.desc_ru || category.desc_en || '';
    if (lang === 'en') return category.desc_en || category.desc_ru || category.desc_fr || '';
    return category.desc_fr || '';
  };

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/catalogue/${categoryId}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const findCategoryInTree = (cats: Category[], id: number): Category | undefined => {
    for (const cat of cats) {
      if (cat.id === id) return cat;
      if (cat.children && cat.children.length > 0) {
        const found = findCategoryInTree(cat.children, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const mutedClass = isLight ? 'text-gray-600' : 'text-gray-400';
  const textClass = isLight ? 'text-black' : 'text-white';

  const processCategories = (cats: Category[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];

    cats.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    cats.forEach(cat => {
      const categoryWithChildren = categoryMap.get(cat.id)!;
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        categoryMap.get(cat.parent_id)!.children!.push(categoryWithChildren);
      } else {
        rootCategories.push(categoryWithChildren);
      }
    });

    return rootCategories;
  };

  const processedCategories = processCategories(categories);
  const topLevelCategories = processedCategories;

  if (loading) {
    return (
      <main className="min-h-screen pt-4">
        <section className="py-12 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="w-10 h-10 text-[#FF6B00] animate-spin mx-auto" />
                <p className={`mt-4 ${mutedClass}`}>Загрузка каталога...</p>
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
        <section className="py-12 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={fetchCategories}
                  className="mt-4 px-4 py-2 bg-[#FF6B00] text-black rounded-lg"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-4">
      <section className="py-12 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!categoryId ? (
              <>
                <div className="text-center mb-12">
                  <h1 className={`font-black italic text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight mb-4 ${textClass}`}>
                    {t('catalogue.title')}
                  </h1>
                  <p className={`text-xs sm:text-sm ${mutedClass} max-w-2xl mx-auto`}>
                    {t('catalogue.subtitle')}
                  </p>
                </div>

                {topLevelCategories.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topLevelCategories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border border-transparent hover:border-[#FF6B00] hover:scale-[1.02] bg-transparent`}
                      >
                        <div className="aspect-[4/3] flex items-center justify-center p-6 bg-transparent">
                          {category.image_url ? (
                            <img
                              src={category.image_url}
                              alt={getCategoryName(category)}
                              className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-110"
                            />
                          ) : (
                            <Package className={`w-16 h-16 ${mutedClass} opacity-30`} />
                          )}
                        </div>
                        <div className={`p-4`}>
                          <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-2 ${textClass} group-hover:text-[#FF6B00] transition-colors`}>
                            {getCategoryName(category)}
                          </h2>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${mutedClass}`}>
                              {category.product_count || 0} {t('catalogue.products_count', { count: category.product_count || 0 })}
                            </span>
                            <ChevronRight className={`w-5 h-5 ${mutedClass} group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all duration-300`} />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className={`text-center py-12 ${mutedClass}`}>
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Категории скоро появятся</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleBack}
                  className={`mb-8 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
                    }`}
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  {t('catalogue.back')}
                </button>

                {(() => {
                  const currentCategory = findCategoryInTree(processedCategories, parseInt(categoryId));
                  if (!currentCategory) {
                    return (
                      <div className={`text-center py-12 ${mutedClass}`}>
                        <p>Категория не найдена</p>
                      </div>
                    );
                  }

                  const subcategories = currentCategory.children || [];

                  return (
                    <>
                      <div className="text-center mb-8">
                        <h1 className={`font-black italic text-2xl sm:text-3xl md:text-4xl uppercase tracking-tight mb-2 ${textClass}`}>
                          {getCategoryName(currentCategory)}
                        </h1>
                        <p className={`text-xs sm:text-sm ${mutedClass}`}>
                          {getCategoryDescription(currentCategory)}
                        </p>
                      </div>

                      {subcategories.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                          {subcategories.map((sub, index) => (
                            <motion.div
                              key={sub.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => navigate(`/catalogue/${categoryId}/${sub.id}`)}
                              className={`rounded-xl overflow-hidden group cursor-pointer transition-all duration-300 border border-transparent hover:border-[#FF6B00] hover:scale-[1.02] bg-transparent`}
                            >
                              <div className="aspect-square flex items-center justify-center p-4 bg-transparent">
                                {sub.image_url ? (
                                  <img
                                    src={sub.image_url}
                                    alt={getCategoryName(sub)}
                                    className="max-w-full max-h-full object-contain transition-transform duration-1000 group-hover:scale-110"
                                  />
                                ) : (
                                  <Package className={`w-12 h-12 ${mutedClass} opacity-30`} />
                                )}
                              </div>
                              <div className={`p-3`}>
                                <h3 className={`font-bold italic text-base uppercase tracking-wide mb-1 ${textClass} group-hover:text-[#FF6B00] transition-colors`}>
                                  {getCategoryName(sub)}
                                </h3>
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs ${mutedClass}`}>
                                    {sub.product_count || 0} {t('catalogue.products_count', { count: sub.product_count || 0 })}
                                  </span>
                                  <ChevronRight className={`w-4 h-4 ${mutedClass} group-hover:text-[#FF6B00] group-hover:translate-x-1 transition-all duration-300`} />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className={`text-center py-12 ${mutedClass}`}>
                          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
                          <p>Подкатегории скоро появятся</p>
                          <p className="text-sm mt-2">
                            <Link to="/catalogue" className="text-[#FF6B00] hover:underline">
                              Вернуться к каталогу
                            </Link>
                          </p>
                        </div>
                      )}
                    </>
                  );
                })()}
              </>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default Catalogue;
