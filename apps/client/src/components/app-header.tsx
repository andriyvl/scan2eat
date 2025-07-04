import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';

export const AppHeader = () => {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">{t('welcome')}</h1>
        <LanguageSwitcher />
      </div>
    </header>
  );
}; 