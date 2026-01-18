import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Upload,
  Filter,
  Package,
  Tag,
  Award,
  Globe,
  Calculator,
  Settings,
  Cloud
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
  children?: Category[];
}

const AdminCategories: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [cloudStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

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
      const response = await fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm(t('admin.categories.confirmDelete'))) return;
    
    try {
      const response = await fetch(`https://yasndeco-api.andrey-gaffer.workers.dev/api/categories/${categoryId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        setCategories(categories.filter(cat => cat.id !== categoryId));
      } else {
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const processCategories = (cats: Category[]): Category[] => {
    const categoryMap = new Map<number, Category>();
    const rootCategories: Category[] = [];
    
    // First pass: create map of all categories
    cats.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });
    
    // Second pass: build hierarchy
    cats.forEach(cat => {
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(cat);
        }
      } else {
        rootCategories.push(cat);
      }
    });
    
    return rootCategories;
  };


  
  const themeToggle = () => {
    const newTheme = isLight ? 'dark' : 'light';
    localStorage.setItem('site-theme', newTheme);
    setIsLight(!isLight);
    window.dispatchEvent(new Event('themechange'));
  };
  
  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  

  const adminNavItems = [
    { id: 'products', label: t('admin.sections.products.title'), icon: <Package className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', label: t('admin.sections.categories.title'), icon: <Tag className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', label: t('admin.sections.brands.title'), icon: <Award className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'translations', label: t('admin.sections.translations.title'), icon: <Globe className="w-4 h-4" />, path: '/admin/translations' },
    { id: 'calculators', label: t('admin.sections.calculators.title'), icon: <Calculator className="w-4 h-4" />, path: '/admin/calculators' },
    { id: 'settings', label: t('admin.sections.settings.title'), icon: <Settings className="w-4 h-4" />, path: '/admin/settings' },
    { id: 'content', label: t('admin.sections.content.title'), icon: <Settings className="w-4 h-4" />, path: '/admin/content' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isCloudOnline = cloudStatus === 'online';

  const getCategoryName = (category: Category) => {
    const lang = i18n.language;
    switch (lang) {
      case 'ru': return category.name_ru || 'Без названия';
      case 'en': return category.name_en || 'Untitled';
      default: return category.name_fr || 'Sans titre';
    }
  };

  const processedCategories = processCategories(categories);
  
  const filteredCategories = processedCategories.filter(category =>
    getCategoryName(category).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLight 
          ? 'bg-white/95 backdrop-blur-md border-gray-200' 
          : 'bg-black/95 backdrop-blur-md border-gray-800'
      }`}>
        <div className="flex items-center gap-3">
          <Link to="/admin" className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-gray-800'}`}>
            <ChevronRight className={`w-5 h-5 rotate-180 ${isLight ? 'text-gray-700' : 'text-gray-300'}`} />
          </Link>
          <h1 className={`font-black italic text-xl tracking-tight ${textClass}`}>
            {t('admin.sections.categories.title')}
          </h1>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-[#FF6B00] text-black'
                  : isLight 
                    ? 'text-gray-700 hover:bg-gray-100' 
                    : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
            isCloudOnline 
              ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
              : 'bg-red-500/10 text-red-600 border border-red-500/20'
          }`}>
            <Cloud className="w-3 h-3" />
            {isCloudOnline ? t('admin.categories.cloudOnline') : t('admin.categories.cloudOffline')}
          </div>
          <button
            onClick={themeToggle}
            className={`p-2 rounded-lg transition-colors ${isLight ? 'hover:bg-gray-100' : 'hover:bg-gray-800'}`}
          >
            {isLight ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main className={`pt-20 ${isLight ? 'bg-gray-50' : 'bg-black'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className={`text-2xl font-bold ${textClass} mb-2`}>
                  {t('admin.categories.manageCategories')}
                </h2>
                <p className={mutedClass}>
                  {t('admin.categories.description')}
                </p>
              </div>
              <div className="flex gap-3">
<button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLight 
                    ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700' 
                    : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}>
                  <Upload className="w-4 h-4" />
                  {t('admin.categories.import')}
                </button>
                <button
                  onClick={() => navigate('/admin/add-category')}
                  className="flex items-center gap-2 bg-[#FF6B00] text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FF8533] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {t('admin.categories.newCategory')}
                </button>
                <button
                  onClick={() => navigate('/admin/add-category')}
                  className="flex items-center gap-2 bg-[#FF6B00] text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FF8533] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Nouvelle catégorie
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedClass}`} />
                <input
                  type="text"
                  placeholder={t('admin.products.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${borderClass} ${textClass} placeholder-${mutedClass} focus:outline-none focus:border-[#FF6B00] transition-colors ${
                    isLight ? 'bg-white' : 'bg-gray-800'
                  }`}
                />
              </div>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isLight 
                  ? 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700' 
                  : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}>
                <Filter className="w-4 h-4" />
                {t('admin.categories.filters')}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`group relative rounded-xl overflow-hidden transition-all duration-300`}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden">
                          {category.image_url ? (
                            <img 
                              src={category.image_url} 
                              alt={getCategoryName(category)}
                              className="w-full h-full object-cover"
                            />
                          ) : category.icon ? (
                            <div className="text-2xl">
                              {category.icon}
                            </div>
                          ) : (
                            <Tag className={`w-8 h-8 ${mutedClass}`} />
                          )}
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg ${textClass}`}>
                            {getCategoryName(category)}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                            isLight ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400'
                          }`}>
                            {t('admin.content.active')}
                          </span>
                          {category.children && category.children.length > 0 && (
                            <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ml-2 ${
                              isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {category.children.length} {t('admin.categories.subcategories')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => navigate(`/admin/categories/${category.id}`)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLight ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-700 text-gray-400'
                          }`}
                          title={t('admin.categories.view')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/categories/${category.id}/edit`)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLight ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-700 text-gray-400'
                          }`}
                          title={t('admin.categories.edit')}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isLight ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-500/10 text-red-400'
                          }`}
                          title={t('admin.categories.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <p className={`text-sm ${mutedClass} mb-4 line-clamp-2`}>
                      {(category[`desc_${i18n.language}` as keyof Category] || 
                       category.desc_fr || 
                       'Aucune description') as React.ReactNode}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{t('admin.categories.order')}: {category.sort_order}</span>
                    </div>
                  </div>
                </div>

                {category.children && category.children.length > 0 && (
                  <div className="ml-6 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.children.map((subcategory, subIndex) => (
                      <motion.div
                        key={subcategory.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + subIndex * 0.05 }}
                        className={`group relative rounded-lg overflow-hidden transition-all duration-300`}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                                {subcategory.icon ? (
                                  <span className="text-lg">{subcategory.icon}</span>
                                ) : (
                                  <Tag className={`w-5 h-5 ${mutedClass}`} />
                                )}
                              </div>
                              <div>
                                <h4 className={`font-bold text-sm ${textClass}`}>
                                  {getCategoryName(subcategory)}
                                </h4>
                                <span className={`text-xs px-1.5 py-0.5 rounded-full inline-block ${
                                  isLight ? 'bg-green-100 text-green-700' : 'bg-green-500/20 text-green-400'
                                }`}>
                                  {t('admin.content.active')}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              <button 
                                onClick={() => navigate(`/admin/categories/${subcategory.id}`)}
                                className={`p-1 rounded transition-colors ${
                                  isLight ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-gray-700 text-gray-400'
                                }`}
                                title={t('admin.categories.view')}
                              >
                                <Eye className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => navigate(`/admin/categories/${subcategory.id}/edit`)}
                                className={`p-1 rounded transition-colors ${
                                  isLight ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-gray-700 text-gray-400'
                                }`}
                                title={t('admin.categories.edit')}
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button 
                                onClick={() => handleDeleteCategory(subcategory.id)}
                                className={`p-1 rounded transition-colors ${
                                  isLight ? 'hover:bg-red-50 text-red-500' : 'hover:bg-red-500/10 text-red-400'
                                }`}
                                title={t('admin.categories.delete')}
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          <p className={`text-xs ${mutedClass} mb-2 line-clamp-2`}>
                            {(subcategory[`desc_${i18n.language}` as keyof Category] || 
                             subcategory.desc_fr || 
                             'Aucune description') as React.ReactNode}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{t('admin.categories.order')}: {subcategory.sort_order}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Tag className={`w-16 h-16 mx-auto mb-4 ${mutedClass}`} />
              <h3 className={`text-lg font-medium mb-2 ${textClass}`}>
                {t('admin.categories.noCategoriesFound')}
              </h3>
              <p className={mutedClass}>
                {searchQuery ? t('admin.categories.tryAnotherSearch') : t('admin.categories.startByAdding')}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminCategories;