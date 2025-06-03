import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { loadTranslations } from '@/config/i18n.config';

type LanguageContextValue = {
  language: string;
  setLanguage: (language: string) => void;
  isInitialized: boolean;
};

const LANGUAGE_KEY = 'scan2eat_language';
const SUPPORTED_LANGUAGES = ['en', 'vi'];

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language on mount
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // First try to get from localStorage
        const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
          await loadTranslations(savedLanguage);
          setLanguageState(savedLanguage);
          setIsInitialized(true);
          return;
        }

        // Then try to get from browser
        const browserLanguage = navigator.language.split('-')[0];
        // Only use browser language if it's supported
        if (SUPPORTED_LANGUAGES.includes(browserLanguage)) {
          await loadTranslations(browserLanguage);
          setLanguageState(browserLanguage);
          localStorage.setItem(LANGUAGE_KEY, browserLanguage);
          setIsInitialized(true);
          return;
        }

        // Default to English
        await loadTranslations('en');
        setLanguageState('en');
        localStorage.setItem(LANGUAGE_KEY, 'en');
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize language:', error);
        // Fallback to English if something goes wrong
        await loadTranslations('en');
        setLanguageState('en');
        localStorage.setItem(LANGUAGE_KEY, 'en');
        setIsInitialized(true);
      }
    };

    initializeLanguage();
  }, []);

  const setLanguage = async (newLanguage: string) => {
    if (!SUPPORTED_LANGUAGES.includes(newLanguage)) return;
    
    try {
      await loadTranslations(newLanguage);
      setLanguageState(newLanguage);
      localStorage.setItem(LANGUAGE_KEY, newLanguage);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isInitialized }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
