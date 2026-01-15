import React from 'react';

const Header: React.FC = () => {
  const navItems = ['Accueil', 'Catalogue', 'Marques', 'Services', 'Calculateurs', 'Contact'];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-20 relative">
            <div className="absolute left-0 -ml-64">
              <div className="logo-container">
                <h1 className="text-3xl font-bold tracking-wider">
                  <span className="text-accent">YAN'S</span> <span className="text-white">DECO</span>
                </h1>
              </div>
            </div>

            <nav className="hidden md:flex space-x-10">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="nav-link"
                >
                  {item}
                </a>
              ))}
            </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-5 ml-auto lg:ml-0 lg:pl-24">
              <div className="hidden lg:flex flex-col items-end text-[12px] text-gray-300 font-medium tracking-wider whitespace-nowrap">
                <span className="leading-6">+33 1 23 45 67 89</span>
                <span className="leading-6">+33 6 12 34 56 78</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button className="text-accent font-bold hover:text-white transition-colors">FR</button>
                <span className="text-gray-600">|</span>
                <button className="text-gray-400 hover:text-white transition-colors">EN</button>
                <span className="text-gray-600">|</span>
                <button className="text-gray-400 hover:text-white transition-colors">RU</button>
              </div>

              <button className="text-gray-300 hover:text-accent transition-colors mx-6" aria-label="Panier">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>

              <button className="bg-accent text-black px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider hover:bg-opacity-90 transition-all ml-12">
                Connexion
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
