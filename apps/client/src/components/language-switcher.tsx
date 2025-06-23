import { useLanguage } from '../contexts/language.context';

export const LanguageSwitcher = () => {
  const { language, setLanguage, supportedLanguages } = useLanguage();

  return (
    <div className="flex gap-2">
      {supportedLanguages.map(lang => (
        <button 
          key={lang.id}
          onClick={() => setLanguage(lang.id)}
          className={`px-2 py-1 rounded ${language === lang.id ? 'bg-gray-200' : ''}`}
        >
          {lang.flagEmoji}
        </button>
      ))}
    </div>
  );
};