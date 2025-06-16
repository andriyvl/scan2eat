// src/contexts/table-context.tsx

import { createContext, useContext, useState, type ReactNode, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { useOrderStore } from '@/features/order/order.store';
import type { Order } from '@/types/types';

type TableContextValue = {
  restaurantId: string;
  tableId: string;
  restaurantName?: string;
  setContext: (restaurantId: string, tableId: string, restaurantName?: string) => void;
};

const TableContext = createContext<TableContextValue | undefined>(undefined);

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [restaurantId, setRestaurantId] = useState('');
  const [tableId, setTableId] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const setCurrentOrder = useOrderStore((s) => s.setCurrentOrder);

  const setContext = (restaurant: string, table: string, name?: string) => {
    setRestaurantId(restaurant);
    setTableId(table);
    if (name) setRestaurantName(name);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      const orderId = localStorage.getItem('currentOrderId');
      if (orderId) {
        const orderRef = doc(db, 'orders', orderId);
        const orderSnap = await getDoc(orderRef);
        if (orderSnap.exists()) {
          const data = orderSnap.data();
          if (
            data &&
            data.tableId &&
            data.language &&
            typeof data.isTakeaway === 'boolean' &&
            typeof data.orderComment === 'string' &&
            data.status &&
            Array.isArray(data.dishes) &&
            typeof data.price === 'number' &&
            data.createdAt &&
            data.updatedAt
          ) {
            setCurrentOrder({
              id: orderId,
              tableId: data.tableId,
              language: data.language,
              isTakeaway: data.isTakeaway,
              orderComment: data.orderComment,
              status: data.status,
              dishes: data.dishes,
              price: data.price,
              createdAt: data.createdAt,
              updatedAt: data.updatedAt,
            } as Order);
          }
        }
      }
    };
    fetchOrder();
  }, [tableId, setCurrentOrder]);

  return (
    <TableContext.Provider value={{ restaurantId, tableId, restaurantName, setContext }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) throw new Error('useTable must be used within TableProvider');
  return context;
};
