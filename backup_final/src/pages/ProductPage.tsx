import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: string;
  description: string;
  fullDescription: string;
  image: string;
  features: string[];
}

interface SubcategoryDetail {
  name: string;
  description: string;
  products: Product[];
}

interface ProductPageProps {
  theme: 'dark' | 'light';
}

const productData: Record<string, SubcategoryDetail> = {
  PEINTURES: {
    name: 'PEINTURES',
    description: 'Peintures acryliques et glycéro pour tous vos projets de finition',
    products: [
      { 
        id: 'p1', 
        name: 'Peinture Acrylique Blanche', 
        brand: 'TOUPRET', 
        price: '24,90 €', 
        description: 'Peinture blanche mate intérieur',
        fullDescription: 'Peinture acrylique de haute qualité pour intérieurs. Finition mate parfaite, excellente couvrance et résistance aux lavages. Idéale pour toutes les pièces de vie.',
        image: '/assets/products/peinture-acrylique-blanche.jpg',
        features: ['Finition mate', 'Excellent pouvoir couvrant', 'Résistant aux lavages', 'Séchage rapide', 'Faible odeur']
      },
      { 
        id: 'p2', 
        name: 'Peinture Glycéro Blanche', 
        brand: 'BOSTIK', 
        price: '32,50 €', 
        description: 'Peinture glycérophtalique haute résistance',
        fullDescription: 'Peinture glycérophtalique professionnelle pour les pièces humides et à forte sollicitation. Résistance exceptionnelle et finition satinée brillante.',
        image: '/assets/products/peinture-glycero-blanche.jpg',
        features: ['Finition satinée', 'Haute résistance', 'Pour pièces humides', 'Longue durée', 'Entretien facile']
      },
      { 
        id: 'p3', 
        name: 'Peinture Colorée', 
        brand: 'SIKA', 
        price: '28,00 €', 
        description: 'Peinture couleur selon nuancier',
        fullDescription: 'Peinture colorante de précision disponible dans un large choix de teintes. Pigments de haute qualité pour des couleurs durables et éclatantes.',
        image: '/assets/products/peinture-coloree.jpg',
        features: ['Large nuancier', 'Couleurs durables', 'Teintes personnalisables', 'Couvrance optimale', 'Résistance UV']
      },
      { 
        id: 'p4', 
        name: 'Peinture Satinée', 
        brand: 'TOUPRET', 
        price: '27,90 €', 
        description: 'Finition satinée lavable',
        fullDescription: 'Peinture satinée pour un rendu élégant et moderne. Facile à nettoyer, parfaite pour les cuisines, salles de bain et couloirs.',
        image: '/assets/products/peinture-satinee.jpg',
        features: ['Finition satinée', 'Lavable', 'Résistant à l\'humidité', 'Aspect soyeux', 'Entretien facile']
      },
      { 
        id: 'p5', 
        name: 'Peinture Brillant', 
        brand: 'BOSTIK', 
        price: '31,00 €', 
        description: 'Finition brillante miroir',
        fullDescription: 'Peinture haute brillance pour des surfaces miroir impeccables. Effet laqué professionnel pour vos portes, fenêtres et mobiliers.',
        image: '/assets/products/peinture-brillant.jpg',
        features: ['Finition miroir', 'Effet laqué', 'Haut pouvoir couvrant', 'Séchage rapide', 'Résistant aux chocs']
      },
      { 
        id: 'p6', 
        name: 'Peinture Mat', 
        brand: 'PAREXLANKO', 
        price: '22,50 €', 
        description: 'Finition mate profonde',
        fullDescription: 'Peinture mate de qualité professionnelle pour un rendu matte profond et élégant. Masque parfaitement les imperfections.',
        image: '/assets/products/peinture-mat.jpg',
        features: ['Finition mate profonde', 'Masque les défauts', 'Touché agréable', 'Non réfléchissant', 'Grande couvrance']
      },
    ]
  },
  'SOUS-COUCHES': {
    name: 'SOUS-COUCHES',
    description: 'Primaires et sous-couches pour préparer vos surfaces',
    products: [
      { 
        id: 'p1', 
        name: 'Primaire Universel', 
        brand: 'BOSTIK', 
        price: '18,90 €', 
        description: 'Sous-couche tous supports',
        fullDescription: 'Primaire d\'accrochage universel pour tous types de supports. Améliore l\'adhérence des revêtements et réduit la consommation de peinture.',
        image: '/assets/products/primaire-universel.jpg',
        features: ['Tous supports', 'Séchage rapide', 'Réduit la consommation', 'Améliore l\'adhérence', 'Sans solvant']
      },
      { 
        id: 'p2', 
        name: 'Primaire Plâtre', 
        brand: 'TOUPRET', 
        price: '16,50 €', 
        description: 'Pour plaques de plâtre',
        fullDescription: 'Primaire spécifique pour plaques de plâtre et enduits. Régularise l\'absorption et facilite la mise en peinture.',
        image: '/assets/products/primaire-platre.jpg',
        features: ['Pour plâtre', 'Régularise l\'absorption', 'Facile à appliquer', 'Séchage rapide', 'Blanc profond']
      },
      { 
        id: 'p3', 
        name: 'Sous-couche Bois', 
        brand: 'SIKA', 
        price: '21,00 €', 
        description: 'Pour boiseries',
        fullDescription: 'Sous-couche bois de haute qualité. Protège et prépare les surfaces bois avant mise en peinture ou vernis.',
        image: '/assets/products/sous-couche-bois.jpg',
        features: ['Pour bois', 'Anti-taches', 'Séchage rapide', 'Facile à poncer', 'Excellent rendement']
      },
      { 
        id: 'p4', 
        name: 'Béton Prim', 
        brand: 'PAREXLANKO', 
        price: '19,90 €', 
        description: 'Pour surfaces béton',
        fullDescription: 'Primaire consolidant pour surfaces béton et ciment. Pénètre en profondeur et stabilise les supports poreux.',
        image: '/assets/products/beton-prim.jpg',
        features: ['Pour béton', 'Consolidant', 'Pénètre en profondeur', 'Stabilise les supports', 'Résistant']
      },
    ]
  },
  ENDUITS: {
    name: 'ENDUITS',
    description: 'Enduits de lissage et rebouchage pour toutes vos réparations',
    products: [
      { 
        id: 'p1', 
        name: 'Enduit Lissage', 
        brand: 'TOUPRET', 
        price: '14,90 €', 
        description: 'Enduit de lissage fin',
        fullDescription: 'Enduit de lissage pour obtenir des surfaces parfaitement planes. Application facile et toucher soyeux.',
        image: '/assets/products/enduit-lissage.jpg',
        features: ['Finition parfaite', 'Touché soyeux', 'Facile à appliquer', 'Ponçage facile', 'Blanc pur']
      },
      { 
        id: 'p2', 
        name: 'Enduit Rebouchage', 
        brand: 'BOSTIK', 
        price: '12,50 €', 
        description: 'Pour fissures et trous',
        fullDescription: 'Enduit de rebouchage haute performance pour combler fissures, trous et joints. Remontée rapide sans retrait.',
        image: '/assets/products/enduit-rebouchage.jpg',
        features: ['Rebouche fissures', 'Sans retrait', 'Séchage rapide', 'Ponçage facile', 'Blanc']
      },
      { 
        id: 'p3', 
        name: 'Enduit Gros', 
        brand: 'PAREXLANKO', 
        price: '16,00 €', 
        description: 'Enduit de rebouchage épais',
        fullDescription: 'Enduit de dégrossissage pour les grosses réparations. Application en couche épaisse possible.',
        image: '/assets/products/enduit-gros.jpg',
        features: ['Couche épaisse', 'Pour grandes réparations', 'Bon maintien', 'Ponçage moyen', 'Blanc']
      },
      { 
        id: 'p4', 
        name: 'Enduit Projection', 
        brand: 'SIKA', 
        price: '22,00 €', 
        description: 'Enduit machine',
        fullDescription: 'Enduit professionnel pour projection mécanique. Productivité accrue pour les grandes surfaces.',
        image: '/assets/products/enduit-projection.jpg',
        features: ['Pour machine', 'Grande surface', 'Rendement élevé', 'Finition uniforme', 'Blanc']
      },
    ]
  },
  'BANDES À JOINTS': {
    name: 'BANDES À JOINTS',
    description: 'Bandes pour plaques de plâtre et joints',
    products: [
      { 
        id: 'p1', 
        name: 'Bande Joint Standard', 
        brand: 'TOUPRET', 
        price: '8,50 €', 
        description: 'Bande papier 150mm',
        fullDescription: 'Bande à joints en papier de qualité professionnelle. Haute résistance et facilité de pose.',
        image: '/assets/products/bande-joint-standard.jpg',
        features: ['Papier qualité pro', '150mm', 'Haute résistance', 'Facile à poser', 'Plis nets']
      },
      { 
        id: 'p2', 
        name: 'Bande Armée', 
        brand: 'BOSTIK', 
        price: '12,00 €', 
        description: 'Bande fibre 100mm',
        fullDescription: 'Bande à joints armée de fibre de verre. Renforcement supplémentaire pour les angles et joints sollicités.',
        image: '/assets/products/bande-armee.jpg',
        features: ['Fibre de verre', '100mm', 'Renforcée', 'Angles solides', 'Résistante']
      },
      { 
        id: 'p3', 
        name: 'Bande Angle', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '6,00 €', 
        description: 'Bande angle métal',
        fullDescription: 'Bande d\'angle métallique pour des angles parfaitement droits et protégés.',
        image: '/assets/products/bande-angle.jpg',
        features: ['Métal', 'Angles droits', 'Protection', 'Facile à poser', 'Durable']
      },
    ]
  },
  'BANDES ARMÉES': {
    name: 'BANDES ARMÉES',
    description: 'Renforcement des angles et coins',
    products: [
      { 
        id: 'p1', 
        name: 'Corner Guard', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '9,90 €', 
        description: 'Protection angle alu',
        fullDescription: 'Protection d\'angle en aluminium pour une durabilité maximale. Installation rapide et professionnelle.',
        image: '/assets/products/corner-guard.jpg',
        features: ['Aluminium', 'Protection angle', 'Durable', 'Pose rapide', 'Finition propre']
      },
      { 
        id: 'p2', 
        name: 'Bande Carbone', 
        brand: 'TOUPRET', 
        price: '15,00 €', 
        description: 'Bande fibre carbone',
        fullDescription: 'Bande de renforcement en fibre de carbone pour les joints à forte sollicitation.',
        image: '/assets/products/bande-carbone.jpg',
        features: ['Fibre carbone', 'Ultra-résistante', 'Joint renforcé', 'Longue durée', 'Professionnel']
      },
    ]
  },
  'PRODUITS DE FINITION': {
    name: 'PRODUITS DE FINITION',
    description: 'Vernis et protections pour vos réalisations',
    products: [
      { 
        id: 'p1', 
        name: 'Vernis Incolore', 
        brand: 'BOSTIK', 
        price: '24,90 €', 
        description: 'Vernis protecteur mat',
        fullDescription: 'Vernis de protection incolore à finition mate. Protège vos surfaces tout en conservant leur aspect naturel.',
        image: '/assets/products/vernis-incolore.jpg',
        features: ['Incolore', 'Finition mate', 'Protège', 'Facile à appliquer', 'Séchage rapide']
      },
      { 
        id: 'p2', 
        name: 'Vernis Colle', 
        brand: 'SIKA', 
        price: '28,00 €', 
        description: 'Vernis colle河北省',
        fullDescription: 'Vernis colle multifonction. Protection et collage en une seule opération.',
        image: '/assets/products/vernis-colle.jpg',
        features: ['2-en-1', 'Protège et colle', 'Polyvalent', 'Séchage rapide', 'Transparent']
      },
    ]
  },
  'COLLE À CARRELAGE': {
    name: 'COLLE À CARRELAGE',
    description: 'Colles pour tous types de carrelage',
    products: [
      { 
        id: 'p1', 
        name: 'Colle C1', 
        brand: 'BOSTIK', 
        price: '22,90 €', 
        description: 'Colle ciment ordinaire',
        fullDescription: 'Colle à carrelage C1 pour les revêtements céramiques standards. Adaptée aux murs et sols intérieurs.',
        image: '/assets/products/colle-c1.jpg',
        features: ['C1 standard', 'Céramique', 'Murs et sols', 'Facile à appliquer', 'Bon accrochage']
      },
      { 
        id: 'p2', 
        name: 'Colle C2', 
        brand: 'SIKA', 
        price: '29,90 €', 
        description: 'Colle ciment améliorée',
        fullDescription: 'Colle à carrelage C2 haute performance pour grands formats et pièces humides.',
        image: '/assets/products/colle-c2.jpg',
        features: ['C2 améliorée', 'Grand format', 'Pièces humides', 'Haute résistance', 'Longue vie']
      },
      { 
        id: 'p3', 
        name: 'Colle Sol Souple', 
        brand: 'PAREXLANKO', 
        price: '26,00 €', 
        description: 'Pour sols PVC',
        fullDescription: 'Colle spécifique pour revêtements de sols souples PVC, linoléum et moquettes.',
        image: '/assets/products/colle-sol-souple.jpg',
        features: ['Sol souple', 'PVC', 'Linoléum', 'Moquette', 'Résistant']
      },
    ]
  },
  'COLLE À PARQUET': {
    name: 'COLLE À PARQUET',
    description: 'Colles pour parquet stratifié et massif',
    products: [
      { 
        id: 'p1', 
        name: 'Colle Parquet MS', 
        brand: 'BOSTIK', 
        price: '45,00 €', 
        description: 'Colle MS Polymère',
        fullDescription: 'Colle MS polymère pour parquet stratifié et massif. Sans solvant, sans odeur et très flexible.',
        image: '/assets/products/colle-parquet-ms.jpg',
        features: ['MS Polymère', 'Sans solvant', 'Sans odeur', 'Flexible', 'Tous parquets']
      },
      { 
        id: 'p2', 
        name: 'Colle Parquet PU', 
        brand: 'SIKA', 
        price: '52,00 €', 
        description: 'Colle polyuréthane',
        fullDescription: 'Colle polyuréthane professionnelle pour parquets-massifs et contrecollés. Haute résistance à l\'humidité.',
        image: '/assets/products/colle-parquet-pu.jpg',
        features: ['Polyuréthane', 'Parquet massif', 'Résistant humidité', 'Professionnel', 'Longue vie']
      },
    ]
  },
  'COLLE SOL SOUPLE': {
    name: 'COLLE SOL SOUPLE',
    description: 'Pour PVC, linoléum, moquette',
    products: [
      { 
        id: 'p1', 
        name: 'Colle Moquette', 
        brand: 'BOSTIK', 
        price: '19,90 €', 
        description: 'Colle spécifique moquette',
        fullDescription: 'Colle acrylique pour la pose de moquettes tous types. Fixation permanente et rapide.',
        image: '/assets/products/colle-moquette.jpg',
        features: ['Moquette', 'Fixation rapide', 'Permanente', 'Facile à poser', 'Économique']
      },
      { 
        id: 'p2', 
        name: 'Colle PVC', 
        brand: 'PAREXLANKO', 
        price: '23,00 €', 
        description: 'Colle vinyle',
        fullDescription: 'Colle spéciale revêtements PVC. Adhésion immédiate et tenue durable.',
        image: '/assets/products/colle-pvc.jpg',
        features: ['PVC', 'Vinyle', 'Adhésion immédiate', 'Tenue durable', 'Simple']
      },
    ]
  },
  'COLLE POUR CARREAUX DE PLÂTRE': {
    name: 'COLLE CARREAUX PLÂTRE',
    description: 'Plaques de plâtre et partitions',
    products: [
      { 
        id: 'p1', 
        name: 'Colle Plâtre', 
        brand: 'TOUPRET', 
        price: '16,50 €', 
        description: 'Colle plaques de plâtre',
        fullDescription: 'Colle à plâtre pour la pose de carreaux de plâtre et cloisons. Prise rapide et résistance élevée.',
        image: '/assets/products/colle-platre.jpg',
        features: ['Plâtre', 'Carreaux', 'Prise rapide', 'Résistante', 'Facile']
      },
    ]
  },
  'COLLES EN TUBE': {
    name: 'COLLES EN TUBE',
    description: 'Bostik et autres marques en format tube',
    products: [
      { 
        id: 'p1', 
        name: 'Bostik Fix', 
        brand: 'BOSTIK', 
        price: '8,90 €', 
        description: 'Colle de fixation tube',
        fullDescription: 'Colle de fixation en tube pour les petits travaux de bricolage. Prise rapide et tenue puissante.',
        image: '/assets/products/bostik-fix.jpg',
        features: ['Tube', 'Fixation rapide', 'Polyvalent', 'Petits travaux', 'Pratique']
      },
      { 
        id: 'p2', 
        name: 'Colle Express', 
        brand: 'SIKA', 
        price: '12,00 €', 
        description: 'Colle rapide',
        fullDescription: 'Colle express pour les réparations urgentes. Prise ultra-rapide et résistance immédiate.',
        image: '/assets/products/colle-express.jpg',
        features: ['Rapide', 'Express', 'Réparations', 'Prise immédiate', 'Forte']
      },
    ]
  },
  'MASTICS ACRYLIQUES': {
    name: 'MASTICS ACRYLIQUES',
    description: 'Pour joints et fissures',
    products: [
      { 
        id: 'p1', 
        name: 'Mastic Acrylique', 
        brand: 'BOSTIK', 
        price: '7,50 €', 
        description: 'Mastic peinture blanc',
        fullDescription: 'Mastic acrylique de remplissage pour joints et fissures. Peinturable et polyvalent.',
        image: '/assets/products/mastic-acrylique.jpg',
        features: ['Acrylique', 'Peinturable', 'Joints', 'Fissures', 'Blanc']
      },
      { 
        id: 'p2', 
        name: 'Mastic Large Joint', 
        brand: 'SIKA', 
        price: '9,90 €', 
        description: 'Mastic 25mm',
        fullDescription: 'Mastic acrylique pour grands joints jusqu\'à 25mm. Excellent pouvoir de remplissage.',
        image: '/assets/products/mastic-large.jpg',
        features: ['25mm', 'Grand joint', 'Remplissage', 'Peinturable', 'Flexibilité']
      },
    ]
  },
  'MASTICS SILICONE': {
    name: 'MASTICS SILICONE',
    description: 'Étanchéité salle de bain et cuisine',
    products: [
      { 
        id: 'p1', 
        name: 'Silicone Sanitaire', 
        brand: 'BOSTIK', 
        price: '8,90 €', 
        description: 'Silicone anti-moisissure',
        fullDescription: 'Silicone sanitaire avec protection anti-moisissure. Parfait pour salles de bain et cuisines.',
        image: '/assets/products/silicone-sanitaire.jpg',
        features: ['Sanitaire', 'Anti-moisissure', 'Salle de bain', 'Cuisine', 'Étanche']
      },
      { 
        id: 'p2', 
        name: 'Silicone Vitrerie', 
        brand: 'SIKA', 
        price: '7,50 €', 
        description: 'Silicone transparent',
        fullDescription: 'Silicone de vitrage transparent pour l\'étanchéité des fenêtres et vitrages.',
        image: '/assets/products/silicone-vitrerie.jpg',
        features: ['Transparent', 'Vitrage', 'Étanche', 'Résistant UV', 'Vitrier']
      },
    ]
  },
  'COLLES SPÉCIALES': {
    name: 'COLLES SPÉCIALES',
    description: 'Polyuréthane, MS polymère',
    products: [
      { 
        id: 'p1', 
        name: 'Colle PU', 
        brand: 'SIKA', 
        price: '24,00 €', 
        description: 'Polyuréthane haute résistance',
        fullDescription: 'Colle polyuréthane pour les assemblages exigeants. Résistance mécanique et chimique élevée.',
        image: '/assets/products/colle-pu.jpg',
        features: ['Polyuréthane', 'Haute résistance', 'Assemblages', 'Chimique', 'Mécanique']
      },
      { 
        id: 'p2', 
        name: 'Colle MS', 
        brand: 'BOSTIK', 
        price: '22,00 €', 
        description: 'MS Polymère',
        fullDescription: 'Colle MS polymère hybride. Compatible avec tous matériaux et environnements.',
        image: '/assets/products/colle-ms.jpg',
        features: ['MS Polymère', 'Hybride', 'Tous matériaux', 'Polyvalent', 'Durable']
      },
    ]
  },
  'BROSSES & PINCEAUX': {
    name: 'BROSSES & PINCEAUX',
    description: 'Pinceaux professionnels pour tous vos travaux',
    products: [
      { 
        id: 'p1', 
        name: 'Pinceau Plat 50mm', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '6,90 €', 
        description: 'Pinceau professionnel',
        fullDescription: 'Pinceau plat professionnel de 50mm. Poils synthétiques de qualité pour une application parfaite.',
        image: '/assets/products/pinceau-plat-50.jpg',
        features: ['50mm', 'Plat', 'Synthétique', 'Professionnel', 'Application parfaite']
      },
      { 
        id: 'p2', 
        name: 'Pinceau Radiateur', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '5,50 €', 
        description: 'Pinceau long manche',
        fullDescription: 'Pinceau à radiateur avec long manche incurvé. Accès facile aux zones difficiles.',
        image: '/assets/products/pinceau-radiateur.jpg',
        features: ['Radiateur', 'Long manche', 'Incurvé', 'Zones difficiles', 'Pratique']
      },
      { 
        id: 'p3', 
        name: 'Brosse Métallique', 
        brand: 'TOUPRET', 
        price: '4,90 €', 
        description: 'Brosse décapage',
        fullDescription: 'Brosse métallique pour le décapage et le nettoyage des surfaces rouillées ou peintes.',
        image: '/assets/products/brosse-metallique.jpg',
        features: ['Métallique', 'Décapage', 'Nettoyage', 'Rouille', 'Puissante']
      },
    ]
  },
  'ROULEAUX': {
    name: 'ROULEAUX',
    description: 'Rouleaux et manchons pour peinture',
    products: [
      { 
        id: 'p1', 
        name: 'Rouleau Standard', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '8,90 €', 
        description: 'Rouleau 180mm',
        fullDescription: 'Rouleau de peinture standard 180mm. Manchon polyester pour toutes types de peinture.',
        image: '/assets/products/rouleau-standard.jpg',
        features: ['180mm', 'Standard', 'Polyester', 'Toutes peinture', 'Couvrant']
      },
      { 
        id: 'p2', 
        name: 'Manchon Longue', 
        brand: 'TOUPRET', 
        price: '5,50 €', 
        description: 'Manchon 12mm',
        fullDescription: 'Manchon velours 12mm pour finition parfaite. Réservé aux pinturas lisses.',
        image: '/assets/products/manchon-longue.jpg',
        features: ['12mm', 'Velours', 'Finition', 'Lisse', 'Parfait']
      },
      { 
        id: 'p3', 
        name: 'Bac Peinture', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '12,00 €', 
        description: 'Bac + grille',
        fullDescription: 'Bac à peinture professionnel avec grille d\'essorage intégrée.',
        image: '/assets/products/bac-peinture.jpg',
        features: ['Bac', 'Grille', 'Essorage', 'Professionnel', 'Pratique']
      },
    ]
  },
  'RÂTEAUX & SPALTES': {
    name: 'RÂTEAUX & SPALTES',
    description: 'Outils de précision pour professionnels',
    products: [
      { 
        id: 'p1', 
        name: 'Râteau', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '7,50 €', 
        description: 'Râteau à colle',
        fullDescription: 'Râteau à colle denté pour l\'application régulière de la colle à carrelage.',
        image: '/assets/products/rateau.jpg',
        features: ['Râteau', 'Denté', 'Colle', 'Carrelage', 'Régulier']
      },
      { 
        id: 'p2', 
        name: 'Spalters', 
        brand: 'TOUPRET', 
        price: '9,00 €', 
        description: 'Grande spatule',
        fullDescription: 'Spatule large pour l\'application d\'enduits et de revêtements en grande surface.',
        image: '/assets/products/spalters.jpg',
        features: ['Spatule', 'Large', 'Enduits', 'Grande surface', 'Professionnel']
      },
    ]
  },
  'RUBANS DE MASQUAGE': {
    name: 'RUBANS DE MASQUAGE',
    description: 'Adhésifs de protection pour vos travaux',
    products: [
      { 
        id: 'p1', 
        name: 'Ruban Masking', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '4,50 €', 
        description: 'Ruban papier 50mm',
        fullDescription: 'Ruban de masquage papier 50mm. Décollement net sans résidus.',
        image: '/assets/products/ruban-masking.jpg',
        features: ['50mm', 'Papier', 'Masquage', 'Net', 'Sans résidu']
      },
      { 
        id: 'p2', 
        name: 'Ruban Carrelage', 
        brand: 'TOUPRET', 
        price: '5,90 €', 
        description: 'Ruban précis',
        fullDescription: 'Ruban de précision pour la pose de carrelage. Protection des bordures et joints.',
        image: '/assets/products/ruban-carrelage.jpg',
        features: ['Précis', 'Carrelage', 'Bordures', 'Joints', 'Protection']
      },
    ]
  },
  'BACS À PEINTURE': {
    name: 'BACS À PEINTURE',
    description: 'Bacs et accessoires pour rouleaux',
    products: [
      { 
        id: 'p1', 
        name: 'Bac Professionnel', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '14,90 €', 
        description: 'Bac renforcé',
        fullDescription: 'Bac à peinture professionnel renforcé. Longue durée de vie et ergonomie.',
        image: '/assets/products/bac-professionnel.jpg',
        features: ['Professionnel', 'Renforcé', 'Ergonomique', 'Durable', 'Pratique']
      },
      { 
        id: 'p2', 
        name: 'Grille Essoreuse', 
        brand: 'TOUPRET', 
        price: '6,00 €', 
        description: 'Grille essorage',
        fullDescription: 'Grille d\'essorage pour rouleaux. Distribution uniforme de la peinture.',
        image: '/assets/products/grille-essoreuse.jpg',
        features: ['Grille', 'Essorage', 'Uniforme', 'Rouleau', 'Pratique']
      },
    ]
  },
  'ESCABEAUX & ÉCHAFAUDAGES': {
    name: 'ESCABEAUX & ÉCHAFAUDAGES',
    description: 'Accès en hauteur pour vos travaux',
    products: [
      { 
        id: 'p1', 
        name: 'Escabeau 3 Marches', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '89,00 €', 
        description: 'Escabeau aluminium',
        fullDescription: 'Escabeau aluminium 3 marches. Léger, stable et sécurisé pour tous vos travaux en hauteur.',
        image: '/assets/products/escabeau-3.jpg',
        features: ['3 marches', 'Aluminium', 'Léger', 'Stable', 'Sécurisé']
      },
      { 
        id: 'p2', 
        name: 'Escabeau 4 Marches', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '125,00 €', 
        description: 'Escabeau pro',
        fullDescription: 'Escabeau professionnel 4 marches avec plateau outil intégré.',
        image: '/assets/products/escabeau-4.jpg',
        features: ['4 marches', 'Pro', 'Plateau outil', 'Haut', 'Professionnel']
      },
    ]
  },
  'TRUELLE & MALAXEUR': {
    name: 'TRUELLE & MALAXEUR',
    description: 'Outils de pose pour carreleur',
    products: [
      { 
        id: 'p1', 
        name: 'Truelle Italienne', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '12,90 €', 
        description: 'Truelle professionnelle',
        fullDescription: 'Truelle italienne professionnelle en acier inox. Manche bois ergonomique.',
        image: '/assets/products/truelle-italienne.jpg',
        features: ['Italienne', 'Inox', 'Bois', 'Ergonomique', 'Pro']
      },
      { 
        id: 'p2', 
        name: 'Malaxeur', 
        brand: 'TOUPRET', 
        price: '45,00 €', 
        description: 'Malaxeur perceuse',
        fullDescription: 'Malaxeur à mortier pour perceuse. Agitateur hélicoïdal pour mélanges homogènes.',
        image: '/assets/products/malaxeur.jpg',
        features: ['Malaxeur', 'Perceuse', 'Hélicoïdal', 'Homogène', 'Mortier']
      },
    ]
  },
  'CRÉMAILLÈRES': {
    name: 'CRÉMAILLÈRES',
    description: 'Peignes à colle pour carrelage',
    products: [
      { 
        id: 'p1', 
        name: 'Peigne 6mm', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '7,50 €', 
        description: 'Peigne petit carré',
        fullDescription: 'Peigne à colle 6mm pour petits carreaux. Dents carrées pour une meilleure application.',
        image: '/assets/products/peigne-6.jpg',
        features: ['6mm', 'Petit carré', 'Carreaux', 'Dents carrées', 'Application']
      },
      { 
        id: 'p2', 
        name: 'Peigne 10mm', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '8,90 €', 
        description: 'Peigne grand carré',
        fullDescription: 'Peigne à colle 10mm pour grands formats. Dents carrées pour un键槽 optimal.',
        image: '/assets/products/peigne-10.jpg',
        features: ['10mm', 'Grand carré', 'Grand format', 'Dents carrées', 'Optimal']
      },
    ]
  },
  'COUPE-CARREAUX': {
    name: 'COUPE-CARREAUX',
    description: 'Coupe-carrelage manuel et électrique',
    products: [
      { 
        id: 'p1', 
        name: 'Coupe Manuel', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '65,00 €', 
        description: 'Coupe-carrelage 600mm',
        fullDescription: 'Coupe-carrelage manuel 600mm avec rail en aluminium. Coupe droite précise.',
        image: '/assets/products/coupe-manuel.jpg',
        features: ['Manuel', '600mm', 'Aluminium', 'Précis', 'Droite']
      },
      { 
        id: 'p2', 
        name: 'Pince Coupe', 
        brand: 'TOUPRET', 
        price: '35,00 €', 
        description: 'Pince réctangulaire',
        fullDescription: 'Pince coupe-carrelage pour découpes précises. Format rectangulaire pratique.',
        image: '/assets/products/pince-coupe.jpg',
        features: ['Pince', 'Rectangulaire', 'Découpes', 'Précise', 'Manuelle']
      },
    ]
  },
  'SCIES & DISQUES': {
    name: 'SCIES & DISQUES',
    description: 'Découpe électrique pour carrelage',
    products: [
      { 
        id: 'p1', 
        name: 'Scie Sauteuse', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '85,00 €', 
        description: 'Scie carveau',
        fullDescription: 'Scie sauteuse pour carreaux. Coupe précise et nette pour les découpes complexes.',
        image: '/assets/products/scie-sauteuse.jpg',
        features: ['Scie', 'Carreaux', 'Précise', 'Complexe', 'Découpe']
      },
      { 
        id: 'p2', 
        name: 'Disque Diamant', 
        brand: 'TOUPRET', 
        price: '28,00 €', 
        description: 'Disque 115mm',
        fullDescription: 'Disque diamanté 115mm pour meuleuse. Coupe tous types de carreaux et pierre.',
        image: '/assets/products/disque-diamant.jpg',
        features: ['Diamant', '115mm', 'Meuleuse', 'Tous carreaux', 'Pierre']
      },
    ]
  },
  'NIVEAU & FIL À PLOMB': {
    name: 'NIVEAU & FIL À PLOMB',
    description: 'Contrôle de planéité et alignement',
    products: [
      { 
        id: 'p1', 
        name: 'Niveau 80cm', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '22,00 €', 
        description: 'Niveau aluminium',
        fullDescription: 'Niveau à bulle aluminium 80cm avec fioles haute précision. Certifié professionnel.',
        image: '/assets/products/niveau-80.jpg',
        features: ['80cm', 'Aluminium', 'Précis', 'Fioles', 'Pro']
      },
      { 
        id: 'p2', 
        name: 'Fil à Plomb', 
        brand: 'TOUPRET', 
        price: '8,50 €', 
        description: 'Fil et plomb',
        fullDescription: 'Fil à plomb traditionnel avec masse métallique. Précision maximale pour la verticalité.',
        image: '/assets/products/fil-plomb.jpg',
        features: ['Fil', 'Plomb', 'Verticalité', 'Traditionnel', 'Précis']
      },
    ]
  },
  'CROISILLONS & CALES': {
    name: 'CROISILLONS & CALES',
    description: 'Joints et espacements pour carrelage',
    products: [
      { 
        id: 'p1', 
        name: 'Croisillons 2mm', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '4,50 €', 
        description: '100 croisillons',
        fullDescription: 'Pack de 100 croisillons d\'espacement 2mm pour joints réguliers.',
        image: '/assets/products/croisillons-2.jpg',
        features: ['2mm', '100 pièces', 'Espacement', 'Joints réguliers', 'Pratique']
      },
      { 
        id: 'p2', 
        name: 'Cales Nivellement', 
        brand: 'TOUPRET', 
        price: '15,00 €', 
        description: 'Système nivellement',
        fullDescription: 'Système de nivellement pour carrelage. Élimine les différences de niveau entre carreaux.',
        image: '/assets/products/cales-nivellement.jpg',
        features: ['Nivellement', 'Système', 'Élimine niveau', 'Carrelage', 'Parfait']
      },
    ]
  },
  'RAGRÉAGE': {
    name: 'RAGRÉAGE',
    description: 'Enduits de lissage pour sols',
    products: [
      { 
        id: 'p1', 
        name: 'Ragréage Fin', 
        brand: 'BOSTIK', 
        price: '24,90 €', 
        description: 'Enduit sol 5mm',
        fullDescription: 'Ragréage autolissant pour sols. Epaisseur jusqu\'à 5mm, séchage rapide.',
        image: '/assets/products/ragrement-fin.jpg',
        features: ['Autolissant', '5mm', 'Séchage rapide', 'Sols', 'Fin']
      },
      { 
        id: 'p2', 
        name: 'Ragréage épais', 
        brand: 'PAREXLANKO', 
        price: '28,00 €', 
        description: 'Enduit sol 10mm',
        fullDescription: 'Ragréage de reprise épais. Epaisseur jusqu\'à 10mm pour sols très irréguliers.',
        image: '/assets/products/ragrement-epais.jpg',
        features: ['Epais', '10mm', 'Reprise', 'Irrégulier', 'Sols']
      },
    ]
  },
  'PRIMAIRE D\'ACCROCHE': {
    name: 'PRIMAIRE D\'ACCROCHE',
    description: 'Sous-couches sols et primaires d\'accroche',
    products: [
      { 
        id: 'p1', 
        name: 'Primaire Sol', 
        brand: 'BOSTIK', 
        price: '18,50 €', 
        description: 'Primaire universel',
        fullDescription: 'Primaire d\'accroche universel pour tous types de revêtements de sol.',
        image: '/assets/products/primaire-sol.jpg',
        features: ['Universel', 'Sols', 'Accroche', 'Tous revêtements', 'Polyvalent']
      },
      { 
        id: 'p2', 
        name: 'Pont de liaison', 
        brand: 'PAREXLANKO', 
        price: '22,00 €', 
        description: 'Primaire haute performance',
        fullDescription: 'Pont de liaison haute performance pour supports difficiles. Adhérence exceptionnelle.',
        image: '/assets/products/pont-liaison.jpg',
        features: ['Pont', 'Haute performance', 'Difficile', 'Adhérence', 'Exceptionnel']
      },
    ]
  },
  'MORTIER DE RÉPARATION': {
    name: 'MORTIER DE RÉPARATION',
    description: 'Réparations structurales et comblement',
    products: [
      { 
        id: 'p1', 
        name: 'Mortier Réparation', 
        brand: 'SIKA', 
        price: '19,90 €', 
        description: 'Mortier rapide',
        fullDescription: 'Mortier de réparation à prise rapide pour petites et moyennes réparations.',
        image: '/assets/products/mortier-reparation.jpg',
        features: ['Rapide', 'Petites réparations', 'Moyennes', 'Prise rapide', 'Efficace']
      },
      { 
        id: 'p2', 
        name: 'Béton Mortier', 
        brand: 'PAREXLANKO', 
        price: '16,00 €', 
        description: 'Mortier multiusage',
        fullDescription: 'Mortier multiusage pour toutes les réparations courantes. Polyvalent et économique.',
        image: '/assets/products/beton-mortier.jpg',
        features: ['Multiusage', 'Polyvalent', 'Réparations', 'Courantes', 'Économique']
      },
    ]
  },
  'DÉSHUMIDIFIANTS': {
    name: 'DÉSHUMIDIFIANTS',
    description: 'Traitement humidité et assèchement',
    products: [
      { 
        id: 'p1', 
        name: 'Déshumidificateur', 
        brand: 'SIKA', 
        price: '45,00 €', 
        description: 'Traitement humidité',
        fullDescription: 'Traitement déshumidificateur assèchant pour murs humides. Élimine l\'humidité en profondeur.',
        image: '/assets/products/deshumidificateur.jpg',
        features: ['Déshumidifie', 'Murs humides', 'Assèche', 'Profondeur', 'Efficace']
      },
    ]
  },
  'PROTECTION DE SOL': {
    name: 'PROTECTION DE SOL',
    description: 'Films et bâches de protection',
    products: [
      { 
        id: 'p1', 
        name: 'Film Protection', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '12,00 €', 
        description: 'Film polythène',
        fullDescription: 'Film de protection polythène autocollant. Protection des sols et surfaces pendant les travaux.',
        image: '/assets/products/film-protection.jpg',
        features: ['Film', 'Polythène', 'Autocollant', 'Protection', 'Travaux']
      },
    ]
  },
  'NETTOYANTS SPÉCIAUX': {
    name: 'NETTOYANTS SPÉCIAUX',
    description: 'Nettoyage sols et surfaces',
    products: [
      { 
        id: 'p1', 
        name: 'Nettoyant Joints', 
        brand: 'BOSTIK', 
        price: '9,90 €', 
        description: 'Nettoyant carrelage',
        fullDescription: 'Nettoyant spécial joints de carrelage. Élimine les salissures et fait briller.',
        image: '/assets/products/nettoyant-joints.jpg',
        features: ['Joints', 'Carrelage', 'Salissures', 'Brille', 'Spécial']
      },
      { 
        id: 'p2', 
        name: 'Décapant', 
        brand: 'SIKA', 
        price: '14,00 €', 
        description: 'Décapant peinture',
        fullDescription: 'Décapant professionnel pour peinture et vernis. Action rapide et profonde.',
        image: '/assets/products/decapant.jpg',
        features: ['Décapant', 'Peinture', 'Vernis', 'Rapide', 'Profond']
      },
    ]
  },
  'CHEVILLES': {
    name: 'CHEVILLES',
    description: 'Cheville tous supports etFixations',
    products: [
      { 
        id: 'p1', 
        name: 'Cheville Universelle', 
        brand: 'BOSTIK', 
        price: '8,50 €', 
        description: 'Pack 100 cheville 8mm',
        fullDescription: 'Pack de 100 chevilles universelles 8mm. Pour tous types de supports.',
        image: '/assets/products/cheville-universelle.jpg',
        features: ['Universelle', '100 pièces', '8mm', 'Tous supports', 'Polyvalente']
      },
      { 
        id: 'p2', 
        name: 'Cheville Béton', 
        brand: 'SIKA', 
        price: '12,00 €', 
        description: 'Pack 50 cheville 10mm',
        fullDescription: 'Pack de 50 chevilles à béton 10mm. Haute résistance pour charges lourdes.',
        image: '/assets/products/cheville-beton.jpg',
        features: ['Béton', '50 pièces', '10mm', 'Charge lourde', 'Résistante']
      },
    ]
  },
  'VIS À BOIS': {
    name: 'VIS À BOIS',
    description: 'Vis et boulons pour bois',
    products: [
      { 
        id: 'p1', 
        name: 'Vis Bois 4x40', 
        brand: 'BOSTIK', 
        price: '9,90 €', 
        description: 'Pack 200 vis',
        fullDescription: 'Pack de 200 vis à bois 4x40mm. Tête fraisée et pointe normale.',
        image: '/assets/products/vis-bois-4x40.jpg',
        features: ['4x40mm', '200 pièces', 'Bois', 'Fraîsée', 'Normale']
      },
      { 
        id: 'p2', 
        name: 'Vis Agglo', 
        brand: 'SIKA', 
        price: '11,00 €', 
        description: 'Pack 200 vis agglo',
        fullDescription: 'Pack de 200 vis pour aggloméré. Pointe forêt pour pénétration facile.',
        image: '/assets/products/vis-agglo.jpg',
        features: ['Agglo', '200 pièces', 'Pointe forêt', 'Facile', 'Pénétration']
      },
    ]
  },
  'VIS À MÉTAL': {
    name: 'VIS À MÉTAL',
    description: 'Fixations métalliques et vis tôle',
    products: [
      { 
        id: 'p1', 
        name: 'Vis Tôle', 
        brand: 'BOSTIK', 
        price: '8,00 €', 
        description: 'Pack 100 vis tôle',
        fullDescription: 'Pack de 100 vis à tôle. Pointe foreuse pour métal fino et tôle.',
        image: '/assets/products/vis-tole.jpg',
        features: ['Tôle', '100 pièces', 'Foreuse', 'Metal fino', 'Spécialisée']
      },
    ]
  },
  'VIS À BÉTON': {
    name: 'VIS À BÉTON',
    description: 'Scellement chimique et vis béton',
    products: [
      { 
        id: 'p1', 
        name: 'Scellement Chimique', 
        brand: 'SIKA', 
        price: '18,50 €', 
        description: 'Cartouche 300ml',
        fullDescription: 'Scellement chimique en cartouche 300ml. Pour fixations lourdes dans le béton.',
        image: '/assets/products/scellement-chimique.jpg',
        features: ['Chimique', '300ml', 'Béton', 'Lourde', 'Fixation']
      },
      { 
        id: 'p2', 
        name: 'Vis Béton', 
        brand: 'BOSTIK', 
        price: '15,00 €', 
        description: 'Pack 50 vis',
        fullDescription: 'Pack de 50 vis à béton avec chevilles. Installation rapide sans scellement.',
        image: '/assets/products/vis-beton.jpg',
        features: ['Béton', '50 pièces', 'Chevilles', 'Rapide', 'Sans scellement']
      },
    ]
  },
  'CLOUS & PISTOLET': {
    name: 'CLOUS & PISTOLET',
    description: 'Clouage rapide et pistolet à clous',
    products: [
      { 
        id: 'p1', 
        name: 'Pistolet Cloueur', 
        brand: 'L\'OUTIL PARFAIT', 
        price: '75,00 €', 
        description: 'Pistolet manuel',
        fullDescription: 'Pistolet à clous manuel professionnel. Clouage rapide et précis sans compresseur.',
        image: '/assets/products/pistolet-cloueur.jpg',
        features: ['Pistolet', 'Manuel', 'Professionnel', 'Rapide', 'Précis']
      },
      { 
        id: 'p2', 
        name: 'Clous', 
        brand: 'BOSTIK', 
        price: '12,00 €', 
        description: 'Pack clous 30mm',
        fullDescription: 'Pack de clous 30mm pour pistolet cloueur. Acier galvanisé anti-rouille.',
        image: '/assets/products/clous-30mm.jpg',
        features: ['30mm', 'Pack', 'Galvanisé', 'Anti-rouille', 'Acier']
      },
    ]
  },
  'BOULONS & ÉCROUS': {
    name: 'BOULONS & ÉCROUS',
    description: 'Visserie industrielle et fixations',
    products: [
      { 
        id: 'p1', 
        name: 'Boulon M8', 
        brand: 'BOSTIK', 
        price: '14,00 €', 
        description: 'Pack 20 boulons M8',
        fullDescription: 'Pack de 20 boulons M8x40mm avec écrous et rondelles. Acier zingué.',
        image: '/assets/products/boulon-m8.jpg',
        features: ['M8', '20 pièces', 'Zingué', 'Acier', 'Complet']
      },
      { 
        id: 'p2', 
        name: 'Écrous', 
        brand: 'SIKA', 
        price: '8,50 €', 
        description: 'Pack 50 écrous M8',
        fullDescription: 'Pack de 50 écrous M8. Acier zingué pour toutes vos fixations.',
        image: '/assets/products/ecrous-m8.jpg',
        features: ['M8', '50 pièces', 'Zingué', 'Acier', 'Fixations']
      },
    ]
  }
};

const ProductPage: React.FC<ProductPageProps> = ({ theme }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subcategoryId, productId } = useParams<{ subcategoryId: string; productId: string }>();
  const isLight = theme === 'light';

  const handleBack = (): void => {
    navigate(-1);
  };

  const subcategoryKey = subcategoryId?.replace(/_/g, ' ') || '';
  const subcategory = productData[subcategoryKey];
  const product = subcategory?.products.find(p => p.id === productId);

  if (!product) {
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
            <div className={`text-center py-12 ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
              <p>{t('contact.notFound')}</p>
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
          <button
            onClick={handleBack}
            className={`mb-8 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${
              isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
            }`}
          >
            {t('catalogue.back')}
          </button>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="aspect-square flex items-center justify-center p-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/assets/products/placeholder.jpg';
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <span className="text-[#FF6B00] text-sm font-bold uppercase tracking-wide">
                  {product.brand}
                </span>
              </div>

              <h1 className={`font-black italic text-3xl uppercase tracking-tight mb-4 ${isLight ? 'text-black' : 'text-white'}`}>
                {product.name}
              </h1>

              <p className={`text-2xl font-bold text-[#FF6B00] mb-6`}>
                {product.price}
              </p>

              <p className={`text-sm leading-relaxed mb-6 ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                {product.fullDescription}
              </p>

              <div className="mb-8">
                <h3 className={`font-bold italic text-lg uppercase mb-4 ${isLight ? 'text-black' : 'text-white'}`}>
                  {t('contact.features')}
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className={`flex items-center gap-2 text-sm ${isLight ? 'text-gray-700' : 'text-gray-300'}`}>
                      <Check className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto">
                <button className="w-full bg-[#FF6B00] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#FF8533] transition-all duration-200 flex items-center justify-center gap-3">
                  <ShoppingCart className="w-5 h-5" />
                  {t('contact.addToCart')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
