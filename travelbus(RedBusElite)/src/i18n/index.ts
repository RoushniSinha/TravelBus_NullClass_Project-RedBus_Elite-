import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import hi from './locales/hi.json';
import te from './locales/te.json';
import ta from './locales/ta.json';
import mr from './locales/mr.json';

i18n.use(initReactI18next).init({
  resources: { en: { translation: en }, hi: { translation: hi }, te: { translation: te }, ta: { translation: ta }, mr: { translation: mr } },
  lng: localStorage.getItem('rbe_lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => localStorage.setItem('rbe_lang', lng));

export default i18n;
