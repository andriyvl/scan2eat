import { useParams } from 'react-router-dom';
import { CurrentOrder } from '@/features/order/current/current-order';

export const OrderStatusPage = () => {
  const { orderId } = useParams();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Order Status</h1>
      <CurrentOrder orderId={orderId as string} />
    </div>
  );
}; 