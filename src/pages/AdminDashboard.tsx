import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Package, 
  Tag, 
  Award, 
  Globe, 
  Calculator, 
  Settings,
  Cloud,
  Plus,
  ChevronRight,
  Upload,
  Download,
  RefreshCw,
  LogOut,
  User
} from 'lucide-react';

interface AdminSection {
  id: string;
  key: string;
  icon: React.ReactNode;
  path: string;
  color: string;
  label: string;
}

interface AdminDashboardProps {
  onToggleTheme?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onToggleTheme }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [cloudStatus, setCloudStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  
  useEffect(() => {
    const handleStorageChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    
    const handleThemeChange = () => {
      setIsLight(localStorage.getItem('site-theme') === 'light');
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themechange', handleThemeChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themechange', handleThemeChange);
    };
  }, []);
  
  const themeToggleFn = () => {
    const newTheme = isLight ? 'dark' : 'light';
    localStorage.setItem('site-theme', newTheme);
    setIsLight(!isLight);
    window.dispatchEvent(new Event('themechange'));
  };
  
  const handleToggleTheme = onToggleTheme || themeToggleFn;
  
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-black' : 'border-[#FF6B00]/20';
  const hoverBorderClass = 'hover:border-[#FF6B00]';

  const adminNavItems = [
    { id: 'products', key: 'admin.sections.products', label: t('admin.sections.products.title'), icon: <Package className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', key: 'admin.sections.categories', label: t('admin.sections.categories.title'), icon: <Tag className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', key: 'admin.sections.brands', label: t('admin.sections.brands.title'), icon: <Award className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'translations', key: 'admin.sections.translations', label: t('admin.sections.translations.title'), icon: <Globe className="w-4 h-4" />, path: '/admin/translations' },
    { id: 'calculators', key: 'admin.sections.calculators', label: t('admin.sections.calculators.title'), icon: <Calculator className="w-4 h-4" />, path: '/admin/calculators' },
    { id: 'settings', key: 'admin.sections.settings', label: t('admin.sections.settings.title'), icon: <Settings className="w-4 h-4" />, path: '/admin/settings' },
  ];

  const sections: AdminSection[] = [
    {
      id: 'products',
      key: 'admin.sections.products',
      icon: <Package className="w-12 h-12" />,
      path: '/admin/products',
      color: 'from-orange-500/10 to-orange-600/5',
      label: t('admin.sections.products.title')
    },
    {
      id: 'categories',
      key: 'admin.sections.categories',
      icon: <Tag className="w-12 h-12" />,
      path: '/admin/categories',
      color: 'from-blue-500/10 to-blue-600/5',
      label: t('admin.sections.categories.title')
    },
    {
      id: 'brands',
      key: 'admin.sections.brands',
      icon: <Award className="w-12 h-12" />,
      path: '/admin/brands',
      color: 'from-yellow-500/10 to-yellow-600/5',
      label: t('admin.sections.brands.title')
    },
    {
      id: 'translations',
      key: 'admin.sections.translations',
      icon: <Globe className="w-12 h-12" />,
      path: '/admin/translations',
      color: 'from-green-500/10 to-green-600/5',
      label: t('admin.sections.translations.title')
    },
    {
      id: 'calculators',
      key: 'admin.sections.calculators',
      icon: <Calculator className="w-12 h-12" />,
      path: '/admin/calculators',
      color: 'from-purple-500/10 to-purple-600/5',
      label: t('admin.sections.calculators.title')
    },
    {
      id: 'settings',
      key: 'admin.sections.settings',
      icon: <Settings className="w-12 h-12" />,
      path: '/admin/settings',
      color: 'from-gray-500/10 to-gray-600/5',
      label: t('admin.sections.settings.title')
    }
  ];

  const isCloudOnline = cloudStatus === 'online';
  const isActive = (path: string) => location.pathname === path;
  const isRootAdmin = location.pathname === '/admin';

  const renderDashboardContent = () => (
    <>
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="font-black italic text-4xl md:text-5xl uppercase tracking-tight mb-3 text-[#FF6B00]">
          {t('admin.title')}
        </h1>
        <p className={`text-sm ${isLight ? 'text-zinc-600' : 'text-zinc-300'} max-w-2xl mx-auto`}>
          {t('admin.subtitle')}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sections.map((section, index) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Link to={section.path}>
              <div
                className={`relative h-56 rounded-xl border border-transparent ${borderClass} bg-transparent group cursor-pointer transition-all duration-500 overflow-hidden ${
                  hoveredSection === section.id ? 'drop-shadow-[0_0_15px_rgba(255,107,0,0.3)]' : ''
                }`}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Glass effect on hover */}
                <div className="absolute inset-0 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-5">
                  <div className={`mb-3 transition-all duration-500 ${
                    hoveredSection === section.id ? 'scale-110' : 'scale-100'
                  } ${hoveredSection === section.id ? 'text-[#FF6B00]' : 'text-[#FF6B00]'}`}>
                    {section.icon}
                  </div>
                  
                  <h3 className={`font-black italic text-2xl uppercase tracking-tight mb-2 transition-all duration-300 ${
                    hoveredSection === section.id ? 'text-white' : (isLight ? 'text-black' : 'text-white')
                  }`}>
                    {section.label}
                  </h3>

                  {/* Tooltip on hover */}
                  <div className={`absolute bottom-3 left-3 right-3 transition-all duration-500 ${
                    hoveredSection === section.id 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-3'
                  }`}>
                    <p className={`text-xs text-center bg-black/40 backdrop-blur-sm rounded-lg py-1.5 px-3 ${
                      hoveredSection === section.id ? 'text-zinc-200' : mutedClass
                    }`}>
                      {t(`${section.key}.description`)}
                    </p>
                  </div>
                </div>

                {/* Border glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute inset-0 rounded-xl border border-[#FF6B00]/50" />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#FF6B00]/10 to-transparent opacity-50" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-14">
        <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-5 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
          {t('admin.quickActions.title')}
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Plus className="w-4 h-4" />, label: t('admin.quickActions.newProduct'), path: '/admin/add-product' },
            { icon: <Upload className="w-4 h-4" />, label: t('admin.quickActions.importCsv') },
            { icon: <Download className="w-4 h-4" />, label: t('admin.quickActions.exportData') },
            { icon: <RefreshCw className="w-4 h-4" />, label: t('admin.quickActions.syncCloud') },
          ].map((action, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              onClick={action.path ? () => navigate(action.path!) : undefined}
              className={`flex items-center justify-center gap-2 py-3 px-4 bg-transparent border ${borderClass} rounded-lg text-xs font-bold uppercase tracking-wide ${isLight ? 'text-zinc-700' : 'text-zinc-400'} hover:text-[#FF6B00] hover:border-[#FF6B00] transition-all duration-300`}
            >
              {action.icon}
              {action.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-14">
        <h2 className={`font-bold italic text-xl uppercase tracking-wide mb-5 ${isLight ? 'text-zinc-900' : 'text-white'}`}>
          {t('admin.recentActivity.title')}
        </h2>
        
        <div className="space-y-2">
          {[
            { time: '2 min', action: t('admin.recentActivity.items.productModified'), status: 'success' },
            { time: '15 min', action: t('admin.recentActivity.items.categoryAdded'), status: 'success' },
            { time: '1 h', action: t('admin.recentActivity.items.syncComplete'), status: 'info' },
            { time: '3 h', action: t('admin.recentActivity.items.translationUpdated'), status: 'warning' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className={`flex items-center gap-3 p-3 bg-transparent border border-transparent ${borderClass} rounded-lg ${hoverBorderClass} transition-all duration-300`}
            >
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' :
                activity.status === 'warning' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.6)]' :
                'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)]'
              }`} />
              <span className={`text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'} w-14`}>{activity.time}</span>
              <span className={`text-sm ${isLight ? 'text-zinc-900' : 'text-white'} flex-1`}>{activity.action}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`} />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );

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
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            {t('admin.backToSite')}
          </button>
          <div className={`h-4 w-px ${isLight ? 'bg-gray-300' : 'bg-white/10'}`} />
          
          {/* Admin Navigation */}
          <nav className="admin-nav hidden md:flex items-center gap-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`admin-nav-item flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? isLight 
                      ? 'bg-[#FF6B00] text-black' 
                      : 'bg-[#FF6B00] text-black'
                    : isLight 
                      ? 'text-gray-600 hover:bg-gray-100 hover:text-[#FF6B00]' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-[#FF6B00]'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Cloud Status */}
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

          {/* Theme Toggle */}
          <button
            onClick={handleToggleTheme}
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

          {/* Sync Button */}
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

          {/* Admin Profile */}
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center`}>
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
          {isRootAdmin ? renderDashboardContent() : <Outlet />}
        </div>
      </main>

      {/* Footer */}
      <footer className={`border-t py-4 ${borderClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between text-xs ${mutedClass}`}>
            <span>{t('admin.footer.copyright')}</span>
            <span>{t('admin.footer.version')} 1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
