import './app.css'
import { LanguageProvider } from './contexts/language.context';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TableProvider } from './contexts/table.context';
import { TableEntryPage } from './pages/table-entry-page';
import { OrderStatusPage } from './pages/order-status-page';

export const App = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <TableProvider>
            <main className="flex-1 min-h-0 bg-main flex flex-col">
              <Routes>
                <Route path="/" element={<TableEntryPage />} />
                <Route path=":restaurantId/:qrId" element={<TableEntryPage />} />
                <Route path=":restaurantId/:qrId/order/:orderId" element={<OrderStatusPage />} />
              </Routes>
            </main>
        </TableProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};