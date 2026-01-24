import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  RefreshCw,
  Zap,
  ChevronDown
} from 'lucide-react';

interface Subcategory {
  id: number;
  name: string;
  name_ru: string;
  name_fr: string;
  name_en: string;
  slug: string;
  icon: string | null;
  image_url: string | null;
  parent_id: number | null;
  sort_order: number;
  desc_ru: string | null;
  desc_fr: string | null;
  desc_en: string | null;
  hide_name: boolean;
  bg_light_color: string | null;
  bg_light_opacity: number | null;
  bg_light_enabled: boolean;
  bg_dark_color: string | null;
  bg_dark_opacity: number | null;
  bg_dark_enabled: boolean;
  border_light_enabled: boolean;
  border_light_color: string | null;
  border_light_opacity: number | null;
  border_dark_enabled: boolean;
  border_dark_color: string | null;
  border_dark_opacity: number | null;
  glow_light_enabled: boolean;
  glow_light_color: string | null;
  glow_light_opacity: number | null;
  glow_light_blur: number | null;
  glow_dark_enabled: boolean;
  glow_dark_color: string | null;
  glow_dark_opacity: number | null;
  glow_dark_blur: number | null;
}

interface AdminSettingsSubcategoriesCustomizationProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSettingsSubcategoriesCustomization: React.FC<AdminSettingsSubcategoriesCustomizationProps> = ({
  isOpen,
  onClose
}) => {
  const [isLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Visual settings states
  const [hideName, setHideName] = useState(false);
  const [bgLightEnabled, setBgLightEnabled] = useState(false);
  const [bgLightColor, setBgLightColor] = useState('#FF6B00');
  const [bgLightOpacity, setBgLightOpacity] = useState(50);
  const [bgDarkEnabled, setBgDarkEnabled] = useState(false);
  const [bgDarkColor, setBgDarkColor] = useState('#FF6B00');
  const [bgDarkOpacity, setBgDarkOpacity] = useState(50);
  const [borderLightEnabled, setBorderLightEnabled] = useState(false);
  const [borderLightColor, setBorderLightColor] = useState('#FF6B00');
  const [borderLightOpacity, setBorderLightOpacity] = useState(100);
  const [borderDarkEnabled, setBorderDarkEnabled] = useState(false);
  const [borderDarkColor, setBorderDarkColor] = useState('#FF6B00');
  const [borderDarkOpacity, setBorderDarkOpacity] = useState(100);
  const [glowLightEnabled, setGlowLightEnabled] = useState(false);
  const [glowLightColor, setGlowLightColor] = useState('#FF6B00');
  const [glowLightOpacity, setGlowLightOpacity] = useState(50);
  const [glowLightBlur, setGlowLightBlur] = useState(20);
  const [glowDarkEnabled, setGlowDarkEnabled] = useState(false);
  const [glowDarkColor, setGlowDarkColor] = useState('#FF6B00');
  const [glowDarkOpacity, setGlowDarkOpacity] = useState(50);
  const [glowDarkBlur, setGlowDarkBlur] = useState(20);

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';

  useEffect(() => {
    if (isOpen) {
      fetchSubcategories();
    }
  }, [isOpen]);

  const fetchSubcategories = async () => {
    setLoading(true);
    setError('');
    try {
      // Get all categories first to find root categories
      const allCategoriesResponse = await fetch(`${API_URL}/categories`);
      const allCategoriesData = await allCategoriesResponse.json();
      
      if (allCategoriesData.success) {
        // Filter only subcategories (parent_id IS NOT NULL)
        const subcategoriesData = allCategoriesData.data.filter((cat: any) => cat.parent_id !== null);
        setSubcategories(subcategoriesData);
        
        if (subcategoriesData.length > 0) {
          setSelectedSubcategory(subcategoriesData[0]);
          loadSubcategorySettings(subcategoriesData[0]);
        }
      } else {
        setError(allCategoriesData.error || 'Failed to load subcategories');
      }
    } catch (err) {
      setError('Failed to load subcategories');
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategorySettings = (subcategory: Subcategory) => {
    setHideName(subcategory.hide_name || false);
    setBgLightEnabled(subcategory.bg_light_enabled || false);
    setBgLightColor(subcategory.bg_light_color || '#FF6B00');
    setBgLightOpacity(subcategory.bg_light_opacity || 50);
    setBgDarkEnabled(subcategory.bg_dark_enabled || false);
    setBgDarkColor(subcategory.bg_dark_color || '#FF6B00');
    setBgDarkOpacity(subcategory.bg_dark_opacity || 50);
    setBorderLightEnabled(subcategory.border_light_enabled || false);
    setBorderLightColor(subcategory.border_light_color || '#FF6B00');
    setBorderLightOpacity(subcategory.border_light_opacity || 100);
    setBorderDarkEnabled(subcategory.border_dark_enabled || false);
    setBorderDarkColor(subcategory.border_dark_color || '#FF6B00');
    setBorderDarkOpacity(subcategory.border_dark_opacity || 100);
    setGlowLightEnabled(subcategory.glow_light_enabled || false);
    setGlowLightColor(subcategory.glow_light_color || '#FF6B00');
    setGlowLightOpacity(subcategory.glow_light_opacity || 50);
    setGlowLightBlur(subcategory.glow_light_blur || 20);
    setGlowDarkEnabled(subcategory.glow_dark_enabled || false);
    setGlowDarkColor(subcategory.glow_dark_color || '#FF6B00');
    setGlowDarkOpacity(subcategory.glow_dark_opacity || 50);
    setGlowDarkBlur(subcategory.glow_dark_blur || 20);
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setSelectedSubcategory(subcategory);
    loadSubcategorySettings(subcategory);
    setShowDropdown(false);
  };

  const handleSaveSettings = async () => {
    if (!selectedSubcategory) return;

    console.log('Selected subcategory data:', selectedSubcategory);
    console.log('Visual settings:', {
      hideName, bgLightEnabled, bgLightColor, bgLightOpacity,
      bgDarkEnabled, bgDarkColor, bgDarkOpacity,
      borderLightEnabled, borderLightColor, borderLightOpacity,
      borderDarkEnabled, borderDarkColor, borderDarkOpacity,
      glowLightEnabled, glowLightColor, glowLightOpacity, glowLightBlur,
      glowDarkEnabled, glowDarkColor, glowDarkOpacity, glowDarkBlur
    });

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const requestBody = {
        slug: selectedSubcategory.slug || '',
        icon: selectedSubcategory.icon || null,
        image_url: selectedSubcategory.image_url || null,
        parent_id: selectedSubcategory.parent_id || null,
        sort_order: selectedSubcategory.sort_order || 0,
        name: selectedSubcategory.name_ru || selectedSubcategory.name || '',
        name_ru: selectedSubcategory.name_ru || '',
        name_fr: selectedSubcategory.name_fr || '',
        name_en: selectedSubcategory.name_en || '',
        desc_ru: selectedSubcategory.desc_ru || null,
        desc_fr: selectedSubcategory.desc_fr || null,
        desc_en: selectedSubcategory.desc_en || null,
        icon_url: selectedSubcategory.icon || null,
        hide_name: hideName || false,
        bg_light_color: bgLightEnabled ? bgLightColor : null,
        bg_light_opacity: bgLightEnabled ? bgLightOpacity : null,
        bg_light_enabled: bgLightEnabled || false,
        bg_dark_color: bgDarkEnabled ? bgDarkColor : null,
        bg_dark_opacity: bgDarkEnabled ? bgDarkOpacity : null,
        bg_dark_enabled: bgDarkEnabled || false,
        border_light_enabled: borderLightEnabled || false,
        border_light_color: borderLightEnabled ? borderLightColor : null,
        border_light_opacity: borderLightEnabled ? borderLightOpacity : null,
        border_dark_enabled: borderDarkEnabled || false,
        border_dark_color: borderDarkEnabled ? borderDarkColor : null,
        border_dark_opacity: borderDarkEnabled ? borderDarkOpacity : null,
        glow_light_enabled: glowLightEnabled || false,
        glow_light_color: glowLightEnabled ? glowLightColor : null,
        glow_light_opacity: glowLightEnabled ? glowLightOpacity : null,
        glow_light_blur: glowLightEnabled ? glowLightBlur : null,
        glow_dark_enabled: glowDarkEnabled || false,
        glow_dark_color: glowDarkEnabled ? glowDarkColor : null,
        glow_dark_opacity: glowDarkEnabled ? glowDarkOpacity : null,
        glow_dark_blur: glowDarkEnabled ? glowDarkBlur : null
      };
      
      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${API_URL}/categories/${selectedSubcategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('API Response:', response.status, data);
      
      if (data.success) {
        setSuccess('Настройки подкаталога успешно сохранены');
        setTimeout(() => setSuccess(''), 3000);
        
        // Update subcategory in list
        setSubcategories(subcategories.map(sub => 
          sub.id === selectedSubcategory.id ? data.data : sub
        ));
        setSelectedSubcategory(data.data);
        
        // Refresh subcategories list to include any new subcategories
        fetchSubcategories();
      } else {
        setError(data.error || 'Failed to save subcategory settings');
      }
    } catch (err) {
      setError('Failed to save subcategory settings');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`relative w-full max-w-5xl p-6 border ${borderClass} rounded-xl ${isLight ? 'bg-white' : 'bg-zinc-900'} my-8`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold italic text-xl uppercase tracking-wide ${textClass}`}>
            Кастомизация плиток подкаталогов
          </h3>
          <button
            onClick={onClose}
            className={`p-1 hover:bg-white/10 rounded-lg transition-colors ${mutedClass}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subcategory Selector Dropdown */}
        <div className="mb-6">
          <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
            Выберите подкаталог
          </label>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full px-4 py-3 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass} flex items-center justify-between`}
            >
              <span>
                {selectedSubcategory 
                  ? selectedSubcategory.name_ru || selectedSubcategory.name 
                  : 'Выберите подкаталог...'
                }
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''} ${mutedClass}`} />
            </button>
            
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute top-full left-0 right-0 mt-1 border ${borderClass} rounded-lg ${isLight ? 'bg-white' : 'bg-zinc-900'} shadow-lg max-h-60 overflow-y-auto z-10`}
                >
                  {subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategorySelect(subcategory)}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-[#FF6B00]/10 transition-colors ${textClass} ${selectedSubcategory?.id === subcategory.id ? 'bg-[#FF6B00]/20' : ''}`}
                    >
                      {subcategory.name_ru || subcategory.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500 text-sm flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {success}
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-sm"
          >
            {error}
          </motion.div>
        )}

        {selectedSubcategory && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="hideName"
                checked={hideName}
                onChange={(e) => setHideName(e.target.checked)}
                className="w-4 h-4 rounded border-[#FF6B00] text-[#FF6B00] focus:ring-[#FF6B00]"
              />
              <label htmlFor="hideName" className={`text-sm ${textClass}`}>
                Не показывать название на плитке (иконка будет "парить")
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Light Theme Settings */}
              <div className="space-y-4">
                <h4 className={`font-bold text-sm uppercase tracking-wide ${textClass}`}>Светлая тема</h4>
                
                <div className="p-4 border border-dashed border-[#FF6B00]/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="bgLightEnabled"
                      checked={bgLightEnabled}
                      onChange={(e) => setBgLightEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-[#FF6B00] text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <label htmlFor="bgLightEnabled" className={`text-sm ${textClass}`}>
                      Заливка фона
                    </label>
                  </div>
                  {bgLightEnabled && (
                    <div className="flex flex-col gap-3 ml-6">
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Цвет:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={bgLightColor}
                            onChange={(e) => setBgLightColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-zinc-600"
                          />
                          <input
                            type="text"
                            value={bgLightColor}
                            onChange={(e) => setBgLightColor(e.target.value)}
                            className={`w-20 px-2 py-1 text-xs border ${borderClass} rounded ${textClass} ${inputBgClass}`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Прозрачность:</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={bgLightOpacity}
                          onChange={(e) => setBgLightOpacity(Number(e.target.value))}
                          className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className={`text-xs w-10 ${textClass}`}>{bgLightOpacity}%</span>
                      </div>
                      <div
                        className="h-8 rounded border border-zinc-600"
                        style={{ backgroundColor: `${bgLightColor}${Math.round(bgLightOpacity * 2.55).toString(16).padStart(2, '0')}` }}
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 border border-dashed border-[#FF6B00]/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="borderLightEnabled"
                      checked={borderLightEnabled}
                      onChange={(e) => setBorderLightEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-[#FF6B00] text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <label htmlFor="borderLightEnabled" className={`text-sm ${textClass}`}>
                      Рамка
                    </label>
                  </div>
                  {borderLightEnabled && (
                    <div className="flex flex-col gap-3 ml-6">
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Цвет:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={borderLightColor}
                            onChange={(e) => setBorderLightColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-zinc-600"
                          />
                          <input
                            type="text"
                            value={borderLightColor}
                            onChange={(e) => setBorderLightColor(e.target.value)}
                            className={`w-20 px-2 py-1 text-xs border ${borderClass} rounded ${textClass} ${inputBgClass}`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Прозрачность:</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={borderLightOpacity}
                          onChange={(e) => setBorderLightOpacity(Number(e.target.value))}
                          className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className={`text-xs w-10 ${textClass}`}>{borderLightOpacity}%</span>
                      </div>
                      <div
                        className="w-full h-8 rounded border-2"
                        style={{ borderColor: `${borderLightColor}${Math.round(borderLightOpacity * 2.55).toString(16).padStart(2, '0')}` }}
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 border border-dashed border-[#FF6B00]/30 rounded-lg bg-[#FF6B00]/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-[#FF6B00]" />
                    <h5 className={`font-bold text-sm uppercase tracking-wide ${textClass}`}>Свечение при наведении - Светлая тема</h5>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="glowLightEnabled"
                      checked={glowLightEnabled}
                      onChange={(e) => setGlowLightEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-[#FF6B00] text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <label htmlFor="glowLightEnabled" className={`text-sm ${textClass}`}>
                      Включить свечение
                    </label>
                  </div>
                  {glowLightEnabled && (
                    <div className="flex flex-col gap-3 ml-6">
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Цвет:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={glowLightColor}
                            onChange={(e) => setGlowLightColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-zinc-600"
                          />
                          <input
                            type="text"
                            value={glowLightColor}
                            onChange={(e) => setGlowLightColor(e.target.value)}
                            className={`w-20 px-2 py-1 text-xs border ${borderClass} rounded ${textClass} ${inputBgClass}`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Прозрачность:</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={glowLightOpacity}
                          onChange={(e) => setGlowLightOpacity(Number(e.target.value))}
                          className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className={`text-xs w-10 ${textClass}`}>{glowLightOpacity}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Размытие:</label>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          value={glowLightBlur}
                          onChange={(e) => setGlowLightBlur(Number(e.target.value))}
                          className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className={`text-xs w-10 ${textClass}`}>{glowLightBlur}px</span>
                      </div>
                      <div
                        className="h-8 rounded border border-zinc-600"
                        style={{
                          boxShadow: `0 0 ${glowLightBlur}px ${glowLightColor}${Math.round(glowLightOpacity * 2.55).toString(16).padStart(2, '0')}`
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Dark Theme Settings */}
              <div className="space-y-4">
                <h4 className={`font-bold text-sm uppercase tracking-wide ${textClass}`}>Темная тема</h4>
                
                <div className="p-4 border border-dashed border-[#FF6B00]/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="bgDarkEnabled"
                      checked={bgDarkEnabled}
                      onChange={(e) => setBgDarkEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-[#FF6B00] text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <label htmlFor="bgDarkEnabled" className={`text-sm ${textClass}`}>
                      Заливка фона
                    </label>
                  </div>
                  {bgDarkEnabled && (
                    <div className="flex flex-col gap-3 ml-6">
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Цвет:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={bgDarkColor}
                            onChange={(e) => setBgDarkColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-zinc-600"
                          />
                          <input
                            type="text"
                            value={bgDarkColor}
                            onChange={(e) => setBgDarkColor(e.target.value)}
                            className={`w-20 px-2 py-1 text-xs border ${borderClass} rounded ${textClass} ${inputBgClass}`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Прозрачность:</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={bgDarkOpacity}
                          onChange={(e) => setBgDarkOpacity(Number(e.target.value))}
                          className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className={`text-xs w-10 ${textClass}`}>{bgDarkOpacity}%</span>
                      </div>
                      <div
                        className="h-8 rounded border border-zinc-600"
                        style={{ backgroundColor: `${bgDarkColor}${Math.round(bgDarkOpacity * 2.55).toString(16).padStart(2, '0')}` }}
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 border border-dashed border-[#FF6B00]/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="borderDarkEnabled"
                      checked={borderDarkEnabled}
                      onChange={(e) => setBorderDarkEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-[#FF6B00] text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <label htmlFor="borderDarkEnabled" className={`text-sm ${textClass}`}>
                      Рамка
                    </label>
                  </div>
                  {borderDarkEnabled && (
                    <div className="flex flex-col gap-3 ml-6">
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Цвет:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={borderDarkColor}
                            onChange={(e) => setBorderDarkColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-zinc-600"
                          />
                          <input
                            type="text"
                            value={borderDarkColor}
                            onChange={(e) => setBorderDarkColor(e.target.value)}
                            className={`w-20 px-2 py-1 text-xs border ${borderClass} rounded ${textClass} ${inputBgClass}`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Прозрачность:</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={borderDarkOpacity}
                          onChange={(e) => setBorderDarkOpacity(Number(e.target.value))}
                          className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className={`text-xs w-10 ${textClass}`}>{borderDarkOpacity}%</span>
                      </div>
                      <div
                        className="w-full h-8 rounded border-2"
                        style={{ borderColor: `${borderDarkColor}${Math.round(borderDarkOpacity * 2.55).toString(16).padStart(2, '0')}` }}
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 border border-dashed border-[#FF6B00]/30 rounded-lg bg-[#FF6B00]/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-[#FF6B00]" />
                    <h5 className={`font-bold text-sm uppercase tracking-wide ${textClass}`}>Свечение при наведении - Темная тема</h5>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      id="glowDarkEnabled"
                      checked={glowDarkEnabled}
                      onChange={(e) => setGlowDarkEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-[#FF6B00] text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <label htmlFor="glowDarkEnabled" className={`text-sm ${textClass}`}>
                      Включить свечение
                    </label>
                  </div>
                  {glowDarkEnabled && (
                    <div className="flex flex-col gap-3 ml-6">
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Цвет:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={glowDarkColor}
                            onChange={(e) => setGlowDarkColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-zinc-600"
                          />
                          <input
                            type="text"
                            value={glowDarkColor}
                            onChange={(e) => setGlowDarkColor(e.target.value)}
                            className={`w-20 px-2 py-1 text-xs border ${borderClass} rounded ${textClass} ${inputBgClass}`}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Прозрачность:</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={glowDarkOpacity}
                          onChange={(e) => setGlowDarkOpacity(Number(e.target.value))}
                          className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className={`text-xs w-10 ${textClass}`}>{glowDarkOpacity}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className={`text-xs ${mutedClass}`}>Размытие:</label>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          value={glowDarkBlur}
                          onChange={(e) => setGlowDarkBlur(Number(e.target.value))}
                          className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className={`text-xs w-10 ${textClass}`}>{glowDarkBlur}px</span>
                      </div>
                      <div
                        className="h-8 rounded border border-zinc-600"
                        style={{
                          boxShadow: `0 0 ${glowDarkBlur}px ${glowDarkColor}${Math.round(glowDarkOpacity * 2.55).toString(16).padStart(2, '0')}`
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
              <button
                onClick={onClose}
                className={`flex-1 py-2.5 border ${borderClass} rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${textClass} hover:border-[#FF6B00]`}
              >
                Отмена
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className="flex-1 py-2.5 bg-[#FF6B00] text-black rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Сохранить
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-[#FF6B00] animate-spin" />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminSettingsSubcategoriesCustomization;
