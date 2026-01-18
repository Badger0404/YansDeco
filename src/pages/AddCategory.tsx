import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Save,
  Package,
  Tag,
  Award,
  Globe,
  Calculator,
  Settings,
  RefreshCw,
  LogOut,
  User,
  X
} from 'lucide-react';

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
  desc_ru: string | null;
  desc_fr: string | null;
  desc_en: string | null;
  created_at: string;
}

const AddCategory: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name_ru: '',
    name_fr: '',
    name_en: '',
    desc_ru: '',
    desc_fr: '',
    desc_en: '',
    slug: '',
    icon: '',
    image_url: '',
    parent_id: '' as string,
    sort_order: '0'
  });

  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
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
    formData.append('folder', 'categories');

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFormData(prev => ({ ...prev, image_url: data.data.url }));
        setImagePreview(data.data.url);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name_fr.trim()) {
      setError('French name is required');
      return;
    }
    if (!formData.slug.trim()) {
      setError('Slug is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: formData.slug,
          name_ru: formData.name_ru || null,
          name_fr: formData.name_fr,
          name_en: formData.name_en || null,
          desc_ru: formData.desc_ru || null,
          desc_fr: formData.desc_fr || null,
          desc_en: formData.desc_en || null,
          icon: formData.icon || null,
          image_url: formData.image_url || null,
          parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
          sort_order: parseInt(formData.sort_order) || 0
        })
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Category created successfully!');
        setTimeout(() => {
          navigate('/admin/categories');
        }, 1500);
      } else {
        setError(data.error || 'Failed to create category');
      }
    } catch (err) {
      setError('Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryName = (cat: Category) => {
    const lang = i18n.language;
    switch (lang) {
      case 'ru': return cat.name_ru || cat.name_fr || cat.name_en || 'Без названия';
      case 'en': return cat.name_en || cat.name_fr || cat.name_ru || 'Untitled';
      default: return cat.name_fr || cat.name_ru || cat.name_en || 'Sans titre';
    }
  };

  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';
  const headerBgClass = isLight ? 'bg-white/95 border-gray-200' : 'bg-black/95 border-white/10';

  const adminNavItems = [
    { id: 'products', label: t('admin.sections.products.title'), icon: <Package className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', label: t('admin.sections.categories.title'), icon: <Tag className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', label: t('admin.sections.brands.title'), icon: <Award className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'translations', label: t('admin.sections.translations.title'), icon: <Globe className="w-4 h-4" />, path: '/admin/translations' },
    { id: 'calculators', label: t('admin.sections.calculators.title'), icon: <Calculator className="w-4 h-4" />, path: '/admin/calculators' },
    { id: 'settings', label: t('admin.sections.settings.title'), icon: <Settings className="w-4 h-4" />, path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen">
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/categories')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            {t('admin.backToCategories')}
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
                    : isLight ? 'text-gray-600 hover:bg-gray-100 hover:text-[#FF6B00]' : 'text-zinc-400 hover:bg-white/5 hover:text-[#FF6B00]'
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
                isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'
              }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Save className="w-4 h-4" />
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
                <div className="aspect-video flex items-center justify-center p-8">
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="w-10 h-10 text-[#FF6B00] animate-spin" />
                      <p className={`text-sm ${mutedClass}`}>Загрузка...</p>
                    </div>
                  ) : imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Tag className="w-20 h-20 text-gray-300" />
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
                    onClick={() => { setImagePreview(''); setFormData(prev => ({ ...prev, image_url: '' })); }}
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
              <div className={`p-6 border ${borderClass} rounded-xl`}>
                <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
                  {t('admin.categories.categoryInfo')}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border ${borderClass} text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      placeholder="category-slug"
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('admin.categories.parentCategory')}
                    </label>
                    <select
                      value={formData.parent_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border ${borderClass} text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                    >
                      <option value="">{t('admin.categories.noParent')}</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {getCategoryName(cat)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('admin.categories.icon')}
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border ${borderClass} text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      placeholder="🏠"
                    />
                  </div>

                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('admin.categories.order')}
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, sort_order: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border ${borderClass} text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-6 border ${borderClass} rounded-xl mt-8`}
          >
            <h3 className={`font-bold italic text-xl uppercase tracking-wide mb-6 ${textClass}`}>
              {t('admin.categories.multilingualContent')}
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {['fr', 'en', 'ru'].map((lang) => (
                <div key={lang} className="space-y-4">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('admin.categories.name')} ({lang.toUpperCase()}) {lang === 'fr' && '*'}
                    </label>
                    <input
                      type="text"
                      value={formData[`name_${lang}` as keyof typeof formData]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [`name_${lang}`]: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border ${borderClass} text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      placeholder={lang === 'fr' ? 'Nom de la catégorie' : lang === 'en' ? 'Category name' : 'Название категории'}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      {t('admin.categories.description')} ({lang.toUpperCase()})
                    </label>
                    <textarea
                      rows={4}
                      value={formData[`desc_${lang}` as keyof typeof formData]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [`desc_${lang}`]: e.target.value }))}
                      className={`w-full px-4 py-3 rounded-lg border ${borderClass} text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass} resize-none`}
                      placeholder={lang === 'fr' ? 'Description de la catégorie...' : lang === 'en' ? 'Category description...' : 'Описание категории...'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => navigate('/admin/categories')}
              className={`px-6 py-3 border ${borderClass} rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${textClass} hover:border-[#FF6B00]`}
            >
              {t('admin.cancel')}
            </button>
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-[#FF6B00] text-black rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {t('admin.saving')}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {t('admin.categories.create')}
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddCategory;