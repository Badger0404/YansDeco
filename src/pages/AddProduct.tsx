import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Package,
  Tag,
  Award,
  Globe,
  Calculator,
  Settings,
  RefreshCw,
  LogOut,
  Sparkles,
  X,
  Check,
  Save,
  User
} from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
  description_ru: string | null;
  description_fr: string | null;
  description_en: string | null;
  created_at: string;
}

interface Category {
  id: number;
  slug: string;
  icon: string | null;
  image_url: string | null;
  parent_id: number | null;
  sort_order: number;
  name_ru: string | null;
  name_fr: string | null;
  name_en: string | null;
  children?: Category[];
}

const AddProduct: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [stock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [brandId, setBrandId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
  const [isPopular, setIsPopular] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
  const [focusedField, setFocusedField] = useState<{ lang: string; field: 'name' | 'description' } | null>(null);
  const [translatingField, setTranslatingField] = useState<{ lang: string; field: 'name' | 'description' } | null>(null);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      if (data.success) {
        setFlatCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
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
        setSuccess('Translation completed');
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
    if (!translations.fr.name.trim()) {
      setError('Enter product name');
      return;
    }
    if (!price) {
      setError('Enter price');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sku: sku.trim(),
          price: parseFloat(price) || 0,
          stock: parseInt(stock) || 0,
          brand_id: brandId === null ? null : brandId,
          category_id: subCategoryId !== null ? subCategoryId : categoryId,
          is_popular: isPopular ? 1 : 0,
          announcement_date: null,
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
        setSuccess('Product added successfully!');
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      } else {
        setError(data.error || 'Failed to save product');
      }
    } catch (err) {
      setError('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const mutedClass = isLight ? 'text-gray-600' : 'text-gray-400';
  const textClass = isLight ? 'text-black' : 'text-white';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';
  const borderClass = isLight ? 'border-zinc-200' : 'border-zinc-700/50';
  const headerBgClass = isLight ? 'bg-white/95 border-gray-200' : 'bg-black/95 border-white/10';
  const featureBgClass = isLight ? 'bg-white/5' : 'bg-white/5';

  const adminNavItems = [
    { id: 'products', label: t('admin.sections.products.title'), icon: <Package className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', label: t('admin.sections.categories.title'), icon: <Tag className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', label: t('admin.sections.brands.title'), icon: <Award className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'translations', label: t('admin.sections.translations.title'), icon: <Globe className="w-4 h-4" />, path: '/admin/translations' },
    { id: 'calculators', label: t('admin.sections.calculators.title'), icon: <Calculator className="w-4 h-4" />, path: '/admin/calculators' },
    { id: 'settings', label: t('admin.sections.settings.title'), icon: <Settings className="w-4 h-4" />, path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const currentBrand = brands.find(b => b.id === brandId);

  const getProductName = () => {
    const lang = i18n.language;
    if (lang === 'ru') return translations.ru.name || translations.fr.name || translations.en.name || '';
    if (lang === 'fr') return translations.fr.name || translations.ru.name || translations.en.name || '';
    if (lang === 'en') return translations.en.name || translations.ru.name || translations.fr.name || '';
    return translations.fr.name || '';
  };

  const getCategoryName = (category: Category) => {
    const lang = i18n.language;
    switch (lang) {
      case 'ru': return category.name_ru || category.name_fr || category.name_en || 'Без названия';
      case 'en': return category.name_en || category.name_fr || category.name_ru || 'Untitled';
      default: return category.name_fr || category.name_ru || category.name_en || 'Sans titre';
    }
  };

  const getSubCategories = (parentId: number): Category[] => {
    return flatCategories.filter(cat => Number(cat.parent_id) === parentId);
  };

  const topLevelCategories = flatCategories.filter(cat => !cat.parent_id);

  return (
    <div className="min-h-screen">
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            {t('admin.backToProducts')}
          </button>
          <div className={`h-4 w-px ${isLight ? 'bg-gray-300' : 'bg-white/10'}`} />
          
          <nav className="hidden md:flex items-center gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? isLight ? 'bg-[#FF6B00] text-black' : 'bg-[#FF6B00] text-black'
                    : isLight ? 'text-gray-600 hover:bg-gray-100 hover:text-[#FF6B00]' : 'text-gray-400 hover:bg-white/5 hover:text-[#FF6B00]'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-black" />
            </div>
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="min-h-screen pt-4">
        <section className="py-12 transition-colors duration-500 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => navigate('/admin/products')}
              className={`mb-8 transition-colors duration-200 text-sm uppercase tracking-wide flex items-center gap-2 ${
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
              }`}
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              {t('admin.backToProducts')}
            </button>

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

            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border-2 border-dashed transition-all duration-300 ${
                    isDragging 
                      ? 'border-[#FF6B00] bg-[#FF6B00]/10' 
                      : `${borderClass}`
                  }`}
                >
                  <div className="aspect-square flex items-center justify-center p-8">
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="w-10 h-10 text-[#FF6B00] animate-spin" />
                        <p className={`text-sm ${mutedClass}`}>Загрузка...</p>
                      </div>
                    ) : imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Package className="w-20 h-20 text-gray-300" />
                        <p className={`mt-4 text-sm ${mutedClass}`}>Перетащите фото сюда</p>
                      </div>
                    )}
                  </div>

                  <label className={`absolute inset-0 cursor-pointer ${!imagePreview ? 'flex' : 'hidden'}`}>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>

                  {imagePreview && (
                    <button
                      onClick={() => { setImagePreview(''); setImageUrl(''); }}
                      className="absolute top-4 right-4 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className={`text-center text-xs mt-3 ${mutedClass}`}>
                  PNG, JPG до 5MB
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col"
              >
                <div className="mb-4">
                  <span className="text-[#FF6B00] text-sm font-bold uppercase tracking-wide">
                    {currentBrand?.name || 'НОВЫЙ ТОВАР'}
                  </span>
                </div>

                <input
                  type="text"
                  value={getProductName()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTranslations(prev => ({
                      ...prev,
                      fr: { ...prev.fr, name: value },
                      ru: { ...prev.ru, name: value },
                      en: { ...prev.en, name: value }
                    }));
                  }}
                  className={`w-full font-black italic text-3xl uppercase tracking-tight bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300 ${textClass}`}
                  placeholder="НАЗВАНИЕ ТОВАРА"
                />

                <div className="flex items-center gap-4 mt-4 mb-6">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-28 pr-8 font-bold text-2xl bg-transparent border-b border-dashed focus:outline-none focus:border-[#FF6B00] ${textClass} placeholder-gray-300`}
                      placeholder="0.00"
                    />
                    <span className={`absolute right-0 top-1/2 -translate-y-1/2 font-bold text-2xl text-[#FF6B00]`}>€</span>
                  </div>
                  
                  <span className={`text-sm ${mutedClass}`}>•</span>
                  
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className={`flex-1 text-sm ${mutedClass} bg-transparent border-b border-dashed focus:outline-none focus:border-[#FF6B00] placeholder-gray-300`}
                    placeholder="Артикул"
                  />
                </div>

<p className={`text-sm leading-relaxed mb-6 ${mutedClass}`}>
                      Полное описание товара...
                    </p>

                <div className="mb-8">
                  <h3 className={`font-bold italic text-lg uppercase mb-4 ${textClass}`}>
                    Характеристики
                  </h3>
                  <ul className="space-y-2">
                    {[
                      { lang: 'fr', label: 'Français', value: translations.fr.description },
                      { lang: 'ru', label: 'Русский', value: translations.ru.description },
                      { lang: 'en', label: 'English', value: translations.en.description }
                    ].filter(item => item.value && item.value.length > 10).slice(0, 4)                    .map((item) => (
                      <li key={item.lang} className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                        <Check className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                        {item.value.substring(0, 80)}{item.value.length > 80 ? '...' : ''}
                      </li>
                    ))}
                    {translations.fr.description.length <= 10 && (
                      <li className={`flex items-center gap-2 text-sm ${mutedClass}`}>
                        <Check className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                        <span className="italic">Добавьте описание для характеристик</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-6 mb-6">
                  <label className={`flex items-center gap-3 cursor-pointer ${textClass}`}>
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
                </div>

                <div className="mt-auto">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-[#FF6B00] text-black px-8 py-4 text-sm font-bold uppercase tracking-wider rounded-xl hover:bg-[#FF8533] transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Добавить товар
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>

            <div className="mt-12 max-w-2xl">
              <div className="mb-6">
                <h3 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
                  {t('admin.brands.title')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('admin.brands.select')}
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={brandId || ''}
                        onChange={(e) => setBrandId(e.target.value ? parseInt(e.target.value) : null)}
                        className={`flex-1 px-4 py-3 rounded-lg border ${borderClass} text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      >
                        <option value="">{t('admin.brands.select')}</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowBrandModal(true)}
                        className={`px-4 py-3 rounded-lg border ${borderClass} text-sm font-bold uppercase tracking-wide transition-colors ${textClass} hover:border-[#FF6B00]`}
                      >
                        + {t('admin.brands.add')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
                  {t('admin.categories.title')}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('admin.categories.title')}
                    </label>
                    <select
                      value={categoryId || ''}
                      onChange={(e) => {
                        setCategoryId(e.target.value ? parseInt(e.target.value) : null);
                        setSubCategoryId(null);
                      }}
                      className={`w-full px-4 py-3 rounded-lg border ${borderClass} text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
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
                    <div className="ml-4">
                      <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                        {t('admin.categories.subcategory')}
                      </label>
                      <select
                        value={subCategoryId || ''}
                        onChange={(e) => setSubCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                        className={`w-full px-4 py-3 rounded-lg border ${borderClass} text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
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
              </div>
            </div>

                <div className="mt-12">
              <h3 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
                Переводы
              </h3>
              <div className="space-y-6">
                {[
                  { lang: 'fr', label: 'Français', flag: '🇫🇷' },
                  { lang: 'en', label: 'English', flag: '🇬🇧' },
                  { lang: 'ru', label: 'Русский', flag: '🇷🇺' }
                ].map((lang) => (
                  <motion.div
                    key={lang.lang}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl ${featureBgClass}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span className={`text-sm font-bold uppercase tracking-wide ${textClass}`}>
                        {lang.label}
                      </span>
                      <AnimatePresence>
                        {focusedField?.lang === lang.lang && focusedField?.field === 'name' && 
                         translations[lang.lang as keyof typeof translations].name.length >= 3 && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => handleTranslateFromField(lang.lang, 'name')}
                            disabled={translatingField !== null}
                            className="ml-auto p-1.5 bg-[#FF6B00]/20 rounded-lg transition-colors group"
                            title="AI Translate"
                          >
                            {translatingField?.lang === lang.lang && translatingField?.field === 'name' ? (
                              <RefreshCw className="w-4 h-4 text-[#FF6B00] animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                            )}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                    <div className="grid gap-3">
                      <input
                        type="text"
                        value={translations[lang.lang as keyof typeof translations].name}
                        onChange={(e) => {
                          setTranslations(prev => ({
                            ...prev,
                            [lang.lang]: { ...prev[lang.lang as keyof typeof prev], name: e.target.value }
                          }));
                          setFocusedField({ lang: lang.lang, field: 'name' });
                        }}
                        onFocus={() => setFocusedField({ lang: lang.lang, field: 'name' })}
                        className={`w-full px-4 py-2 bg-transparent border rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        placeholder="Название"
                      />
                      <textarea
                        rows={2}
                        value={translations[lang.lang as keyof typeof translations].description}
                        onChange={(e) => {
                          setTranslations(prev => ({
                            ...prev,
                            [lang.lang]: { ...prev[lang.lang as keyof typeof prev], description: e.target.value }
                          }));
                        }}
                        className={`w-full px-4 py-2 bg-transparent border rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass} resize-none`}
                        placeholder="Описание"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
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
                  Добавить бренд
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
                    Название бренда *
                  </label>
                  <input
                    type="text"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                    placeholder="Название бренда"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowBrandModal(false)}
                    className={`flex-1 py-2.5 border ${borderClass} rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${textClass} hover:border-[#FF6B00]`}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleAddBrand}
                    disabled={!newBrandName.trim()}
                    className="flex-1 py-2.5 bg-[#FF6B00] text-black rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors disabled:opacity-50"
                  >
                    Добавить
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddProduct;
