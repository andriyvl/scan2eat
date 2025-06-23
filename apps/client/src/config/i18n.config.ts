import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase.config';

export const loadTranslations = async (locale: string) => {
  try {
    const docRef = doc(db, 'translations', locale);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error(`No translations found for language: ${locale}`);
      return;
    }

    const translations = docSnap.data();

    i18n.removeResourceBundle(locale, 'translation');

    i18n.addResourceBundle(locale, 'translation', translations, true, true);
    i18n.changeLanguage(locale);
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {}, // Start with empty resources
  });

export { i18n };
