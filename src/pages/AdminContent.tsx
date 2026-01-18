import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, Save, X, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface SiteConfig {
  phone1: string;
  phone2: string;
  email: string;
  address: string;
}

const AdminContent: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'slides' | 'materials' | 'config'>('slides');
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [materials, setMaterials] = useState<CalculatorMaterial[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    phone1: '',
    phone2: '',
    email: '',
    address: ''
  });
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<CalculatorMaterial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [slidesRes, materialsRes, configRes] = await Promise.all([
        fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/hero-slides'),
        fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/admin/calculator-materials'),
        fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/site-config')
      ]);

      const slidesData = await slidesRes.json();
      const materialsData = await materialsRes.json();
      const configData = await configRes.json();

      if (slidesData.success) setSlides(slidesData.data);
      if (materialsData.success) setMaterials(materialsData.data);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">{t('admin.content.loading')}</div>
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
            <nav className="flex">
              {[
                { id: 'slides', label: t('admin.content.slidesHero') },
                { id: 'materials', label: t('admin.content.materialsCalculator') },
                { id: 'config', label: t('admin.content.siteConfig') }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 font-medium ${
                    activeTab === tab.id
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
                <div className="flex justify-between items-center mb-6">
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
                        <label className="block text-sm font-medium mb-1">{t('admin.content.badge')} (FR)</label>
                        <input
                          type="text"
                          value={editingSlide.badge_fr || ''}
                          onChange={(e) => setEditingSlide({...editingSlide, badge_fr: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.badge')} (EN)</label>
                        <input
                          type="text"
                          value={editingSlide.badge_en || ''}
                          onChange={(e) => setEditingSlide({...editingSlide, badge_en: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.badge')} (RU)</label>
                        <input
                          type="text"
                          value={editingSlide.badge_ru || ''}
                          onChange={(e) => setEditingSlide({...editingSlide, badge_ru: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.title')} (FR)</label>
                        <input
                          type="text"
                          value={editingSlide.title_fr}
                          onChange={(e) => setEditingSlide({...editingSlide, title_fr: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.title')} (EN)</label>
                        <input
                          type="text"
                          value={editingSlide.title_en}
                          onChange={(e) => setEditingSlide({...editingSlide, title_en: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.title')} (RU)</label>
                        <input
                          type="text"
                          value={editingSlide.title_ru}
                          onChange={(e) => setEditingSlide({...editingSlide, title_ru: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">{t('admin.content.subtitle')} (FR)</label>
                        <textarea
                          value={editingSlide.subtitle_fr || ''}
                          onChange={(e) => setEditingSlide({...editingSlide, subtitle_fr: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">{t('admin.content.subtitle')} (EN)</label>
                        <textarea
                          value={editingSlide.subtitle_en || ''}
                          onChange={(e) => setEditingSlide({...editingSlide, subtitle_en: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">{t('admin.content.subtitle')} (RU)</label>
                        <textarea
                          value={editingSlide.subtitle_ru || ''}
                          onChange={(e) => setEditingSlide({...editingSlide, subtitle_ru: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
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
                        <th className="text-left py-2">{t('admin.content.title')}</th>
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
                        <label className="block text-sm font-medium mb-1">{t('admin.content.name')} (FR)</label>
                        <input
                          type="text"
                          value={editingMaterial.name_fr}
                          onChange={(e) => setEditingMaterial({...editingMaterial, name_fr: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.name')} (EN)</label>
                        <input
                          type="text"
                          value={editingMaterial.name_en}
                          onChange={(e) => setEditingMaterial({...editingMaterial, name_en: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.name')} (RU)</label>
                        <input
                          type="text"
                          value={editingMaterial.name_ru}
                          onChange={(e) => setEditingMaterial({...editingMaterial, name_ru: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.consumption')}</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingMaterial.consumption}
                          onChange={(e) => setEditingMaterial({...editingMaterial, consumption: parseFloat(e.target.value)})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.unit')}</label>
                        <input
                          type="text"
                          value={editingMaterial.unit}
                          onChange={(e) => setEditingMaterial({...editingMaterial, unit: e.target.value})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{t('admin.content.coats')}</label>
                        <input
                          type="number"
                          value={editingMaterial.coats}
                          onChange={(e) => setEditingMaterial({...editingMaterial, coats: parseInt(e.target.value)})}
                          className="w-full px-3 py-2 border rounded"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-4 gap-2">
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

            {activeTab === 'config' && (
              <div>
                <h2 className="text-xl font-semibold mb-6">{t('admin.content.siteConfig')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('admin.phone1')}</label>
                    <input
                      type="text"
                      value={siteConfig.phone1}
                      onChange={(e) => setSiteConfig({...siteConfig, phone1: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('admin.phone2')}</label>
                    <input
                      type="text"
                      value={siteConfig.phone2}
                      onChange={(e) => setSiteConfig({...siteConfig, phone2: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('admin.email')}</label>
                    <input
                      type="email"
                      value={siteConfig.email}
                      onChange={(e) => setSiteConfig({...siteConfig, email: e.target.value})}
                      className="w-full px-3 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t('admin.address')}</label>
                    <input
                      type="text"
                      value={siteConfig.address}
                      onChange={(e) => setSiteConfig({...siteConfig, address: e.target.value})}
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
    </div>
  );
};

export default AdminContent;