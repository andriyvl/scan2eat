import './app.css'
import { LanguageProvider } from './contexts/language.context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TableProvider } from './contexts/table.context';
import { TableEntryPage } from './pages/table-entry-page';
import { OrderStatusPage } from './pages/order-status-page';
import { AppHeader } from './components/app-header';

export const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <TableProvider>
          <div className="min-h-screen flex flex-col">
            <AppHeader />
            <main className="flex-1">
              <Routes>
                <Route path=":restaurantId/:tableId" element={<TableEntryPage />} />
                <Route path="order/:orderId" element={<OrderStatusPage />} />
              </Routes>
            </main>
          </div>
        </TableProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};