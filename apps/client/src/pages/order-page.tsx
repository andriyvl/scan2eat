import { Header } from '@/components/header';
import { CurrentOrder } from '@/components/order/current/current-order';

export const OrderPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-1 p-4">
    <CurrentOrder />
    </main>
  </div>
      
  );
}; 