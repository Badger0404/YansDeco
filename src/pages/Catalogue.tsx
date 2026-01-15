import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Subcategory {
  name: string;
  description: string;
  icon: string;
  products: string;
}

interface Category {
  id: string;
  name: string;
  products: string;
  image: string;
}

const peintureSubcategories: Subcategory[] = [
  {
    name: 'PEINTURES',
    description: 'Peintures acryliques et glycéro',
    icon: '🎨',
    products: '0 PRODUITS'
  },
  {
    name: 'SOUS-COUCHES',
    description: 'Primaires et sous-couches',
    icon: '🖌️',
    products: '0 PRODUITS'
  },
  {
    name: 'ENDUITS',
    description: 'Enduits de lissage et rebouchage',
    icon: '🧱',
    products: '0 PRODUITS'
  },
  {
    name: 'BANDES À JOINTS',
    description: 'Bandes pour plaques de plâtre',
    icon: '📏',
    products: '0 PRODUITS'
  },
  {
    name: 'BANDES ARMÉES',
    description: 'Renforcement des angles',
    icon: '🔧',
    products: '0 PRODUITS'
  },
  {
    name: 'PRODUITS DE FINITION',
    description: 'Vernis et protections',
    icon: '✨',
    products: '0 PRODUITS'
  }
];

const collesSubcategories: Subcategory[] = [
  {
    name: 'COLLE À CARRELAGE',
    description: 'Pour tous types de carrelage',
    icon: '🧱',
    products: '0 PRODUITS'
  },
  {
    name: 'COLLE À PARQUET',
    description: 'Colles pour parquet stratifié et massif',
    icon: '🪵',
    products: '0 PRODUITS'
  },
  {
    name: 'COLLE SOL SOUPLE',
    description: 'PVC, linoléum, moquette',
    icon: '🏠',
    products: '0 PRODUITS'
  },
  {
    name: 'COLLE POUR CARREAUX DE PLÂTRE',
    description: 'Plaques de plâtre et partitions',
    icon: '📋',
    products: '0 PRODUITS'
  },
  {
    name: 'COLLES EN TUBE',
    description: 'Bostik et autres marques',
    icon: '🧪',
    products: '0 PRODUITS'
  },
  {
    name: 'MASTICS ACRYLIQUES',
    description: 'Pour joints et fissures',
    icon: '🟪',
    products: '0 PRODUITS'
  },
  {
    name: 'MASTICS SILICONE',
    description: 'Étanchéité salle de bain et cuisine',
    icon: '💧',
    products: '0 PRODUITS'
  },
  {
    name: 'COLLES SPÉCIALES',
    description: 'Polyuréthane, MS polymère',
    icon: '⚡',
    products: '0 PRODUITS'
  }
];

const outillagePeintreSubcategories: Subcategory[] = [
  {
    name: 'BROSSES & PINCEAUX',
    description: 'Pinceaux professionnels',
    icon: '🖌️',
    products: '0 PRODUITS'
  },
  {
    name: 'ROULEAUX',
    description: 'Rouleaux et manchons',
    icon: '🔄',
    products: '0 PRODUITS'
  },
  {
    name: 'RÂTEAUX & SPALTES',
    description: 'Outils de précision',
    icon: '🔧',
    products: '0 PRODUITS'
  },
  {
    name: 'RUBANS DE MASQUAGE',
    description: 'Adhésifs de protection',
    icon: '📏',
    products: '0 PRODUITS'
  },
  {
    name: 'BACS À PEINTURE',
    description: 'Bacs et grilles',
    icon: '🪣',
    products: '0 PRODUITS'
  },
  {
    name: 'ESCABEAUX & ÉCHAFAUDAGES',
    description: 'Accès en hauteur',
    icon: '🪜',
    products: '0 PRODUITS'
  }
];

const outillageCarreleurSubcategories: Subcategory[] = [
  {
    name: 'TRUELLE & MALAXEUR',
    description: 'Outils de pose',
    icon: '🔧',
    products: '0 PRODUITS'
  },
  {
    name: 'CRÉMAILLÈRES',
    description: 'Peignes à colle',
    icon: '📐',
    products: '0 PRODUITS'
  },
  {
    name: 'COUPE-CARREAUX',
    description: 'Coupe-carrelage manuel',
    icon: '🔪',
    products: '0 PRODUITS'
  },
  {
    name: 'Scies & DISQUES',
    description: 'Découpe électrique',
    icon: '⚙️',
    products: '0 PRODUITS'
  },
  {
    name: 'NIVEAU & FIL À PLOMB',
    description: 'Contrôle de planéité',
    icon: '📏',
    products: '0 PRODUITS'
  },
  {
    name: 'CROISILLONS & CALES',
    description: 'Joints et espacements',
    icon: '➕',
    products: '0 PRODUITS'
  }
];

const preparationSolsSubcategories: Subcategory[] = [
  {
    name: 'RAGRÉAGE',
    description: 'Enduits de lissage',
    icon: '🧱',
    products: '0 PRODUITS'
  },
  {
    name: 'PRIMAIRE D\'ACCROCHE',
    description: 'Sous-couches sols',
    icon: '🖌️',
    products: '0 PRODUITS'
  },
  {
    name: 'MORTIER DE RÉPARATION',
    description: 'Réparations structurales',
    icon: '🔧',
    products: '0 PRODUITS'
  },
  {
    name: 'DÉSHUMIDIFIANTS',
    description: 'Traitement humidité',
    icon: '💧',
    products: '0 PRODUITS'
  },
  {
    name: 'PROTECTION DE SOL',
    description: 'Films et bâches',
    icon: '🛡️',
    products: '0 PRODUITS'
  },
  {
    name: 'NETTOYANTS SPÉCIAUX',
    description: 'Nettoyage sols',
    icon: '🧹',
    products: '0 PRODUITS'
  }
];

const fixationVisserieSubcategories: Subcategory[] = [
  {
    name: 'CHEVILLES',
    description: 'Cheville tous supports',
    icon: '🔩',
    products: '0 PRODUITS'
  },
  {
    name: 'VIS À BOIS',
    description: 'Vis et boulons',
    icon: '🔩',
    products: '0 PRODUITS'
  },
  {
    name: 'VIS À MÉTAL',
    description: 'Fixations métalliques',
    icon: '⚙️',
    products: '0 PRODUITS'
  },
  {
    name: 'VIS À BÉTON',
    description: 'Scellement chimique',
    icon: '🔨',
    products: '0 PRODUITS'
  },
  {
    name: 'CLOUS & PISTOLET',
    description: 'Clouage rapide',
    icon: '🔧',
    products: '0 PRODUITS'
  },
  {
    name: 'BOULONS & ÉCROUS',
    description: 'Visserie industrielle',
    icon: '⚙️',
    products: '0 PRODUITS'
  }
];
  {
    id: 'PEINTURE_FINITION',
    name: 'PEINTURE_FINITION',
    products: '0 PRODUITS',
    image: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
  },
  {
    id: 'COLLES_MASTICS',
    name: 'COLLES_MASTICS',
    products: '0 PRODUITS',
    image: 'linear-gradient(135deg, #1f1f1f 0%, #333333 100%)'
  },
  {
    id: 'OUTILLAGE_PEINTRE',
    name: 'OUTILLAGE_PEINTRE',
    products: '0 PRODUITS',
    image: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
  },
  {
    id: 'OUTILLAGE_CARRELEUR',
    name: 'OUTILLAGE_CARRELEUR',
    products: '0 PRODUITS',
    image: 'linear-gradient(135deg, #222222 0%, #383838 100%)'
  },
  {
    id: 'PREPARATION_SOLS',
    name: 'PREPARATION_SOLS',
    products: '0 PRODUITS',
    image: 'linear-gradient(135deg, #1c1c1c 0%, #303030 100%)'
  },
  {
    id: 'FIXATION_VISSERIE',
    name: 'FIXATION_VISSERIE',
    products: '0 PRODUITS',
    image: 'linear-gradient(135deg, #1e1e1e 0%, #353535 100%)'
  }
];

const Catalogue: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const handleCategoryClick = (categoryId: string): void => {
    navigate(`/catalogue/${categoryId}`);
  };

  const handleBack = (): void => {
    navigate(-1);
  };

  if (categoryId === 'PEINTURE_FINITION') {
    return (
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="mb-8 text-gray-500 hover:text-[#FF6B00] transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2"
          >
            ← RETOUR
          </button>

          <div className="text-center mb-10">
            <h1 className="font-black italic text-4xl uppercase tracking-tight">
              <span className="text-white">PEINTURE &</span>{' '}
              <span className="text-[#FF6B00]">FINITION</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peintureSubcategories.map((sub: Subcategory, index: number) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-2xl p-6 hover:bg-zinc-800 transition-colors duration-200 cursor-pointer border border-zinc-800 hover:border-[#FF6B00]"
              >
                <div className="text-4xl mb-4">{sub.icon}</div>
                <h3 className="font-bold italic text-lg uppercase text-white mb-2 leading-tight">
                  {sub.name}
                </h3>
                <p className="text-gray-500 text-xs mb-4">{sub.description}</p>
                <span className="text-[#FF6B00] text-xs font-medium uppercase tracking-wide">
                  {sub.products}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categoryId === 'COLLES_MASTICS') {
    return (
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="mb-8 text-gray-500 hover:text-[#FF6B00] transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2"
          >
            ← RETOUR
          </button>

          <div className="text-center mb-10">
            <h1 className="font-black italic text-4xl uppercase tracking-tight">
              <span className="text-white">COLLES &</span>{' '}
              <span className="text-[#FF6B00]">MASTICS</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {collesSubcategories.map((sub: Subcategory, index: number) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-2xl p-6 hover:bg-zinc-800 transition-colors duration-200 cursor-pointer border border-zinc-800 hover:border-[#FF6B00]"
              >
                <div className="text-4xl mb-4">{sub.icon}</div>
                <h3 className="font-bold italic text-lg uppercase text-white mb-2 leading-tight">
                  {sub.name}
                </h3>
                <p className="text-gray-500 text-xs mb-4">{sub.description}</p>
                <span className="text-[#FF6B00] text-xs font-medium uppercase tracking-wide">
                  {sub.products}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categoryId === 'OUTILLAGE_PEINTRE') {
    return (
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="mb-8 text-gray-500 hover:text-[#FF6B00] transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2"
          >
            ← RETOUR
          </button>

          <div className="text-center mb-10">
            <h1 className="font-black italic text-4xl uppercase tracking-tight">
              <span className="text-white">OUTILLAGE</span>{' '}
              <span className="text-[#FF6B00]">PEINTRE</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {outillagePeintreSubcategories.map((sub: Subcategory, index: number) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-2xl p-6 hover:bg-zinc-800 transition-colors duration-200 cursor-pointer border border-zinc-800 hover:border-[#FF6B00]"
              >
                <div className="text-4xl mb-4">{sub.icon}</div>
                <h3 className="font-bold italic text-lg uppercase text-white mb-2 leading-tight">
                  {sub.name}
                </h3>
                <p className="text-gray-500 text-xs mb-4">{sub.description}</p>
                <span className="text-[#FF6B00] text-xs font-medium uppercase tracking-wide">
                  {sub.products}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categoryId === 'OUTILLAGE_CARRELEUR') {
    return (
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="mb-8 text-gray-500 hover:text-[#FF6B00] transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2"
          >
            ← RETOUR
          </button>

          <div className="text-center mb-10">
            <h1 className="font-black italic text-4xl uppercase tracking-tight">
              <span className="text-white">OUTILLAGE</span>{' '}
              <span className="text-[#FF6B00]">CARRELEUR</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {outillageCarreleurSubcategories.map((sub: Subcategory, index: number) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-2xl p-6 hover:bg-zinc-800 transition-colors duration-200 cursor-pointer border border-zinc-800 hover:border-[#FF6B00]"
              >
                <div className="text-4xl mb-4">{sub.icon}</div>
                <h3 className="font-bold italic text-lg uppercase text-white mb-2 leading-tight">
                  {sub.name}
                </h3>
                <p className="text-gray-500 text-xs mb-4">{sub.description}</p>
                <span className="text-[#FF6B00] text-xs font-medium uppercase tracking-wide">
                  {sub.products}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categoryId === 'PREPARATION_SOLS') {
    return (
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="mb-8 text-gray-500 hover:text-[#FF6B00] transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2"
          >
            ← RETOUR
          </button>

          <div className="text-center mb-10">
            <h1 className="font-black italic text-4xl uppercase tracking-tight">
              <span className="text-white">PRÉPARATION</span>{' '}
              <span className="text-[#FF6B00]">SOLS</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {preparationSolsSubcategories.map((sub: Subcategory, index: number) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-2xl p-6 hover:bg-zinc-800 transition-colors duration-200 cursor-pointer border border-zinc-800 hover:border-[#FF6B00]"
              >
                <div className="text-4xl mb-4">{sub.icon}</div>
                <h3 className="font-bold italic text-lg uppercase text-white mb-2 leading-tight">
                  {sub.name}
                </h3>
                <p className="text-gray-500 text-xs mb-4">{sub.description}</p>
                <span className="text-[#FF6B00] text-xs font-medium uppercase tracking-wide">
                  {sub.products}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categoryId === 'FIXATION_VISSERIE') {
    return (
      <section className="py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={handleBack}
            className="mb-8 text-gray-500 hover:text-[#FF6B00] transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2"
          >
            ← RETOUR
          </button>

          <div className="text-center mb-10">
            <h1 className="font-black italic text-4xl uppercase tracking-tight">
              <span className="text-white">FIXATION &</span>{' '}
              <span className="text-[#FF6B00]">VISSERIE</span>
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fixationVisserieSubcategories.map((sub: Subcategory, index: number) => (
              <div
                key={index}
                className="bg-zinc-900 rounded-2xl p-6 hover:bg-zinc-800 transition-colors duration-200 cursor-pointer border border-zinc-800 hover:border-[#FF6B00]"
              >
                <div className="text-4xl mb-4">{sub.icon}</div>
                <h3 className="font-bold italic text-lg uppercase text-white mb-2 leading-tight">
                  {sub.name}
                </h3>
                <p className="text-gray-500 text-xs mb-4">{sub.description}</p>
                <span className="text-[#FF6B00] text-xs font-medium uppercase tracking-wide">
                  {sub.products}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-black italic text-5xl uppercase tracking-tight mb-4">
            <span className="text-white">NOS</span>{' '}
            <span className="text-[#FF6B00]">RAYONS</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm leading-relaxed">
            Du bâtiment à la rénovation, toute une gamme de matériaux, outillage et accessoires pour les professionnels et les particuliers.
            <br />
            Des conseils personnalisés pour vous accompagner dans tous vos projets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category: Category, index: number) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(category.id)}
              className="relative h-64 rounded-xl overflow-hidden group cursor-pointer"
              style={{
                background: category.image
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <h3 className="font-bold italic text-xl uppercase text-white mb-1 leading-tight">
                    {category.name}
                  </h3>
                  <span className="text-[#FF6B00] text-xs font-medium uppercase tracking-wide">
                    {category.products}
                  </span>
                </div>
                <span className="text-gray-400 text-xs uppercase tracking-wider group-hover:text-[#FF6B00] transition-colors duration-200">
                  VOIR LES PRODUITS →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catalogue;
