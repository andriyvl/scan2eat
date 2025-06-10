import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTable } from '@/contexts/table.context';
import { MenuPage } from '@/features/menu/menu-page';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/config/firebase.config';

export const TableEntryPage = () => {
  const { restaurantId, tableId } = useParams();
  const { setContext } = useTable();

  useEffect(() => {
    const initializeContext = async () => {
      if (restaurantId && tableId) {
        console.log('[TableEntry] Params:', { restaurantId, tableId });
        
        // Fetch restaurant name
        try {
          const restaurantDoc = await getDoc(doc(db, 'restaurants', restaurantId));
          const restaurantName = restaurantDoc.data()?.name;
          
          setContext(restaurantId, tableId, restaurantName);
        } catch (error) {
          console.error('Error fetching restaurant:', error);
          setContext(restaurantId, tableId);
        }
      }
    };

    initializeContext();
  }, [restaurantId, tableId]);

  return <MenuPage />;
};
