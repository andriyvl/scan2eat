import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from './firebase.config';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {} // will load manually below
});

export const loadTranslations = async (language: string) => {
  const q = query(collection(db, 'translations'), where('language', '==', language));
  const snapshot = await getDocs(q);

  const translations: Record<string, string> = {};
  snapshot.forEach((doc) => {
    const { key, value } = doc.data();
    translations[key] = value;
  });

  // Clear previous bundle
  i18n.removeResourceBundle(language, 'translation');

  // Add and switch language
  i18n.addResourceBundle(language, 'translation', translations, true, true);
  i18n.changeLanguage(language);
};
