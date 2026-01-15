import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const footerLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Catalogue', path: '/catalogue' },
    { label: 'Calculateurs', path: '/calculateurs' }
  ];

  return (
    <footer className="bg-black/90 backdrop-blur-md border-t border-gray-800 pt-16 pb-8 dark:bg-black/90 dark:border-gray-800 light:bg-white/90 light:border-gray-300 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <Link
              to="/"
              className="text-2xl font-bold tracking-wider mb-4 hover:opacity-80 transition-opacity inline-block"
            >
              <span className="text-[#FF6B00]">YAN'S</span>
              <span className="dark:text-white light:text-black">DECO</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 light:text-gray-600 mb-4 font-light text-sm leading-relaxed">
              Le partenaire de vos chantiers et projets de rénovation. Qualité, conseil et expertise à votre service.
            </p>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 light:text-gray-600">
              <p>+33 1 23 45 67 89</p>
              <p>contact@yansdeco.fr</p>
            </div>
          </div>

          <div>
            <h4 className="text-white dark:text-white light:text-black font-bold uppercase tracking-wider text-xs mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-gray-500 dark:text-gray-400 light:text-gray-600 hover:text-[#FF6B00] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white dark:text-white light:text-black font-bold uppercase tracking-wider text-xs mb-4">Yan's Deco</h4>
            <p className="text-gray-500 dark:text-gray-400 light:text-gray-600 mb-2 text-sm">© 2026 YAN'S DECO</p>
            <p className="text-[#FF6B00] font-semibold text-sm">
              Groslay • Montmorency • Ile-de-France
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 dark:border-gray-700 light:border-gray-300 text-center text-xs text-gray-600">
          <p>Tous droits réservés. Conception et réalisation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
