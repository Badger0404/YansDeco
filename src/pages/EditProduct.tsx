import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Upload,
  Plus,
  RefreshCw,
  Sparkles,
  X,
  Check,
  Camera
} from 'lucide-react';
import BarcodeScanner from '../components/BarcodeScanner';

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
}

interface Category {
  id: number;
  name_ru: string | null;
  name_fr: string | null;
  name_en: string | null;
  parent_id: number | null;
  children?: Category[];
}

const EditProduct: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [announcementDate, setAnnouncementDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [brandId, setBrandId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [translations, setTranslations] = useState({
    ru: { name: '', description: '' },
    fr: { name: '', description: '' },
    en: { name: '', description: '' }
  });

  const [showBrandModal, setShowBrandModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState<string | null>(null);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  const [focusedField, setFocusedField] = useState<{ lang: string; field: 'name' | 'description' } | null>(null);
  const [translatingField, setTranslatingField] = useState<{ lang: string; field: 'name' | 'description' } | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/products/${productId}`);
      const data = await response.json();
      if (data.success) {
        const product = data.data;
        setSku(product.sku || '');
        setBarcode(product.barcode || '');
        setPrice(product.price ? product.price.toString() : '');
        setStock(product.stock ? product.stock.toString() : '');
        setIsPopular(product.is_popular === 1);
        setImageUrl(product.image_url || '');
        setImagePreview(product.image_url || '');
        setBrandId(product.brand_id);
        setCategoryId(product.category_id);
        setTranslations({
          ru: { name: product.name_ru || '', description: product.desc_ru || '' },
          fr: { name: product.name_fr || '', description: product.desc_fr || '' },
          en: { name: product.name_en || '', description: product.desc_en || '' }
        });
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Failed to load product:', err);
      setError('Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarcodeScan = (scannedBarcode: string) => {
    setBarcode(scannedBarcode);
    setShowScanner(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      if (data.success) {
        setFlatCategories(data.data);

        if (id && categoryId) {
          const currentCat = data.data.find((c: Category) => c.id === categoryId);
          if (currentCat && currentCat.parent_id) {
            setSubCategoryId(categoryId);
            setCategoryId(currentCat.parent_id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const getSubCategories = (parentId: number): Category[] => {
    return flatCategories.filter(cat => Number(cat.parent_id) === parentId);
  };

  const topLevelCategories = flatCategories.filter(cat => !cat.parent_id);

  const getCategoryName = (category: Category) => {
    const lang = i18n.language;
    switch (lang) {
      case 'ru': return category.name_ru || category.name_fr || category.name_en || 'Без названия';
      case 'en': return category.name_en || category.name_fr || category.name_ru || 'Untitled';
      default: return category.name_fr || category.name_ru || category.name_en || 'Sans titre';
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_URL}/brands`);
      const data = await response.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (err) {
      console.error('Failed to load brands:', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'products');

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.data.url);
        setImagePreview(data.data.url);
      } else {
        const errorMsg = `Upload error: ${data.error || 'Unknown error'}`;
        setError(errorMsg);
        window.alert(errorMsg);
      }
    } catch (err) {
      const errorMsg = `Upload error: ${err instanceof Error ? err.message : 'Network error'}`;
      setError(errorMsg);
      window.alert(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTranslateFromField = async (sourceLang: string, sourceField: 'name' | 'description') => {
    const sourceText = translations[sourceLang as keyof typeof translations][sourceField];

    if (!sourceText.trim() || sourceText.length < 3) {
      return;
    }

    setTranslatingField({ lang: sourceLang, field: sourceField });
    setError('');

    const targetLangs = ['ru', 'fr', 'en'].filter(lang => lang !== sourceLang);

    try {
      const response = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: {
            [sourceField]: sourceText
          },
          sourceLang,
          targetLangs: targetLangs
        })
      });

      const data = await response.json();

      if (data.success) {
        setTranslations(prev => {
          const newTranslations = { ...prev };
          targetLangs.forEach(targetLang => {
            if (data.data[targetLang] && !newTranslations[targetLang as keyof typeof prev][sourceField]?.trim()) {
              newTranslations[targetLang as keyof typeof prev] = {
                ...newTranslations[targetLang as keyof typeof prev],
                [sourceField]: data.data[targetLang][sourceField] || ''
              };
            }
          });
          return newTranslations;
        });
        setSuccess('Translation completed successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorMsg = `Translation error: ${data.error || 'Unknown error'}`;
        setError(errorMsg);
        window.alert(errorMsg);
      }
    } catch (err) {
      const errorMsg = `Translation error: ${err instanceof Error ? err.message : 'Network error'}`;
      setError(errorMsg);
      window.alert(errorMsg);
    } finally {
      setTranslatingField(null);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      setError('Enter brand name');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/brands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName, logo_url: newBrandLogo })
      });

      const data = await response.json();

      if (data.success) {
        const newBrand = data.data;
        setBrands(prev => [...prev, newBrand]);
        setBrandId(newBrand.id);
        setShowBrandModal(false);
        setNewBrandName('');
        setNewBrandLogo(null);
        setSuccess('Brand added');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to add brand');
      }
    } catch (err) {
      setError('Failed to add brand');
    }
  };

  const handleSave = async () => {
    if (!sku.trim()) {
      setError('Enter product SKU');
      return;
    }
    if (!translations.ru.name.trim()) {
      setError('Enter product name in Russian');
      return;
    }
    if (!price) {
      setError('Enter price');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: sku.trim(),
          barcode: barcode?.trim() || null,
          price: parseFloat(price) || 0,
          stock: parseInt(stock) || 0,
          brand_id: brandId === null ? null : brandId,
          category_id: subCategoryId !== null ? subCategoryId : categoryId,
          is_popular: isPopular ? 1 : 0,
          announcement_date: announcementDate || null,
          image_url: imageUrl || null,
          name_ru: translations.ru.name || null,
          desc_ru: translations.ru.description || null,
          name_fr: translations.fr.name || null,
          desc_fr: translations.fr.description || null,
          name_en: translations.en.name || null,
          desc_en: translations.en.description || null
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Product updated successfully!');
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      } else {
        setError(data.error || 'Failed to update product');
      }
    } catch (err) {
      setError('Failed to update product');
    } finally {
      setIsSaving(false);
    }
  };

  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="pt-4 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => navigate('/admin/products')}
              className={`mb-3 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'
                }`}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              {t('admin.backToProducts')}
            </button>
            <h1 className={`font-black italic text-2xl md:text-4xl uppercase tracking-tight ${textClass}`}>
              Modifier le produit
            </h1>
            <p className={`text-sm ${mutedClass} mt-1 hidden sm:block`}>
              Modifiez les informations du produit
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500 text-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {success}
            </motion.div>
          )}

          <div className="space-y-6">
            <div className={`p-6 border ${borderClass} rounded-xl`}>
              <h2 className={`font-bold italic text-lg uppercase tracking-wide mb-4 ${textClass}`}>
                Informations de base
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                    placeholder="SKU-12345"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    Barcode
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className={`w-full px-4 py-2.5 pr-12 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      placeholder="1234567890123"
                    />
                    <button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#FF6B00]/20 hover:bg-[#FF6B00]/40 rounded-lg transition-colors"
                      title="Сканировать штрихкод"
                    >
                      <Camera className="w-4 h-4 text-[#FF6B00]" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    Prix *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-full px-4 py-2.5 pr-12 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      placeholder="0.00"
                    />
                    <span className={`absolute right-4 top-1/2 -translate-y-1/2 ${mutedClass}`}>€</span>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                  Marque
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={brandId || ''}
                    onChange={(e) => setBrandId(e.target.value ? parseInt(e.target.value) : null)}
                    className={`flex-1 px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  >
                    <option value="">Sélectionner une marque...</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setShowBrandModal(true)}
                    className={`px-4 py-2.5 border ${borderClass} rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${textClass} hover:border-[#FF6B00] flex items-center gap-1 whitespace-nowrap`}
                  >
                    <Plus className="w-4 h-4" />
                    Nouveau
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                  {t('admin.categories.title')}
                </label>
                <select
                  value={categoryId || ''}
                  onChange={(e) => {
                    setCategoryId(e.target.value ? parseInt(e.target.value) : null);
                    setSubCategoryId(null);
                  }}
                  className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                >
                  <option value="">{t('admin.categories.select')}</option>
                  {topLevelCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {getCategoryName(category)}
                    </option>
                  ))}
                </select>
              </div>

              {categoryId && getSubCategories(categoryId).length > 0 && (
                <div className="mt-4 ml-4">
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    {t('admin.categories.subcategory')}
                  </label>
                  <select
                    value={subCategoryId || ''}
                    onChange={(e) => setSubCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                    className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  >
                    <option value="">{t('admin.categories.selectSub')}</option>
                    {getSubCategories(categoryId).map((subCategory) => (
                      <option key={subCategory.id} value={subCategory.id}>
                        {getCategoryName(subCategory)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className={`p-6 border ${borderClass} rounded-xl`}>
              <h2 className={`font-bold italic text-lg uppercase tracking-wide mb-4 ${textClass}`}>
                Image du produit
              </h2>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${isDragging
                    ? 'border-[#FF6B00] bg-[#FF6B00]/10'
                    : `${borderClass} ${isLight ? 'bg-gray-50' : 'bg-black/30'}`
                  }`}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
                    <p className={`text-sm ${mutedClass}`}>Téléchargement...</p>
                  </div>
                ) : imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Aperçu du produit"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      onClick={async () => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer cette image?')) {
                          try {
                            await fetch(`${API_URL}/products/${id}/image`, { method: 'DELETE' });
                            setImagePreview('');
                            setImageUrl('');
                          } catch (err) {
                            setError('Failed to delete image');
                          }
                        }
                      }}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                      title="Supprimer l'image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className={`w-10 h-10 mx-auto mb-3 ${mutedClass}`} />
                    <p className={`text-sm mb-2 ${mutedClass}`}>
                      Glissez-déposez un fichier ici ou cliquez ci-dessous
                    </p>
                    <p className={`text-xs ${mutedClass} opacity-70 mb-4`}>
                      PNG, JPG jusqu'à 5MB
                    </p>

                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-black text-sm font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors cursor-pointer">
                      <Camera className="w-5 h-5" />
                      Choisir un fichier
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>

            <div className={`p-6 border ${borderClass} rounded-xl`}>
              <div className="mb-4">
                <h2 className={`font-bold italic text-lg uppercase tracking-wide ${textClass}`}>
                  Contenu multilingue
                </h2>
                <p className={`text-xs ${mutedClass} mt-1`}>
                  Entrez le texte dans n'importe quelle langue et appuyez sur l'icône ✨ pour traduire dans les autres langues
                </p>
              </div>

              <div className="flex gap-2 mb-6">
                {[
                  { code: 'ru', label: 'RU', flag: '🇷🇺' },
                  { code: 'fr', label: 'FR', flag: '🇫🇷' },
                  { code: 'en', label: 'EN', flag: '🇬🇧' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wide rounded-lg transition-colors ${translations[lang.code as keyof typeof translations] === translations.ru
                        ? 'bg-[#FF6B00] text-black'
                        : `border ${borderClass} ${textClass} hover:border-[#FF6B00]`
                      }`}
                  >
                    {lang.flag} {lang.label}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                {['ru', 'fr', 'en'].map((lang) => (
                  <div key={lang} className="space-y-4">
                    <div className="relative">
                      <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                        Nom ({lang.toUpperCase()}) {lang === 'ru' && '*'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={translations[lang as keyof typeof translations].name}
                          onChange={(e) => {
                            setTranslations(prev => ({
                              ...prev,
                              [lang]: { ...prev[lang as keyof typeof prev], name: e.target.value }
                            }));
                            setFocusedField({ lang, field: 'name' });
                          }}
                          onFocus={() => setFocusedField({ lang, field: 'name' })}
                          onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                          className={`w-full px-4 py-2.5 pr-14 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                          placeholder={lang === 'ru' ? 'Nom du produit' : lang === 'fr' ? 'Nom du produit' : 'Product name'}
                        />
                        <AnimatePresence>
                          {focusedField?.lang === lang && focusedField?.field === 'name' &&
                            translations[lang as keyof typeof translations].name.length >= 3 && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => handleTranslateFromField(lang, 'name')}
                                disabled={translatingField !== null}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#FF6B00]/20 hover:bg-[#FF6B00]/40 rounded-lg transition-colors group"
                                title="AI Translate"
                              >
                                {translatingField?.lang === lang && translatingField?.field === 'name' ? (
                                  <RefreshCw className="w-4 h-4 text-[#FF6B00] animate-spin" />
                                ) : (
                                  <Sparkles className="w-4 h-4 text-[#FF6B00] group-hover:scale-110 transition-transform" />
                                )}
                              </motion.button>
                            )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="relative">
                      <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                        Description ({lang.toUpperCase()})
                      </label>
                      <div className="relative">
                        <textarea
                          rows={3}
                          value={translations[lang as keyof typeof translations].description}
                          onChange={(e) => {
                            setTranslations(prev => ({
                              ...prev,
                              [lang]: { ...prev[lang as keyof typeof prev], description: e.target.value }
                            }));
                            setFocusedField({ lang, field: 'description' });
                          }}
                          onFocus={() => setFocusedField({ lang, field: 'description' })}
                          onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                          className={`w-full px-4 py-2.5 pr-14 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass} resize-none`}
                          placeholder="Description du produit..."
                        />
                        <AnimatePresence>
                          {focusedField?.lang === lang && focusedField?.field === 'description' &&
                            translations[lang as keyof typeof translations].description.length >= 3 && (
                              <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => handleTranslateFromField(lang, 'description')}
                                disabled={translatingField !== null}
                                className="absolute right-2 top-3 p-1.5 bg-[#FF6B00]/20 hover:bg-[#FF6B00]/40 rounded-lg transition-colors group"
                                title="AI Translate"
                              >
                                {translatingField?.lang === lang && translatingField?.field === 'description' ? (
                                  <RefreshCw className="w-4 h-4 text-[#FF6B00] animate-spin" />
                                ) : (
                                  <Sparkles className="w-4 h-4 text-[#FF6B00] group-hover:scale-110 transition-transform" />
                                )}
                              </motion.button>
                            )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-6 border ${borderClass} rounded-xl`}>
              <h2 className={`font-bold italic text-lg uppercase tracking-wide mb-4 ${textClass}`}>
                Paramètres commerciaux
              </h2>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-[#FF6B00] text-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                  <span className={`text-sm font-medium ${textClass}`}>
                    Mettre en avant
                  </span>
                </label>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    Date d&apos;annonce (si produit &quot;Bientôt disponible&quot;)
                  </label>
                  <input
                    type="date"
                    value={announcementDate}
                    onChange={(e) => setAnnouncementDate(e.target.value)}
                    className={`w-full md:w-64 px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                  />
                  <p className={`text-xs mt-1 ${mutedClass}`}>
                    Laissez vide si le produit est déjà en vente
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
              <label className={`flex items-center gap-3 cursor-pointer order-2 sm:order-1 ${textClass}`}>
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="w-5 h-5 text-[#FF6B00] bg-transparent border-2 border-[#FF6B00] rounded focus:ring-[#FF6B00] focus:ring-2 focus:ring-offset-0"
                />
                <span className="text-sm font-medium">
                  {t('admin.content.popularProduct')}
                </span>
              </label>

              <div className="flex gap-3 order-1 sm:order-2 w-full sm:w-auto">
                <button
                  onClick={() => navigate('/admin/products')}
                  className={`flex-1 sm:flex-none px-6 py-3 border ${borderClass} rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${textClass} hover:border-[#FF6B00]`}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none px-8 py-3 bg-[#FF6B00] text-black rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showBrandModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowBrandModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-md p-6 border ${borderClass} rounded-xl ${isLight ? 'bg-white' : 'bg-zinc-900'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold italic text-xl uppercase tracking-wide ${textClass}`}>
                  Ajouter une marque
                </h3>
                <button
                  onClick={() => setShowBrandModal(false)}
                  className={`p-1 hover:bg-white/10 rounded-lg transition-colors ${mutedClass}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    Nom de la marque *
                  </label>
                  <input
                    type="text"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                    placeholder="Nom de la marque"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowBrandModal(false)}
                    className={`flex-1 py-2.5 border ${borderClass} rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${textClass} hover:border-[#FF6B00]`}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddBrand}
                    disabled={!newBrandName.trim()}
                    className="flex-1 py-2.5 bg-[#FF6B00] text-black rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors disabled:opacity-50"
                  >
                    Ajouter
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScan={handleBarcodeScan}
      />
    </div>
  );
};

export default EditProduct;
