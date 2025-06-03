import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTable } from '@/contexts/table.context';
import { MenuPage } from '@/features/menu/menu-page';

export const TableEntryPage = () => {
  const { restaurantId, tableId } = useParams();
  const { setContext } = useTable();

  useEffect(() => {
    if (restaurantId && tableId) {
      console.log('[TableEntry] Params:', { restaurantId, tableId });
      setContext(restaurantId, tableId);
    }
  }, [restaurantId, tableId]);

  return <MenuPage />;
};
