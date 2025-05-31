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

export const loadTranslations = async (lang: string) => {
  const q = query(collection(db, 'translations'), where('lang', '==', lang));
  const snapshot = await getDocs(q);

  const translations: Record<string, string> = {};
  snapshot.forEach((doc) => {
    const { key, value } = doc.data();
    translations[key] = value;
  });

  // Clear previous bundle
  i18n.removeResourceBundle(lang, 'translation');

  // Add and switch language
  i18n.addResourceBundle(lang, 'translation', translations, true, true);
  i18n.changeLanguage(lang);
};


// FOR DEBUG
// export const loadTranslations = async (lang: string) => {
//   console.log('[debug] trying to fetch translations for:', lang);

//   try {
//     const snapshot = await getDocs(collection(db, 'translations'));
//     console.log('[debug] snapshot size:', snapshot.size);

//     snapshot.forEach((doc) => {
//       console.log('[debug] doc:', doc.id, doc.data());
//     });
//   } catch (e) {
//     console.error('[debug] error fetching translations:', e);
//   }
// };