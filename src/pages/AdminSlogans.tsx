import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import { AnimatePresence } from 'framer-motion';
import { checkHealth } from '../components/CloudStatus';
import {
  ChevronRight,
  LogOut,
  User,
  Edit,
  Save,
  X,
  Check,
  RefreshCw,
  Languages
} from 'lucide-react';

interface SlideStyles {
  label_size: string;
  label_weight: string;
  label_transform: string;
  label_tracking: string;
  label_color: string;
  title_size: string;
  title_weight: string;
  title_italic: boolean;
  title_transform: string;
  title_color: string;
  content_size: string;
  content_weight: string;
  content_color: string;
}

interface SloganSlide {
  id: number;
  key: string;
  slide_index: number;
  label_ru: string;
  label_fr: string;
  label_en: string;
  title_ru: string;
  title_fr: string;
  title_en: string;
  content_ru: string;
  content_fr: string;
  content_en: string;
  is_active: boolean;
  styles?: SlideStyles;
}

const DEFAULT_STYLES: SlideStyles = {
  label_size: 'text-xs',
  label_weight: 'font-bold',
  label_transform: 'uppercase',
  label_tracking: 'tracking-widest',
  label_color: '#FF6B00',
  title_size: 'text-4xl',
  title_weight: 'font-black',
  title_italic: true,
  title_transform: 'uppercase',
  title_color: '#FFFFFF',
  content_size: 'text-sm',
  content_weight: 'font-normal',
  content_color: '#9CA3AF',
};

const AdminSlogans: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  const [slides, setSlides] = useState<SloganSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingSlide, setEditingSlide] = useState<SloganSlide | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [translating, setTranslating] = useState(false);

  const [formData, setFormData] = useState({
    key: '',
    slide_index: 1,
    label_ru: '',
    label_fr: '',
    label_en: '',
    title_ru: '',
    title_fr: '',
    title_en: '',
    content_ru: '',
    content_fr: '',
    content_en: '',
    is_active: true,
    label_size: 'text-xs',
    label_weight: 'font-bold',
    label_transform: 'uppercase',
    label_tracking: 'tracking-widest',
    label_color: '#FF6B00',
    title_size: 'text-4xl',
    title_weight: 'font-black',
    title_italic: true,
    title_transform: 'uppercase',
    title_color: '#FFFFFF',
    content_size: 'text-sm',
    content_weight: 'font-normal',
    content_color: '#9CA3AF',
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
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    setError('');

    const defaultSlides: SloganSlide[] = [
      { id: 1, key: 'slide1', slide_index: 1, label_ru: 'ЭКСПРЕСС-ДОСТАВКА', label_fr: 'LIVRAISON EXPRESS DISPONIBLE', label_en: 'EXPRESS DELIVERY', title_ru: 'СТРОИТЕЛЬНЫЕ МАТЕРИАЛЫ С БЫСТРОЙ ДОСТАВКОЙ', title_fr: 'MATERIAUX DE CONSTRUCTION AVEC LIVRAISON RAPIDE', title_en: 'CONSTRUCTION MATERIALS WITH FAST DELIVERY', content_ru: 'Расположенные в Гролле, мы обслуживаем профессионалов и частных лиц в Монморанси и по всему Иль-де-Франс. Промышленное качество, местный сервис. Наши цены вас приятно удивят.', content_fr: "Basé à Groslay, nous servons les professionnels et particuliers à Montmorency et dans toute l'Île-de-France. Qualité industrielle, service local. Nos prix vous surprendront agréablement.", content_en: 'Based in Groslay, we serve professionals and individuals in Montmorency and throughout Île-de-France. Industrial quality, local service. Our prices will pleasantly surprise you.', is_active: true, styles: { ...DEFAULT_STYLES } },
      { id: 2, key: 'slide2', slide_index: 2, label_ru: 'ПРОФЕССИОНАЛЬНОЕ КАЧЕСТВО', label_fr: 'QUALITÉ PROFESSIONNELLE', label_en: 'PROFESSIONAL QUALITY', title_ru: 'МЕСТНЫЙ СЕРВИС В ИЛЬ-ДЕ-ФРАНС', title_fr: 'SERVICE LOCAL EN ÎLE-DE-FRANCE', title_en: 'LOCAL SERVICE IN ÎLE-DE-FRANCE', content_ru: 'Конкурентные цены для профессионалов и частных лиц', content_fr: 'Prix compétitifs pour les pros et les particuliers', content_en: 'Competitive prices for pros and individuals', is_active: true, styles: { ...DEFAULT_STYLES } },
      { id: 3, key: 'slide3', slide_index: 3, label_ru: 'ЭКСПЕРТНЫЙ СОВЕТ', label_fr: 'CONSEIL EXPERT', label_en: 'EXPERT ADVICE', title_ru: 'ВЕСЬ АССОРТИМЕНТ МАТЕРИАЛОВ', title_fr: 'TOUTE GAMME DE MATÉRIAUX', title_en: 'FULL RANGE OF MATERIALS', content_ru: 'От покрытий до инструментов - всё для ваших проектов', content_fr: 'Des revêtements aux outils, tout pour vos projets', content_en: 'From coatings to tools, everything for your projects', is_active: true, styles: { ...DEFAULT_STYLES } },
    ];

    try {
      const response = await fetch(`${API_URL}/admin/slides`);
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        setSlides(data.data);
      } else {
        setSlides(defaultSlides);
      }
    } catch (err) {
      setSlides(defaultSlides);
    } finally {
      setLoading(false);
    }
  };

  const getLocalizedText = (slide: SloganSlide, field: string) => {
    const lang = i18n.language || 'fr';
    const langKey = `${field}_${lang}` as keyof SloganSlide;
    const fallbackKey = `${field}_fr` as keyof SloganSlide;
    return (slide[langKey] || slide[fallbackKey] || '') as string;
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const doTranslate = async () => {
    const sourceLang = formData.label_fr?.trim() ? 'fr' : 
                       formData.label_ru?.trim() ? 'ru' : 
                       formData.label_en?.trim() ? 'en' : null;

    if (!sourceLang) {
      setError('Введите текст для перевода');
      return;
    }

    const sourceLabel = formData[`label_${sourceLang}` as keyof typeof formData] as string;
    const sourceTitle = formData[`title_${sourceLang}` as keyof typeof formData] as string;
    const sourceContent = formData[`content_${sourceLang}` as keyof typeof formData] as string;

    if (!sourceLabel || sourceLabel.trim().length < 3) {
      setError('Введите текст для перевода (минимум 3 символа)');
      return;
    }

    setTranslating(true);
    setError('');

    const targetLangs = (['ru', 'fr', 'en'] as const).filter(l => l !== sourceLang);
    const requestBody = {
      text: `${sourceLabel}|||${sourceTitle}|||${sourceContent}`,
      description: '',
      sourceLang,
      targetLangs: targetLangs as string[],
      tags: 'slide_text'
    };

    try {
      const resp = await fetch(`${API_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      const data = await resp.json();

      if (data.success && data.data) {
        const next = { ...formData } as any;
        
        (['ru', 'fr', 'en'] as const).forEach(tLang => {
          if (tLang === sourceLang) return;
          
          const translated = data.data[tLang];
          if (translated && translated.description) {
            const parts = translated.description.split('|||');
            next[`label_${tLang}`] = parts[0]?.trim() || '';
            next[`title_${tLang}`] = parts[1]?.trim() || '';
            next[`content_${tLang}`] = parts[2]?.trim() || '';
          }
        });

        setFormData(next);
        setSuccess('Перевод выполнен');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Ошибка перевода');
      }
    } catch (e) {
      setError('Ошибка при переводе');
      console.error('Translation error:', e);
    } finally {
      setTranslating(false);
    }
  };

  const handleEdit = (slide: SloganSlide) => {
    setFormData({
      key: slide.key,
      slide_index: slide.slide_index,
      label_ru: slide.label_ru || '',
      label_fr: slide.label_fr || '',
      label_en: slide.label_en || '',
      title_ru: slide.title_ru || '',
      title_fr: slide.title_fr || '',
      title_en: slide.title_en || '',
      content_ru: slide.content_ru || '',
      content_fr: slide.content_fr || '',
      content_en: slide.content_en || '',
      is_active: slide.is_active,
      ...(slide.styles || DEFAULT_STYLES)
    });
    setEditingSlide(slide);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSlide(null);
    setError('');
  };

  const handleSave = () => {
    setError('');
    if (!formData.key.trim()) {
      setError('Key is required');
      return;
    }
    setSlides(prev => prev.map(s => 
      s.id === editingSlide?.id 
        ? { ...s, label_ru: formData.label_ru, label_fr: formData.label_fr, label_en: formData.label_en, title_ru: formData.title_ru, title_fr: formData.title_fr, title_en: formData.title_en, content_ru: formData.content_ru, content_fr: formData.content_fr, content_en: formData.content_en, is_active: formData.is_active, styles: { label_size: formData.label_size, label_weight: formData.label_weight, label_transform: formData.label_transform, label_tracking: formData.label_tracking, label_color: formData.label_color, title_size: formData.title_size, title_weight: formData.title_weight, title_italic: formData.title_italic, title_transform: formData.title_transform, title_color: formData.title_color, content_size: formData.content_size, content_weight: formData.content_weight, content_color: formData.content_color } }
        : s
    ));
    setSuccess('Saved!');
    handleCloseModal();
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleSaveAll = async () => {
    setError('');
    setSuccess('');
    setSlides(prev => prev.map(s => ({ ...s, styles: s.styles || DEFAULT_STYLES })));
    try {
      for (const slide of slides) {
        await fetch(`${API_URL}/admin/slides`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...slide, styles: slide.styles || DEFAULT_STYLES })
        });
      }
      setSuccess(t('admin.slogans.savedToMain'));
      checkHealth();
    } catch (err) {
      setError('Failed to save');
    }
    setTimeout(() => setSuccess(''), 3000);
  };

  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const textClass = isLight ? 'text-zinc-900' : 'text-white';
  const borderClass = isLight ? 'border-zinc-200' : 'border-zinc-700/50';
  const inputBgClass = isLight ? 'bg-white' : 'bg-black/50';
  const headerBgClass = isLight ? 'bg-white/95 border-gray-200' : 'bg-black/95 border-white/10';
  const cardBgClass = isLight ? 'bg-white' : 'bg-zinc-900';

  if (loading) {
    return React.createElement('div', { className: 'min-h-screen flex items-center justify-center bg-transparent' },
      React.createElement(RefreshCw, { className: 'w-8 h-8 text-[#FF6B00] animate-spin' })
    );
  }

  return React.createElement('div', { className: 'min-h-screen' },
    React.createElement('header', { className: `w-full flex items-center justify-between px-3 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}` },
      React.createElement('div', { className: 'flex items-center gap-3 sm:gap-4' },
        React.createElement('button', { onClick: () => navigate('/'), className: `flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'}` },
          React.createElement(ChevronRight, { className: 'w-3.5 h-3.5 rotate-180' }),
          React.createElement('span', { className: 'hidden sm:inline' }, t('admin.backToSite'))
        )
      ),
      React.createElement('div', { className: 'flex items-center gap-3 sm:gap-4' },
        React.createElement('div', { className: 'w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center' },
          React.createElement(User, { className: 'w-3.5 h-3.5 text-black' })
        ),
        React.createElement('button', { onClick: () => navigate('/'), className: `flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'}` },
          React.createElement(LogOut, { className: 'w-3.5 h-3.5' }),
          React.createElement('span', { className: 'hidden sm:inline' }, t('admin.logout'))
        )
      )
    ),
    React.createElement('main', { className: 'pt-20 pb-12' },
      React.createElement('div', { className: 'max-w-full mx-auto px-3 sm:px-6 lg:px-8' },
        React.createElement('div', { className: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8' },
          React.createElement('div', null,
            React.createElement('h1', { className: `font-black italic text-2xl sm:text-3xl uppercase tracking-tight ${textClass}` }, t('admin.slogans.title')),
            React.createElement('p', { className: `text-xs sm:text-sm ${mutedClass}` }, t('admin.slogans.pageDesc'))
          ),
          React.createElement('button', { onClick: handleSaveAll, className: 'flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FF6B00] text-black text-xs sm:text-sm font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors' },
            React.createElement(Save, { className: 'w-4 h-4' }),
            t('admin.saveAndUpdate')
          )
        ),
        error && React.createElement('div', { className: 'mb-6 p-3 sm:p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500 text-xs sm:text-sm' }, error),
        success && React.createElement('div', { className: 'mb-6 p-3 sm:p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-500 text-xs sm:text-sm flex items-center gap-2' },
          React.createElement(Check, { className: 'w-4 h-4' }), success
        ),
        React.createElement('div', { className: 'grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6' },
          slides.map((slide) => {
            const slideStyles = slide.styles || DEFAULT_STYLES;
            return React.createElement('div', { key: slide.id, className: 'flex flex-col' },
              React.createElement('div', { className: `mb-4 flex items-center gap-2` },
                React.createElement('div', { className: 'w-10 h-10 rounded-xl bg-[#FF6B00]/20 flex items-center justify-center' },
                  React.createElement(Edit, { className: 'w-5 h-5 text-[#FF6B00]' })
                ),
                React.createElement('div', null,
                  React.createElement('h3', { className: `font-bold italic uppercase tracking-wide ${textClass}` }, getLocalizedText(slide, 'label') || t(`admin.slide${slide.slide_index}.title`)),
                  React.createElement('p', { className: `text-xs ${mutedClass}` }, `Slide ${slide.slide_index}`)
                )
              ),
              React.createElement('div', { className: `border ${borderClass} rounded-xl overflow-hidden ${cardBgClass} flex-grow flex flex-col h-[280px] sm:h-[300px]` },
                React.createElement('div', { className: `flex-grow p-4 sm:p-6 ${isLight ? 'bg-gray-50' : 'bg-white/5'}` },
                  React.createElement('div', { className: 'flex flex-col h-full' },
                    React.createElement('span', { className: `${slideStyles.label_size} ${slideStyles.label_weight} ${slideStyles.label_transform} ${slideStyles.label_tracking} mb-1 sm:mb-2`, style: { color: slideStyles.label_color } }, getLocalizedText(slide, 'label') || 'LABEL'),
                    React.createElement('h1', { className: `${slideStyles.title_size} ${slideStyles.title_weight} ${slideStyles.title_italic ? 'italic' : ''} ${slideStyles.title_transform} leading-none tracking-tight mb-2 sm:mb-3`, style: { color: slideStyles.title_color } }, getLocalizedText(slide, 'title') || 'TITLE'),
                    React.createElement('p', { className: `${slideStyles.content_size} ${slideStyles.content_weight} flex-grow leading-relaxed line-clamp-3 sm:line-clamp-4`, style: { color: slideStyles.content_color } }, getLocalizedText(slide, 'content') || 'Description...')
                  )
                ),
                React.createElement('div', { className: `px-3 py-3 border-t ${borderClass} flex items-center justify-between` },
                  React.createElement('span', { className: `text-xs ${mutedClass}` }, `ID: ${slide.id}`),
                  React.createElement('button', { onClick: () => handleEdit(slide), className: 'flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6B00] text-black text-xs font-bold uppercase rounded hover:bg-[#FF8533]' },
                    React.createElement(Edit, { className: 'w-3 h-3' }),
                    t('admin.slogans.edit')
                  )
                )
              )
            );
          })
        )
      )
    ),
    showModal && React.createElement(AnimatePresence, null,
      React.createElement('div', { className: 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]', onClick: handleCloseModal }),
      React.createElement('div', { className: `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] z-[70] ${cardBgClass} rounded-2xl shadow-2xl overflow-hidden flex flex-col` },
        React.createElement('div', { className: `p-4 sm:p-6 border-b ${borderClass} flex items-center justify-between` },
          React.createElement('h2', { className: `font-bold italic text-lg sm:text-xl uppercase tracking-wide ${textClass}` }, editingSlide ? t(`admin.slide${editingSlide.slide_index}.title`) : t('admin.slogans.title')),
          React.createElement('button', { onClick: handleCloseModal, className: `p-1.5 sm:p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-white/10'}` },
            React.createElement(X, { className: `w-5 h-5 ${textClass}` })
          )
        ),
        React.createElement('div', { className: 'flex-1 overflow-y-auto p-4 sm:p-6 space-y-4' },
          React.createElement('div', { className: 'flex justify-end' },
            React.createElement('button', { 
              onClick: doTranslate, 
              disabled: translating,
              className: `flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold uppercase rounded-lg transition-colors ${translating ? 'bg-[#FF6B00]/50 text-black cursor-not-allowed' : 'bg-[#FF6B00] text-black hover:bg-[#FF8533]'}` 
            },
              React.createElement(Languages, { className: 'w-4 h-4' }),
              translating ? 'Перевод...' : 'AI ПЕРЕВЕСТИ'
            )
          ),
          ['ru', 'fr', 'en'].map((lang) =>
            React.createElement('div', { key: lang, className: `p-3 sm:p-4 border ${borderClass} rounded-xl ${isLight ? 'bg-gray-50' : 'bg-white/5'}` },
              React.createElement('h4', { className: `font-bold uppercase text-xs ${mutedClass} mb-3` }, lang === 'ru' ? 'RU' : lang === 'en' ? 'EN' : 'FR'),
              ['label', 'title', 'content'].map((field) =>
                React.createElement('div', { key: field, className: 'mb-4' },
                  React.createElement('div', { className: 'flex items-center justify-between mb-2' },
                    React.createElement('label', { className: `block text-[10px] font-bold uppercase tracking-wide ${mutedClass}` }, field),
                    field === 'label' && React.createElement('div', { className: 'flex gap-1' },
                      React.createElement('select', { value: formData.label_size, onChange: (e: any) => updateField('label_size', e.target.value), className: `px-2 py-1 border ${borderClass} rounded text-xs ${textClass} ${inputBgClass}` },
                        React.createElement('option', { value: 'text-xs' }, 'xs'),
                        React.createElement('option', { value: 'text-sm' }, 'sm'),
                        React.createElement('option', { value: 'text-base' }, 'base')
                      ),
                      React.createElement('select', { value: formData.label_weight, onChange: (e: any) => updateField('label_weight', e.target.value), className: `px-2 py-1 border ${borderClass} rounded text-xs ${textClass} ${inputBgClass}` },
                        React.createElement('option', { value: 'font-normal' }, 'N'),
                        React.createElement('option', { value: 'font-bold' }, 'B')
                      ),
                      React.createElement('input', { type: 'color', value: formData.label_color, onChange: (e: any) => updateField('label_color', e.target.value), className: 'w-7 h-6 rounded border cursor-pointer' })
                    ),
                    field === 'title' && React.createElement('div', { className: 'flex gap-1' },
                      React.createElement('select', { value: formData.title_size, onChange: (e: any) => updateField('title_size', e.target.value), className: `px-2 py-1 border ${borderClass} rounded text-xs ${textClass} ${inputBgClass}` },
                        React.createElement('option', { value: 'text-3xl' }, '3xl'),
                        React.createElement('option', { value: 'text-4xl' }, '4xl'),
                        React.createElement('option', { value: 'text-5xl' }, '5xl')
                      ),
                      React.createElement('select', { value: formData.title_weight, onChange: (e: any) => updateField('title_weight', e.target.value), className: `px-2 py-1 border ${borderClass} rounded text-xs ${textClass} ${inputBgClass}` },
                        React.createElement('option', { value: 'font-bold' }, 'B'),
                        React.createElement('option', { value: 'font-black' }, 'BL')
                      ),
                      React.createElement('button', { onClick: () => updateField('title_italic', !formData.title_italic), className: `px-2 py-1 border ${borderClass} rounded text-xs ${formData.title_italic ? 'bg-[#FF6B00] text-black' : textClass} ${inputBgClass}` }, 'I'),
                      React.createElement('input', { type: 'color', value: formData.title_color, onChange: (e: any) => updateField('title_color', e.target.value), className: 'w-7 h-6 rounded border cursor-pointer' })
                    ),
                    field === 'content' && React.createElement('div', { className: 'flex gap-1' },
                      React.createElement('select', { value: formData.content_size, onChange: (e: any) => updateField('content_size', e.target.value), className: `px-2 py-1 border ${borderClass} rounded text-xs ${textClass} ${inputBgClass}` },
                        React.createElement('option', { value: 'text-sm' }, 'sm'),
                        React.createElement('option', { value: 'text-base' }, 'base')
                      ),
                      React.createElement('select', { value: formData.content_weight, onChange: (e: any) => updateField('content_weight', e.target.value), className: `px-2 py-1 border ${borderClass} rounded text-xs ${textClass} ${inputBgClass}` },
                        React.createElement('option', { value: 'font-normal' }, 'N')
                      ),
                      React.createElement('input', { type: 'color', value: formData.content_color, onChange: (e: any) => updateField('content_color', e.target.value), className: 'w-7 h-6 rounded border cursor-pointer' })
                    )
                  ),
                  React.createElement('input', { type: 'text', value: formData[`${field}_${lang}` as keyof typeof formData] as string, onChange: (e: any) => updateField(`${field}_${lang}`, e.target.value), className: `w-full px-3 py-2 border ${borderClass} rounded-lg text-xs ${textClass} ${inputBgClass}` })
                )
              )
            )
          )
        ),
        React.createElement('div', { className: `p-4 sm:p-6 border-t ${borderClass} flex justify-end gap-3` },
          React.createElement('button', { onClick: handleCloseModal, className: `px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase border ${borderClass} rounded-lg ${textClass}` }, t('admin.cancel')),
          React.createElement('button', { onClick: handleSave, className: 'flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 bg-[#FF6B00] text-black text-xs sm:text-sm font-bold uppercase rounded-lg hover:bg-[#FF8533]' },
            React.createElement(Save, { className: 'w-4 h-4' }),
            t('admin.save')
          )
        )
      )
    )
  );
};

export default AdminSlogans;
