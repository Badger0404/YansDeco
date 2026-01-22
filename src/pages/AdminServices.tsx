import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { checkHealth } from '../components/CloudStatus';
import ColorPicker from '../components/ColorPicker';
import {
  ChevronRight,
  Plus,
  Package,
  Tag,
  Award,
  Globe,
  Calculator,
  Settings,
  RefreshCw,
  LogOut,
  User,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Wand2,
  Upload,
  XCircle
} from 'lucide-react';

interface Service {
  id: number;
  key: string;
  icon: string | null;
  icon_emoji: string | null;
  icon_url: string | null;
  gradient_from: string | null;
  gradient_to: string | null;
  tags_ru: string | null;
  tags_fr: string | null;
  tags_en: string | null;
  title_ru: string | null;
  title_fr: string | null;
  title_en: string | null;
  subtitle_ru: string | null;
  subtitle_fr: string | null;
  subtitle_en: string | null;
  description_ru: string | null;
  description_fr: string | null;
  description_en: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

const defaultEmojis = ['🚚', '🏪', '👷', '📋', '💼', '🎯', '⭐', '💪', '🔧', '✨'];

const AdminServices: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    key: '',
    icon_emoji: '',
    icon_url: '',
    gradient_from: '#FF6B00',
    gradient_to: '#FF6B00',
    title_ru: '',
    title_fr: '',
    title_en: '',
    subtitle_ru: '',
    subtitle_fr: '',
    subtitle_en: '',
    description_ru: '',
    description_fr: '',
    description_en: '',
    tags_ru: '',
    tags_fr: '',
    tags_en: '',
    is_active: true
  });

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/admin/services`);
      const data = await response.json();
      if (data.success) {
        setServices(data.data || []);
      } else {
        setError('Failed to load services');
      }
    } catch (err) {
      console.error('Failed to load services:', err);
      setError('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    const newKey = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setFormData({
      key: newKey,
      icon_emoji: defaultEmojis[services.length % defaultEmojis.length],
      icon_url: '',
      gradient_from: '#FF6B00',
      gradient_to: '#FF6B00',
      title_ru: '',
      title_fr: '',
      title_en: '',
      subtitle_ru: '',
      subtitle_fr: '',
      subtitle_en: '',
      description_ru: '',
      description_fr: '',
      description_en: '',
      tags_ru: '',
      tags_fr: '',
      tags_en: '',
      is_active: true
    });
    setShowAddModal(true);
  };

  const handleEdit = (service: Service) => {
    setFormData({
      key: service.key,
      icon_emoji: service.icon_emoji || '',
      icon_url: service.icon_url || '',
      gradient_from: service.gradient_from || '#FF6B00',
      gradient_to: service.gradient_to || '#FF6B00',
      title_ru: service.title_ru || '',
      title_fr: service.title_fr || '',
      title_en: service.title_en || '',
      subtitle_ru: service.subtitle_ru || '',
      subtitle_fr: service.subtitle_fr || '',
      subtitle_en: service.subtitle_en || '',
      description_ru: service.description_ru || '',
      description_fr: service.description_fr || '',
      description_en: service.description_en || '',
      tags_ru: service.tags_ru || '',
      tags_fr: service.tags_fr || '',
      tags_en: service.tags_en || '',
      is_active: service.is_active === 1
    });
    setEditingService(service);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingService(null);
    setError('');
  };

  const handleTranslate = async () => {
    let sourceLang = '';

    if (formData.description_ru?.trim() || formData.title_ru?.trim() || formData.subtitle_ru?.trim() || formData.tags_ru?.trim()) {
      sourceLang = 'ru';
    } else if (formData.description_en?.trim() || formData.title_en?.trim() || formData.subtitle_en?.trim() || formData.tags_en?.trim()) {
      sourceLang = 'en';
    } else if (formData.description_fr?.trim() || formData.title_fr?.trim() || formData.subtitle_fr?.trim() || formData.tags_fr?.trim()) {
      sourceLang = 'fr';
    }

    if (!sourceLang) {
      setError(t('admin.translations.fillSourceField'));
      return;
    }

    setTranslating(true);
    setError('');

    const targetLangs = sourceLang === 'ru' ? ['fr', 'en'] : sourceLang === 'en' ? ['ru', 'fr'] : ['ru', 'en'];

    try {
      const fieldsToTranslate: any = {};
      if (formData[`title_${sourceLang}` as keyof typeof formData]) fieldsToTranslate.title = formData[`title_${sourceLang}` as keyof typeof formData];
      if (formData[`subtitle_${sourceLang}` as keyof typeof formData]) fieldsToTranslate.subtitle = formData[`subtitle_${sourceLang}` as keyof typeof formData];
      if (formData[`description_${sourceLang}` as keyof typeof formData]) fieldsToTranslate.description = formData[`description_${sourceLang}` as keyof typeof formData];
      if (formData[`tags_${sourceLang}` as keyof typeof formData]) fieldsToTranslate.tags = formData[`tags_${sourceLang}` as keyof typeof formData];

      const response = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: fieldsToTranslate,
          sourceLang,
          targetLangs
        })
      });

      const data = await response.json();

      if (data.success && data.data) {
        setFormData(prev => {
          const updated = { ...prev };

          targetLangs.forEach((lang: string) => {
            const translations = data.data[lang];
            if (translations) {
              if (translations.title) (updated as any)[`title_${lang}`] = translations.title;
              if (translations.subtitle) (updated as any)[`subtitle_${lang}`] = translations.subtitle;
              if (translations.description) (updated as any)[`description_${lang}`] = translations.description;
              if (translations.tags) (updated as any)[`tags_${lang}`] = translations.tags;
            }
          });
          return updated;
        });
        setSuccess(t('admin.translations.success'));
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Translation failed');
      }
    } catch (err) {
      console.error('[Translate] Error:', err);
      setError('Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'services');

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        updateField('icon_url', data.data.url);
        setSuccess('Image uploaded successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    updateField('icon_url', '');
  };

  const handleSave = async () => {
    setError('');

    if (!formData.key.trim()) {
      setError('Key is required');
      return;
    }

    try {
      const url = editingService
        ? `${API_URL}/services/${editingService.id}`
        : `${API_URL}/services`;
      const method = editingService ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sort_order: editingService?.sort_order ?? services.length,
          is_active: formData.is_active ? 1 : 0
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingService ? t('admin.services.updated') : t('admin.services.created'));
        handleCloseModal();
        fetchServices();
        checkHealth();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save service');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save service - connection error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('admin.services.deleteConfirm'))) return;

    try {
      const response = await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setSuccess(t('admin.services.deleted'));
        fetchServices();
        checkHealth();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete service');
      }
    } catch (err) {
      setError('Failed to delete service');
    }
  };

  const handleToggleVisibility = async (service: Service) => {
    try {
      await fetch(`${API_URL}/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: service.is_active === 1 ? 0 : 1 })
      });
      fetchServices();
      checkHealth();
    } catch (err) {
      console.error('Failed to toggle visibility:', err);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const borderClass = isLight ? 'border-zinc-200' : 'border-zinc-700/50';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';
  const headerBgClass = isLight ? 'bg-white/95 border-gray-200' : 'bg-black/95 border-white/10';
  const cardBgClass = isLight ? 'bg-white' : 'bg-zinc-900';

  const adminNavItems = [
    { id: 'products', label: t('admin.sections.products.title'), icon: <Package className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', label: t('admin.sections.categories.title'), icon: <Tag className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', label: t('admin.sections.brands.title'), icon: <Award className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'services', label: t('admin.sections.services.title'), icon: <Globe className="w-4 h-4" />, path: '/admin/services' },
    { id: 'translations', label: t('admin.sections.translations.title'), icon: <Sparkles className="w-4 h-4" />, path: '/admin/translations' },
    { id: 'calculators', label: t('admin.sections.calculators.title'), icon: <Calculator className="w-4 h-4" />, path: '/admin/calculators' },
    { id: 'settings', label: t('admin.sections.settings.title'), icon: <Settings className="w-4 h-4" />, path: '/admin/settings' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className={`w-full flex items-center justify-between px-3 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
              }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            <span className="hidden sm:inline">{t('admin.backToSite')}</span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${item.id === 'services'
                  ? 'bg-[#FF6B00] text-black' : ''
                  } ${isLight
                    ? 'text-gray-600 hover:bg-gray-100 hover:text-[#FF6B00]'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-[#FF6B00]'
                  }`}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-black" />
            </div>
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'
                }`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('admin.logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className={`font-black italic text-2xl sm:text-3xl uppercase tracking-tight ${textClass}`}>
                {t('admin.services.title')}
              </h1>
              <p className={`text-xs sm:text-sm ${mutedClass}`}>
                {t('admin.services.manageServices')}
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF6B00] text-black text-xs sm:text-sm font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors"
            >
              <Plus className="w-4 h-4" />
              {t('admin.services.addService')}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-xs sm:text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 sm:p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500 text-xs sm:text-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {success}
            </motion.div>
          )}

          {services.length === 0 ? (
            <div className={`text-center py-12 sm:py-16 border ${borderClass} rounded-xl ${mutedClass}`}>
              <Globe className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
              <p className="text-base sm:text-lg mb-4">{t('admin.services.noServices')}</p>
              <button
                onClick={handleAddNew}
                className="px-4 py-2.5 bg-[#FF6B00] text-black rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors"
              >
                {t('admin.services.addService')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`relative p-4 sm:p-6 border ${borderClass} rounded-xl ${cardBgClass} transition-all duration-300 ${service.is_active === 0 ? 'opacity-50 grayscale' : ''
                    }`}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl overflow-hidden"
                      style={{
                        background: service.gradient_from
                          ? service.gradient_from.startsWith('from-')
                            ? service.gradient_from
                            : `linear-gradient(135deg, ${service.gradient_from}, ${service.gradient_from})`
                          : '#FF6B00'
                      }}
                    >
                      {service.icon_url ? (
                        <img src={service.icon_url} alt="" className="w-full h-full object-cover" />
                      ) : service.icon_emoji ? (
                        <span>{service.icon_emoji}</span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleToggleVisibility(service)}
                        className={`p-1.5 sm:p-2 border ${borderClass} rounded-lg transition-colors ${service.is_active === 1
                          ? 'text-green-500 hover:bg-green-500/10'
                          : 'text-gray-400 hover:bg-gray-500/10'
                          }`}
                        title={service.is_active === 1 ? t('admin.services.hide') : t('admin.services.show')}
                      >
                        {service.is_active === 1 ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleEdit(service)}
                        className={`p-1.5 sm:p-2 border ${borderClass} rounded-lg hover:border-[#FF6B00] transition-colors`}
                        title={t('admin.services.edit')}
                      >
                        <Edit className={`w-4 h-4 ${mutedClass}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className={`p-1.5 sm:p-2 border ${borderClass} rounded-lg hover:border-red-500 transition-colors`}
                        title={t('admin.services.delete')}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>

                  <h3 className={`font-bold italic text-lg sm:text-xl uppercase tracking-tight mb-1 ${textClass}`}>
                    {service.title_fr || service.key}
                  </h3>
                  <p className={`text-xs sm:text-sm ${mutedClass} mb-2 sm:mb-3`}>
                    {service.subtitle_fr || '—'}
                  </p>
                  <p className={`text-xs sm:text-sm ${mutedClass} line-clamp-2 mb-3 sm:mb-4`}>
                    {service.description_fr || t('admin.services.noDescription')}
                  </p>

                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {service.tags_fr?.split(',').filter(t => t.trim()).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 sm:py-1 bg-[#FF6B00]/10 text-[#FF6B00] rounded-full text-[10px] sm:text-xs">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className={`mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${borderClass} flex items-center justify-between text-[10px] sm:text-xs ${mutedClass}`}>
                    <span>Key: {service.key}</span>
                    <span>ID: {service.id}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {(editingService || showAddModal) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] z-[70] ${cardBgClass} rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
            >
              <div className={`p-4 sm:p-6 border-b ${borderClass} flex items-center justify-between`}>
                <h2 className={`font-bold italic text-lg sm:text-xl uppercase tracking-wide ${textClass}`}>
                  {editingService ? t('admin.services.edit') : t('admin.services.addNew')}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
                >
                  <X className={`w-5 h-5 ${textClass}`} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-xs"
                  >
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500 text-xs flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {success}
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className={`block text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-1.5 sm:mb-2 ${mutedClass}`}>
                      Key
                    </label>
                    <input
                      type="text"
                      value={formData.key}
                      onChange={(e) => updateField('key', e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border ${borderClass} rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      placeholder="service_key"
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-1.5 sm:mb-2 ${mutedClass}`}>
                      Emoji
                    </label>
                    <input
                      type="text"
                      value={formData.icon_emoji}
                      onChange={(e) => updateField('icon_emoji', e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border ${borderClass} rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      placeholder="🚚"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-1.5 sm:mb-2 ${mutedClass}`}>
                    Image (optional)
                  </label>
                  <div className="space-y-3">
                    {formData.icon_url ? (
                      <div className="relative inline-block">
                        <img
                          src={formData.icon_url}
                          alt="Service icon"
                          className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className={`border-2 border-dashed ${borderClass} rounded-lg p-6 text-center hover:border-[#FF6B00] transition-colors`}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="service-image-upload"
                          disabled={uploading}
                        />
                        <label
                          htmlFor="service-image-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          {uploading ? (
                            <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
                          ) : (
                            <Upload className="w-8 h-8 text-zinc-400" />
                          )}
                          <span className={`text-xs ${mutedClass}`}>
                            {uploading ? 'Uploading...' : 'Click to upload image'}
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <ColorPicker
                    label="Gradient Color"
                    value={formData.gradient_from}
                    onChange={(value) => updateField('gradient_from', value)}
                  />
                </div>

                {['ru', 'fr', 'en'].map((lang) => (
                  <div key={lang} className={`p-3 sm:p-4 border ${borderClass} rounded-xl ${isLight ? 'bg-gray-50' : 'bg-white/5'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-bold uppercase text-xs ${mutedClass}`}>
                        {lang === 'ru' ? '🇷🇺 Русский' : lang === 'en' ? '🇬🇧 English' : '🇫🇷 Français'}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wide mb-1 ${mutedClass}`}>
                          {t('admin.services.title')}
                        </label>
                        <input
                          type="text"
                          value={formData[`title_${lang}` as keyof typeof formData] as string}
                          onChange={(e) => updateField(`title_${lang}`, e.target.value)}
                          className={`w-full px-3 py-2 border ${borderClass} rounded-lg text-xs focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wide mb-1 ${mutedClass}`}>
                          {t('admin.services.subtitle')}
                        </label>
                        <input
                          type="text"
                          value={formData[`subtitle_${lang}` as keyof typeof formData] as string}
                          onChange={(e) => updateField(`subtitle_${lang}`, e.target.value)}
                          className={`w-full px-3 py-2 border ${borderClass} rounded-lg text-xs focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wide mb-1 ${mutedClass}`}>
                          {t('admin.services.description')}
                        </label>
                        <textarea
                          rows={3}
                          value={formData[`description_${lang}` as keyof typeof formData] as string}
                          onChange={(e) => updateField(`description_${lang}`, e.target.value)}
                          className={`w-full px-3 py-2 border ${borderClass} rounded-lg text-xs focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass} resize-none`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wide mb-1 ${mutedClass}`}>
                          Tags
                        </label>
                        <input
                          type="text"
                          value={formData[`tags_${lang}` as keyof typeof formData] as string}
                          onChange={(e) => updateField(`tags_${lang}`, e.target.value)}
                          className={`w-full px-3 py-2 border ${borderClass} rounded-lg text-xs focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                          placeholder="tag1, tag2, tag3"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => updateField('is_active', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <span className={`text-xs sm:text-sm ${textClass}`}>
                      {t('admin.services.active')}
                    </span>
                  </label>

                  <button
                    onClick={handleTranslate}
                    disabled={translating}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wide rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
                  >
                    {translating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Wand2 className="w-4 h-4" />
                    )}
                    {t('admin.translations.translate')}
                  </button>
                </div>
              </div>

              <div className={`p-4 sm:p-6 border-t ${borderClass} flex justify-end gap-3`}>
                <button
                  onClick={handleCloseModal}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide border ${borderClass} rounded-lg transition-colors ${textClass}`}
                >
                  {t('admin.cancel')}
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#FF6B00] text-black text-xs sm:text-sm font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors"
                >
                  <Save className="w-4 h-4" />
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

export default AdminServices;
