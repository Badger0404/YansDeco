import React from 'react';
import { NavLink } from 'react-router-dom';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const [activeLang, setActiveLang] = React.useState('FR');

  const isLight = theme === 'light';

  const navItems = [
    { key: 'accueil', label: 'Accueil', path: '/' },
    { key: 'catalogue', label: 'Catalogue', path: '/catalogue' },
    { key: 'marques', label: 'Marques', path: '/marques' },
    { key: 'services', label: 'Services', path: '/services' },
    { key: 'calculateurs', label: 'Calculateurs', path: '/calculateurs' },
    { key: 'contact', label: 'Contact', path: '/contact' }
  ];

  return (
    <header className={`w-full flex items-center justify-between px-10 py-4 border-b fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isLight 
        ? 'bg-white/90 backdrop-blur-md border-gray-200' 
        : 'bg-black/80 backdrop-blur-md border-gray-800'
    }`}>
      <NavLink
        to="/"
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <h1 className="font-bold text-2xl tracking-wide">
          <span className="text-[#FF6B00]">YAN'S</span>
          <span className={isLight ? 'text-black' : 'text-white'}>DECO</span>
        </h1>
      </NavLink>

      <nav className="flex items-center gap-6">
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

      <div className="flex items-center gap-6">
        <div className={`flex flex-col items-end text-[10px] font-medium leading-tight ${
          isLight ? 'text-gray-600' : 'text-gray-400'
        }`}>
          <span>+33 1 23 45 67 89</span>
          <span>+33 6 12 34 56 78</span>
        </div>

        <div className="flex gap-2 text-xs">
          {['FR', 'EN', 'RU'].map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`font-medium transition-colors duration-200 ${
                activeLang === lang
                  ? 'text-[#FF6B00]'
                  : isLight 
                    ? 'text-gray-600 hover:text-black' 
                    : 'text-gray-400 hover:text-white'
              }`}
            >
              {lang}
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

        <button className="flex items-center gap-2 bg-[#FF6B00] text-black px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none hover:opacity-90 transition-opacity duration-200">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          Connexion
        </button>

        <button
          onClick={onToggleTheme}
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
  );
};

export default Header;