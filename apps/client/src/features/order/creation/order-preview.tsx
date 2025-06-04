import { useOrderStore } from '../order.store';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language.context';
import { useTable } from '@/contexts/table.context';
import { useNavigate } from 'react-router-dom';
import { calculateOrderTotal, submitNewOrder, updateExistingOrder } from '../services/order.service';

export const OrderPreview = () => {
  const { dishes, removeDish, clearOrder } = useOrderStore();
  const [submitting, setSubmitting] = useState(false);
  const { tableId } = useTable();
  const navigate = useNavigate();
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  useEffect(() => {
    const storedOrderId = localStorage.getItem('currentOrderId');
    setCurrentOrderId(storedOrderId);
  }, []);

  const total = calculateOrderTotal(dishes);
  const { language } = useLanguage();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (currentOrderId) {
        await updateExistingOrder(currentOrderId, dishes);
        clearOrder();
        navigate(`/order/${currentOrderId}`);
      } else {
        const orderId = await submitNewOrder(tableId, language, dishes, total);
        localStorage.setItem('currentOrderId', orderId);
        clearOrder();
        navigate(`/order/${orderId}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update order');
    } finally {
      setSubmitting(false);
    }
  };

  if (!dishes.length) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t z-50">
      <h3 className="font-semibold text-lg mb-2">Your Order</h3>
      <ul className="space-y-1 max-h-40 overflow-y-auto">
        {dishes.map((d, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span>
              {d.name}
              {d.takeaway ? ' 🥡' : ''}
              {d.comment ? ` – ${d.comment}` : ''}
            </span>
            <div>
              <span>{d.price}₫</span>
              <span
                className="text-red-500 cursor-pointer ml-4"
                onClick={() => removeDish(d.dishId)}
              >
                ✕
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mt-2 font-semibold">
        <span>Total:</span>
        <span>{total}₫</span>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-2 w-full bg-blue-600 text-white py-2 rounded"
        disabled={submitting}
      >
        {submitting 
          ? 'Updating...' 
          : currentOrderId 
            ? 'Add to Current Order' 
            : 'Submit Order'}
      </button>
    </div>
  );
};
