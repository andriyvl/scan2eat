import './app.css'
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/languge-switcher';

export const App = () => {
  const { t } = useTranslation();

  return (
    <>
    <div className="p-4">
      <LanguageSwitcher />
      <h1 className="text-xl font-bold">{t('welcome')}</h1>
      <button className="mt-4 px-4 py-2 bg-black text-white rounded">
        {t('order')}
      </button>
    </div>
    </>
  )
};