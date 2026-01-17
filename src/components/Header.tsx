import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLight = theme === 'light';

  const currentLang = i18n.language;

  const navItems = [
    { key: 'accueil', label: t('nav.home'), path: '/' },
    { key: 'catalogue', label: t('nav.catalogue'), path: '/catalogue' },
    { key: 'marques', label: t('nav.brands'), path: '/marques' },
    { key: 'services', label: t('nav.services'), path: '/services' },
    { key: 'calculateurs', label: t('nav.calculators'), path: '/calculateurs' },
    { key: 'contact', label: t('nav.contact'), path: '/contact' }
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
      <header className={`w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLight 
          ? 'bg-white/90 backdrop-blur-md border-gray-200' 
          : 'bg-black/80 backdrop-blur-md border-gray-800'
      }`}>
        <button
          className={`lg:hidden p-2 transition-colors ${isLight ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-[#FF6B00]'}`}
          onClick={() => setIsMenuOpen(true)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <NavLink
          to="/"
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <h1 className="font-bold text-2xl tracking-wide">
            <span className="text-[#FF6B00]">YAN'S</span>
            <span className={isLight ? 'text-black' : 'text-white'}>DECO</span>
          </h1>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) =>
                `text-xs uppercase tracking-widest font-medium transition-colors duration-200 ${
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

        <div className="flex items-center gap-4">
          <div className={`hidden sm:flex flex-col items-end text-[10px] font-medium leading-tight ${
            isLight ? 'text-gray-600' : 'text-gray-400'
          }`}>
            <span>{t('header.phone1')}</span>
            <span>{t('header.phone2')}</span>
          </div>

          <div className="hidden sm:flex gap-1 text-xs">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`px-2 py-1 rounded transition-all duration-200 font-medium ${
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
            className={`transition-colors duration-200 ${isLight ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-[#FF6B00]'}`} 
            aria-label="Panier"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>

          <button className="hidden sm:flex items-center gap-2 bg-[#FF6B00] text-black px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none hover:opacity-90 transition-opacity duration-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Connexion
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              console.log('Theme button clicked');
              onToggleTheme();
            }}
            className={`transition-colors duration-200 ${
              isLight ? 'text-black hover:text-[#FF6B00]' : 'text-gray-400 hover:text-[#FF6B00]'
            }`}
            aria-label="Toggle theme"
          >
            {isLight ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
          <div className={`absolute left-0 top-0 bottom-0 w-80 max-w-[80vw] transform transition-transform duration-300 ease-out ${
            isLight 
              ? 'bg-white/95 backdrop-blur-xl border-r border-gray-200' 
              : 'bg-zinc-900/95 backdrop-blur-xl border-r border-gray-800'
          }`}>
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`font-bold text-xl ${isLight ? 'text-black' : 'text-white'}`}>
                  MENU
                </h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-2 transition-colors ${isLight ? 'text-black hover:text-[#FF6B00]' : 'text-white hover:text-[#FF6B00]'}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2 text-sm mb-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => i18n.changeLanguage(lang.code)}
                    className={`px-3 py-1 rounded-md font-medium transition-all duration-200 ${
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

              <div className={`text-xs ${isLight ? 'text-gray-600' : 'text-gray-400'}`}>
                <span>{t('header.phone1')}</span>
                <br />
                <span>{t('header.phone2')}</span>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.key}>
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`w-full text-left px-4 py-3 rounded-lg text-sm uppercase tracking-wide font-medium transition-all duration-200 ${
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

              <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] text-black px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Connexion
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
