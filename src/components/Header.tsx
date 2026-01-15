import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const navItems = ['Accueil', 'Catalogue', 'Marques', 'Services', 'Calculateurs', 'Contact'];

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800 dark:bg-black/95 dark:border-gray-800 light:bg-white light:border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-20 relative">
            <div className="absolute left-0 -ml-64">
              <div className="logo-container">
                <h1 className="text-3xl font-bold tracking-wider dark:text-white light:text-black">
                  <span className="text-accent">YAN'S</span> <span className="dark:text-white light:text-black">DECO</span>
                </h1>
              </div>
            </div>

            <nav className="hidden md:flex space-x-10 ml-auto mr-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="nav-link dark:text-gray-300 dark:hover:text-accent light:text-gray-600 light:hover:text-accent"
                >
                  {item}
                </a>
              ))}
            </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-5 ml-auto lg:ml-0 lg:pl-24">
              <div className="hidden lg:flex flex-col items-end text-[12px] dark:text-gray-300 light:text-gray-600 font-medium tracking-wider whitespace-nowrap">
                <span className="leading-6">+33 1 23 45 67 89</span>
                <span className="leading-6">+33 6 12 34 56 78</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button className="text-accent font-bold hover:text-white transition-colors">FR</button>
                <span className="text-gray-600">|</span>
                <button className="text-gray-400 dark:hover:text-white light:text-gray-500 transition-colors">EN</button>
                <span className="text-gray-600">|</span>
                <button className="text-gray-400 dark:hover:text-white light:text-gray-500 transition-colors">RU</button>
              </div>

              <button className="text-gray-300 dark:hover:text-accent light:text-gray-600 transition-colors mx-6" aria-label="Panier">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>

              <button className="bg-accent text-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all ml-12">
                Connexion
              </button>

              <div className="theme-toggle-container ml-20 flex items-center gap-2 bg-gray-800/50 dark:bg-gray-800/50 light:bg-gray-100 rounded-lg px-3 py-2">
                <button
                  onClick={() => setIsDark(true)}
                  className={`transition-colors ${isDark ? 'text-accent' : 'text-gray-500 hover:text-gray-300'}`}
                  aria-label="Dark mode"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                </button>
                <span className="text-gray-600">|</span>
                <button
                  onClick={() => setIsDark(false)}
                  className={`transition-colors ${!isDark ? 'text-accent' : 'text-gray-500 hover:text-gray-300'}`}
                  aria-label="Light mode"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
