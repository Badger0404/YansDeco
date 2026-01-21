import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './auth/AuthModal';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

interface SiteConfig {
  phone1: { ru: string; fr: string; en: string };
  phone2: { ru: string; fr: string; en: string };
  email: { ru: string; fr: string; en: string };
  address: { ru: string; fr: string; en: string };
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const { totalItems, setIsCartOpen } = useCart();
  const { client, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isLight = theme === 'light';

  useEffect(() => {
    fetchSiteConfig();
  }, []);

  const fetchSiteConfig = async () => {
    try {
      const response = await fetch('https://yasndeco-api.andrey-gaffer.workers.dev/api/site-config');
      const data = await response.json();
      if (data.success) {
        setSiteConfig(data.data);
      }
    } catch (error) {
      console.error('Error fetching site config:', error);
    }
  };

  const getConfigValue = (key: string) => {
    if (!siteConfig || !(key in siteConfig)) return '';
    const lang = i18n.language;
    const configValue = siteConfig[key as keyof SiteConfig];
    if (!configValue) return '';
    return configValue[lang as keyof typeof configValue] || configValue.fr || '';
  };

  const currentLang = i18n.language;

  const navItems = [
    { key: 'accueil', label: t('nav.home'), path: '/' },
    { key: 'catalogue', label: t('nav.catalogue'), path: '/catalogue' },
    { key: 'marques', label: t('nav.brands'), path: '/marques' },
    { key: 'services', label: t('nav.services'), path: '/services' },
    { key: 'calculateurs', label: t('nav.calculators'), path: '/calculateurs' },
    { key: 'contact', label: t('nav.contact'), path: '/contact' },
    { key: 'legal', label: t('nav.legal'), path: '/legal' }
  ];

  const navigate = useNavigate();

  const handleNavClick = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };


  const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' }
  ];

  return (
    <>
      <header className={`w-full flex items-center justify-between px-3 sm:px-6 lg:px-10 py-3 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLight 
          ? 'bg-white/90 backdrop-blur-md border-gray-200' 
          : 'bg-black/80 backdrop-blur-md border-gray-800'
      }`}>
        <button
          className={`p-1.5 sm:p-2 transition-colors lg:hidden ${isLight ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-[#FF6B00]'}`}
          onClick={() => setIsMenuOpen(true)}
          aria-label="Menu"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <NavLink
          to="/"
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <h1 className="font-bold text-xl sm:text-2xl tracking-wide">
            <span className="text-[#FF6B00]">YAN'S</span>
            <span className={isLight ? 'text-black' : 'text-white'}>DECO</span>
          </h1>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `text-[10px] xl:text-xs uppercase tracking-widest font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-[#FF6B00]'
                    : isLight 
                      ? 'text-black hover:text-[#FF6B00]' 
                      : 'text-white hover:text-[#FF6B00]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className={`hidden xs:flex flex-col items-end text-[9px] sm:text-[10px] font-medium leading-tight ${
            isLight ? 'text-gray-600' : 'text-gray-400'
          }`}>
            <span>{getConfigValue('phone1') || t('header.phone1')}</span>
            <span>{getConfigValue('phone2') || t('header.phone2')}</span>
          </div>

          <div className="flex gap-0.5 sm:gap-1 text-[10px] sm:text-xs">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`px-1.5 sm:px-2 py-1 rounded transition-all duration-200 font-medium ${
                  currentLang === lang.code
                    ? 'bg-[#FF6B00] text-black'
                    : isLight 
                      ? 'text-gray-600 hover:text-black' 
                      : 'text-gray-400 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <button 
            className={`relative p-1.5 transition-colors duration-200 ${isLight ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-[#FF6B00]'}`}
            aria-label="Panier"
            onClick={() => setIsCartOpen(true)}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-[#FF6B00] text-black text-[9px] sm:text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </button>

          {isAuthenticated && client ? (
            <div className="hidden sm:flex items-center gap-1.5 relative group">
              <button className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide hover:text-[#FF6B00] transition-colors">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#FF6B00] flex items-center justify-center">
                  <span className="text-black text-[10px] sm:text-xs font-bold">
                    {client.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className={`hidden sm:inline ${isLight ? 'text-black' : 'text-white'}`}>
                  {client.name.split(' ')[0]}
                </span>
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full right-0 mt-2 w-44 sm:w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-1.5 sm:p-2">
                  <button
                    onClick={() => navigate('/profile')}
                    className="w-full text-left px-3 py-2 text-xs sm:text-sm hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {t('auth.profile')}
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-3 py-2 text-xs sm:text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {t('auth.logout')}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-[#FF6B00] text-black px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-none hover:opacity-90 transition-opacity duration-200"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="hidden xs:inline">Connexion</span>
            </button>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleTheme();
            }}
            className={`p-1.5 transition-colors duration-200 ${
              isLight ? 'text-black hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
            }`}
            aria-label="Toggle theme"
          >
            {isLight ? (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[60]">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className={`absolute left-0 top-0 bottom-0 w-full max-w-sm sm:max-w-xs ${isLight 
              ? 'bg-white/95 backdrop-blur-xl border-r border-gray-200' 
              : 'bg-zinc-900/95 backdrop-blur-xl border-r border-gray-800'
          }`}>
            <div className="p-4 sm:p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className={`font-bold text-lg sm:text-xl ${isLight ? 'text-black' : 'text-white'}`}>
                  MENU
                </h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-1.5 sm:p-2 transition-colors ${isLight ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-[#FF6B00]'}`}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-1.5 sm:gap-2 text-xs sm:text-sm mb-3 sm:mb-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-md font-medium transition-all duration-200 ${
                      currentLang === lang.code
                        ? 'bg-[#FF6B00] text-black'
                        : isLight 
                          ? 'bg-gray-100 text-gray-600 hover:text-black' 
                          : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              <div className={`text-[10px] sm:text-xs ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                <span>{t('header.phone1')}</span>
                <br />
                <span>{t('header.phone2')}</span>
              </div>
            </div>

            <nav className="p-3 sm:p-4">
              <ul className="space-y-1 sm:space-y-2">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm uppercase tracking-wide font-medium transition-all duration-200 ${
                        isLight 
                          ? 'text-black hover:bg-[#FF6B00] hover:text-black' 
                          : 'text-white hover:bg-[#FF6B00] hover:text-black'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-2 sm:space-y-3">
                {isAuthenticated && client ? (
                  <>
                    <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg ${isLight ? 'bg-gray-100' : 'bg-white/10'}`}>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FF6B00] flex items-center justify-center">
                        <span className="text-black font-bold text-xs sm:text-sm">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-xs sm:text-sm truncate ${isLight ? 'text-black' : 'text-white'}`}>
                          {client.name}
                        </p>
                        <p className={`text-[10px] sm:text-xs truncate ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                          {client.email}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        navigate('/profile');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 sm:gap-2 border border-[#FF6B00] text-[#FF6B00] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-[#FF6B00] hover:text-black transition-colors"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      {t('auth.profile')}
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 sm:gap-2 border border-red-500 text-red-500 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    >
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      {t('auth.logout')}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-[#FF6B00] text-black px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Connexion
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} theme={theme} />
    </>
  );
};

export default Header;
