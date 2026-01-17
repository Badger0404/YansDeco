import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

interface Subcategory {
  name: string;
  icon?: string;
  imageUrl?: string;
}

interface Category {
  id: string;
  name: string;
  image?: string;
  imageUrl?: string;
  icon?: string;
}

interface CatalogueProps {
  theme: 'dark' | 'light';
}

const DefaultIcon: React.FC<{ icon?: string; isLight: boolean; className?: string }> = ({ 
  icon, 
  isLight, 
  className = '' 
}) => (
  <span className={`${className} transition-colors duration-500 ${
    isLight ? 'text-[#FF6B00]' : 'text-white'
  }`}>
    {icon}
  </span>
);

const peintureSubcategories: Subcategory[] = [
  { name: 'PEINTURES', icon: '🎨' },
  { name: 'SOUS-COUCHES', icon: '🖌️' },
  { name: 'ENDUITS', icon: '🧱' },
  { name: 'BANDES À JOINTS', icon: '📏' },
  { name: 'BANDES ARMÉES', icon: '🔧' },
  { name: 'PRODUITS DE FINITION', icon: '✨' }
];

const collesSubcategories: Subcategory[] = [
  { name: 'COLLE À CARRELAGE', icon: '🧱' },
  { name: 'COLLE À PARQUET', icon: '🪵' },
  { name: 'COLLE SOL SOUPLE', icon: '🏠' },
  { name: 'COLLE POUR CARREAUX DE PLÂTRE', icon: '📋' },
  { name: 'COLLES EN TUBE', icon: '🧪' },
  { name: 'MASTICS ACRYLIQUES', icon: '🟪' },
  { name: 'MASTICS SILICONE', icon: '💧' },
  { name: 'COLLES SPÉCIALES', icon: '⚡' }
];

const outillagePeintreSubcategories: Subcategory[] = [
  { name: 'BROSSES & PINCEAUX', icon: '🖌️' },
  { name: 'ROULEAUX', icon: '🔄' },
  { name: 'RÂTEAUX & SPALTES', icon: '🔧' },
  { name: 'RUBANS DE MASQUAGE', icon: '📏' },
  { name: 'BACS À PEINTURE', icon: '🪣' },
  { name: 'ESCABEAUX & ÉCHAFAUDAGES', icon: '🪜' }
];

const outillageCarreleurSubcategories: Subcategory[] = [
  { name: 'TRUELLE & MALAXEUR', icon: '🔧' },
  { name: 'CRÉMAILLÈRES', icon: '📐' },
  { name: 'COUPE-CARREAUX', icon: '🔪' },
  { name: 'SCIES & DISQUES', icon: '⚙️' },
  { name: 'NIVEAU & FIL À PLOMB', icon: '📏' },
  { name: 'CROISILLONS & CALES', icon: '➕' }
];

const preparationSolsSubcategories: Subcategory[] = [
  { name: 'RAGRÉAGE', icon: '🧱' },
  { name: 'PRIMAIRE D\'ACCROCHE', icon: '🖌️' },
  { name: 'MORTIER DE RÉPARATION', icon: '🔧' },
  { name: 'DÉSHUMIDIFIANTS', icon: '💧' },
  { name: 'PROTECTION DE SOL', icon: '🛡️' },
  { name: 'NETTOYANTS SPÉCIAUX', icon: '🧹' }
];

const fixationVisserieSubcategories: Subcategory[] = [
  { name: 'CHEVILLES', icon: '🔩' },
  { name: 'VIS À BOIS', icon: '🔩' },
  { name: 'VIS À MÉTAL', icon: '⚙️' },
  { name: 'VIS À BÉTON', icon: '🔨' },
  { name: 'CLOUS & PISTOLET', icon: '🔧' },
  { name: 'BOULONS & ÉCROUS', icon: '⚙️' }
];

const categories: Category[] = [
  { id: 'PEINTURE_FINITION', name: 'PEINTURE_FINITION', image: '/assets/categories/peinture_finition.svg' },
  { id: 'COLLES_MASTICS', name: 'COLLES_MASTICS', image: '/assets/categories/colles_mastics.svg' },
  { id: 'OUTILLAGE_PEINTRE', name: 'OUTILLAGE_PEINTRE', image: '/assets/categories/outillage_peintre.svg' },
  { id: 'OUTILLAGE_CARRELEUR', name: 'OUTILLAGE_CARRELEUR', image: '/assets/categories/outillage_carreleur.svg' },
  { id: 'PREPARATION_SOLS', name: 'PREPARATION_SOLS', image: '/assets/categories/preparation_sols.svg' },
  { id: 'FIXATION_VISSERIE', name: 'FIXATION_VISSERIE', image: '/assets/categories/fixation_visserie.svg' }
];

const categoryTranslations: Record<string, string> = {
  'PEINTURE_FINITION': 'PEINTURE & FINITION',
  'COLLES_MASTICS': 'COLLES & MASTICS',
  'OUTILLAGE_PEINTRE': 'OUTILLAGE PEINTRE',
  'OUTILLAGE_CARRELEUR': 'OUTILLAGE CARRELEUR',
  'PREPARATION_SOLS': 'PRÉPARATION SOLS',
  'FIXATION_VISSERIE': 'FIXATION & VISSERIE'
};

const Catalogue: React.FC<CatalogueProps> = ({ theme }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const isLight = theme === 'light';

  const handleCategoryClick = (categoryId: string): void => {
    navigate(`/catalogue/${categoryId}`);
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryName: string): void => {
    const subcategoryId = subcategoryName.replace(/\s+/g, '_');
    navigate(`/catalogue/${categoryId}/${subcategoryId}`);
  };

  const handleBack = (): void => {
    navigate(-1);
  };

  const getCategoryTitle = (id: string): string => {
    return categoryTranslations[id] || id;
  };

  const renderSubcategories = (subcategories: Subcategory[], catId: string) => (
    <div className={`grid ${catId === 'COLLES_MASTICS' ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-2 md:grid-cols-3'} gap-4`}>
      {subcategories.map((sub, index) => (
        <div 
          key={index} 
          className="h-48 rounded-xl transition-all duration-1000 group hover:scale-[1.05] border border-transparent hover:border-[#FF6B00] bg-transparent cursor-pointer"
          onClick={() => handleSubcategoryClick(catId, sub.name)}
        >
          <div className="flex flex-col h-full p-4">
            <div className="pt-2 text-center">
              <h3 className={`font-bold italic text-sm uppercase transition-colors duration-500 ${
                isLight ? 'text-black' : 'text-white'
              }`}>
                {sub.name}
              </h3>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
              {sub.imageUrl ? (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <img
                    src={sub.imageUrl}
                    alt={sub.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              ) : null}
            </div>

            <div className="pb-4 text-center">
              <span className="text-[10px] text-[#FF6B00] font-medium uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                {t('catalogue.products')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (categoryId === 'PEINTURE_FINITION') {
    return (
      <main className="min-h-screen pt-4">
        <section className="py-12 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleBack}
              className={`mb-8 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
              }`}
            >
              {t('catalogue.back')}
            </button>

            <div className="text-center mb-10">
              <h1 className="font-black italic text-4xl uppercase tracking-tight">
                <span className={isLight ? 'text-black' : 'text-white'}>{getCategoryTitle('PEINTURE_FINITION').split(' ')[0]}</span>{' '}
                <span className="text-[#FF6B00]">{getCategoryTitle('PEINTURE_FINITION').split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>

            {renderSubcategories(peintureSubcategories, 'PEINTURE_FINITION')}
          </div>
        </section>
      </main>
    );
  }

  if (categoryId === 'COLLES_MASTICS') {
    return (
      <main className="min-h-screen pt-4">
        <section className="py-12 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleBack}
              className={`mb-8 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
              }`}
            >
              {t('catalogue.back')}
            </button>

            <div className="text-center mb-10">
              <h1 className="font-black italic text-4xl uppercase tracking-tight">
                <span className={isLight ? 'text-black' : 'text-white'}>{getCategoryTitle('COLLES_MASTICS').split(' ')[0]}</span>{' '}
                <span className="text-[#FF6B00]">{getCategoryTitle('COLLES_MASTICS').split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>

            {renderSubcategories(collesSubcategories, 'COLLES_MASTICS')}
          </div>
        </section>
      </main>
    );
  }

  if (categoryId === 'OUTILLAGE_PEINTRE') {
    return (
      <main className="min-h-screen pt-4">
        <section className="py-12 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleBack}
              className={`mb-8 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
              }`}
            >
              {t('catalogue.back')}
            </button>

            <div className="text-center mb-10">
              <h1 className="font-black italic text-4xl uppercase tracking-tight">
                <span className={isLight ? 'text-black' : 'text-white'}>{getCategoryTitle('OUTILLAGE_PEINTRE').split(' ')[0]}</span>{' '}
                <span className="text-[#FF6B00]">{getCategoryTitle('OUTILLAGE_PEINTRE').split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>

            {renderSubcategories(outillagePeintreSubcategories, 'OUTILLAGE_PEINTRE')}
          </div>
        </section>
      </main>
    );
  }

  if (categoryId === 'OUTILLAGE_CARRELEUR') {
    return (
      <main className="min-h-screen pt-4">
        <section className="py-12 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleBack}
              className={`mb-8 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
              }`}
            >
              {t('catalogue.back')}
            </button>

            <div className="text-center mb-10">
              <h1 className="font-black italic text-4xl uppercase tracking-tight">
                <span className={isLight ? 'text-black' : 'text-white'}>{getCategoryTitle('OUTILLAGE_CARRELEUR').split(' ')[0]}</span>{' '}
                <span className="text-[#FF6B00]">{getCategoryTitle('OUTILLAGE_CARRELEUR').split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>

            {renderSubcategories(outillageCarreleurSubcategories, 'OUTILLAGE_CARRELEUR')}
          </div>
        </section>
      </main>
    );
  }

  if (categoryId === 'PREPARATION_SOLS') {
    return (
      <main className="min-h-screen pt-4">
        <section className="py-12 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleBack}
              className={`mb-8 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
              }`}
            >
              {t('catalogue.back')}
            </button>

            <div className="text-center mb-10">
              <h1 className="font-black italic text-4xl uppercase tracking-tight">
                <span className={isLight ? 'text-black' : 'text-white'}>{getCategoryTitle('PREPARATION_SOLS').split(' ')[0]}</span>{' '}
                <span className="text-[#FF6B00]">{getCategoryTitle('PREPARATION_SOLS').split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>

            {renderSubcategories(preparationSolsSubcategories, 'PREPARATION_SOLS')}
          </div>
        </section>
      </main>
    );
  }

  if (categoryId === 'FIXATION_VISSERIE') {
    return (
      <main className="min-h-screen pt-4">
        <section className="py-12 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleBack}
              className={`mb-8 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
              }`}
            >
              {t('catalogue.back')}
            </button>

            <div className="text-center mb-10">
              <h1 className="font-black italic text-4xl uppercase tracking-tight">
                <span className={isLight ? 'text-black' : 'text-white'}>{getCategoryTitle('FIXATION_VISSERIE').split(' ')[0]}</span>{' '}
                <span className="text-[#FF6B00]">{getCategoryTitle('FIXATION_VISSERIE').split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>

            {renderSubcategories(fixationVisserieSubcategories, 'FIXATION_VISSERIE')}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-4">
      <section className="py-16 transition-colors duration-500 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="font-black italic text-5xl uppercase tracking-tight mb-4 drop-shadow-lg">
              <span className={isLight ? 'text-black' : 'text-white'}>{t('home.sections').split(' ')[0]}</span>{' '}
              <span className="text-[#FF6B00]">{t('home.sections').split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-sm leading-relaxed drop-shadow-md ${
              isLight ? 'text-gray-700' : 'text-gray-300'
            }`}>
              {t('home.sectionsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category.id)}
                className="relative h-80 rounded-xl overflow-hidden group cursor-pointer bg-transparent transition-all duration-1000 group-hover:scale-[1.05] border border-transparent hover:border-[#FF6B00]"
              >
                <div className="absolute inset-0">
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : category.icon ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <DefaultIcon 
                        icon={category.icon} 
                        isLight={isLight} 
                        className="text-6xl"
                      />
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col items-center justify-center h-full p-6 transform transition-transform duration-500 group-hover:scale-[1.05]">
                  <div className="text-center">
                    <h3 className={`font-black italic text-4xl uppercase leading-tight transition-colors duration-500 ${
                      isLight ? 'text-black' : 'text-white'
                    }`}>
                      <span>{categoryTranslations[category.id].split(' ')[0]}</span>{' '}
                      <span className="text-[#FF6B00]">
                        {categoryTranslations[category.id].split(' ').slice(1).join(' ')}
                      </span>
                    </h3>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 pb-4 text-center transform transition-transform duration-500 group-hover:scale-110">
                    <span className="text-[#FF6B00] text-xs font-medium uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {t('catalogue.products')}
                    </span>
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

export default Catalogue;
