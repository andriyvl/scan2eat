import { useTranslation } from 'react-i18next';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2 mb-4">
      <button onClick={() => changeLanguage('en')} className="underline">
        🇬🇧 English
      </button>
      <button onClick={() => changeLanguage('vi')} className="underline">
        🇻🇳 Tiếng Việt
      </button>
    </div>
  );
};
