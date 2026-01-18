import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
  ArrowUp,
  ArrowDown,
  Truck
} from 'lucide-react';

interface Service {
  id: number;
  key: string;
  icon: string | null;
  icon_emoji: string | null;
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
}

const iconEmojis: Record<string, string> = {
  livraison: '🚚',
  retrait: '🏪',
  conseils: '👷',
  devis: '📋'
};

const AdminServices: React.FC = () => {
  const { t } = useTranslation();

  const serviceKeys = [
    { key: 'livraison', label: t('admin.services.serviceLabels.delivery') },
    { key: 'retrait', label: t('admin.services.serviceLabels.pickup') },
    { key: 'conseils', label: t('admin.services.serviceLabels.advice') },
    { key: 'devis', label: t('admin.services.serviceLabels.quote') }
  ];
  const navigate = useNavigate();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [isSaving, setIsSaving] = useState(false);

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
        setServices(data.data);
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

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData(service);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async (id: number) => {
    setIsSaving(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Service updated');
        setEditingId(null);
        setFormData({});
        fetchServices();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update service');
      }
    } catch (err) {
      setError('Failed to update service');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newServices = [...services];
    [newServices[index], newServices[index - 1]] = [newServices[index - 1], newServices[index]];
    const service = newServices[index];
    await fetch(`${API_URL}/services/${service.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sort_order: index })
    });
    fetchServices();
  };

  const handleMoveDown = async (index: number) => {
    if (index === services.length - 1) return;
    const newServices = [...services];
    [newServices[index], newServices[index + 1]] = [newServices[index + 1], newServices[index]];
    const service = newServices[index];
    await fetch(`${API_URL}/services/${service.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sort_order: index })
    });
    fetchServices();
  };

  const handleCreate = async () => {
    const usedKeys = services.map(s => s.key);
    const availableKey = serviceKeys.find(k => !usedKeys.includes(k.key));
    
    if (!availableKey) {
      setError('All service slots are filled');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: availableKey.key,
          icon_emoji: iconEmojis[availableKey.key],
          sort_order: services.length,
          title_fr: availableKey.label,
          title_ru: availableKey.label,
          title_en: availableKey.label,
          is_active: 1
        })
      });
      const data = await response.json();
      if (data.success) {
        setSuccess('Service created');
        fetchServices();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to create service');
      }
    } catch (err) {
      setError('Failed to create service');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const response = await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        setSuccess('Service deleted');
        fetchServices();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete service');
      }
    } catch (err) {
      setError('Failed to delete service');
    }
  };

  const updateField = (field: keyof Service, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const borderClass = isLight ? 'border-zinc-200' : 'border-zinc-700/50';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';
  const headerBgClass = isLight ? 'bg-white/95 border-gray-200' : 'bg-black/95 border-white/10';

  const adminNavItems = [
    { id: 'products', label: t('admin.sections.products.title'), icon: <Package className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', label: t('admin.sections.categories.title'), icon: <Tag className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', label: t('admin.sections.brands.title'), icon: <Award className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'services', label: 'SERVICES', icon: <Truck className="w-4 h-4" />, path: '/admin/services' },
    { id: 'translations', label: t('admin.sections.translations.title'), icon: <Globe className="w-4 h-4" />, path: '/admin/translations' },
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
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            {t('admin.backToSite')}
          </button>
          
          <nav className="hidden md:flex items-center gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  item.id === 'services'
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className={`font-black italic text-3xl uppercase tracking-tight ${textClass}`}>
                {t('admin.services.title')}
              </h1>
              <p className={`text-sm ${mutedClass}`}>
                {t('admin.services.manageServices')}
              </p>
            </div>
            <button
              onClick={handleCreate}
              disabled={services.length >= 4}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] text-black text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              Ajouter un service
            </button>
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

          <div className="space-y-4">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 border ${borderClass} rounded-xl ${isLight ? 'bg-white/80' : 'bg-zinc-900/80'}`}
              >
                {editingId === service.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`font-bold italic text-lg uppercase ${textClass}`}>
                        Éditer: {service.key}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCancel}
                          className={`p-2 border ${borderClass} rounded-lg hover:border-red-500 transition-colors`}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                        <button
                          onClick={() => handleSave(service.id)}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] text-black text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors disabled:opacity-50"
                        >
                          {isSaving ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Sauvegarder
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                          Clé
                        </label>
                        <select
                          value={formData.key || ''}
                          onChange={(e) => updateField('key', e.target.value)}
                          className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        >
                          {serviceKeys.map(k => (
                            <option key={k.key} value={k.key}>{k.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                          Emoji
                        </label>
                        <input
                          type="text"
                          value={formData.icon_emoji || ''}
                          onChange={(e) => updateField('icon_emoji', e.target.value)}
                          className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                          placeholder="🚚"
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                          Gradient (from)
                        </label>
                        <input
                          type="text"
                          value={formData.gradient_from || ''}
                          onChange={(e) => updateField('gradient_from', e.target.value)}
                          className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                          placeholder="from-orange-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                          Titre (FR)
                        </label>
                        <input
                          type="text"
                          value={formData.title_fr || ''}
                          onChange={(e) => updateField('title_fr', e.target.value)}
                          className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                          Sous-titre (FR)
                        </label>
                        <input
                          type="text"
                          value={formData.subtitle_fr || ''}
                          onChange={(e) => updateField('subtitle_fr', e.target.value)}
                          className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                          Tags (FR, virgule)
                        </label>
                        <input
                          type="text"
                          value={formData.tags_fr || ''}
                          onChange={(e) => updateField('tags_fr', e.target.value)}
                          className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                        Description (FR)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description_fr || ''}
                        onChange={(e) => updateField('description_fr', e.target.value)}
                        className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass} resize-none`}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{service.icon_emoji || '📋'}</span>
                        <div>
                          <h3 className={`font-bold italic text-xl uppercase ${textClass}`}>
                            {service.title_fr || service.key}
                          </h3>
                          <p className={`text-sm ${mutedClass}`}>
                            {service.subtitle_fr || 'Pas de sous-titre'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                          className={`p-2 border ${borderClass} rounded-lg hover:border-[#FF6B00] transition-colors ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <ArrowUp className={`w-4 h-4 ${mutedClass}`} />
                        </button>
                        <button
                          onClick={() => handleMoveDown(index)}
                          disabled={index === services.length - 1}
                          className={`p-2 border ${borderClass} rounded-lg hover:border-[#FF6B00] transition-colors ${index === services.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <ArrowDown className={`w-4 h-4 ${mutedClass}`} />
                        </button>
                        <button
                          onClick={() => handleEdit(service)}
                          className={`p-2 border ${borderClass} rounded-lg hover:border-[#FF6B00] transition-colors`}
                        >
                          <Edit className={`w-4 h-4 ${mutedClass}`} />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className={`p-2 border ${borderClass} rounded-lg hover:border-red-500 transition-colors`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-sm mt-3 ${mutedClass} line-clamp-2`}>
                      {service.description_fr || 'Pas de description'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {service.tags_fr?.split(',').map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-[#FF6B00]/10 text-[#FF6B00] rounded-full text-xs">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            ))}

            {services.length === 0 && (
              <div className={`text-center py-12 border ${borderClass} rounded-xl ${mutedClass}`}>
                <Truck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Aucun service disponible</p>
                <button
                  onClick={handleCreate}
                  className="mt-4 px-4 py-2 bg-[#FF6B00] text-black rounded-lg text-sm font-bold uppercase tracking-wide"
                >
{t('admin.services.addService')}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminServices;
