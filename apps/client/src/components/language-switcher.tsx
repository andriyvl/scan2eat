import { loadTranslations } from '../config/i18n.config';
import { useLanguage } from '../contexts/language.context';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = async (newLang: string) => {
    await loadTranslations(newLang);
    setLanguage(newLang);
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={() => handleLanguageChange('en')}
        className={`px-2 py-1 rounded ${language === 'en' ? 'bg-gray-200' : ''}`}
      >
        🇬🇧 English
      </button>
      <button 
        onClick={() => handleLanguageChange('vi')}
        className={`px-2 py-1 rounded ${language === 'vi' ? 'bg-gray-200' : ''}`}
      >
        🇻🇳 Tiếng Việt
      </button>
    </div>
  );
};