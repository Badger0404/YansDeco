import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Save, X, ChevronLeft, Wand2, RefreshCw, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroSlide {
  id?: number;
  badge_ru?: string;
  badge_fr?: string;
  badge_en?: string;
  title_ru: string;
  title_fr: string;
  title_en: string;
  subtitle_ru?: string;
  subtitle_fr?: string;
  subtitle_en?: string;
  sort_order?: number;
  is_active?: boolean;
}

interface CalculatorMaterial {
  id?: number;
  name_ru: string;
  name_fr: string;
  name_en: string;
  consumption: number;
  unit: string;
  coats: number;
  sort_order?: number;
  is_active?: boolean;
}

interface Slogan {
  id?: number;
  key?: string;
  title_ru: string;
  title_fr: string;
  title_en: string;
  content_ru: string;
  content_fr: string;
  content_en: string;
  image_url?: string;
  is_active?: boolean;
}

interface SiteConfig {
  phone1: string;
  phone2: string;
  email: string;
  address: string;
}

const AdminContent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'slides' | 'materials' | 'config' | 'slogans'>('slides');
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [materials, setMaterials] = useState<CalculatorMaterial[]>([]);
  const [slogans, setSlogans] = useState<Slogan[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    phone1: '',
    phone2: '',
    email: '',
    address: ''
  });
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<CalculatorMaterial | null>(null);
  const [editingSlogan, setEditingSlogan] = useState<Slogan | null>(null);
  const [showSloganModal, setShowSloganModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isLight] = useState(() => localStorage.getItem('site-theme') === 'light');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [slidesRes, materialsRes, configRes, slogansRes] = await Promise.all([
        fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/hero-slides'),
        fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/calculator-materials'),
        fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/site-config'),
        fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/slogans')
      ]);

      const slidesData = await slidesRes.json();
      const materialsData = await materialsRes.json();
      const configData = await configRes.json();
      const slogansData = await slogansRes.json();

      if (slidesData.success) setSlides(slidesData.data);
      if (materialsData.success) setMaterials(materialsData.data);
      if (slogansData.success) setSlogans(slogansData.data);
      if (configData.success) {
        const config = configData.data;
        setSiteConfig({
          phone1: config.phone1?.fr || '',
          phone2: config.phone2?.fr || '',
          email: config.email?.fr || '',
          address: config.address?.fr || ''
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSlide = async (slide: HeroSlide) => {
    try {
      const url = slide.id
        ? `https://yasndeco-api.andrey-gaffer.workers.dev/api/hero-slides/${slide.id}`
        : 'https://yasndeco-api.andrey-gaffer.workers.dev/api/hero-slides';

      const response = await fetch(url, {
        method: slide.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide)
      });

      if (response.ok) {
        setEditingSlide(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving slide:', error);
    }
  };

  const handleDeleteSlide = async (id: number) => {
    if (!confirm(t('admin.content.confirmDeleteSlide'))) return;

    try {
      const response = await fetch(`https://yasndeco-api.andrey-gaffer.workers.dev/api/hero-slides/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  const handleSaveMaterial = async (material: CalculatorMaterial) => {
    try {
      const url = material.id
        ? `https://yasndeco-api.andrey-gaffer.workers.dev/api/calculator-materials/${material.id}`
        : 'https://yasndeco-api.andrey-gaffer.workers.dev/api/calculator-materials';

      const response = await fetch(url, {
        method: material.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(material)
      });

      if (response.ok) {
        setEditingMaterial(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving material:', error);
    }
  };

  const handleDeleteMaterial = async (id: number) => {
    if (!confirm(t('admin.content.confirmDeleteMaterial'))) return;

    try {
      const response = await fetch(`https://yasndeco-api.andrey-gaffer.workers.dev/api/calculator-materials/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting material:', error);
    }
  };

  const handleSaveSlogan = async () => {
    if (!editingSlogan) return;
    try {
      const url = editingSlogan.id
        ? `https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/slogans/${editingSlogan.id}`
        : 'https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/slogans';

      const response = await fetch(url, {
        method: editingSlogan.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSlogan)
      });

      if (response.ok) {
        setShowSloganModal(false);
        setEditingSlogan(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error saving slogan:', error);
    }
  };

  const handleDeleteSlogan = async (id: number) => {
    if (!confirm(t('admin.content.confirmDeleteSlogan'))) return;

    try {
      const response = await fetch(`https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/slogans/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting slogan:', error);
    }
  };

  const handleToggleSloganVisibility = async (slogan: Slogan) => {
    try {
      await fetch(`https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/slogans/${slogan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !slogan.is_active })
      });
      fetchData();
    } catch (error) {
      console.error('Error toggling slogan visibility:', error);
    }
  };

  const handleTranslateSlogan = async () => {
    if (!editingSlogan) return;

    let sourceLang: 'fr' | 'en' | 'ru' | '' = '';
    if (editingSlogan.title_ru?.trim() || editingSlogan.content_ru?.trim()) sourceLang = 'ru';
    else if (editingSlogan.title_en?.trim() || editingSlogan.content_en?.trim()) sourceLang = 'en';
    else if (editingSlogan.title_fr?.trim() || editingSlogan.content_fr?.trim()) sourceLang = 'fr';

    if (!sourceLang) {
      alert(t('admin.translations.fillSourceField'));
      return;
    }

    const targetLangs = (['fr', 'en', 'ru'] as const).filter(l => l !== sourceLang);
    const fieldsToTranslate: Record<string, string> = {};
    if ((editingSlogan as any)[`title_${sourceLang}`]) fieldsToTranslate.title = (editingSlogan as any)[`title_${sourceLang}`];
    if ((editingSlogan as any)[`content_${sourceLang}`]) fieldsToTranslate.content = (editingSlogan as any)[`content_${sourceLang}`];

    setIsTranslating(true);
    try {
      const response = await fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: fieldsToTranslate,
          sourceLang,
          targetLangs
        })
      });

      const data = await response.json();
      if (data.success) {
        const updated = { ...editingSlogan };
        targetLangs.forEach(lang => {
          const translations = data.data[lang];
          if (translations) {
            if (translations.title) (updated as any)[`title_${lang}`] = translations.title;
            if (translations.content) (updated as any)[`content_${lang}`] = translations.content;
          }
        });
        setEditingSlogan(updated);
      }
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const response = await fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/site-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...siteConfig,
          type: 'text'
        })
      });

      if (response.ok) {
        alert(t('admin.content.configSaved'));
      }
    } catch (error) {
      console.error('Error saving config:', error);
    }
  };

  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const borderClass = isLight ? 'border-zinc-200' : 'border-zinc-700/50';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';
  const cardBgClass = isLight ? 'bg-white' : 'bg-zinc-900';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            {t('admin.content.backToDashboard')}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t('admin.content.title')}</h1>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'slides', label: t('admin.content.slidesHero') },
                { id: 'materials', label: t('admin.content.materialsCalculator') },
                { id: 'slogans', label: t('admin.content.slogans') },
                { id: 'config', label: t('admin.content.siteConfig') }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 font-medium whitespace-nowrap ${activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'slides' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-xl font-semibold">{t('admin.content.slidesHero')}</h2>
                  <button
                    onClick={() => setEditingSlide({ title_ru: '', title_fr: '', title_en: '', subtitle_ru: '', subtitle_fr: '', subtitle_en: '', is_active: true })}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('admin.content.addSlide')}
                  </button>
                </div>

                {editingSlide && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      {editingSlide.id ? t('admin.content.editSlide') : t('admin.content.newSlide')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.badge')} ({t('admin.content.languageFr')})</label>
                        <input
                          type="text"
                          value={editingSlide.badge_fr || ''}
                          onChange={(e) => setEditingSlide({ ...editingSlide, badge_fr: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.badge')} ({t('admin.content.languageEn')})</label>
                        <input
                          type="text"
                          value={editingSlide.badge_en || ''}
                          onChange={(e) => setEditingSlide({ ...editingSlide, badge_en: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.badge')} ({t('admin.content.languageRu')})</label>
                        <input
                          type="text"
                          value={editingSlide.badge_ru || ''}
                          onChange={(e) => setEditingSlide({ ...editingSlide, badge_ru: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.labelTitle')} ({t('admin.content.languageFr')})</label>
                        <input
                          type="text"
                          value={editingSlide.title_fr}
                          onChange={(e) => setEditingSlide({ ...editingSlide, title_fr: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.labelTitle')} ({t('admin.content.languageEn')})</label>
                        <input
                          type="text"
                          value={editingSlide.title_en}
                          onChange={(e) => setEditingSlide({ ...editingSlide, title_en: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.labelTitle')} ({t('admin.content.languageRu')})</label>
                        <input
                          type="text"
                          value={editingSlide.title_ru}
                          onChange={(e) => setEditingSlide({ ...editingSlide, title_ru: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">{t('admin.content.subtitle')} ({t('admin.content.languageFr')})</label>
                        <textarea
                          value={editingSlide.subtitle_fr || ''}
                          onChange={(e) => setEditingSlide({ ...editingSlide, subtitle_fr: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">{t('admin.content.subtitle')} ({t('admin.content.languageEn')})</label>
                        <textarea
                          value={editingSlide.subtitle_en || ''}
                          onChange={(e) => setEditingSlide({ ...editingSlide, subtitle_en: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">{t('admin.content.subtitle')} ({t('admin.content.languageRu')})</label>
                        <textarea
                          value={editingSlide.subtitle_ru || ''}
                          onChange={(e) => setEditingSlide({ ...editingSlide, subtitle_ru: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2">
                      <button
                        onClick={() => setEditingSlide(null)}
                        className="flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t('admin.content.cancel')}
                      </button>
                      <button
                        onClick={() => handleSaveSlide(editingSlide)}
                        className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {t('admin.content.save')}
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">{t('admin.content.badge')}</th>
                        <th className="text-left py-2">{t('admin.content.labelTitle')}</th>
                        <th className="text-left py-2">{t('admin.content.order')}</th>
                        <th className="text-left py-2">{t('admin.content.active')}</th>
                        <th className="text-left py-2">{t('admin.content.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slides.map((slide) => (
                        <tr key={slide.id} className="border-b">
                          <td className="py-2">{slide.badge_fr}</td>
                          <td className="py-2">{slide.title_fr}</td>
                          <td className="py-2">{slide.sort_order}</td>
                          <td className="py-2">{slide.is_active ? t('admin.content.yes') : t('admin.content.no')}</td>
                          <td className="py-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingSlide(slide)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSlide(slide.id!)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">{t('admin.content.materialsCalculator')}</h2>
                  <button
                    onClick={() => setEditingMaterial({ name_ru: '', name_fr: '', name_en: '', consumption: 0, unit: '', coats: 1, is_active: true })}
                    className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('admin.content.addMaterial')}
                  </button>
                </div>

                {editingMaterial && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-medium mb-4">
                      {editingMaterial.id ? t('admin.content.editMaterial') : t('admin.content.newMaterial')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.name')} ({t('admin.content.languageFr')})</label>
                        <input
                          type="text"
                          value={editingMaterial.name_fr}
                          onChange={(e) => setEditingMaterial({ ...editingMaterial, name_fr: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.name')} ({t('admin.content.languageEn')})</label>
                        <input
                          type="text"
                          value={editingMaterial.name_en}
                          onChange={(e) => setEditingMaterial({ ...editingMaterial, name_en: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.name')} ({t('admin.content.languageRu')})</label>
                        <input
                          type="text"
                          value={editingMaterial.name_ru}
                          onChange={(e) => setEditingMaterial({ ...editingMaterial, name_ru: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.consumption')}</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingMaterial.consumption}
                          onChange={(e) => setEditingMaterial({ ...editingMaterial, consumption: parseFloat(e.target.value) })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.unit')}</label>
                        <input
                          type="text"
                          value={editingMaterial.unit}
                          onChange={(e) => setEditingMaterial({ ...editingMaterial, unit: e.target.value })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.coats')}</label>
                        <input
                          type="number"
                          value={editingMaterial.coats}
                          onChange={(e) => setEditingMaterial({ ...editingMaterial, coats: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-end mt-4 gap-2">
                      <button
                        onClick={() => setEditingMaterial(null)}
                        className="flex items-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t('admin.content.cancel')}
                      </button>
                      <button
                        onClick={() => handleSaveMaterial(editingMaterial)}
                        className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {t('admin.content.save')}
                      </button>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">{t('admin.content.name')}</th>
                        <th className="text-left py-2">{t('admin.content.consumption')}</th>
                        <th className="text-left py-2">{t('admin.content.unit')}</th>
                        <th className="text-left py-2">{t('admin.content.coats')}</th>
                        <th className="text-left py-2">{t('admin.content.active')}</th>
                        <th className="text-left py-2">{t('admin.content.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map((material) => (
                        <tr key={material.id} className="border-b">
                          <td className="py-2">{material.name_fr}</td>
                          <td className="py-2">{material.consumption}</td>
                          <td className="py-2">{material.unit}</td>
                          <td className="py-2">{material.coats}</td>
                          <td className="py-2">{material.is_active ? t('admin.content.yes') : t('admin.content.no')}</td>
                          <td className="py-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingMaterial(material)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMaterial(material.id!)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'slogans' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">{t('admin.content.slogans')}</h2>
                    <p className={`text-xs ${mutedClass}`}>{t('admin.content.manageSlogans')}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingSlogan({ title_ru: '', title_fr: '', title_en: '', content_ru: '', content_fr: '', content_en: '', is_active: true });
                      setShowSloganModal(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF6B00] text-black text-xs sm:text-sm font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    {t('admin.content.addSlogan')}
                  </button>
                </div>

                {slogans.length === 0 ? (
                  <div className={`text-center py-12 sm:py-16 border ${borderClass} rounded-xl ${mutedClass}`}>
                    <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-base sm:text-lg mb-4">{t('admin.content.noSlogans')}</p>
                    <button
                      onClick={() => {
                        setEditingSlogan({ title_ru: '', title_fr: '', title_en: '', content_ru: '', content_fr: '', content_en: '', is_active: true });
                        setShowSloganModal(true);
                      }}
                      className="px-4 py-2.5 bg-[#FF6B00] text-black rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors"
                    >
                      {t('admin.content.addSlogan')}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {slogans.map((slogan, index) => (
                      <motion.div
                        key={slogan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`relative p-4 sm:p-6 border ${borderClass} rounded-xl ${cardBgClass} transition-all duration-300 ${!slogan.is_active ? 'opacity-50 grayscale' : ''
                          }`}
                      >
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center overflow-hidden">
                            {slogan.image_url ? (
                              <img src={slogan.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Sparkles className="w-6 h-6 text-[#FF6B00]" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleToggleSloganVisibility(slogan)}
                              className={`p-1.5 sm:p-2 border ${borderClass} rounded-lg transition-colors ${slogan.is_active
                                ? 'text-green-500 hover:bg-green-500/10'
                                : 'text-gray-400 hover:bg-gray-500/10'
                                }`}
                              title={slogan.is_active ? t('admin.services.hide') : t('admin.services.show')}
                            >
                              {slogan.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => {
                                setEditingSlogan(slogan);
                                setShowSloganModal(true);
                              }}
                              className={`p-1.5 sm:p-2 border ${borderClass} rounded-lg hover:border-[#FF6B00] transition-colors`}
                              title={t('admin.services.edit')}
                            >
                              <Edit2 className={`w-4 h-4 ${mutedClass}`} />
                            </button>
                            <button
                              onClick={() => handleDeleteSlogan(slogan.id!)}
                              className={`p-1.5 sm:p-2 border ${borderClass} rounded-lg hover:border-red-500 transition-colors`}
                              title={t('admin.services.delete')}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        <h3 className={`font-bold italic text-lg sm:text-xl uppercase tracking-tight mb-1 ${textClass}`}>
                          {(slogan as any)[`title_${i18n.language}`] || slogan.title_fr || '—'}
                        </h3>
                        <p className={`text-xs sm:text-sm ${mutedClass} line-clamp-2 mb-3 sm:mb-4`}>
                          {(slogan as any)[`content_${i18n.language}`] || slogan.content_fr || '—'}
                        </p>

                        <div className={`mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${borderClass} flex items-center justify-between text-[10px] sm:text-xs ${mutedClass}`}>
                          <span>Key: {slogan.key || '-'}</span>
                          <span>ID: {slogan.id}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'config' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">{t('admin.content.siteConfig')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('admin.phone1')}</label>
                    <input
                      type="text"
                      value={siteConfig.phone1}
                      onChange={(e) => setSiteConfig({ ...siteConfig, phone1: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('admin.phone2')}</label>
                    <input
                      type="text"
                      value={siteConfig.phone2}
                      onChange={(e) => setSiteConfig({ ...siteConfig, phone2: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('admin.email')}</label>
                    <input
                      type="email"
                      value={siteConfig.email}
                      onChange={(e) => setSiteConfig({ ...siteConfig, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('admin.address')}</label>
                    <input
                      type="text"
                      value={siteConfig.address}
                      onChange={(e) => setSiteConfig({ ...siteConfig, address: e.target.value })}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button
                    onClick={handleSaveConfig}
                    className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {t('admin.content.saveConfig')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSloganModal && editingSlogan && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setShowSloganModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] z-[70] ${cardBgClass} rounded-2xl shadow-2xl overflow-hidden flex flex-col`}
            >
              <div className={`p-4 sm:p-6 border-b ${borderClass} flex items-center justify-between`}>
                <h2 className={`font-bold italic text-lg sm:text-xl uppercase tracking-wide ${textClass}`}>
                  {editingSlogan.id ? t('admin.content.editSlogan') : t('admin.content.newSlogan')}
                </h2>
                <button
                  onClick={() => setShowSloganModal(false)}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`}
                >
                  <X className={`w-5 h-5 ${textClass}`} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className={`block text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-1.5 sm:mb-2 ${mutedClass}`}>
                      Key
                    </label>
                    <input
                      type="text"
                      value={editingSlogan.key || ''}
                      onChange={(e) => setEditingSlogan({ ...editingSlogan, key: e.target.value })}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border ${borderClass} rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      placeholder="slogan_key"
                    />
                  </div>
                  <div>
                    <label className={`block text-[10px] sm:text-xs font-bold uppercase tracking-wide mb-1.5 sm:mb-2 ${mutedClass}`}>
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={editingSlogan.image_url || ''}
                      onChange={(e) => setEditingSlogan({ ...editingSlogan, image_url: e.target.value })}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border ${borderClass} rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      placeholder="https://..."
                    />
                  </div>
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
                          {t('admin.content.labelTitle')}
                        </label>
                        <input
                          type="text"
                          value={(editingSlogan as any)[`title_${lang}`]}
                          onChange={(e) => setEditingSlogan({ ...editingSlogan, [`title_${lang}`]: e.target.value })}
                          className={`w-full px-3 py-2 border ${borderClass} rounded-lg text-xs focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        />
                      </div>
                      <div>
                        <label className={`block text-[10px] font-bold uppercase tracking-wide mb-1 ${mutedClass}`}>
                          {t('admin.content.content')}
                        </label>
                        <textarea
                          rows={2}
                          value={(editingSlogan as any)[`content_${lang}`]}
                          onChange={(e) => setEditingSlogan({ ...editingSlogan, [`content_${lang}`]: e.target.value })}
                          className={`w-full px-3 py-2 border ${borderClass} rounded-lg text-xs focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass} resize-none`}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingSlogan.is_active}
                      onChange={(e) => setEditingSlogan({ ...editingSlogan, is_active: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <span className={`text-xs sm:text-sm ${textClass}`}>
                      {t('admin.content.active')}
                    </span>
                  </label>

                  <button
                    onClick={handleTranslateSlogan}
                    disabled={isTranslating}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs sm:text-sm font-bold uppercase tracking-wide rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
                  >
                    {isTranslating ? (
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
                  onClick={() => setShowSloganModal(false)}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wide border ${borderClass} rounded-lg transition-colors ${textClass}`}
                >
                  {t('admin.content.cancel')}
                </button>
                <button
                  onClick={handleSaveSlogan}
                  className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#FF6B00] text-black text-xs sm:text-sm font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {t('admin.content.save')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminContent;