import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Upload,
  RefreshCw,
  X,
  Check,
  Sparkles,
  Camera
} from 'lucide-react';

interface Brand {
  id: number;
  name: string;
  logo_url: string | null;
  description_ru: string | null;
  description_fr: string | null;
  description_en: string | null;
}

const AdminBrands: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

  const [brands, setBrands] = useState<Brand[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [translations, setTranslations] = useState({
    ru: { description: '' },
    fr: { description: '' },
    en: { description: '' }
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [translatingField, setTranslatingField] = useState<string | null>(null);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);
  
  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch(`${API_URL}/brands`);
      const data = await response.json();
      if (data.success) {
        setBrands(data.data);
      }
    } catch (err) {
      console.error('Failed to load brands:', err);
      setError('Failed to load brands');
    }
  };

  const handleAddBrand = () => {
    setEditingBrand(null);
    setBrandName('');
    setLogoUrl('');
    setLogoPreview('');
    setTranslations({ ru: { description: '' }, fr: { description: '' }, en: { description: '' } });
    setShowModal(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setBrandName(brand.name);
    setLogoUrl(brand.logo_url || '');
    setLogoPreview(brand.logo_url || '');
    setTranslations({
      ru: { description: brand.description_ru || '' },
      fr: { description: brand.description_fr || '' },
      en: { description: brand.description_en || '' }
    });
    setShowModal(true);
  };

  const handleDeleteBrand = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette marque?')) return;
    
    setDeleting(id);
    try {
      const response = await fetch(`${API_URL}/brands/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setBrands(brands.filter(b => b.id !== id));
        setSuccess('Marque supprimée avec succès');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete brand');
      }
    } catch (err) {
      setError('Failed to delete brand');
    } finally {
      setDeleting(null);
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
    formData.append('folder', 'brands');

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLogoUrl(data.data.url);
        setLogoPreview(data.data.url);
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleTranslateDescription = async (sourceLang: string) => {
    const sourceText = translations[sourceLang as keyof typeof translations].description;
    
    if (!sourceText.trim() || sourceText.length < 3) {
      return;
    }

    setTranslatingField(sourceLang);
    setError('');

    const targetLangs = ['ru', 'fr', 'en'].filter(lang => lang !== sourceLang);

    try {
      const response = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: { description: sourceText },
          sourceLang,
          targetLangs: targetLangs
        })
      });

      const data = await response.json();

      if (data.success) {
        setTranslations(prev => {
          const newTranslations = { ...prev };
          targetLangs.forEach(targetLang => {
            if (data.data[targetLang] && !newTranslations[targetLang as keyof typeof prev].description?.trim()) {
              newTranslations[targetLang as keyof typeof prev] = {
                ...newTranslations[targetLang as keyof typeof prev],
                description: data.data[targetLang].description || ''
              };
            }
          });
          return newTranslations;
        });
        setSuccess('Traduction effectuée avec succès');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to translate');
      }
    } catch (err) {
      setError('Failed to translate');
    } finally {
      setTranslatingField(null);
    }
  };

  const handleSaveBrand = async () => {
    if (!brandName.trim()) {
      setError('Le nom de la marque est requis');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const response = await fetch(
        editingBrand ? `${API_URL}/brands/${editingBrand.id}` : `${API_URL}/brands`,
        {
          method: editingBrand ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: brandName,
            logo_url: logoUrl || null,
            description_ru: translations.ru.description,
            description_fr: translations.fr.description,
            description_en: translations.en.description
          })
        }
      );

      const data = await response.json();
      if (data.success) {
        if (editingBrand) {
          setBrands(brands.map(b => b.id === editingBrand.id ? data.data : b));
        } else {
          setBrands([...brands, data.data]);
        }
        setShowModal(false);
        setSuccess(editingBrand ? 'Marque mise à jour' : 'Marque créée avec succès');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save brand');
      }
    } catch (err) {
      setError('Failed to save brand');
    } finally {
      setSaving(false);
    }
  };

  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className={`font-black italic text-2xl md:text-3xl uppercase tracking-tight ${textClass}`}>
                {t('admin.brands.title')}
              </h1>
              <p className={`text-xs ${mutedClass} mt-1`}>
                {t('admin.sections.brands.description')}
              </p>
            </div>

            <button 
              onClick={handleAddBrand}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FF6B00] text-black rounded-lg hover:bg-[#FF8533] transition-colors"
            >
              <Plus className="w-3 h-3" />
              {t('admin.brands.addNew')}
            </button>
          </div>

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

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedClass}`} />
              <input
                type="text"
                placeholder={t('admin.brands.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-transparent border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} placeholder-${mutedClass}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {filteredBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="relative group"
              >
                <div 
                  className="relative aspect-square flex items-center justify-center cursor-pointer"
                  onClick={() => navigate(`/admin/brands/${brand.id}`)}
                >
                  {brand.logo_url ? (
                    <img 
                      src={brand.logo_url} 
                      alt={brand.name}
                      className="w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-110 filter drop-shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className={`text-6xl font-black italic ${textClass} opacity-50 group-hover:opacity-100 transition-opacity`}>
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-center mt-4">
                  <h3 className={`font-bold italic text-lg uppercase tracking-wide ${textClass} group-hover:text-[#FF6B00] transition-colors`}>
                    {brand.name}
                  </h3>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditBrand(brand);
                    }}
                    className={`p-2 bg-[#FF6B00] rounded-lg text-black hover:bg-[#FF8533] transition-colors shadow-lg`}
                    title={t('admin.brands.edit')}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteBrand(brand.id, e)}
                    disabled={deleting === brand.id}
                    className={`p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50`}
                    title={t('admin.brands.delete')}
                  >
                    {deleting === brand.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-2xl p-6 border ${borderClass} rounded-xl ${isLight ? 'bg-white' : 'bg-zinc-900'} my-8`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold italic text-xl uppercase tracking-wide ${textClass}`}>
                  {editingBrand ? t('admin.brands.edit') : t('admin.brands.addNew')}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-1 hover:bg-white/10 rounded-lg transition-colors ${mutedClass}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    {t('admin.brands.name')} *
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                    placeholder="Nom de la marque"
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                    {t('admin.brands.brandLogo')}
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                      isDragging 
                        ? 'border-[#FF6B00] bg-[#FF6B00]/10' 
                        : `${borderClass} ${isLight ? 'bg-gray-50' : 'bg-black/30'}`
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="w-6 h-6 text-[#FF6B00] animate-spin" />
                        <p className={`text-sm ${mutedClass}`}>Chargement...</p>
                      </div>
                    ) : logoPreview ? (
                      <div className="relative inline-block">
                        <img src={logoPreview} alt="Logo" className="max-h-32 mx-auto rounded-lg" />
                        <button
                          onClick={async () => {
                            if (confirm('Êtes-vous sûr de vouloir supprimer ce logo?')) {
                              if (editingBrand) {
                                try {
                                  await fetch(`${API_URL}/brands/${editingBrand.id}/logo`, { method: 'DELETE' });
                                  setLogoUrl('');
                                  setLogoPreview('');
                                } catch (err) {
                                  setError('Failed to delete logo');
                                }
                              } else {
                                setLogoUrl('');
                                setLogoPreview('');
                              }
                            }
                          }}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                          title="Supprimer le logo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className={`w-8 h-8 mx-auto mb-2 ${mutedClass}`} />
                        <p className={`text-sm mb-2 ${mutedClass}`}>
                          {t('admin.brands.dragDropFile')}
                        </p>
                        <p className={`text-xs ${mutedClass} opacity-70 mb-2`}>
                          {t('admin.brands.fileInfo')}
                        </p>
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6B00] text-black text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors cursor-pointer">
                          <Camera className="w-4 h-4" />
                          {t('admin.brands.chooseFile')}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase tracking-wide mb-3 ${mutedClass}`}>
                    {t('admin.brands.multilingualDescription')}
                  </label>
                  <p className={`text-xs ${mutedClass} mb-4`}>
                    {t('admin.brands.translateHint')}
                  </p>

                  {['ru', 'fr', 'en'].map((lang) => (
                    <div key={lang} className="mb-4">
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
                            setFocusedField(lang);
                          }}
                          onFocus={() => setFocusedField(lang)}
                          onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                          className={`w-full px-4 py-2.5 pr-14 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass} resize-none`}
                          placeholder={lang === 'ru' ? 'Описание бренда...' : lang === 'fr' ? 'Description de la marque...' : 'Brand description...'}
                        />
                        <AnimatePresence>
                          {focusedField === lang && translations[lang as keyof typeof translations].description.length >= 3 && (
                            <motion.button
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              onClick={() => handleTranslateDescription(lang)}
                              disabled={translatingField !== null}
                              className="absolute right-2 top-2 p-1.5 bg-[#FF6B00]/20 hover:bg-[#FF6B00]/40 rounded-lg transition-colors group"
                              title="AI Translate"
                            >
                              {translatingField === lang ? (
                                <RefreshCw className="w-4 h-4 text-[#FF6B00] animate-spin" />
                              ) : (
                                <Sparkles className="w-4 h-4 text-[#FF6B00] group-hover:scale-110 transition-transform" />
                              )}
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-6 mt-4 border-t border-gray-200 dark:border-white/10">
                <button
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-2.5 border ${borderClass} rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${textClass} hover:border-[#FF6B00]`}
                >
                  {t('admin.cancel')}
                </button>
                <button
                  onClick={handleSaveBrand}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#FF6B00] text-black rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {t('admin.saving')}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {t('admin.save')}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBrands;
