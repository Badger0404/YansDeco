import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { Instagram, Facebook, Video, Shield } from 'lucide-react';

interface FooterProps {
  theme: 'dark' | 'light';
}

interface SiteConfig {
  phone1: { ru: string; fr: string; en: string };
  phone2: { ru: string; fr: string; en: string };
  email: { ru: string; fr: string; en: string };
  address: { ru: string; fr: string; en: string };
}

const Footer: React.FC<FooterProps> = ({ theme }) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const isLight = theme === 'light';
  const isContactPage = location.pathname === '/contact';

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
  
  const footerLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.catalogue'), path: '/catalogue' },
    { label: t('nav.calculators'), path: '/calculateurs' }
  ];

  const socialLinks = [
    { 
      href: 'https://www.instagram.com/yans_deco?igsh=ZnY4dTY2OGcwNTdv', 
      icon: Instagram, 
      label: 'Instagram' 
    },
    { 
      href: 'https://www.facebook.com/share/1BqkghiSWn/?mibextid=wwXIfr', 
      icon: Facebook, 
      label: 'Facebook' 
    },
    { 
      href: 'https://www.tiktok.com/@yans.deco?_r=1&_t=ZN-936CikheAsg', 
      icon: Video, 
      label: 'TikTok' 
    }
  ];

  return (
    <footer className="relative z-10 border-t pt-16 pb-8 bg-transparent group">
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
              {t('footer.tagline')}
            </p>
            <div className="space-y-2 text-sm">
              <p className={isLight ? 'text-zinc-700' : 'text-white'}>
                {getConfigValue('phone1') || '+33 1 23 45 67 89'}
              </p>
              <p className={isLight ? 'text-zinc-700' : 'text-white'}>
                {getConfigValue('email') || 'contact@yansdeco.fr'}
              </p>
            </div>
            <div className="flex gap-3 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isLight 
                      ? 'bg-gray-100 text-gray-600 hover:bg-[#FF6B00] hover:text-black' 
                      : 'bg-white/10 text-gray-400 hover:bg-[#FF6B00] hover:text-black'
                  }`}
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`font-bold uppercase tracking-wider text-xs mb-4 ${
              isLight ? 'text-zinc-900' : 'text-white'
            }`}>
              {t('footer.quickLinks')}
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
            <p className={isLight ? 'text-zinc-700' : 'text-white'}>{t('footer.copyright')}</p>
            <p className="text-[#FF6B00] font-semibold text-sm mt-2">
              {t('footer.location')}
            </p>
            
            {/* Hidden Admin Button - Shows ONLY on hover over the button itself, ONLY on Contact page */}
            {isContactPage && (
              <div className="relative inline-block mt-3">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-500 hover:text-[#FF6B00] opacity-0 hover:opacity-100 transition-all duration-300"
                >
                  <Shield className="w-3 h-3" />
                  {t('admin.title').split(' ').slice(1).join(' ') || 'Admin'}
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className={`mt-12 pt-8 text-center text-xs border-t ${
          isLight ? 'text-zinc-600 border-zinc-300' : 'text-gray-400 border-gray-700'
        }`}>
          <p>{t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
