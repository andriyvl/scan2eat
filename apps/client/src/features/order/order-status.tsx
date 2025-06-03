import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { useTable } from '@/contexts/table.context';
import type { Order } from './order.types';

interface OrderStatusProps {
  orderId: string;
}

export const OrderStatus = ({ orderId }: OrderStatusProps) => {
  const navigate = useNavigate();
  const { tableId, restaurantId, setContext } = useTable();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing');
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'orders', orderId),
      (docSnap) => {
        if (docSnap.exists()) {
          const orderData = docSnap.data() as Omit<Order, 'id'>;
          if (!tableId) {
            setContext('restScan2EatDemo', orderData.tableId);
          }
          setOrder({ id: docSnap.id, ...orderData });
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

    return () => unsubscribe();
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Order #{order.id}</h2>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Order Items</h3>
        <div className="space-y-3">
          {order.dishes.map((dish, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <span className="font-medium">{dish.name}</span>
                {dish.addons.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {dish.addons.map(addon => addon.name).join(', ')}
                  </div>
                )}
                {dish.comment && (
                  <div className="text-sm text-gray-600">{dish.comment}</div>
                )}
              </div>
              <span className="font-medium">{dish.price}₫</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center font-bold text-lg">
          <span>Total</span>
          <span>{order.price}₫</span>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>Order placed: {order.createdAt?.toDate().toLocaleString()}</p>
        <p>Last updated: {order.updatedAt?.toDate().toLocaleString()}</p>
      </div>

      {order.status === 'pending' && (
        <div className="mt-6">
          <button
            onClick={() => navigate(`/${restaurantId}/${tableId}`)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add More Items
          </button>
        </div>
      )}
    </div>
  );
}; 