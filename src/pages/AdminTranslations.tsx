import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  RefreshCw,
  Package,
  Tag,
  Award,
  Globe,
  Calculator,
  Settings,
  Cloud,
  Upload,
  LogOut,
  User,
  X,
  Save
} from 'lucide-react';

interface Translation {
  id: number;
  key: string;
  namespace: string;
  value_ru: string;
  value_fr: string;
  value_en: string;
  description: string | null;
  is_active: number;
}

const AdminTranslations: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLang, setSelectedLang] = useState('fr');
  const [cloudStatus, setCloudStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState({
    key: '',
    namespace: 'common',
    value_ru: '',
    value_fr: '',
    value_en: '',
    description: '',
    is_active: true
  });
  const [saving, setSaving] = useState(false);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);
  
  const themeToggle = () => {
    const newTheme = isLight ? 'dark' : 'light';
    localStorage.setItem('site-theme', newTheme);
    setIsLight(!isLight);
    window.dispatchEvent(new Event('themechange'));
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/translations`);
      const data = await response.json();
      if (data.success) {
        setTranslations(data.data.translations || []);
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error);
    }
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditForm({
      key: '',
      namespace: 'common',
      value_ru: '',
      value_fr: '',
      value_en: '',
      description: '',
      is_active: true
    });
    setShowAddModal(true);
  };

  const handleEdit = (translation: Translation) => {
    setEditingTranslation(translation);
    setEditForm({
      key: translation.key,
      namespace: translation.namespace,
      value_ru: translation.value_ru || '',
      value_fr: translation.value_fr || '',
      value_en: translation.value_en || '',
      description: translation.description || '',
      is_active: translation.is_active === 1
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingTranslation) {
        const response = await fetch(`${API_URL}/admin/translations/${editingTranslation.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm)
        });
        const data = await response.json();
        if (data.success) {
          setTranslations(prev => prev.map(t => 
            t.id === editingTranslation.id ? { ...t, ...editForm, is_active: editForm.is_active ? 1 : 0 } as Translation : t
          ));
          setEditingTranslation(null);
        }
      } else {
        const response = await fetch(`${API_URL}/admin/translations`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editForm)
        });
        const data = await response.json();
        if (data.success && data.data.translation) {
          setTranslations(prev => [...prev, data.data.translation]);
          setShowAddModal(false);
        }
      }
    } catch (error) {
      console.error('Failed to save translation:', error);
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.translations.deleteConfirm'))) return;
    
    try {
      const response = await fetch(`${API_URL}/admin/translations/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setTranslations(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete translation:', error);
    }
  };

  const handleSync = () => {
    setCloudStatus('syncing');
    fetchTranslations().then(() => {
      setTimeout(() => setCloudStatus('online'), 1000);
    });
  };

  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const hoverBorderClass = 'hover:border-[#FF6B00]';
  const bgClass = isLight ? 'bg-white' : 'bg-zinc-900';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';

  const adminNavItems = [
    { id: 'products', label: t('admin.sections.products.title'), icon: <Package className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', label: t('admin.sections.categories.title'), icon: <Tag className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', label: t('admin.sections.brands.title'), icon: <Award className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'translations', label: t('admin.sections.translations.title'), icon: <Globe className="w-4 h-4" />, path: '/admin/translations' },
    { id: 'calculators', label: t('admin.sections.calculators.title'), icon: <Calculator className="w-4 h-4" />, path: '/admin/calculators' },
    { id: 'settings', label: t('admin.sections.settings.title'), icon: <Settings className="w-4 h-4" />, path: '/admin/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isCloudOnline = cloudStatus === 'online';

  const languages = [
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'en', label: 'EN', name: 'English' },
    { code: 'ru', label: 'RU', name: 'Русский' },
  ];

  const filteredTranslations = translations.filter(t => 
    t.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (t.value_ru && t.value_ru.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.value_fr && t.value_fr.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (t.value_en && t.value_en.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTranslationValue = (translation: Translation, lang: string) => {
    switch (lang) {
      case 'ru': return translation.value_ru;
      case 'en': return translation.value_en;
      default: return translation.value_fr;
    }
  };

  return (
    <div className="min-h-screen">
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLight 
          ? 'bg-white/95 backdrop-blur-md border-gray-200' 
          : 'bg-black/95 backdrop-blur-md border-white/10'
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            {t('admin.backToDashboard')}
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
          <div className="hidden lg:flex items-center gap-2">
            <Cloud className={`w-3.5 h-3.5 ${isCloudOnline ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`text-xs font-medium uppercase tracking-wide ${
              isCloudOnline ? 'text-green-500' : 'text-red-500'
            }`}>
              {t(`admin.cloudStatus.${cloudStatus}`)}
            </span>
            {cloudStatus === 'syncing' && (
              <RefreshCw className="w-3.5 h-3.5 text-yellow-500 animate-spin" />
            )}
          </div>

          <button
            onClick={handleSync}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FF6B00] text-black rounded-lg hover:bg-[#FF8533] transition-colors"
          >
            <Upload className="w-3 h-3" />
            {t('admin.sync')}
          </button>

          <button
            onClick={themeToggle}
            className={`flex items-center justify-center w-9 h-9 transition-all duration-300 ${
              isLight ? 'text-black hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'
            }`}
            title={isLight ? t('admin.theme.dark') : t('admin.theme.light')}
          >
            {isLight ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`font-black italic text-2xl md:text-3xl uppercase tracking-tight ${textClass}`}>
                {t('admin.translations.title')}
              </h1>
              <p className={`text-xs ${mutedClass} mt-1`}>
                {t('admin.sections.translations.description')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSync}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border ${borderClass} rounded-lg transition-colors ${textClass} ${hoverBorderClass}`}
              >
                <RefreshCw className="w-3 h-3" />
                {t('admin.translations.syncAll')}
              </button>
              <button 
                onClick={handleAddNew}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FF6B00] text-black rounded-lg hover:bg-[#FF8533] transition-colors"
              >
                <Plus className="w-3 h-3" />
                {t('admin.translations.addNew')}
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
                  selectedLang === lang.code
                    ? 'bg-[#FF6B00] text-black'
                    : `border ${borderClass} ${textClass} hover:border-[#FF6B00]`
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 mb-5">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedClass}`} />
            <input
              type="text"
              placeholder={t('admin.translations.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 bg-transparent border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} placeholder-${mutedClass}`}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className={`w-8 h-8 animate-spin ${mutedClass}`} />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTranslations.length === 0 ? (
                <div className={`text-center py-12 border ${borderClass} rounded-lg ${mutedClass}`}>
                  {t('admin.translations.noTranslations')}
                </div>
              ) : (
                filteredTranslations.map((trans, index) => (
                  <motion.div
                    key={trans.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={`p-4 bg-transparent border ${borderClass} ${hoverBorderClass} rounded-lg transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <code className={`text-xs font-mono ${mutedClass}`}>{trans.key}</code>
                        <span className={`text-xs px-2 py-0.5 rounded ${isLight ? 'bg-gray-100' : 'bg-white/10'} ${mutedClass}`}>
                          {trans.namespace}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(trans)}
                          className={`p-2 border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(trans.id)}
                          className="p-2 border border-red-500/50 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm ${textClass}`}>{getTranslationValue(trans, selectedLang) || <span className={mutedClass}>—</span>}</p>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {(editingTranslation || showAddModal) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => {
                setEditingTranslation(null);
                setShowAddModal(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[70] ${bgClass} rounded-2xl shadow-2xl overflow-hidden`}
            >
              <div className={`relative p-4 border-b ${borderClass} flex items-center justify-between`}>
                <h2 className={`font-bold italic text-lg uppercase tracking-wide ${textClass}`}>
                  {editingTranslation ? t('admin.translations.edit') : t('admin.translations.addNew')}
                </h2>
                <button
                  onClick={() => {
                    setEditingTranslation(null);
                    setShowAddModal(false);
                  }}
                  className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
                >
                  <X className={`w-5 h-5 ${textClass}`} />
                </button>
              </div>

              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    Key *
                  </label>
                  <input
                    type="text"
                    value={editForm.key}
                    onChange={(e) => setEditForm(prev => ({ ...prev, key: e.target.value }))}
                    className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                    placeholder="nav.home"
                    disabled={!!editingTranslation}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    Namespace
                  </label>
                  <input
                    type="text"
                    value={editForm.namespace}
                    onChange={(e) => setEditForm(prev => ({ ...prev, namespace: e.target.value }))}
                    className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                    placeholder="common"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      Français *
                    </label>
                    <textarea
                      value={editForm.value_fr}
                      onChange={(e) => setEditForm(prev => ({ ...prev, value_fr: e.target.value }))}
                      className={`w-full px-3 py-2 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      English
                    </label>
                    <textarea
                      value={editForm.value_en}
                      onChange={(e) => setEditForm(prev => ({ ...prev, value_en: e.target.value }))}
                      className={`w-full px-3 py-2 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                      Русский
                    </label>
                    <textarea
                      value={editForm.value_ru}
                      onChange={(e) => setEditForm(prev => ({ ...prev, value_ru: e.target.value }))}
                      className={`w-full px-3 py-2 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      rows={3}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    Description
                  </label>
                  <input
                    type="text"
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                    placeholder="Navigation home link"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={editForm.is_active}
                    onChange={(e) => setEditForm(prev => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]"
                  />
                  <label htmlFor="is_active" className={`text-sm ${textClass}`}>
                    {t('admin.translations.active')}
                  </label>
                </div>
              </div>

              <div className={`p-4 border-t ${borderClass} flex justify-end gap-3`}>
                <button
                  onClick={() => {
                    setEditingTranslation(null);
                    setShowAddModal(false);
                  }}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border ${borderClass} rounded-lg transition-colors ${textClass}`}
                >
                  {t('admin.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !editForm.key || !editForm.value_fr}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#FF6B00] text-black rounded-lg hover:bg-[#FF8533] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {t('admin.save')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTranslations;
