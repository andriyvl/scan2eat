import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CurrentOrderButton = () => {
  const [orderId, setOrderId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrderId = localStorage.getItem('currentOrderId');
    setOrderId(storedOrderId);
  }, []);

  if (!orderId) return null;

  return (
    <button
      onClick={() => navigate(`/order/${orderId}`)}
      className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
    >
      <span>🛒</span>
    </button>
  );
}; 