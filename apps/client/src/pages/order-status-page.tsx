import { useParams } from 'react-router-dom';
import { OrderStatus } from '@/features/order/order-status';

export const OrderStatusPage = () => {
  const { orderId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Status</h1>
      <OrderStatus orderId={orderId as string} />
    </div>
  );
}; 