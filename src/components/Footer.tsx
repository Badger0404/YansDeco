import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  theme: 'dark' | 'light';
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isLight = theme === 'light';
  
  const footerLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Catalogue', path: '/catalogue' },
    { label: 'Calculateurs', path: '/calculateurs' }
  ];

  return (
    <footer className="relative z-10 border-t pt-16 pb-8 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link
              to="/"
              className="text-2xl font-bold tracking-wider mb-4 hover:opacity-80 transition-opacity inline-block"
            >
              <span className="text-[#FF6B00]">YAN'S</span>
              <span className={isLight ? 'text-zinc-900' : 'text-white'}>DECO</span>
            </Link>
            <p className={`mb-4 font-light text-sm leading-relaxed ${
              isLight ? 'text-zinc-700' : 'text-white'
            }`}>
              Le partenaire de vos chantiers et projets de rénovation. Qualité, conseil et expertise à votre service.
            </p>
            <div className="space-y-2 text-sm">
              <p className={isLight ? 'text-zinc-700' : 'text-white'}>+33 1 23 45 67 89</p>
              <p className={isLight ? 'text-zinc-700' : 'text-white'}>contact@yansdeco.fr</p>
            </div>
          </div>

          <div>
            <h4 className={`font-bold uppercase tracking-wider text-xs mb-4 ${
              isLight ? 'text-zinc-900' : 'text-white'
            }`}>
              Liens Rapides
            </h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className={`text-sm transition-colors ${
                      isLight 
                        ? 'text-zinc-700 hover:text-[#FF6B00]' 
                        : 'text-white hover:text-[#FF6B00]'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-bold uppercase tracking-wider text-xs mb-4 ${
              isLight ? 'text-zinc-900' : 'text-white'
            }`}>
              Yan's Deco
            </h4>
            <p className={isLight ? 'text-zinc-700' : 'text-white'}>© 2026 YAN'S DECO</p>
            <p className="text-[#FF6B00] font-semibold text-sm mt-2">
              Groslay • Montmorency • Ile-de-France
            </p>
          </div>
        </div>

        <div className={`mt-12 pt-8 text-center text-xs border-t ${
          isLight ? 'text-zinc-600 border-zinc-300' : 'text-gray-400 border-gray-700'
        }`}>
          <p>Tous droits réservés. Conception et réalisation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;