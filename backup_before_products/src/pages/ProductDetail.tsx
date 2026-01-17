import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  description: string;
}

interface SubcategoryDetail {
  name: string;
  description: string;
  products: Product[];
}

interface ProductDetailProps {
  theme: 'dark' | 'light';
}

const subcategoryData: Record<string, SubcategoryDetail> = {
  PEINTURES: {
    name: 'PEINTURES',
    description: 'Peintures acryliques et glycéro pour tous vos projets de finition',
    products: [
      { id: 'p1', name: 'Peinture Acrylique Blanche', brand: 'TOUPRET', price: '24,90 €', description: 'Peinture blanche mate intérieur' },
      { id: 'p2', name: 'Peinture Glycéro Blanche', brand: 'BOSTIK', price: '32,50 €', description: 'Peinture glycérophtalique haute résistance' },
      { id: 'p3', name: 'Peinture Colorée', brand: 'SIKA', price: '28,00 €', description: 'Peinture couleur selon nuancier' },
      { id: 'p4', name: 'Peinture Satinée', brand: 'TOUPRET', price: '27,90 €', description: 'Finition satinée lavable' },
      { id: 'p5', name: 'Peinture Brillant', brand: 'BOSTIK', price: '31,00 €', description: 'Finition brillante miroir' },
      { id: 'p6', name: 'Peinture Mat', brand: 'PAREXLANKO', price: '22,50 €', description: 'Finition mate profonde' },
    ]
  },
  'SOUS-COUCHES': {
    name: 'SOUS-COUCHES',
    description: 'Primaires et sous-couches pour préparer vos surfaces',
    products: [
      { id: 'p1', name: 'Primaire Universel', brand: 'BOSTIK', price: '18,90 €', description: 'Sous-couche tous supports' },
      { id: 'p2', name: 'Primaire Plâtre', brand: 'TOUPRET', price: '16,50 €', description: 'Pour plaques de plâtre' },
      { id: 'p3', name: 'Sous-couche Bois', brand: 'SIKA', price: '21,00 €', description: 'Pour boiseries' },
      { id: 'p4', name: 'Béton Prim', brand: 'PAREXLANKO', price: '19,90 €', description: 'Pour surfaces béton' },
    ]
  },
  ENDUITS: {
    name: 'ENDUITS',
    description: 'Enduits de lissage et rebouchage pour toutes vos réparations',
    products: [
      { id: 'p1', name: 'Enduit Lissage', brand: 'TOUPRET', price: '14,90 €', description: 'Enduit de lissage fin' },
      { id: 'p2', name: 'Enduit Rebouchage', brand: 'BOSTIK', price: '12,50 €', description: 'Pour fissures et trous' },
      { id: 'p3', name: 'Enduit Gros', brand: 'PAREXLANKO', price: '16,00 €', description: 'Enduit de rebouchage épais' },
      { id: 'p4', name: 'Enduit Projection', brand: 'SIKA', price: '22,00 €', description: 'Enduit machine' },
    ]
  },
  'BANDES À JOINTS': {
    name: 'BANDES À JOINTS',
    description: 'Bandes pour plaques de plâtre et joints',
    products: [
      { id: 'p1', name: 'Bande Joint Standard', brand: 'TOUPRET', price: '8,50 €', description: 'Bande papier 150mm' },
      { id: 'p2', name: 'Bande Armée', brand: 'BOSTIK', price: '12,00 €', description: 'Bande fibre 100mm' },
      { id: 'p3', name: 'Bande Angle', brand: 'L\'OUTIL PARFAIT', price: '6,00 €', description: 'Bande angle métal' },
    ]
  },
  'BANDES ARMÉES': {
    name: 'BANDES ARMÉES',
    description: 'Renforcement des angles et coins',
    products: [
      { id: 'p1', name: 'Corner Guard', brand: 'L\'OUTIL PARFAIT', price: '9,90 €', description: 'Protection angle alu' },
      { id: 'p2', name: 'Bande Carbone', brand: 'TOUPRET', price: '15,00 €', description: 'Bande fibre carbone' },
    ]
  },
  'PRODUITS DE FINITION': {
    name: 'PRODUITS DE FINITION',
    description: 'Vernis et protections pour vos réalisations',
    products: [
      { id: 'p1', name: 'Vernis Incolore', brand: 'BOSTIK', price: '24,90 €', description: 'Vernis protecteur mat' },
      { id: 'p2', name: 'Vernis Colle', brand: 'SIKA', price: '28,00 €', description: 'Vernis colle河北省' },
    ]
  },
  'COLLE À CARRELAGE': {
    name: 'COLLE À CARRELAGE',
    description: 'Colles pour tous types de carrelage',
    products: [
      { id: 'p1', name: 'Colle C1', brand: 'BOSTIK', price: '22,90 €', description: 'Colle ciment ordinaire' },
      { id: 'p2', name: 'Colle C2', brand: 'SIKA', price: '29,90 €', description: 'Colle ciment améliorée' },
      { id: 'p3', name: 'Colle Sol Souple', brand: 'PAREXLANKO', price: '26,00 €', description: 'Pour sols PVC' },
    ]
  },
  'COLLE À PARQUET': {
    name: 'COLLE À PARQUET',
    description: 'Colles pour parquet stratifié et massif',
    products: [
      { id: 'p1', name: 'Colle Parquet MS', brand: 'BOSTIK', price: '45,00 €', description: 'Colle MS Polymère' },
      { id: 'p2', name: 'Colle Parquet PU', brand: 'SIKA', price: '52,00 €', description: 'Colle polyuréthane' },
    ]
  },
  'COLLE SOL SOUPLE': {
    name: 'COLLE SOL SOUPLE',
    description: 'Pour PVC, linoléum, moquette',
    products: [
      { id: 'p1', name: 'Colle Moquette', brand: 'BOSTIK', price: '19,90 €', description: 'Colle spécifique moquette' },
      { id: 'p2', name: 'Colle PVC', brand: 'PAREXLANKO', price: '23,00 €', description: 'Colle vinyle' },
    ]
  },
  'COLLE POUR CARREAUX DE PLÂTRE': {
    name: 'COLLE CARREAUX PLÂTRE',
    description: 'Plaques de plâtre et partitions',
    products: [
      { id: 'p1', name: 'Colle Plâtre', brand: 'TOUPRET', price: '16,50 €', description: 'Colle plaques de plâtre' },
    ]
  },
  'COLLES EN TUBE': {
    name: 'COLLES EN TUBE',
    description: 'Bostik et autres marques en format tube',
    products: [
      { id: 'p1', name: 'Bostik Fix', brand: 'BOSTIK', price: '8,90 €', description: 'Colle de fixation tube' },
      { id: 'p2', name: 'Colle Express', brand: 'SIKA', price: '12,00 €', description: 'Colle rapide' },
    ]
  },
  'MASTICS ACRYLIQUES': {
    name: 'MASTICS ACRYLIQUES',
    description: 'Pour joints et fissures',
    products: [
      { id: 'p1', name: 'Mastic Acrylique', brand: 'BOSTIK', price: '7,50 €', description: 'Mastic peinture blanc' },
      { id: 'p2', name: 'Mastic Large Joint', brand: 'SIKA', price: '9,90 €', description: 'Mastic 25mm' },
    ]
  },
  'MASTICS SILICONE': {
    name: 'MASTICS SILICONE',
    description: 'Étanchéité salle de bain et cuisine',
    products: [
      { id: 'p1', name: 'Silicone Sanitaire', brand: 'BOSTIK', price: '8,90 €', description: 'Silicone anti-moisissure' },
      { id: 'p2', name: 'Silicone Vitrerie', brand: 'SIKA', price: '7,50 €', description: 'Silicone transparent' },
    ]
  },
  'COLLES SPÉCIALES': {
    name: 'COLLES SPÉCIALES',
    description: 'Polyuréthane, MS polymère',
    products: [
      { id: 'p1', name: 'Colle PU', brand: 'SIKA', price: '24,00 €', description: 'Polyuréthane haute résistance' },
      { id: 'p2', name: 'Colle MS', brand: 'BOSTIK', price: '22,00 €', description: 'MS Polymère' },
    ]
  },
  'BROSSES & PINCEAUX': {
    name: 'BROSSES & PINCEAUX',
    description: 'Pinceaux professionnels pour tous vos travaux',
    products: [
      { id: 'p1', name: 'Pinceau Plat 50mm', brand: 'L\'OUTIL PARFAIT', price: '6,90 €', description: 'Pinceau professionnel' },
      { id: 'p2', name: 'Pinceau Radiateur', brand: 'L\'OUTIL PARFAIT', price: '5,50 €', description: 'Pinceau long manche' },
      { id: 'p3', name: 'Brosse Métallique', brand: 'TOUPRET', price: '4,90 €', description: 'Brosse décapage' },
    ]
  },
  'ROULEAUX': {
    name: 'ROULEAUX',
    description: 'Rouleaux et manchons pour peinture',
    products: [
      { id: 'p1', name: 'Rouleau Standard', brand: 'L\'OUTIL PARFAIT', price: '8,90 €', description: 'Rouleau 180mm' },
      { id: 'p2', name: 'Manchon Longue', brand: 'TOUPRET', price: '5,50 €', description: 'Manchon 12mm' },
      { id: 'p3', name: 'Bac Peinture', brand: 'L\'OUTIL PARFAIT', price: '12,00 €', description: 'Bac + grille' },
    ]
  },
  'RÂTEAUX & SPALTES': {
    name: 'RÂTEAUX & SPALTES',
    description: 'Outils de précision pour professionnels',
    products: [
      { id: 'p1', name: 'Râteau', brand: 'L\'OUTIL PARFAIT', price: '7,50 €', description: 'Râteau à colle' },
      { id: 'p2', name: 'Spalters', brand: 'TOUPRET', price: '9,00 €', description: 'Grande spatule' },
    ]
  },
  'RUBANS DE MASQUAGE': {
    name: 'RUBANS DE MASQUAGE',
    description: 'Adhésifs de protection pour vos travaux',
    products: [
      { id: 'p1', name: 'Ruban Masking', brand: 'L\'OUTIL PARFAIT', price: '4,50 €', description: 'Ruban papier 50mm' },
      { id: 'p2', name: 'Ruban Carrelage', brand: 'TOUPRET', price: '5,90 €', description: 'Ruban précis' },
    ]
  },
  'BACS À PEINTURE': {
    name: 'BACS À PEINTURE',
    description: 'Bacs et accessoires pour rouleaux',
    products: [
      { id: 'p1', name: 'Bac Professionnel', brand: 'L\'OUTIL PARFAIT', price: '14,90 €', description: 'Bac renforcé' },
      { id: 'p2', name: 'Grille Essoreuse', brand: 'TOUPRET', price: '6,00 €', description: 'Grille essorage' },
    ]
  },
  'ESCABEAUX & ÉCHAFAUDAGES': {
    name: 'ESCABEAUX & ÉCHAFAUDAGES',
    description: 'Accès en hauteur pour vos travaux',
    products: [
      { id: 'p1', name: 'Escabeau 3 Marches', brand: 'L\'OUTIL PARFAIT', price: '89,00 €', description: 'Escabeau aluminium' },
      { id: 'p2', name: 'Escabeau 4 Marches', brand: 'L\'OUTIL PARFAIT', price: '125,00 €', description: 'Escabeau pro' },
    ]
  },
  'TRUELLE & MALAXEUR': {
    name: 'TRUELLE & MALAXEUR',
    description: 'Outils de pose pour carreleur',
    products: [
      { id: 'p1', name: 'Truelle Italienne', brand: 'L\'OUTIL PARFAIT', price: '12,90 €', description: 'Truelle professionnelle' },
      { id: 'p2', name: 'Malaxeur', brand: 'TOUPRET', price: '45,00 €', description: 'Malaxeur perceuse' },
    ]
  },
  'CRÉMAILLÈRES': {
    name: 'CRÉMAILLÈRES',
    description: 'Peignes à colle pour carrelage',
    products: [
      { id: 'p1', name: 'Peigne 6mm', brand: 'L\'OUTIL PARFAIT', price: '7,50 €', description: 'Peigne petit carré' },
      { id: 'p2', name: 'Peigne 10mm', brand: 'L\'OUTIL PARFAIT', price: '8,90 €', description: 'Peigne grand carré' },
    ]
  },
  'COUPE-CARREAUX': {
    name: 'COUPE-CARREAUX',
    description: 'Coupe-carrelage manuel et électrique',
    products: [
      { id: 'p1', name: 'Coupe Manuel', brand: 'L\'OUTIL PARFAIT', price: '65,00 €', description: 'Coupe-carrelage 600mm' },
      { id: 'p2', name: 'Pince Coupe', brand: 'TOUPRET', price: '35,00 €', description: 'Pince réctangulaire' },
    ]
  },
  'SCIES & DISQUES': {
    name: 'SCIES & DISQUES',
    description: 'Découpe électrique pour carrelage',
    products: [
      { id: 'p1', name: 'Scie Sauteuse', brand: 'L\'OUTIL PARFAIT', price: '85,00 €', description: 'Scie carveau' },
      { id: 'p2', name: 'Disque Diamant', brand: 'TOUPRET', price: '28,00 €', description: 'Disque 115mm' },
    ]
  },
  'NIVEAU & FIL À PLOMB': {
    name: 'NIVEAU & FIL À PLOMB',
    description: 'Contrôle de planéité et alignement',
    products: [
      { id: 'p1', name: 'Niveau 80cm', brand: 'L\'OUTIL PARFAIT', price: '22,00 €', description: 'Niveau aluminium' },
      { id: 'p2', name: 'Fil à Plomb', brand: 'TOUPRET', price: '8,50 €', description: 'Fil et plomb' },
    ]
  },
  'CROISILLONS & CALES': {
    name: 'CROISILLONS & CALES',
    description: 'Joints et espacements pour carrelage',
    products: [
      { id: 'p1', name: 'Croisillons 2mm', brand: 'L\'OUTIL PARFAIT', price: '4,50 €', description: '100 croisillons' },
      { id: 'p2', name: 'Cales Nivellement', brand: 'TOUPRET', price: '15,00 €', description: 'Système nivellement' },
    ]
  },
  'RAGRÉAGE': {
    name: 'RAGRÉAGE',
    description: 'Enduits de lissage pour sols',
    products: [
      { id: 'p1', name: 'Ragréage Fin', brand: 'BOSTIK', price: '24,90 €', description: 'Enduit sol 5mm' },
      { id: 'p2', name: 'Ragréage épais', brand: 'PAREXLANKO', price: '28,00 €', description: 'Enduit sol 10mm' },
    ]
  },
  'PRIMAIRE D\'ACCROCHE': {
    name: 'PRIMAIRE D\'ACCROCHE',
    description: 'Sous-couches sols et primaires d\'accroche',
    products: [
      { id: 'p1', name: 'Primaire Sol', brand: 'BOSTIK', price: '18,50 €', description: 'Primaire universel' },
      { id: 'p2', name: 'Pont de liaison', brand: 'PAREXLANKO', price: '22,00 €', description: 'Primaire haute performance' },
    ]
  },
  'MORTIER DE RÉPARATION': {
    name: 'MORTIER DE RÉPARATION',
    description: 'Réparations structurales et comblement',
    products: [
      { id: 'p1', name: 'Mortier Réparation', brand: 'SIKA', price: '19,90 €', description: 'Mortier rapide' },
      { id: 'p2', name: 'Béton Mortier', brand: 'PAREXLANKO', price: '16,00 €', description: 'Mortier multiusage' },
    ]
  },
  'DÉSHUMIDIFIANTS': {
    name: 'DÉSHUMIDIFIANTS',
    description: 'Traitement humidité et assèchement',
    products: [
      { id: 'p1', name: 'Déshumidificateur', brand: 'SIKA', price: '45,00 €', description: 'Traitement humidité' },
    ]
  },
  'PROTECTION DE SOL': {
    name: 'PROTECTION DE SOL',
    description: 'Films et bâches de protection',
    products: [
      { id: 'p1', name: 'Film Protection', brand: 'L\'OUTIL PARFAIT', price: '12,00 €', description: 'Film polythène' },
    ]
  },
  'NETTOYANTS SPÉCIAUX': {
    name: 'NETTOYANTS SPÉCIAUX',
    description: 'Nettoyage sols et surfaces',
    products: [
      { id: 'p1', name: 'Nettoyant Joints', brand: 'BOSTIK', price: '9,90 €', description: 'Nettoyant carrelage' },
      { id: 'p2', name: 'Décapant', brand: 'SIKA', price: '14,00 €', description: 'Décapant peinture' },
    ]
  },
  'CHEVILLES': {
    name: 'CHEVILLES',
    description: 'Cheville tous supports etFixations',
    products: [
      { id: 'p1', name: 'Cheville Universelle', brand: 'BOSTIK', price: '8,50 €', description: 'Pack 100 cheville 8mm' },
      { id: 'p2', name: 'Cheville Béton', brand: 'SIKA', price: '12,00 €', description: 'Pack 50 cheville 10mm' },
    ]
  },
  'VIS À BOIS': {
    name: 'VIS À BOIS',
    description: 'Vis et boulons pour bois',
    products: [
      { id: 'p1', name: 'Vis Bois 4x40', brand: 'BOSTIK', price: '9,90 €', description: 'Pack 200 vis' },
      { id: 'p2', name: 'Vis Agglo', brand: 'SIKA', price: '11,00 €', description: 'Pack 200 vis agglo' },
    ]
  },
  'VIS À MÉTAL': {
    name: 'VIS À MÉTAL',
    description: 'Fixations métalliques et vis tôle',
    products: [
      { id: 'p1', name: 'Vis Tôle', brand: 'BOSTIK', price: '8,00 €', description: 'Pack 100 vis tôle' },
    ]
  },
  'VIS À BÉTON': {
    name: 'VIS À BÉTON',
    description: 'Scellement chimique et vis béton',
    products: [
      { id: 'p1', name: 'Scellement Chimique', brand: 'SIKA', price: '18,50 €', description: 'Cartouche 300ml' },
      { id: 'p2', name: 'Vis Béton', brand: 'BOSTIK', price: '15,00 €', description: 'Pack 50 vis' },
    ]
  },
  'CLOUS & PISTOLET': {
    name: 'CLOUS & PISTOLET',
    description: 'Clouage rapide et pistolet à clous',
    products: [
      { id: 'p1', name: 'Pistolet Cloueur', brand: 'L\'OUTIL PARFAIT', price: '75,00 €', description: 'Pistolet manuel' },
      { id: 'p2', name: 'Clous', brand: 'BOSTIK', price: '12,00 €', description: 'Pack clous 30mm' },
    ]
  },
  'BOULONS & ÉCROUS': {
    name: 'BOULONS & ÉCROUS',
    description: 'Visserie industrielle et fixations',
    products: [
      { id: 'p1', name: 'Boulon M8', brand: 'BOSTIK', price: '14,00 €', description: 'Pack 20 boulons M8' },
      { id: 'p2', name: 'Écrous', brand: 'SIKA', price: '8,50 €', description: 'Pack 50 écrous M8' },
    ]
  }
};

const ProductDetail: React.FC<ProductDetailProps> = ({ theme }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { categoryId, subcategoryId } = useParams<{ categoryId: string; subcategoryId: string }>();
  const isLight = theme === 'light';

  const handleBack = (): void => {
    navigate(-1);
  };

  const handleProductClick = (productId: string): void => {
    navigate(`/catalogue/${categoryId}/${subcategoryId}/${productId}`);
  };

  const categoryNames: Record<string, string> = {
    'PEINTURE_FINITION': 'PEINTURE & FINITION',
    'COLLES_MASTICS': 'COLLES & MASTICS',
    'OUTILLAGE_PEINTRE': 'OUTILLAGE PEINTRE',
    'OUTILLAGE_CARRELEUR': 'OUTILLAGE CARRELEUR',
    'PREPARATION_SOLS': 'PRÉPARATION SOLS',
    'FIXATION_VISSERIE': 'FIXATION & VISSERIE'
  };

  const categoryTitle = categoryId ? categoryNames[categoryId] || categoryId : '';
  const subcategoryKey = subcategoryId?.replace(/_/g, ' ') || '';
  const subcategory = subcategoryData[subcategoryKey] || {
    name: subcategoryId?.replace(/_/g, ' ') || '',
    description: '',
    products: []
  };

  const productCardClass = `relative rounded-xl overflow-hidden group cursor-pointer transition-all duration-1000 ease-out hover:scale-[1.05] border border-transparent hover:border-[#FF6B00] bg-transparent`;

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
              <span className={isLight ? 'text-black' : 'text-white'}>{categoryTitle.split(' ')[0]}</span>{' '}
              <span className="text-[#FF6B00]">{categoryTitle.split(' ').slice(1).join(' ')}</span>
            </h1>
            <h2 className={`font-bold italic text-2xl mt-4 ${isLight ? 'text-black' : 'text-white'}`}>
              {subcategory.name}
            </h2>
            <p className={`text-sm mt-2 max-w-2xl mx-auto ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
              {subcategory.description}
            </p>
          </div>

          {subcategory.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subcategory.products.map((product) => (
                <div
                  key={product.id}
                  className={productCardClass}
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 to-transparent" />
                  
                  <div className="relative p-5 cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[#FF6B00] text-xs font-bold uppercase tracking-wide">
                        {product.brand}
                      </span>
                      <span className={`text-lg font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                        {product.price}
                      </span>
                    </div>
                    
                    <h3 className={`font-bold italic text-lg uppercase mb-2 leading-tight ${
                      isLight ? 'text-black' : 'text-white'
                    }`}>
                      {product.name}
                    </h3>
                    
                    <p className={`text-xs mb-4 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                      {product.description}
                    </p>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                      className="w-full bg-[#FF6B00] text-black py-2 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#FF8533] transition-colors duration-200"
                    >
                      Voir le produit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              <p>Aucun produit disponible dans cette catégorie pour le moment.</p>
              <p className="text-sm mt-2">Revenez bientôt !</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
