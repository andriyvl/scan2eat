import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';
import { CurrentOrderButton } from '@/features/order/current/current-order-button';
import { useTable } from '@/contexts/table.context';

export const AppHeader = () => {
  const { t } = useTranslation();
  const { context } = useTable();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <i className="text-white text-sm">🍽️</i>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900">{context?.restaurantName || t('welcome')}</h1>
            <p className="text-xs text-gray-500">Table {context?.tableId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <LanguageSwitcher />
          <CurrentOrderButton />
        </div>
      </div>
    </header>
  );
}; 