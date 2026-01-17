import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Package,
  Tag,
  Award,
  Globe,
  Calculator,
  Settings,
  Cloud,
  Upload,
  RefreshCw,
  LogOut,
  User,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const AdminHeader: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  const [cloudStatus, setCloudStatus] = useState<'online' | 'offline' | 'syncing'>('online');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleToggleTheme = () => {
    const newTheme = isLight ? 'dark' : 'light';
    localStorage.setItem('site-theme', newTheme);
    setIsLight(!isLight);
    window.dispatchEvent(new Event('themechange'));
  };

  const adminNavItems = [
    { id: 'dashboard', key: 'admin.sections.dashboard', label: t('admin.nav.dashboard'), icon: null, path: '/admin' },
    { id: 'products', key: 'admin.sections.products', label: t('admin.sections.products.title'), icon: <Package className="w-5 h-5" />, path: '/admin/products' },
    { id: 'categories', key: 'admin.sections.categories', label: t('admin.sections.categories.title'), icon: <Tag className="w-5 h-5" />, path: '/admin/categories' },
    { id: 'brands', key: 'admin.sections.brands', label: t('admin.sections.brands.title'), icon: <Award className="w-5 h-5" />, path: '/admin/brands' },
    { id: 'translations', key: 'admin.sections.translations', label: t('admin.sections.translations.title'), icon: <Globe className="w-5 h-5" />, path: '/admin/translations' },
    { id: 'calculators', key: 'admin.sections.calculators', label: t('admin.sections.calculators.title'), icon: <Calculator className="w-5 h-5" />, path: '/admin/calculators' },
    { id: 'settings', key: 'admin.sections.settings', label: t('admin.sections.settings.title'), icon: <Settings className="w-5 h-5" />, path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const isCloudOnline = cloudStatus === 'online';

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLight 
          ? 'bg-white/95 backdrop-blur-md border-gray-200' 
          : 'bg-black/95 backdrop-blur-md border-white/10'
      }`}>
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-2 transition-colors ${isLight ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-[#FF6B00]'}`}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          
          <Link
            to="/"
            className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'
            }`}
          >
            <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            {t('admin.backToSite')}
          </Link>
          
          {!isMobile && <div className={`h-4 w-px ${isLight ? 'bg-gray-300' : 'bg-white/10'}`} />}
          
          {!isMobile && (
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
          )}
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

          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full bg-[#FF6B00] flex items-center justify-center`}>
              <User className="w-3.5 h-3.5 text-black" />
            </div>
            <button
              onClick={() => window.location.href = '/'}
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

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobileMenu}
          />
          <div className={`absolute left-0 top-0 bottom-0 w-80 max-w-[80vw] transform transition-transform duration-300 ease-out ${
            isLight 
              ? 'bg-white/95 backdrop-blur-xl border-r border-gray-200' 
              : 'bg-zinc-900/95 backdrop-blur-xl border-r border-gray-800'
          }`}>
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`font-bold text-lg ${isLight ? 'text-black' : 'text-white'}`}>
                  MENU
                </h2>
                <button
                  onClick={closeMobileMenu}
                  className={`p-2 transition-colors ${isLight ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-[#FF6B00]'}`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {adminNavItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-lg text-sm uppercase tracking-wide font-medium transition-all duration-200 ${
                        isActive(item.path)
                          ? isLight 
                            ? 'bg-[#FF6B00] text-black' 
                            : 'bg-[#FF6B00] text-black'
                          : isLight 
                            ? 'text-black hover:bg-gray-100 hover:text-[#FF6B00]' 
                            : 'text-white hover:bg-white/5 hover:text-[#FF6B00]'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}

      <main className="pt-16 pb-12">
        <Outlet />
      </main>

      <footer className={`border-t py-4 ${isLight ? 'border-gray-200' : 'border-white/10'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between text-xs ${isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
            <span>{t('admin.footer.copyright')}</span>
            <span>{t('admin.footer.version')} 1.0.0</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default AdminHeader;
