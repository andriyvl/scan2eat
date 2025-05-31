import { loadTranslations } from './../i18n.config';

export const LanguageSwitcher = () => {
  return (
    <div className="flex gap-2 mb-4">
      <button onClick={() => loadTranslations('en')}>🇬🇧 English</button>
      <button onClick={() => loadTranslations('vi')}>🇻🇳 Tiếng Việt</button>
    </div>
  );
};