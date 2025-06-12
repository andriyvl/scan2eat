import './app.css'
import { LanguageProvider } from './contexts/language.context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TableProvider } from './contexts/table.context';
import { TableEntryPage } from './pages/table-entry-page';
import { OrderStatusPage } from './pages/order-status-page';
import { Header } from './components/header';

export const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <TableProvider>
          <div className="h-screen flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
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