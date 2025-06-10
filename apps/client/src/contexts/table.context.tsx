// src/contexts/table-context.tsx

import { createContext, useContext, useState, type ReactNode } from 'react';

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

  const setContext = (restaurant: string, table: string, name?: string) => {
    setRestaurantId(restaurant);
    setTableId(table);
    if (name) setRestaurantName(name);
  };

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
