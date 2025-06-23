import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTable } from '../contexts/table.context';
import { MenuList } from '../features/menu/list/menu-list';
import { Header } from '../components/header';

export const TableEntryPage = () => {
  const { restaurantId, qrId } = useParams();
  const { setContext } = useTable();

  useEffect(() => {
    if (restaurantId && qrId) {
      console.log('[TableEntry] Params:', { restaurantId, qrId });
      // TODO: Fetch restaurant name from Firestore
      setContext(restaurantId, qrId, 'test');
    } else {
      setContext(restaurantId || '', qrId || '');
    }
  }, [restaurantId, qrId]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <MenuList />
      </main>
    </div>
  );
};
