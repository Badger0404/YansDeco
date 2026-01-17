import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Upload, 
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
  Sparkles,
  X,
  Check,
  Edit2,
  Trash2,
  FolderTree,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  ArrowLeft,
  Camera
} from 'lucide-react';

interface Category {
  id: number;
  slug: string;
  icon: string | null;
  image_url: string | null;
  parent_id: number | null;
  sort_order: number;
  created_at: string;
  name_ru: string | null;
  name_fr: string | null;
  name_en: string | null;
  desc_ru: string | null;
  desc_fr: string | null;
  desc_en: string | null;
  children?: Category[];
  _depth?: number;
}

const Categories: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [focusedField, setFocusedField] = useState<{ lang: string; field: 'name' | 'description' } | null>(null);

  const [formData, setFormData] = useState({
    slug: '',
    icon: '',
    image_url: '',
    parent_id: null as number | null,
    sort_order: 0,
    name_ru: '',
    name_fr: '',
    name_en: '',
    desc_ru: '',
    desc_fr: '',
    desc_en: ''
  });

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      const data = await response.json();
      if (data.success) {
        const tree = buildCategoryTree(data.data);
        setCategories(tree);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      setError('Ошибка загрузки категорий');
    } finally {
      setLoading(false);
    }
  };

  const buildCategoryTree = (flatCategories: Category[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    const roots: Category[] = [];

    flatCategories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [], _depth: 0 });
    });

    flatCategories.forEach(cat => {
      const node = categoryMap.get(cat.id)!;
      if (cat.parent_id && categoryMap.has(cat.parent_id)) {
        const parent = categoryMap.get(cat.parent_id)!;
        parent.children = parent.children || [];
        parent.children.push(node);
        node._depth = (parent._depth || 0) + 1;
      } else {
        roots.push(node);
      }
    });

    const sortTree = (nodes: Category[]): Category[] => {
      return nodes.sort((a, b) => a.sort_order - b.sort_order).map(node => ({
        ...node,
        children: node.children ? sortTree(node.children) : []
      }));
    };

    return sortTree(roots);
  };

  const toggleExpanded = (id: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleTranslateFromField = async (sourceLang: string, sourceField: 'name' | 'description') => {
    const textObj = {
      name: formData.name_ru,
      description: formData.desc_ru
    };

    if (!textObj.name.trim() || textObj.name.length < 3) {
      return;
    }

    setIsTranslating(true);
    setError('');

    const targetLangs = ['fr', 'en'].filter(lang => lang !== sourceLang);

    try {
      const response = await fetch(`${API_URL}/api/ai/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textObj,
          targetLangs
        })
      });

      const data = await response.json();

      if (data.success) {
        setFormData(prev => {
          const newData = { ...prev };
          targetLangs.forEach((targetLang: string) => {
            if (data.data[targetLang]) {
              if (sourceField === 'name') {
                (newData as unknown as Record<string, string>)[`name_${targetLang}`] = data.data[targetLang].name || '';
              } else {
                (newData as unknown as Record<string, string>)[`desc_${targetLang}`] = data.data[targetLang].description || '';
              }
            }
          });
          return newData;
        });
        setSuccess('Перевод выполнен успешно');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        console.error('[Translate] Server error:', data.error);
        const errorMsg = `Ошибка перевода: ${data.error || 'Неизвестная ошибка'}`;
        setError(errorMsg);
        window.alert(errorMsg);
      }
    } catch (err) {
      const errorMsg = `Ошибка перевода: ${err instanceof Error ? err.message : 'Network error'}`;
      console.error('[Translate] Network error:', err);
      setError(errorMsg);
      window.alert(errorMsg);
    } finally {
      setIsTranslating(false);
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
    
    console.log('[Upload] Starting upload, file:', file.name, 'size:', file.size, 'bytes');
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', 'categories');

    try {
      console.log('[Upload] Sending request to:', `${API_URL}/api/upload`);
      
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: uploadFormData
      });
      
      console.log('[Upload] Response status:', response.status, response.statusText);
      console.log('[Upload] Response headers:', Object.fromEntries(response.headers.entries()));
      
      const data = await response.json();
      console.log('[Upload] Response data:', data);
      
      if (data.success) {
        console.log('[Upload] Success! URL:', data.data.url);
        setImagePreview(data.data.url);
        setFormData(prev => ({ ...prev, image_url: data.data.url }));
      } else {
        console.error('[Upload] Error from server:', data.error);
        const errorMsg = `Ошибка загрузки: ${data.error || 'Неизвестная ошибка'}`;
        setError(errorMsg);
        window.alert(errorMsg);
      }
    } catch (err) {
      const errorMsg = `Ошибка загрузки изображения: ${err instanceof Error ? err.message : 'Network error'}`;
      console.error('[Upload] Network error:', err);
      setError(errorMsg);
      window.alert(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleTranslateAll = async () => {
    if (!formData.name_ru.trim() || formData.name_ru.length < 3) {
      setError('Введите название на русском (минимум 3 символа)');
      return;
    }

    setIsTranslating(true);
    setError('');

    const apiUrl = `${API_URL}/api/ai/translate`;
    console.log('Отправляю запрос на:', apiUrl);
    console.log('Тело запроса:', {
      text: {
        name: formData.name_ru,
        description: formData.desc_ru
      },
      targetLangs: ['fr', 'en']
    });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: {
            name: formData.name_ru,
            description: formData.desc_ru
          },
          targetLangs: ['fr', 'en']
        })
      });

      console.log('Ответ от API:', response.status, response.statusText);
      const data = await response.json();
      console.log('Данные ответа:', data);

      if (data.success) {
        setFormData(prev => ({
          ...prev,
          name_fr: data.data.fr?.name || '',
          desc_fr: data.data.fr?.description || '',
          name_en: data.data.en?.name || '',
          desc_en: data.data.en?.description || ''
        }));
        setSuccess('Перевод выполнен успешно');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        console.error('Ошибка ИИ:', data.error);
        setError(data.error || 'Ошибка перевода');
      }
    } catch (err) {
      console.error('Ошибка ИИ:', err);
      setError('Ошибка при переводе');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSave = async () => {
    setError('');
    
    if (!formData.name_ru.trim()) {
      setError('Введите название категории на русском');
      return;
    }

    if (!formData.slug.trim()) {
      setError('Введите slug');
      return;
    }

    setIsSaving(true);

    try {
      const url = editingId 
        ? `${API_URL}/api/categories/${editingId}`
        : `${API_URL}/api/categories`;
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingId ? 'Категория обновлена' : 'Категория создана');
        setTimeout(() => setSuccess(''), 3000);
        setShowForm(false);
        resetForm();
        fetchCategories();
      } else {
        setError(data.error || 'Ошибка сохранения');
      }
    } catch (err) {
      setError('Ошибка при сохранении категории');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;

    setError('');
    try {
      const response = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        setSuccess('Категория удалена');
        setTimeout(() => setSuccess(''), 3000);
        fetchCategories();
      } else {
        setError(data.error || 'Ошибка удаления');
      }
    } catch (err) {
      setError('Ошибка при удалении категории');
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      slug: category.slug,
      icon: category.icon || '',
      image_url: category.image_url || '',
      parent_id: category.parent_id,
      sort_order: category.sort_order,
      name_ru: category.name_ru || '',
      name_fr: category.name_fr || '',
      name_en: category.name_en || '',
      desc_ru: category.desc_ru || '',
      desc_fr: category.desc_fr || '',
      desc_en: category.desc_en || ''
    });
    setImagePreview(category.image_url || '');
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleAddSubCategory = (parentId: number) => {
    resetForm();
    setFormData(prev => ({ ...prev, parent_id: parentId }));
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      icon: '',
      image_url: '',
      parent_id: null,
      sort_order: 0,
      name_ru: '',
      name_fr: '',
      name_en: '',
      desc_ru: '',
      desc_fr: '',
      desc_en: ''
    });
    setImagePreview('');
    setEditingId(null);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const handleBack = () => {
    setShowForm(false);
    resetForm();
  };

  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const textClass = isLight ? 'text-zinc-900' : 'text-white';
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

  const renderCategoryRow = (category: Category) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const depth = category._depth || 0;
    const indent = depth * 24;

    return (
      <React.Fragment key={category.id}>
        <tr className={`${isLight ? 'hover:bg-gray-50' : 'hover:bg-white/5'} transition-colors`}>
          <td className={`px-4 py-3 text-sm ${textClass}`}>
            {category.id}
          </td>
          <td className="px-4 py-3">
            {category.image_url ? (
              <img src={category.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-zinc-700/50 flex items-center justify-center">
                <span className="text-lg">{category.icon || '📁'}</span>
              </div>
            )}
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-1">
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(category.id)}
                  className={`p-1 hover:bg-[#FF6B00]/20 rounded transition-colors ${mutedClass}`}
                >
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
                </button>
              )}
              <span className="text-lg">{category.icon || '📁'}</span>
            </div>
          </td>
          <td className={`px-4 py-3 text-sm ${textClass}`}>
            <span style={{ marginLeft: `${indent}px` }}>{category.name_ru || '-'}</span>
          </td>
          <td className={`px-4 py-3 text-sm ${mutedClass}`}>
            {category.slug}
          </td>
          <td className={`px-4 py-3 text-sm ${mutedClass}`}>
            {category.parent_id 
              ? categories.flatMap(c => c.children || []).find(c => c.id === category.parent_id)?.name_ru || '-'
              : '—'}
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center justify-end gap-1.5">
              <button
                onClick={() => handleAddSubCategory(category.id)}
                className={`p-1.5 border ${borderClass} rounded-lg hover:bg-[#FF6B00]/20 hover:border-[#FF6B00] transition-colors ${mutedClass}`}
                title="Добавить подкатегорию"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleEdit(category)}
                className={`p-1.5 border ${borderClass} rounded-lg hover:border-[#FF6B00] transition-colors ${mutedClass} hover:text-[#FF6B00]`}
                title="Редактировать"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-1.5 border border-red-500/30 rounded-lg hover:bg-red-500/20 text-red-500 transition-colors"
                title="Удалить"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </td>
        </tr>
        {hasChildren && isExpanded && (
          category.children!.map(child => renderCategoryRow(child))
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBgClass}`}>
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
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? isLight ? 'bg-[#FF6B00] text-black' : 'bg-[#FF6B00] text-black'
                    : isLight ? 'text-gray-600 hover:bg-gray-100 hover:text-[#FF6B00]' : 'text-zinc-400 hover:bg-white/5 hover:text-[#FF6B00]'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FF6B00] text-black rounded-lg hover:bg-[#FF8533] transition-colors">
            <Upload className="w-3 h-3" />
            {t('admin.sync')}
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

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!showForm ? (
            <>
              {/* Page Title */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className={`font-black italic text-3xl md:text-4xl uppercase tracking-tight ${textClass}`}>
                    Категории
                  </h1>
                  <p className={`text-sm ${mutedClass} mt-1`}>
                    Управление категориями и подкатегориями товаров
                  </p>
                </div>
                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#FF6B00] text-black text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Добавить категорию
                </button>
              </div>

              {/* Messages */}
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

              {/* Categories Tree */}
              <div className={`border ${borderClass} rounded-xl overflow-hidden`}>
                {loading ? (
                  <div className="p-12 text-center">
                    <RefreshCw className={`w-8 h-8 mx-auto mb-3 ${mutedClass} animate-spin`} />
                    <p className={`text-sm ${mutedClass}`}>Загрузка...</p>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="p-12 text-center">
                    <FolderTree className={`w-12 h-12 mx-auto mb-3 ${mutedClass} opacity-50`} />
                    <p className={`text-sm ${mutedClass}`}>Категории не найдены</p>
                    <button
                      onClick={handleAddNew}
                      className="mt-4 px-4 py-2 bg-[#FF6B00] text-black text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors"
                    >
                      Добавить первую категорию
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={`border-b ${borderClass}`}>
                        <tr className={isLight ? 'bg-gray-50' : 'bg-white/5'}>
                          <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wide ${mutedClass}`}>#</th>
                          <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Фото</th>
                          <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Иконка</th>
                          <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Название (RU)</th>
                          <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Slug</th>
                          <th className={`px-4 py-3 text-left text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Родитель</th>
                          <th className={`px-4 py-3 text-right text-xs font-bold uppercase tracking-wide ${mutedClass}`}>Действия</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {categories.map(cat => renderCategoryRow(cat))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Form */}
              <div className="mb-8">
                <button
                  onClick={handleBack}
                  className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${mutedClass} hover:text-[#FF6B00] mb-4`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Назад к списку
                </button>
                
                <h1 className={`font-black italic text-3xl md:text-4xl uppercase tracking-tight ${textClass}`}>
                  {editingId ? 'Редактировать категорию' : formData.parent_id ? `Подкатегория: ${categories.flatMap(c => c.children || []).find(c => c.id === formData.parent_id)?.name_ru || ''}` : 'Новая категория'}
                </h1>
                <p className={`text-sm ${mutedClass} mt-1`}>
                  Заполните информацию о категории на трёх языках
                </p>
              </div>

              {/* Messages */}
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

              <div className="space-y-6">
                {/* Image Upload */}
                <div className={`p-6 border ${borderClass} rounded-xl`}>
                  <h2 className={`font-bold italic text-lg uppercase tracking-wide mb-4 ${textClass}`}>
                    Изображение категории
                  </h2>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      isDragging 
                        ? 'border-[#FF6B00] bg-[#FF6B00]/10' 
                        : `${borderClass} ${isLight ? 'bg-gray-50' : 'bg-black/30'}`
                    }`}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="w-8 h-8 text-[#FF6B00] animate-spin" />
                        <p className={`text-sm ${mutedClass}`}>Загрузка...</p>
                      </div>
                    ) : imagePreview ? (
                      <div className="relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-48 rounded-lg"
                        />
                        <button
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className={`w-10 h-10 mx-auto mb-3 ${mutedClass}`} />
                        <p className={`text-sm mb-2 ${mutedClass}`}>
                          Перетащите файл или нажмите для выбора
                        </p>
                        <p className={`text-xs ${mutedClass} opacity-70 mb-4`}>
                          PNG, JPG до 5MB
                        </p>
                        
                        <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B00] text-black text-sm font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors cursor-pointer">
                          <Camera className="w-5 h-5" />
                          Загрузить фото
                          <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                        
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className={`p-6 border ${borderClass} rounded-xl`}>
                  <h2 className={`font-bold italic text-lg uppercase tracking-wide mb-4 ${textClass}`}>
                    Основная информация
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                        Slug *
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        placeholder="category-slug"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                        Порядок сортировки
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.sort_order}
                        onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                        className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                        Родительская категория
                      </label>
                      <select
                        value={formData.parent_id || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value ? parseInt(e.target.value) : null }))}
                        className={`w-full px-4 py-2.5 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                      >
                        <option value="">Корневая категория</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>
                            {'—'.repeat(cat._depth || 0)} {cat.name_ru || cat.slug}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Translations */}
                <div className={`p-6 border ${borderClass} rounded-xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className={`font-bold italic text-lg uppercase tracking-wide ${textClass}`}>
                      Мультиязычный контент
                    </h2>
                    <button
                      onClick={handleTranslateAll}
                      disabled={isTranslating || !formData.name_ru.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-[#FF6B00] text-black text-xs font-bold uppercase tracking-wide rounded-lg hover:bg-[#FF8533] transition-colors disabled:opacity-50"
                    >
                      {isTranslating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Перевод...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          AI Translate All
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Translation Fields */}
                    {[
                      { code: 'ru', label: 'RU' },
                      { code: 'fr', label: 'FR' },
                      { code: 'en', label: 'EN' }
                    ].map((lang) => {
                      const nameKey = `name_${lang.code}` as keyof typeof formData;
                      const descKey = `desc_${lang.code}` as keyof typeof formData;
                      
                      return (
                        <div key={lang.code} className="space-y-4">
                          <div className="relative">
                            <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                              Название ({lang.label}) {lang.code === 'ru' && '*'}
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={formData[nameKey] as string}
                                onChange={(e) => {
                                  setFormData(prev => ({
                                    ...prev,
                                    [nameKey]: e.target.value
                                  }));
                                  setFocusedField({ lang: lang.code, field: 'name' });
                                }}
                                onFocus={() => setFocusedField({ lang: lang.code, field: 'name' })}
                                onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                                className={`w-full px-4 py-2.5 pr-14 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass}`}
                                placeholder={lang.code === 'ru' ? 'Название категории' : lang.code === 'fr' ? 'Nom de la catégorie' : 'Category name'}
                              />
                              <AnimatePresence>
                                {focusedField?.lang === lang.code && focusedField?.field === 'name' && 
                                 (formData[nameKey] as string).length >= 3 && lang.code === 'ru' && (
                                  <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => handleTranslateFromField(lang.code, 'name')}
                                    disabled={isTranslating !== null}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-[#FF6B00]/20 hover:bg-[#FF6B00]/40 rounded-lg transition-colors group"
                                    title="AI Translate"
                                  >
                                    {isTranslating ? (
                                      <RefreshCw className="w-4 h-4 text-[#FF6B00] animate-spin" />
                                    ) : (
                                      <Sparkles className="w-4 h-4 text-[#FF6B00] group-hover:scale-110 transition-transform" />
                                    )}
                                  </motion.button>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                          <div className="relative">
                            <label className={`block text-xs font-bold uppercase tracking-wide mb-2 ${mutedClass}`}>
                              Описание ({lang.label})
                            </label>
                            <div className="relative">
                              <textarea
                                rows={3}
                                value={formData[descKey] as string}
                                onChange={(e) => {
                                  setFormData(prev => ({
                                    ...prev,
                                    [descKey]: e.target.value
                                  }));
                                  setFocusedField({ lang: lang.code, field: 'description' });
                                }}
                                onFocus={() => setFocusedField({ lang: lang.code, field: 'description' })}
                                onBlur={() => setTimeout(() => setFocusedField(null), 200)}
                                className={`w-full px-4 py-2.5 pr-14 border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} ${inputBgClass} resize-none`}
                                placeholder="Описание категории..."
                              />
                              <AnimatePresence>
                                {focusedField?.lang === lang.code && focusedField?.field === 'description' &&
                                 (formData[descKey] as string).length >= 3 && lang.code === 'ru' && (
                                  <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => handleTranslateFromField(lang.code, 'description')}
                                    disabled={isTranslating !== null}
                                    className="absolute right-2 top-3 p-1.5 bg-[#FF6B00]/20 hover:bg-[#FF6B00]/40 rounded-lg transition-colors group"
                                    title="AI Translate"
                                  >
                                    {isTranslating ? (
                                      <RefreshCw className="w-4 h-4 text-[#FF6B00] animate-spin" />
                                    ) : (
                                      <Sparkles className="w-4 h-4 text-[#FF6B00] group-hover:scale-110 transition-transform" />
                                    )}
                                  </motion.button>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={handleBack}
                    className={`px-6 py-3 border ${borderClass} rounded-lg text-sm font-bold uppercase tracking-wide transition-colors ${textClass} hover:border-[#FF6B00]`}
                  >
                    Отмена
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-8 py-3 bg-[#FF6B00] text-black rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-[#FF8533] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        {editingId ? 'Сохранить' : 'Создать'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Categories;
