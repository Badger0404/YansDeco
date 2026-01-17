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
  Download,
  Filter,
  ArrowUpDown,
  Package,
  Tag,
  Award,
  Globe,
  Calculator,
  Settings,
  Cloud,
  RefreshCw,
  LogOut,
  User
} from 'lucide-react';

const AdminProducts: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [cloudStatus, setCloudStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');

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

  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const hoverBorderClass = 'hover:border-[#FF6B00]';
  const textClass = isLight ? 'text-zinc-900' : 'text-white';

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

  const products = [
    { id: '1', name: 'Peinture Acrylique Blanche', brand: 'BOSTIK', price: '24.90 €', stock: 150, status: 'active' },
    { id: '2', name: 'Primaire Universel', brand: 'BOSTIK', price: '18.90 €', stock: 89, status: 'active' },
    { id: '3', name: 'Colle C1', brand: 'SIKA', price: '22.90 €', stock: 45, status: 'active' },
    { id: '4', name: 'Enduit Lissage', brand: 'TOUPRET', price: '14.90 €', stock: 200, status: 'active' },
    { id: '5', name: 'Bande Joint Standard', brand: 'TOUPRET', price: '8.50 €', stock: 320, status: 'inactive' },
    { id: '6', name: 'Mastic Acrylique', brand: 'BOSTIK', price: '7.50 €', stock: 175, status: 'active' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
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
            onClick={() => {
              setCloudStatus('syncing');
              setTimeout(() => setCloudStatus('online'), 2000);
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FF6B00] text-black rounded-lg hover:bg-[#FF8533] transition-colors"
          >
            <Upload className="w-3 h-3" />
            {t('admin.sync')}
          </button>

          {/* Theme Toggle */}
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

      {/* Main Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-black italic text-2xl md:text-3xl uppercase tracking-tight text-[#FF6B00]">
                {t('admin.products.title')}
              </h1>
              <p className={`text-xs ${mutedClass} mt-1`}>
                {t('admin.sections.products.description')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
                <Upload className="w-3 h-3" />
                {t('admin.quickActions.importCsv')}
              </button>
              <button className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
                <Download className="w-3 h-3" />
                {t('admin.quickActions.exportData')}
              </button>
              <button className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#FF6B00] text-black rounded-lg hover:bg-[#FF8533] transition-colors">
                <Plus className="w-3 h-3" />
                {t('admin.products.addNew')}
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${mutedClass}`} />
              <input
                type="text"
                placeholder={t('admin.products.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-transparent border ${borderClass} rounded-lg text-sm focus:outline-none focus:border-[#FF6B00] ${textClass} placeholder-zinc-500`}
              />
            </div>
            <button className={`flex items-center gap-1.5 px-4 py-2.5 border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
              <Filter className="w-4 h-4" />
              Filtrer
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-5 bg-transparent border ${borderClass} ${hoverBorderClass} rounded-xl transition-all duration-500 group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className={`font-bold italic text-lg uppercase tracking-wide mb-1 ${textClass}`}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-400">{product.brand}</p>
                  </div>
                  <span className={`text-lg font-bold ${textClass}`}>
                    {product.price}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-zinc-400">
                    <span>{t('admin.products.stock')}: </span>
                    <span className={product.stock > 50 ? 'text-green-500' : product.stock > 20 ? 'text-yellow-500' : 'text-red-500'}>
                      {product.stock}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    product.status === 'active' 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {product.status === 'active' ? t('admin.products.active') : t('admin.products.inactive')}
                  </span>
                </div>

                {/* Quick Actions on Hover */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold uppercase tracking-wide border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
                    <Eye className="w-3.5 h-3.5" />
                    {t('admin.products.view')}
                  </button>
                  <button className={`flex-1 flex items-center justify-center gap-1 py-2 text-xs font-bold uppercase tracking-wide border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
                    <Edit className="w-3.5 h-3.5" />
                    {t('admin.products.edit')}
                  </button>
                  <button className="flex items-center justify-center gap-1 px-2.5 py-2 text-xs font-bold uppercase tracking-wide border border-red-500/50 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-8 text-center">
            <button className={`inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold uppercase tracking-wide border ${borderClass} rounded-lg transition-colors ${textClass} hover:border-[#FF6B00]`}>
              <ArrowUpDown className="w-3.5 h-3.5" />
              Charger plus
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminProducts;
