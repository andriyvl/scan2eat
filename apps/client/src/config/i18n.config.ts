import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getDoc, doc } from 'firebase/firestore';
import { db } from './firebase.config';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {} // will load manually below
});

export const loadTranslations = async (language: string) => {
  try {
    const docRef = doc(db, 'translations', language);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.error(`No translations found for language: ${language}`);
      return;
    }

    const translations = docSnap.data();

    // Clear previous bundle
    i18n.removeResourceBundle(language, 'translation');

    // Add and switch language
    i18n.addResourceBundle(language, 'translation', translations, true, true);
    i18n.changeLanguage(language);
  } catch (error) {
    console.error(`Failed to load translations for ${language}:`, error);
  }
};
