import './app.css'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { QrCodeProvider } from './contexts/qr-code.context';
import { MenuPage } from './pages/menu-page';
import { OrderPage } from './pages/order-page';
import { LanguagePage } from './pages/language-page';
import { WelcomePage } from './pages/welcome-page';
import { LanguageProvider } from './contexts/language.context';

const TableLayout = () => {
  return (
    <QrCodeProvider>
      <main className="flex-1 min-h-0 bg-main flex flex-col">
        <Outlet />
      </main>
    </QrCodeProvider>
  );
}

export const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <main className="flex-1 min-h-0 bg-main flex flex-col">
          <Routes>
            <Route path=":restaurantId/:qrId" element={<TableLayout/>}>
          <Route path="" element={<LanguagePage />} />
            <Route path="welcome" element={<WelcomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="order/:orderId" element={<OrderPage />} />
          </Route>
          </Routes>
        </main>
      </LanguageProvider>
    </BrowserRouter>
  );
};