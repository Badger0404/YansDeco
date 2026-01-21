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
  LogOut,
  User,
  ChevronRight,
  Menu,
  X,
  Home,
  Users,
  Moon,
  Sun
} from 'lucide-react';

const AdminHeader: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isLight, setIsLight] = useState(() => localStorage.getItem('site-theme') === 'light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const handleStorageChange = () => {
    setIsLight(localStorage.getItem('site-theme') === 'light');
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('themechange', handleStorageChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('themechange', handleStorageChange);
    };
  }, [isMobile]);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleToggleTheme = () => {
    const newTheme = isLight ? 'dark' : 'light';
    localStorage.setItem('site-theme', newTheme);
    setIsLight(!isLight);
    window.dispatchEvent(new Event('themechange'));
  };

  const isVTerminal = location.pathname === '/v-terminal';

  const adminNavItems = [
    { id: 'dashboard', label: t('admin.nav.dashboard'), icon: <Home className="w-4 h-4" />, path: '/admin' },
    { id: 'products', label: t('admin.sections.products.title'), icon: <Package className="w-4 h-4" />, path: '/admin/products' },
    { id: 'categories', label: t('admin.sections.categories.title'), icon: <Tag className="w-4 h-4" />, path: '/admin/categories' },
    { id: 'brands', label: t('admin.sections.brands.title'), icon: <Award className="w-4 h-4" />, path: '/admin/brands' },
    { id: 'clients', label: 'CLIENTS', icon: <Users className="w-4 h-4" />, path: '/admin/clients' },
    { id: 'translations', label: t('admin.sections.translations.title'), icon: <Globe className="w-4 h-4" />, path: '/admin/translations' },
    { id: 'calculators', label: t('admin.sections.calculators.title'), icon: <Calculator className="w-4 h-4" />, path: '/admin/calculators' },
    { id: 'settings', label: t('admin.sections.settings.title'), icon: <Settings className="w-4 h-4" />, path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-area-top ${
        isLight 
          ? 'bg-white/95 backdrop-blur-md border-gray-200' 
          : 'bg-zinc-950/95 backdrop-blur-md border-white/10'
      }`}>
        <div className="flex items-center justify-between h-14 px-3 sm:px-4">
          <div className="flex items-center gap-2">
            {isMobile && !isVTerminal ? (
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`p-2 -ml-2 transition-colors ${isLight ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-[#FF6B00]'}`}
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to="/admin"
                className={`p-2 -ml-2 transition-colors ${isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'}`}
                aria-label="Back"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Link>
            )}
            
            {!isVTerminal && (
              <Link
                to="/"
                className={`hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${isLight ? 'text-gray-500 hover:text-[#FF6B00]' : 'text-zinc-500 hover:text-[#FF6B00]'}`}
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                {t('admin.backToSite')}
              </Link>
            )}
          </div>

          {!isVTerminal && (
            <nav className="hidden md:flex items-center gap-0.5">
              {adminNavItems.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-[#FF6B00] text-black'
                      : isLight 
                        ? 'text-gray-600 hover:bg-gray-100 hover:text-[#FF6B00]' 
                        : 'text-zinc-400 hover:bg-white/5 hover:text-[#FF6B00]'
                  }`}
                >
                  {item.icon}
                </Link>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleTheme}
              className={`p-2 transition-all duration-300 ${
                isLight ? 'text-black hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'
              }`}
              title={isLight ? t('admin.theme.dark') : t('admin.theme.light')}
            >
              {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            <div className={`w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center`}>
              <User className="w-4 h-4 text-black" />
            </div>

            {!isVTerminal && (
              <button
                onClick={() => window.location.href = '/'}
                className={`hidden sm:flex items-center gap-1.5 ml-1 px-2 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  isLight ? 'text-gray-600 hover:text-[#FF6B00]' : 'text-zinc-400 hover:text-[#FF6B00]'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {!isVTerminal && !isMobile && (
          <div className="hidden lg:block border-t border-white/5 px-4 py-1.5">
            <nav className="flex items-center gap-0.5">
              {adminNavItems.slice(5).map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-[#FF6B00] text-black'
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
        )}
      </header>

      {isMobile && !isVTerminal && isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobileMenu}
          />
          <div className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] transform transition-transform duration-300 ease-out ${
            isLight 
              ? 'bg-white/95 backdrop-blur-xl border-r border-gray-200' 
              : 'bg-zinc-900/95 backdrop-blur-xl border-r border-gray-800'
          }`}>
            <div className="pt-safe pr-4 pb-4 pl-3 border-b border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h2 className={`font-bold text-lg ${isLight ? 'text-black' : 'text-white'}`}>
                  {t('admin.menu')}
                </h2>
                <button
                  onClick={closeMobileMenu}
                  className={`p-2 -mr-2 transition-colors ${isLight ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-[#FF6B00]'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <nav className="p-3">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => {
                      closeMobileMenu();
                      window.history.back();
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm uppercase tracking-wide font-medium transition-all duration-200 ${
                      isLight 
                        ? 'text-black hover:bg-gray-100 hover:text-[#FF6B00]' 
                        : 'text-white hover:bg-white/5 hover:text-[#FF6B00]'
                    }`}
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    ← Назад
                  </button>
                </li>
                {adminNavItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm uppercase tracking-wide font-medium transition-all duration-200 ${
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

      <main className="pt-14 sm:pt-14">
        <Outlet />
      </main>
    </>
  );
};

export default AdminHeader;
