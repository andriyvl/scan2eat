import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/language.context';
import { useTable } from '@/contexts/table.context';
import { MenuPage } from '@/features/menu/menu-page';

export const TableEntryPage = () => {
  const { restaurantId, tableId, language } = useParams();
  const { setContext } = useTable();
  const { setLanguage } = useLanguage();

  useEffect(() => {
    if (restaurantId && tableId && language) {
      console.log('[TableEntry] Params:', { restaurantId, tableId, language });
      setContext(restaurantId, tableId);
      setLanguage(language);
    }
  }, [restaurantId, tableId, language]);

  return <MenuPage />;
};
