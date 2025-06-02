// src/contexts/table-context.tsx

import { createContext, useContext, useState, type ReactNode } from 'react';

type TableContextValue = {
  restaurantId: string;
  tableId: string;
  setContext: (restaurantId: string, tableId: string) => void;
};

const TableContext = createContext<TableContextValue | undefined>(undefined);

export const TableProvider = ({ children }: { children: ReactNode }) => {
  const [restaurantId, setRestaurantId] = useState('');
  const [tableId, setTableId] = useState('');

  const setContext = (restaurant: string, table: string) => {
    setRestaurantId(restaurant);
    setTableId(table);
  };

  return (
    <TableContext.Provider value={{ restaurantId, tableId, setContext }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) throw new Error('useTable must be used within TableProvider');
  return context;
};
