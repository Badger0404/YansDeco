import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [activeLang, setActiveLang] = useState('FR');

  const navItems = [
    { key: 'accueil', label: 'Accueil', path: '/' },
    { key: 'catalogue', label: 'Catalogue', path: '/catalogue' },
    { key: 'marques', label: 'Marques', path: '/marques' },
    { key: 'services', label: 'Services', path: '/services' },
    { key: 'calculateurs', label: 'Calculateurs', path: '/calculateurs' },
    { key: 'contact', label: 'Contact', path: '/contact' }
  ];

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light-theme');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-theme');
    }
  }, [isDark]);

  return (
    <header className="w-full bg-black text-white flex items-center justify-between px-10 py-4 border-b border-gray-800 dark:bg-black dark:border-gray-800 light:bg-white light:text-black light:border-gray-200 fixed top-0 left-0 right-0 z-50">
      <NavLink
        to="/"
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
      >
        <h1 className="font-bold text-2xl tracking-wide">
          <span className="text-[#FF6B00]">YAN'S</span>
          <span className="dark:text-white light:text-black">DECO</span>
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
                  : 'text-white dark:text-white light:text-black hover:text-[#FF6B00]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-8">
        <div className="flex flex-col items-end text-[10px] text-gray-400 dark:text-gray-400 light:text-gray-600 font-medium leading-tight">
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
                  : 'text-gray-400 hover:text-white dark:hover:text-white light:hover:text-black'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <button className="text-white dark:text-white light:text-black hover:text-[#FF6B00] transition-colors duration-200" aria-label="Panier">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </button>

        <button className="bg-[#FF6B00] text-black px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-none hover:opacity-90 transition-opacity duration-200">
          Connexion
        </button>

        <button
          onClick={() => setIsDark(!isDark)}
          className="text-gray-400 hover:text-[#FF6B00] transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
