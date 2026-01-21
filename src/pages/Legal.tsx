import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Scale, FileText, Shield, ChevronDown } from 'lucide-react';

interface LegalData {
  mentions_fr: string;
  mentions_en: string;
  mentions_ru: string;
  cgv_fr: string;
  cgv_en: string;
  cgv_ru: string;
  privacy_fr: string;
  privacy_en: string;
  privacy_ru: string;
}

interface LegalProps {
  theme: 'dark' | 'light';
}

const Legal: React.FC<LegalProps> = ({ theme }) => {
  const { t, i18n } = useTranslation();
  const isLight = theme === 'light';
  const [loading, setLoading] = useState(true);
  const [legalData, setLegalData] = useState<LegalData | null>(null);
  const [activeSection, setActiveSection] = useState<string>('mentions');

  const API_URL = 'https://yasndeco-api.andrey-gaffer.workers.dev/api';

  useEffect(() => {
    fetchLegalData();
  }, []);

  const fetchLegalData = async () => {
    try {
      const response = await fetch(`${API_URL}/legal`);
      const data = await response.json();
      if (data.success) {
        setLegalData(data.data);
      }
    } catch (error) {
      console.error('Error fetching legal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getText = (field: keyof LegalData): string => {
    if (!legalData) return '';
    const lang = i18n.language;
    const langField = field.replace('_', `_${lang}`) as keyof LegalData;
    return legalData[langField] || legalData[field.replace('_', '_fr') as keyof LegalData] || '';
  };

  const textClass = isLight ? 'text-zinc-900' : 'text-zinc-100';
  const mutedClass = isLight ? 'text-zinc-600' : 'text-zinc-400';
  const borderClass = isLight ? 'border-gray-200' : 'border-white/10';
  const bgClass = isLight ? 'bg-gray-50' : 'bg-zinc-900/40';

  const sections = [
    { id: 'mentions', label: 'Mentions Légales', icon: <Scale className="w-5 h-5" /> },
    { id: 'cgv', label: 'Conditions Générales de Vente', icon: <FileText className="w-5 h-5" /> },
    { id: 'privacy', label: 'Politique de Confidentialité', icon: <Shield className="w-5 h-5" /> }
  ];

  const renderContent = () => {
    const content = getText(`${activeSection}_fr` as keyof LegalData);
    
    if (!content) {
      return (
        <div className={`text-center py-12 ${mutedClass}`}>
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>{t('legal.comingSoon') || 'Ce contenu sera bientôt disponible.'}</p>
        </div>
      );
    }

    return (
      <div className="prose prose-lg max-w-none">
        <div 
          className={`whitespace-pre-wrap ${textClass}`}
          dangerouslySetInnerHTML={{ 
            __html: content
              .replace(/\n/g, '<br />')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
          }}
        />
      </div>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-4 flex items-center justify-center">
        <div className={`text-center ${isLight ? 'text-black' : 'text-white'}`}>
          <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Chargement...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-4">
      <section className="py-16 transition-colors duration-500 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-black italic text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight mb-4 drop-shadow-lg">
              <span className={isLight ? 'text-black' : 'text-white'}>{t('legal.title')}</span>
            </h1>
            <p className={`max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed drop-shadow-md ${mutedClass}`}>
              {t('legal.subtitle')}
            </p>
          </div>

          {/* Mobile Tabs Dropdown */}
          <div className="lg:hidden mb-6">
            <div className={`relative ${bgClass} border ${borderClass} rounded-xl overflow-hidden`}>
              <button
                onClick={() => {
                  const dropdown = document.getElementById('legal-dropdown');
                  dropdown?.classList.toggle('hidden');
                }}
                className={`w-full px-4 py-3 flex items-center justify-between ${textClass}`}
              >
                <div className="flex items-center gap-2">
                  {sections.find(s => s.id === activeSection)?.icon}
                  <span className="font-bold uppercase tracking-wide">
                    {sections.find(s => s.id === activeSection)?.label}
                  </span>
                </div>
                <ChevronDown className="w-5 h-5 transition-transform" />
              </button>
              <div id="legal-dropdown" className="hidden border-t border-white/10">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById('legal-dropdown')?.classList.add('hidden');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-2 transition-colors ${
                      activeSection === section.id
                        ? 'bg-[#FF6B00]/20 text-[#FF6B00]'
                        : `${textClass} hover:bg-white/5`
                    }`}
                  >
                    {section.icon}
                    <span className="font-medium">{section.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className={`sticky top-24 ${bgClass} border ${borderClass} rounded-xl p-4`}>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                        activeSection === section.id
                          ? 'bg-[#FF6B00] text-black'
                          : `${textClass} hover:bg-white/5`
                      }`}
                    >
                      {section.icon}
                      <span className="font-medium text-sm uppercase tracking-wide">
                        {section.label}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Content */}
            <div className="flex-1">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`${bgClass} border ${borderClass} rounded-xl p-6 sm:p-8`}
              >
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  {sections.find(s => s.id === activeSection)?.icon}
                  <h2 className={`text-xl sm:text-2xl font-bold italic uppercase tracking-wide ${textClass}`}>
                    {sections.find(s => s.id === activeSection)?.label}
                  </h2>
                </div>

                {/* Content */}
                {renderContent()}
              </motion.div>

              {/* Last Updated */}
              <p className={`text-xs ${mutedClass} mt-4 text-center`}>
                {t('legal.lastUpdated') || 'Dernière mise à jour: Janvier 2026'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Legal;
