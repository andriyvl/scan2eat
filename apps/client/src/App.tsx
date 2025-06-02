import './app.css'
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './components/language-switcher';
import { MenuPage } from './features/menu/menu-page';
import { LanguageProvider } from './contexts/language.context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TableProvider } from './contexts/table.context';
import { TableEntryPage } from './pages/table-entry';

export const App = () => {
  const { t } = useTranslation();

  return (
      <BrowserRouter>
        <LanguageProvider>
          <div className="p-4">
            <LanguageSwitcher />
            <h1 className="text-xl font-bold">{t('welcome')}</h1>
            <button className="mt-4 px-4 py-2 bg-black text-white rounded">
              {t('order')}
            </button>
          </div>
          <div className="max-w-xl mx-auto">
            <MenuPage />
          </div>
          <TableProvider>
          <Routes>
            <Route path="t/:restaurantId/:tableId/:language" element={<TableEntryPage />} />
          </Routes>
        </TableProvider>
        </LanguageProvider>
    </BrowserRouter>
  )
};