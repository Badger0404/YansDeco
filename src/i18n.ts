import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const fr = {
  header: {
    phone1: "+33 1 23 45 67 89",
    phone2: "+33 6 12 34 56 78",
    connexion: "Connexion",
    menu: "MENU"
  },
  nav: {
    home: "Accueil",
    catalogue: "Catalogue",
    brands: "Marques",
    services: "Services",
    calculators: "Calculateurs",
    contact: "Contact"
  },
  home: {
    popular: "★ Populaires",
    comingSoon: "Produits bientôt disponibles",
    slider: {
      slide1: {
        label: "LIVRAISON EXPRESS DISPONIBLE",
        title: "MATÉRIAUX DE CONSTRUCTION AVEC LIVRAISON RAPIDE",
        description: "Basé à Groslay, nous servons les professionnels et particuliers à Montmorency et dans toute l'Île-de-France. Qualité industrielle, service local. Nos prix vous surprendront agréablement."
      },
      slide2: {
        label: "QUALITÉ PROFESSIONNELLE",
        title: "SERVICE LOCAL EN ÎLE-DE-FRANCE",
        description: "Prix compétitifs pour les pros et les particuliers"
      },
      slide3: {
        label: "CONSEIL EXPERT",
        title: "TOUTE GAMME DE MATÉRIAUX",
        description: "Des revêtements aux outils, tout pour vos projets"
      }
    },
    cta: {
      calculate: "Calculer mes besoins",
      quote: "Demander un devis"
    }
  },
  footer: {
    tagline: "Le partenaire de vos chantiers",
    quickLinks: "Liens rapides",
    copyright: "© 2026 YAN'S DECO",
    location: "Groslay • Montmorency • Île-de-France"
  },
  catalogue: {
    title: "Nos Rayons",
    subtitle: "Du bâtiment à la rénovation, toute une gamme de matériaux, outillage et accessoires pour les professionnels et les particuliers.",
    back: "← RETOUR",
    products: "VOIR TOUS LES PRODUITS"
  },
  brands: {
    title: "NOS MARQUES",
    subtitle: "Nous travaillons avec les plus grandes marques du secteur pour vous garantir qualité et fiabilité.",
    viewAll: "Voir tous les produits"
  },
  services: {
    title: "NOS SERVICES",
    subtitle: "Des services complets pour accompagner tous vos projets de construction et rénovation.",
    livraison: {
      title: "Livraison Rapide",
      desc: "Livraison express sur Groslay et ses environs"
    },
    retrait: {
      title: "Retrait en Magasin",
      desc: "Commandez en ligne et retirez sur place"
    },
    conseils: {
      title: "Conseils Techniques",
      desc: "Équipe qualifiée pour vous guider dans vos choix"
    },
    devis: {
      title: "Devis Professionnels",
      desc: "Devis gratuit sous 24h"
    }
  },
  contact: {
    title: "OÙ NOUS TROUVER",
    subtitle: "Venez découvrir nos produits et bénéficier de conseils personnalisés dans nos établissements.",
    localisation: "Notre localisation",
    address: "1 Rue Magnier Bédu, 95410 Groslay",
    openMaps: "Ouvrir dans Google Maps",
    hours: "Horaires d'ouverture",
    mondayFriday: "Lundi - Samedi",
    saturday: "Samedi",
    sunday: "Dimanche",
    closed: "Fermé",
    contacts: "Contacts",
    email: "YANS.DECO95@GMAIL.COM",
    addressTitle: "Adresse",
    seeMap: "Voir sur la carte →",
    contactForm: "Nous contacter",
    name: "Nom",
    emailLabel: "Email",
    message: "Message",
    send: "Envoyer",
    sending: "Envoi...",
    success: "Message envoyé avec succès !",
    viewProduct: "Voir le produit",
    addToCart: "Ajouter au panier",
    features: "Caractéristiques",
    notFound: "Produit non trouvé.",
    stock: "en stock"
  },
  cart: {
    title: "Panier",
    empty: "Votre panier est vide",
    addItems: "Ajoutez des produits pour continuer",
    total: "Total",
    checkout: "Commander",
    remove: "Supprimer",
    quantity: "Quantité",
    unitPrice: "Prix unitaire",
    subtotal: "Sous-total",
    added: "Ajouté !"
  },
  auth: {
    login: "Connexion",
    register: "Inscription",
    welcomeBack: "Ravis de vous revoir",
    createAccount: "Créez votre compte",
    name: "Nom complet",
    phone: "Téléphone",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    noAccount: "Pas encore de compte ?",
    haveAccount: "Vous avez déjà un compte ?",
    or: "ou",
    google: "Continuer avec Google",
    forgotPassword: "Mot de passe oublié ?",
    invalidEmail: "Email invalide",
    passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
    passwordsNotMatch: "Les mots de passe ne correspondent pas",
    emailAlreadyExists: "Cet email est déjà utilisé",
    invalidCredentials: "Email ou mot de passe incorrect",
    accountCreated: "Compte créé avec succès !",
    logout: "Déconnexion",
    myOrders: "Mes commandes",
    profile: "Mon profil",
    profileUpdated: "Profil mis à jour avec succès !",
    loginRequired: "Veuillez vous connecter pour accéder à votre profil",
    passwordUpdated: "Mot de passe mis à jour avec succès !"
  },
  profile: {
    title: "Mon Profil",
    addresses: "Mes adresses",
    addAddress: "Ajouter une adresse",
    noAddresses: "Aucune adresse enregistrée",
    noOrders: "Aucune commande pour le moment",
    changePassword: "Changer le mot de passe",
    memberSince: "Membre depuis",
    edit: "Modifier",
    save: "Enregistrer",
    cancel: "Annuler",
    type: "Type",
    shipping: "Livraison",
    billing: "Facturation",
    label: "Libellé",
    home: "Maison",
    address: "Adresse",
    city: "Ville",
    postalCode: "Code postal",
    country: "Pays",
    defaultAddress: "Définir comme adresse par défaut",
    default: "Par défaut",
    currentPassword: "Mot de passe actuel",
    newPassword: "Nouveau mot de passe",
    confirmNewPassword: "Confirmer le nouveau mot de passe",
    completed: "Terminée"
  },
  admin: {
    backToSite: "← RETOURNER AU SITE",
    backToDashboard: "← RETOUR",
    logout: "Déconnexion",
    sync: "SYNC",
    title: "Panneau d'Administration",
    subtitle: "Gestion du site",
    sections: {
      products: {
        title: "PRODUITS",
        description: "Ajouter, supprimer ou modifier les prix des produits"
      },
      categories: {
        title: "CATÉGORIES",
        description: "Gestion des catégories et sous-catégories"
      },
      brands: {
        title: "MARQUES",
        description: "Ajout et modification des marques"
      },
      clients: {
        title: "CLIENTS",
        description: "Gestion de la base de données clients"
      },
      translations: {
        title: "TRADUCTIONS",
        description: "Édition des textes et traductions de l'interface"
      },
      calculators: {
        title: "CALCULATEURS",
        description: "Paramètres des formules et calculs",
        addNew: "Nouveau Calculateur"
      },
      settings: {
        title: "PARAMÈTRES",
        description: "Paramètres généraux et Cloud",
        general: "Paramètres Généraux",
        siteConfig: "Configuration du site",
        uploadMedia: "Upload Media",
        mediaManagement: "Gestion des images et fichiers",
        backup: "Backup & Restore",
        backupDesc: "Sauvegarde des données"
      }
    },
    quickActions: {
      title: "Actions Rapides",
      newProduct: "Nouveau Produit",
      importCsv: "Importer CSV",
      exportData: "Exporter Données",
      syncCloud: "Sync Cloud"
    },
    recentActivity: {
      title: "Activité Récente",
      items: {
        productModified: "Produit modifié",
        categoryAdded: "Nouvelle catégorie ajoutée",
        syncComplete: "Sync Cloud terminé",
        translationUpdated: "Traduction mise à jour"
      }
    },
    footer: {
      rights: "Tous droits réservés.",
      version: "Version",
      copyright: "© 2026 created by Andrey Barsukov"
    },
    products: {
      title: "Gestion des Produits",
      addNew: "Ajouter un Produit",
      edit: "Modifier",
      delete: "Supprimer",
      view: "Voir",
      price: "Prix",
      stock: "Stock",
      active: "Actif",
      inactive: "Inactif",
      search: "Rechercher un produit...",
      noProducts: "Aucun produit trouvé",
      confirmDelete: "Êtes-vous sûr de vouloir supprimer ce produit ?",
      save: "Enregistrer",
      cancel: "Annuler",
      name: "Nom du produit",
      description: "Description",
      category: "Catégorie",
      brand: "Marque",
      sku: "Réf. produit",
      quantity: "Quantité",
      images: "Images",
      specifications: "Caractéristiques",
      actions: "Actions"
    },
    categories: {
      title: "Gestion des Catégories",
      addNew: "Ajouter une Catégorie",
      edit: "Modifier",
      delete: "Supprimer",
      view: "Voir les produits",
      parent: "Catégorie parente",
      order: "Ordre d'affichage",
      icon: "Icône",
      noCategories: "Aucune catégorie trouvée"
    },
    brands: {
      title: "Gestion des Marques",
      addNew: "Ajouter une Marque",
      edit: "Modifier",
      delete: "Supprimer",
      logo: "Logo",
      website: "Site web",
      noBrands: "Aucune marque trouvée"
    },
    translations: {
      title: "Gestion des Traductions",
      addNew: "Ajouter une Traduction",
      edit: "Modifier",
      sourceLanguage: "Langue source",
      targetLanguage: "Langue cible",
      key: "Clé de traduction",
      value: "Valeur",
      syncAll: "Synchroniser toutes les traductions",
      noTranslations: "Aucune traduction trouvée"
    },
    cloud: {
      title: "Paramètres Cloud",
      status: "Statut de la connexion",
      connected: "Connecté",
      disconnected: "Déconnecté",
      lastSync: "Dernière synchronisation",
      syncNow: "Synchroniser maintenant",
      upload: "Télécharger vers le cloud",
      download: "Récupérer du cloud",
      autoSync: "Synchronisation automatique",
      settings: "Paramètres Cloud"
    },
    theme: {
      light: "Mode clair",
      dark: "Mode sombre"
    }
  },
  checkout: {
    title: "Finaliser ma commande",
    yourOrder: "Votre commande",
    information: "Coordonnées",
    delivery: "Livraison",
    summary: "Récapitulatif",
    firstName: "Prénom",
    lastName: "Nom",
    address: "Adresse",
    apartment: "Appartement, suite, etc.",
    apartmentOptional: "Appartement, suite, etc. (optionnel)",
    city: "Ville",
    postalCode: "Code postal",
    country: "Pays",
    notes: "Notes",
    notesPlaceholder: "Instructions de livraison spéciales...",
    deliveryMethod: "Mode de livraison",
    homeDelivery: "Livraison à domicile",
    deliveryInfo: "Livraison sous 2-5 jours ouvrés",
    storePickup: "Retrait en magasin",
    free: "GRATUIT",
    continueDelivery: "Continuer vers la livraison",
    toSummary: "Vers le récapitulatif",
    back: "Retour",
    edit: "Modifier",
    confirmOrder: "Confirmer la commande",
    orderSummary: "Récapitulatif de la commande",
    fillAllFields: "Veuillez remplir tous les champs obligatoires",
    orderFailed: "Une erreur est survenue. Veuillez réessayer.",
    orderConfirmed: "Commande confirmée !",
    orderNumber: "Numéro de commande",
    confirmationEmail: "Vous recevrez un email de confirmation sous peu.",
    continueShopping: "Continuer vos achats",
    useSavedAddress: "Utiliser une adresse enregistrée",
    enterManually: "Saisir manuellement",
    loginPrompt: "Connectez-vous pour suivre vos commandes et bénéficier d'avantages."
  }
};

const en = {
  header: {
    phone1: "+33 1 23 45 67 89",
    phone2: "+33 6 12 34 56 78",
    connexion: "Login",
    menu: "MENU"
  },
  nav: {
    home: "Home",
    catalogue: "Catalogue",
    brands: "Brands",
    services: "Services",
    calculators: "Calculators",
    contact: "Contact"
  },
  home: {
    popular: "★ Popular",
    comingSoon: "Products coming soon",
    slider: {
      slide1: {
        label: "EXPRESS DELIVERY AVAILABLE",
        title: "CONSTRUCTION MATERIALS WITH FAST DELIVERY",
        description: "Based in Groslay, we serve professionals and individuals in Montmorency and throughout Île-de-France. Industrial quality, local service."
      },
      slide2: {
        label: "PROFESSIONAL QUALITY",
        title: "LOCAL SERVICE IN ÎLE-DE-FRANCE",
        description: "Competitive prices for professionals and individuals"
      },
      slide3: {
        label: "EXPERT ADVICE",
        title: "FULL RANGE OF MATERIALS",
        description: "From coatings to tools, everything for your projects"
      }
    },
    cta: {
      calculate: "Calculate my needs",
      quote: "Request a quote"
    }
  },
  footer: {
    tagline: "The partner for your construction projects",
    quickLinks: "Quick Links",
    copyright: "© 2026 YAN'S DECO",
    location: "Groslay • Montmorency • Île-de-France"
  },
  catalogue: {
    title: "Our Departments",
    subtitle: "From construction to renovation, a full range of materials, tools and accessories for professionals and individuals.",
    back: "← BACK",
    products: "SEE ALL PRODUCTS"
  },
  brands: {
    title: "OUR BRANDS",
    subtitle: "We work with the biggest brands in the industry to guarantee you quality and reliability.",
    viewAll: "See all products"
  },
  services: {
    title: "OUR SERVICES",
    subtitle: "Complete services to support all your construction and renovation projects.",
    livraison: {
      title: "Fast Delivery",
      desc: "Express delivery on Groslay and surroundings"
    },
    retrait: {
      title: "In-Store Pickup",
      desc: "Order online and pickup on site"
    },
    conseils: {
      title: "Technical Advice",
      desc: "Qualified team to guide you in your choices"
    },
    devis: {
      title: "Professional Quotes",
      desc: "Free quote within 24h"
    }
  },
  contact: {
    title: "WHERE TO FIND US",
    subtitle: "Come discover our products and get personalized advice in our stores.",
    localisation: "Our location",
    address: "1 Rue Magnier Bédu, 95410 Groslay",
    openMaps: "Open in Google Maps",
    hours: "Opening hours",
    mondayFriday: "Monday - Saturday",
    saturday: "Saturday",
    sunday: "Sunday",
    closed: "Closed",
    contacts: "Contacts",
    email: "YANS.DECO95@GMAIL.COM",
    addressTitle: "Address",
    seeMap: "See on map →",
    contactForm: "Contact us",
    name: "Name",
    emailLabel: "Email",
    message: "Message",
    send: "Send",
    sending: "Sending...",
    success: "Message sent successfully!",
    viewProduct: "View product",
    addToCart: "Add to cart",
    features: "Features",
    notFound: "Product not found.",
    stock: "in stock"
  },
  cart: {
    title: "Cart",
    empty: "Your cart is empty",
    addItems: "Add products to continue",
    total: "Total",
    checkout: "Checkout",
    remove: "Remove",
    quantity: "Quantity",
    unitPrice: "Unit price",
    subtotal: "Subtotal",
    added: "Added!"
  },
  auth: {
    login: "Sign In",
    register: "Sign Up",
    welcomeBack: "Welcome back!",
    createAccount: "Create your account",
    name: "Full Name",
    phone: "Phone",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    or: "or",
    google: "Continue with Google",
    forgotPassword: "Forgot password?",
    invalidEmail: "Invalid email",
    passwordTooShort: "Password must be at least 6 characters",
    passwordsNotMatch: "Passwords do not match",
    emailAlreadyExists: "Email already registered",
    invalidCredentials: "Invalid email or password",
    accountCreated: "Account created successfully!",
    logout: "Logout",
    myOrders: "My Orders",
    profile: "My Profile",
    profileUpdated: "Profile updated successfully!",
    loginRequired: "Please sign in to access your profile",
    passwordUpdated: "Password updated successfully!"
  },
  profile: {
    title: "My Profile",
    addresses: "My Addresses",
    addAddress: "Add Address",
    noAddresses: "No addresses saved",
    noOrders: "No orders yet",
    changePassword: "Change Password",
    memberSince: "Member since",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    type: "Type",
    shipping: "Shipping",
    billing: "Billing",
    label: "Label",
    home: "Home",
    address: "Address",
    city: "City",
    postalCode: "Postal Code",
    country: "Country",
    defaultAddress: "Set as default address",
    default: "Default",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    completed: "Completed"
  },
  admin: {
    backToSite: "← RETURN TO SITE",
    backToDashboard: "← BACK",
    logout: "Logout",
    sync: "SYNC",
    title: "Admin Panel",
    subtitle: "Site Management",
    sections: {
      products: {
        title: "PRODUCTS",
        description: "Add, delete or modify product prices"
      },
      categories: {
        title: "CATEGORIES",
        description: "Category and subcategory management"
      },
      brands: {
        title: "BRANDS",
        description: "Add and modify brands"
      },
      clients: {
        title: "CLIENTS",
        description: "Customer database management"
      },
      translations: {
        title: "TRANSLATIONS",
        description: "Edit interface texts and translations"
      },
      calculators: {
        title: "CALCULATORS",
        description: "Formula and calculation settings",
        addNew: "New Calculator"
      },
      settings: {
        title: "SETTINGS",
        description: "General settings and Cloud",
        general: "General Settings",
        siteConfig: "Site Configuration",
        uploadMedia: "Upload Media",
        mediaManagement: "Image and file management",
        backup: "Backup & Restore",
        backupDesc: "Data backup"
      }
    },
    quickActions: {
      title: "Quick Actions",
      newProduct: "New Product",
      importCsv: "Import CSV",
      exportData: "Export Data",
      syncCloud: "Sync Cloud"
    },
    recentActivity: {
      title: "Recent Activity",
      items: {
        productModified: "Product modified",
        categoryAdded: "New category added",
        syncComplete: "Sync Cloud completed",
        translationUpdated: "Translation updated"
      }
    },
    footer: {
      rights: "All rights reserved.",
      version: "Version",
      copyright: "© 2026 created by Andrey Barsukov"
    },
    products: {
      title: "Product Management",
      addNew: "Add Product",
      edit: "Edit",
      delete: "Delete",
      view: "View",
      price: "Price",
      stock: "Stock",
      active: "Active",
      inactive: "Inactive",
      search: "Search product...",
      noProducts: "No product found",
      confirmDelete: "Are you sure you want to delete this product?",
      save: "Save",
      cancel: "Cancel",
      name: "Product name",
      description: "Description",
      category: "Category",
      brand: "Brand",
      sku: "Product ref.",
      quantity: "Quantity",
      images: "Images",
      specifications: "Specifications",
      actions: "Actions"
    },
    categories: {
      title: "Category Management",
      addNew: "Add Category",
      edit: "Edit",
      delete: "Delete",
      view: "View products",
      parent: "Parent category",
      order: "Display order",
      icon: "Icon",
      noCategories: "No category found"
    },
    brands: {
      title: "Brand Management",
      addNew: "Add Brand",
      edit: "Edit",
      delete: "Delete",
      logo: "Logo",
      website: "Website",
      noBrands: "No brand found"
    },
    translations: {
      title: "Translation Management",
      addNew: "Add Translation",
      edit: "Edit",
      sourceLanguage: "Source language",
      targetLanguage: "Target language",
      key: "Translation key",
      value: "Value",
      syncAll: "Sync all translations",
      noTranslations: "No translation found"
    },
    cloud: {
      title: "Cloud Settings",
      status: "Connection status",
      connected: "Connected",
      disconnected: "Disconnected",
      lastSync: "Last synchronization",
      syncNow: "Sync now",
      upload: "Upload to cloud",
      download: "Download from cloud",
      autoSync: "Automatic synchronization",
      settings: "Cloud settings"
    },
    theme: {
      light: "Light mode",
      dark: "Dark mode"
    }
  },
  checkout: {
    title: "Checkout",
    yourOrder: "Your Order",
    information: "Information",
    delivery: "Delivery",
    summary: "Summary",
    firstName: "First Name",
    lastName: "Last Name",
    address: "Address",
    apartment: "Apartment, suite, etc.",
    apartmentOptional: "Apartment, suite, etc. (optional)",
    city: "City",
    postalCode: "Postal Code",
    country: "Country",
    notes: "Notes",
    notesPlaceholder: "Special delivery instructions...",
    deliveryMethod: "Delivery Method",
    homeDelivery: "Home Delivery",
    deliveryInfo: "Delivery within 2-5 business days",
    storePickup: "Store Pickup",
    free: "FREE",
    continueDelivery: "Continue to Delivery",
    toSummary: "To Summary",
    back: "Back",
    edit: "Edit",
    confirmOrder: "Confirm Order",
    orderSummary: "Order Summary",
    fillAllFields: "Please fill in all required fields",
    orderFailed: "An error occurred. Please try again.",
    orderConfirmed: "Order Confirmed!",
    orderNumber: "Order Number",
    confirmationEmail: "You will receive a confirmation email shortly.",
    continueShopping: "Continue Shopping",
    useSavedAddress: "Use saved address",
    enterManually: "Enter manually",
    loginPrompt: "Sign in to track your orders and enjoy benefits."
  }
};

const ru = {
  header: {
    phone1: "+33 1 23 45 67 89",
    phone2: "+33 6 12 34 56 78",
    connexion: "Вход",
    menu: "МЕНЮ"
  },
  nav: {
    home: "Главная",
    catalogue: "Каталог",
    brands: "Бренды",
    services: "Услуги",
    calculators: "Калькуляторы",
    contact: "Контакты"
  },
  home: {
    popular: "★ Популярные",
    comingSoon: "Товары скоро появятся",
    slider: {
      slide1: {
        label: "ДОСТУПНА ЭКСПРЕСС-ДОСТАВКА",
        title: "СТРОИТЕЛЬНЫЕ МАТЕРИАЛЫ С БЫСТРОЙ ДОСТАВКОЙ",
        description: "Базируясь в Гролэ, мы обслуживаем профессионалов и частных лиц в Монморанси и по всему региону Иль-де-Франс. Промышленное качество, местный сервис."
      },
      slide2: {
        label: "ПРОФЕССИОНАЛЬНОЕ КАЧЕСТВО",
        title: "МЕСТНЫЙ СЕРВИС В ИЛЬ-ДЕ-ФРАНС",
        description: "Конкурентные цены для профессионалов и частных лиц"
      },
      slide3: {
        label: "ЭКСПЕРТНАЯ КОНСУЛЬТАЦИЯ",
        title: "ПОЛНЫЙ АССОРТИМЕНТ МАТЕРИАЛОВ",
        description: "От покрытий до инструментов - всё для ваших проектов"
      }
    },
    cta: {
      calculate: "Рассчитать потребности",
      quote: "Запросить смету"
    }
  },
  footer: {
    tagline: "Партнёр ваших строительных проектов",
    quickLinks: "Быстрые ссылки",
    copyright: "© 2026 YAN'S DECO",
    location: "Гролэ • Монморанси • Иль-де-Франс"
  },
  catalogue: {
    title: "Наши разделы",
    subtitle: "От строительства до ремонта - полный ассортимент материалов, инструментов и аксессуаров.",
    back: "← НАЗАД",
    products: "СМОТРЕТЬ ВСЕ ТОВАРЫ"
  },
  brands: {
    title: "НАШИ БРЕНДЫ",
    subtitle: "Мы работаем с ведущими брендами отрасли, чтобы гарантировать вам качество и надёжность.",
    viewAll: "Смотреть все товары"
  },
  services: {
    title: "НАШИ УСЛУГИ",
    subtitle: "Полный спектр услуг для поддержки всех ваших строительных и ремонтных проектов.",
    livraison: {
      title: "Быстрая доставка",
      desc: "Экспресс-доставка по Гролэ и окрестностям"
    },
    retrait: {
      title: "Самовывоз",
      desc: "Закажите онлайн и заберите на месте"
    },
    conseils: {
      title: "Технические консультации",
      desc: "Квалифицированная команда поможет вам в выборе"
    },
    devis: {
      title: "Коммерческие предложения",
      desc: "Бесплатный расчёт в течение 24ч"
    }
  },
  contact: {
    title: "ГДЕ МЫ НАХОДИМСЯ",
    subtitle: "Приходите и откройте для себя нашу продукцию и получите персональные консультации в наших магазинах.",
    localisation: "Наш адрес",
    address: "1 Rue Magnier Bédu, 95410 Groslay",
    openMaps: "Открыть в Google Maps",
    hours: "Часы работы",
    mondayFriday: "Понедельник - Суббота",
    saturday: "Суббота",
    sunday: "Воскресенье",
    closed: "Закрыто",
    contacts: "Контакты",
    email: "YANS.DECO95@GMAIL.COM",
    addressTitle: "Адрес",
    seeMap: "Смотреть на карте →",
    contactForm: "Связаться с нами",
    name: "Имя",
    emailLabel: "Email",
    message: "Сообщение",
    send: "Отправить",
    sending: "Отправка...",
    success: "Сообщение успешно отправлено!",
    viewProduct: "Смотреть товар",
    addToCart: "В корзину",
    features: "Характеристики",
    notFound: "Товар не найден.",
    stock: "в наличии"
  },
  cart: {
    title: "Корзина",
    empty: "Ваша корзина пуста",
    addItems: "Добавьте товары для продолжения",
    total: "Итого",
    checkout: "Оформить заказ",
    remove: "Удалить",
    quantity: "Количество",
    unitPrice: "Цена за штуку",
    subtotal: "Сумма",
    added: "Добавлено!"
  },
  auth: {
    login: "Войти",
    register: "Регистрация",
    welcomeBack: "Рады видеть вас снова",
    createAccount: "Создайте свой аккаунт",
    name: "Полное имя",
    phone: "Телефон",
    email: "Email",
    password: "Пароль",
    confirmPassword: "Подтвердите пароль",
    noAccount: "Еще нет аккаунта?",
    haveAccount: "Уже есть аккаунт?",
    или: "или",
    google: "Войти через Google",
    forgotPassword: "Забыли пароль?",
    invalidEmail: "Некорректный email",
    passwordTooShort: "Пароль должен содержать минимум 6 символов",
    passwordsNotMatch: "Пароли не совпадают",
    emailAlreadyExists: "Этот email уже зарегистрирован",
    invalidCredentials: "Неверный email или пароль",
    accountCreated: "Аккаунт успешно создан!",
    logout: "Выйти",
    myOrders: "Мои заказы",
    profile: "Мой профиль",
    profileUpdated: "Профиль успешно обновлён!",
    loginRequired: "Пожалуйста, войдите для доступа к профилю",
    passwordUpdated: "Пароль успешно обновлён!"
  },
  profile: {
    title: "Мой Профиль",
    addresses: "Мои адреса",
    addAddress: "Добавить адрес",
    noAddresses: "Нет сохранённых адресов",
    noOrders: "Пока нет заказов",
    changePassword: "Изменить пароль",
    memberSince: "Клиент с",
    edit: "Редактировать",
    save: "Сохранить",
    cancel: "Отмена",
    type: "Тип",
    shipping: "Доставка",
    billing: "Оплата",
    label: "Название",
    home: "Дом",
    address: "Адрес",
    city: "Город",
    postalCode: "Почтовый индекс",
    country: "Страна",
    defaultAddress: "Сделать адресом по умолчанию",
    default: "По умолчанию",
    currentPassword: "Текущий пароль",
    newPassword: "Новый пароль",
    confirmNewPassword: "Подтвердите новый пароль",
    completed: "Завершён"
  },
  admin: {
    backToSite: "← ВЕРНУТЬСЯ НА САЙТ",
    backToDashboard: "← НАЗАД",
    logout: "Выход",
    sync: "СИНХ",
    title: "Панель Администратора",
    subtitle: "Управление сайтом",
    sections: {
      products: {
        title: "ТОВАРЫ",
        description: "Добавлять, удалять или изменять цены товаров"
      },
      categories: {
        title: "КАТЕГОРИИ",
        description: "Управление категориями и подкатегориями"
      },
      brands: {
        title: "БРЕНДЫ",
        description: "Добавление и изменение брендов"
      },
      clients: {
        title: "КЛИЕНТЫ",
        description: "Управление базой клиентов"
      },
      translations: {
        title: "ПЕРЕВОДЫ",
        description: "Редактирование текстов и переводов интерфейса"
      },
      calculators: {
        title: "КАЛЬКУЛЯТОРЫ",
        description: "Настройки формул и расчётов",
        addNew: "Новый калькулятор"
      },
      settings: {
        title: "НАСТРОЙКИ",
        description: "Общие настройки и Клауд",
        general: "Общие настройки",
        siteConfig: "Конфигурация сайта",
        uploadMedia: "Загрузка медиа",
        mediaManagement: "Управление изображениями и файлами",
        backup: "Резервное копирование",
        backupDesc: "Сохранение данных"
      }
    },
    quickActions: {
      title: "Быстрые действия",
      newProduct: "Новый товар",
      importCsv: "Импорт CSV",
      exportData: "Экспорт данных",
      syncCloud: "Синхронизация"
    },
    recentActivity: {
      title: "Последняя активность",
      items: {
        productModified: "Товар изменён",
        categoryAdded: "Добавлена категория",
        syncComplete: "Синхронизация завершена",
        translationUpdated: "Перевод обновлён"
      }
    },
    footer: {
      rights: "Все права защищены.",
      version: "Версия",
      copyright: "© 2026 created by Andrey Barsukov"
    },
    products: {
      title: "Управление товарами",
      addNew: "Добавить товар",
      edit: "Редактировать",
      delete: "Удалить",
      view: "Просмотр",
      price: "Цена",
      stock: "Остаток",
      active: "Активен",
      inactive: "Неактивен",
      search: "Поиск товара...",
      noProducts: "Товары не найдены",
      confirmDelete: "Вы уверены что хотите удалить этот товар?",
      save: "Сохранить",
      cancel: "Отмена",
      name: "Название товара",
      description: "Описание",
      category: "Категория",
      brand: "Бренд",
      sku: "Артикул",
      quantity: "Количество",
      images: "Изображения",
      specifications: "Характеристики",
      actions: "Действия"
    },
    categories: {
      title: "Управление категориями",
      addNew: "Добавить категорию",
      edit: "Редактировать",
      delete: "Удалить",
      view: "Смотреть товары",
      parent: "Родительская категория",
      order: "Порядок отображения",
      icon: "Иконка",
      noCategories: "Категории не найдены"
    },
    brands: {
      title: "Управление брендами",
      addNew: "Добавить бренд",
      edit: "Редактировать",
      delete: "Удалить",
      logo: "Логотип",
      website: "Сайт",
      noBrands: "Бренды не найдены"
    },
    translations: {
      title: "Управление переводами",
      addNew: "Добавить перевод",
      edit: "Редактировать",
      sourceLanguage: "Язык источник",
      targetLanguage: "Целевой язык",
      key: "Ключ перевода",
      value: "Значение",
      syncAll: "Синхронизировать все переводы",
      noTranslations: "Переводы не найдены"
    },
    cloud: {
      title: "Настройки Клауда",
      status: "Статус подключения",
      connected: "Подключено",
      disconnected: "Отключено",
      lastSync: "Последняя синхронизация",
      syncNow: "Синхронизировать",
      upload: "Загрузить в облако",
      download: "Скачать из облака",
      autoSync: "Автоматическая синхронизация",
      settings: "Настройки клауда"
    },
    theme: {
      light: "Светлая тема",
      dark: "Тёмная тема"
    }
  },
  checkout: {
    title: "Оформление заказа",
    yourOrder: "Ваш заказ",
    information: "Контакты",
    delivery: "Доставка",
    summary: "Итог",
    firstName: "Имя",
    lastName: "Фамилия",
    address: "Адрес",
    apartment: "Квартира, офис и т.д.",
    apartmentOptional: "Квартира, офис и т.д. (необязательно)",
    city: "Город",
    postalCode: "Почтовый индекс",
    country: "Страна",
    notes: "Примечания",
    notesPlaceholder: "Особые указания по доставке...",
    deliveryMethod: "Способ доставки",
    homeDelivery: "Доставка на дом",
    deliveryInfo: "Доставка в течение 2-5 рабочих дней",
    storePickup: "Самовывоз из магазина",
    free: "БЕСПЛАТНО",
    continueDelivery: "К доставке",
    toSummary: "К итогу",
    back: "Назад",
    edit: "Изменить",
    confirmOrder: "Подтвердить заказ",
    orderSummary: "Итог заказа",
    fillAllFields: "Пожалуйста, заполните все обязательные поля",
    orderFailed: "Произошла ошибка. Попробуйте ещё раз.",
    orderConfirmed: "Заказ подтверждён!",
    orderNumber: "Номер заказа",
    confirmationEmail: "Вы получите письмо с подтверждением.",
    continueShopping: "Продолжить покупки",
    useSavedAddress: "Использовать сохранённый адрес",
    enterManually: "Ввести вручную",
    loginPrompt: "Войдите, чтобы отслеживать заказы и получать преимущества."
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
      ru: { translation: ru }
    },
    supportedLngs: ['fr', 'en', 'ru'],
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
