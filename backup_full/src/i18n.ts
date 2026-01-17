import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['fr', 'en', 'ru'],
    fallbackLng: 'fr',
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

// Load translations dynamically
const loadTranslations = async () => {
  const translations = ['fr', 'en', 'ru'];
  
  for (const lang of translations) {
    try {
      const response = await fetch(`/locales/${lang}/translation.json`);
      if (response.ok) {
        const data = await response.json();
        i18n.addResourceBundle(lang, 'translation', data, true, false);
      }
    } catch (error) {
      console.warn(`Failed to load ${lang} translations:`, error);
    }
  }
};

// Initialize translations
loadTranslations().then(() => {
  i18n.emit('initialized');
});

export default i18n;
