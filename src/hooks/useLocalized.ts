import { useTranslation } from 'react-i18next';
import { LocalizedString, SupportedLanguages } from '../types/localization';

export type { LocalizedString, SupportedLanguages } from '../types/localization';

export const getLang = <T extends LocalizedString | string>(
  localizedObject: T,
  language?: string
): string => {
  if (typeof localizedObject === 'string') {
    return localizedObject;
  }

  const currentLang = (language || 'fr') as SupportedLanguages;
  return localizedObject[currentLang] || localizedObject.fr || '';
};

export const useLocalized = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as SupportedLanguages;

  const tObject = <T extends LocalizedString>(obj: T): string => {
    return obj[currentLang] || obj.fr || '';
  };

  const tArray = <T extends LocalizedString>(arr: T[]): string[] => {
    return arr.map(item => tObject(item));
  };

  return {
    currentLang,
    t: (key: string) => i18n.t(key),
    tObject,
    tArray,
    getLang: <T extends LocalizedString>(obj: T) => getLang(obj, currentLang)
  };
};

export const getLocalizedField = <T extends Record<string, unknown>>(
  obj: T,
  fieldName: string,
  language: string
): string => {
  const localizedField = `${fieldName}_${language}` as keyof T;
  const fallbackField = `${fieldName}_fr` as keyof T;
  
  if (localizedField in obj && obj[localizedField]) {
    return String(obj[localizedField]);
  }
  
  if (fallbackField in obj && obj[fallbackField]) {
    return String(obj[fallbackField]);
  }
  
  return '';
};

export const formatLocalizedPrice = (
  price: number,
  currency: string = 'EUR',
  language?: string
): string => {
  const lang = (language || 'fr') as SupportedLanguages;
  
  const locales: Record<SupportedLanguages, string> = {
    fr: 'fr-FR',
    en: 'en-US',
    ru: 'ru-RU'
  };
  
  return new Intl.NumberFormat(locales[lang], {
    style: 'currency',
    currency
  }).format(price);
};

export const createMultilingualObject = <T extends string>(
  fr: T,
  en?: T,
  ru?: T
): LocalizedString => ({
  fr,
  en: en || fr,
  ru: ru || fr
});
