import React from 'react';

const Footer: React.FC = () => {
  const footerLinks = ['Accueil', 'Catalogue', 'Calculateurs'];

  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold tracking-wider mb-4">
              <span className="text-accent">YAN'S</span> <span className="text-white">DECO</span>
            </h3>
            <p className="text-gray-400 mb-4 font-light text-sm leading-relaxed">
              Le partenaire de vos chantiers et projets de rénovation. Qualité, conseil et expertise à votre service.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>+33 1 23 45 67 89</p>
              <p>contact@yansdeco.fr</p>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-gray-400 hover:text-accent transition-colors text-sm"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-4">Yan's Deco</h4>
            <p className="text-gray-400 mb-2 text-sm">© 2026 YAN'S DECO</p>
            <p className="text-accent font-semibold text-sm">
              Groslay • Montmorency • Ile-de-France
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
          <p>Tous droits réservés. Conception et réalisation.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
