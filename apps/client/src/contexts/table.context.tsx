// src/contexts/table-context.tsx

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../features/order/order.store';

interface TableContextType {
  restaurantId: string;
  qrId: string;
  restaurantName?: string;
  setContext: (restaurantId: string, qrId: string, restaurantName?: string) => void;
}

const TableContext = createContext<TableContextType>({
  restaurantId: '',
  qrId: '',
  setContext: () => {},
});

export const useTable = () => useContext(TableContext);

export const TableProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurantId, setRestaurantId] = useState('');
  const [qrId, setQrId] = useState('');
  const [restaurantName, setRestaurantName] = useState<string>();
  const navigate = useNavigate();
  const { setCurrentOrder, clearCurrentOrder } = useOrderStore();

  const setContext = (restaurant: string, qr: string, name?: string) => {
    setRestaurantId(restaurant);
    setQrId(qr);
    if (name) {
      setRestaurantName(name);
    }
  };

  useEffect(() => {
    const data = localStorage.getItem('tableContext');
    if (data) {
      const parsed = JSON.parse(data);
      setRestaurantId(parsed.restaurantId);
      setQrId(parsed.qrId);
      setRestaurantName(parsed.restaurantName);
    }
  }, []);

  useEffect(() => {
    if (restaurantId && qrId) {
      localStorage.setItem(
        'tableContext',
        JSON.stringify({
          restaurantId,
          qrId,
          restaurantName,
        })
      );
    }
  }, [restaurantId, qrId, restaurantName]);

  useEffect(() => {
    if (!qrId) {
      clearCurrentOrder();
    }
  }, [qrId, clearCurrentOrder]);

  return (
    <TableContext.Provider value={{ restaurantId, qrId, restaurantName, setContext }}>
      {qrId && restaurantId &&children}
    </TableContext.Provider>
  );
};
