import './app.css'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from './contexts/app.context';
import { MenuPage } from './pages/menu-page';
import { OrderPage } from './pages/order-page';
import { LanguagePage } from './pages/language-page';
import { WelcomePage } from './pages/welcome-page';
import { TablesPage } from './pages/tables-page';
import { LanguageProvider } from './contexts/language.context';

const AppLayout = () => {
  return (
    <AppProvider>
      <main className="flex-1 min-h-0 bg-main flex flex-col">
        <Outlet />
      </main>
    </AppProvider>
  );
}

export const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>  
          <Routes>
            <Route path="/" element={<TablesPage />} />
            <Route path=":restaurantId/:qrId" element={<AppLayout />}>
              <Route path="" element={<LanguagePage />} />
              <Route path="welcome" element={<WelcomePage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="order/:orderId" element={<OrderPage />} />
            </Route>
          </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
};