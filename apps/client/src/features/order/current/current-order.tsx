import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { useTable } from '@/contexts/table.context';
import type { Order } from '@/types/types';
import { PaymentCall } from '@/features/call/payment-call';
import { WaiterCall } from '@/features/call/waiter-call';
import { useTranslation } from 'react-i18next';

interface CurrentOrderProps {
  orderId: string;
}

export const CurrentOrder = ({ orderId }: CurrentOrderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tableId, restaurantId, setContext } = useTable();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasActivePaymentCall, setHasActivePaymentCall] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing');
      setLoading(false);
      return;
    }

    const unsubscribeOrder = onSnapshot(
      doc(db, 'orders', orderId),
      (docSnap) => {
        if (docSnap.exists()) {
          const orderData = docSnap.data() as Omit<Order, 'id'>;
          if (!tableId) {
            setContext('restScan2EatDemo', orderData.tableId);
          }
          setOrder({ id: docSnap.id, ...orderData });
          console.log('Order status:', orderData.status); // Debug log
        } else {
          setError('Order not found');
        }
        setLoading(false);
      },
      (error) => {
        setError('Error loading order');
        setLoading(false);
        console.error('Error loading order:', error);
      }
    );

    // Listen for payment calls
    const unsubscribePaymentCalls = tableId ? onSnapshot(
      query(
        collection(db, 'calls'),
        where('tableId', '==', tableId),
        where('type', '==', 'payment_call'),
        where('status', '==', 'active')
      ),
      (snapshot) => {
        const hasCall = !snapshot.empty;
        console.log('Has active payment call:', hasCall); // Debug log
        setHasActivePaymentCall(hasCall);
      }
    ) : () => {};

    return () => {
      unsubscribeOrder();
      unsubscribePaymentCalls();
    };
  }, [orderId, tableId, setContext]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading order status...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Order not found</div>;
  }

  const canAddMoreItems = order.status === 'pending' && !hasActivePaymentCall;
  console.log('Can add more items:', canAddMoreItems, 'Order status:', order.status, 'Has active payment call:', hasActivePaymentCall); // Debug log

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 max-w-lg mx-auto border border-gray-100 mt-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Order #{order.id}</h2>
        <div className={`inline-block px-5 py-2 rounded-full text-base font-semibold ${getStatusColor(order.status)} shadow-sm mb-2`}
          style={{ minWidth: 120 }}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Order Items</h3>
        <div className="space-y-4">
          {order.dishes.map((dish, index) => (
            <div key={index} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3 shadow-sm">
              <div>
                <span className="font-medium">{dish.name}</span>
                {dish.addons.length > 0 && (
                  <div className="text-sm text-gray-500">
                    {dish.addons.map(addon => addon.name).join(', ')}
                  </div>
                )}
                {dish.comment && (
                  <div className="text-sm text-gray-400 italic">{dish.comment}</div>
                )}
              </div>
              <span className="font-semibold">{dish.price}₫</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center font-bold text-xl">
          <span>Total</span>
          <span>{order.price}₫</span>
        </div>
      </div>

      <div className="mb-6 text-sm text-gray-500 text-center">
        <p>Order placed: {order.createdAt?.toDate().toLocaleString()}</p>
        <p>Last updated: {order.updatedAt?.toDate().toLocaleString()}</p>
      </div>

      {canAddMoreItems && (
        <button
          onClick={() => navigate(`/${restaurantId}/${tableId}`)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-base mb-4 hover:bg-blue-700 transition-colors shadow-sm"
        >
          {t('add_more_items')}
        </button>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <WaiterCall />
        <PaymentCall />
      </div>
    </div>
  );
}; 