import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loadTranslations, i18n } from '@/config/i18n.config';
import { db as firestore } from '@/config/firebase.config';
import { collection, getDocs } from 'firebase/firestore';
import type { Locale } from '@/types/types';

type LanguageContextValue = {
  language: string;
  setLanguage: (language: string) => void;
  isInitialized: boolean;
  supportedLanguages: Locale[];
};

const LANGUAGE_KEY = 'scan2eat_language';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('en-US');
  const [isInitialized, setIsInitialized] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState<Locale[]>([]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const languageCollection = collection(firestore, 'languages');
        const languageSnapshot = await getDocs(languageCollection);
        const fetchedLanguages: Locale[] = languageSnapshot.docs.map(doc => doc.data() as Locale);
        setSupportedLanguages(fetchedLanguages);
        
        const supportedLocaleIds = fetchedLanguages.map(language => language.id);
        
        let initialLocale = 'en-US';
        const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage && supportedLocaleIds.includes(savedLanguage)) {
          initialLocale = savedLanguage;
        } else {
          const browserLang = navigator.language;
          if (supportedLocaleIds.includes(browserLang)) {
            initialLocale = browserLang;
          } else {
            const browserLangCode = browserLang.split('-')[0];
            const matchingLocale = supportedLocaleIds.find(id => id.startsWith(browserLangCode));
            if (matchingLocale) {
              initialLocale = matchingLocale;
            }
          }
        }
        
        const langCode = initialLocale;
        await loadTranslations(langCode);
        i18n.changeLanguage(langCode);
        setLanguageState(initialLocale);
        localStorage.setItem(LANGUAGE_KEY, initialLocale);
      } catch (error) {
        console.error('Failed to initialize language:', error);
        await loadTranslations('en-US');
        i18n.changeLanguage('en-US');
        setLanguageState('en-US');
        localStorage.setItem(LANGUAGE_KEY, 'en-US');
      } finally {
        setIsInitialized(true);
      }
    };

    initialize();
  }, []);

  const setLanguage = async (newLanguage: string) => {
    if (!supportedLanguages.map(l => l.id).includes(newLanguage)) return;
    
    try {
      await loadTranslations(newLanguage);
      i18n.changeLanguage(newLanguage);
      setLanguageState(newLanguage);
      localStorage.setItem(LANGUAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isInitialized, supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
