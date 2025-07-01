import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../app.store';
import { useApp } from '@/contexts/app.context';  
import { useTranslation } from 'react-i18next';
import { OrderStatus } from '@/types/types';
import { OrderHeader } from './order-header';
import { OrderDishCard } from './order-dish-card';
import { OrderFooter } from './order-footer';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export const CurrentOrder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { qrId, restaurantId } = useApp();
  const order = useAppStore((s) => s.currentOrder);

  // Simulate loading state if order is null
  if (order === null) {
    return <div className="text-center py-8">Loading order status...</div>;
  }

  // Simulate error state if order is undefined (should not happen)
  if (typeof order === 'undefined') {
    return <div className="text-center py-8 text-red-600">Order not found</div>;
  }

  const canAddMoreItems = order.status !== OrderStatus.Paid;

  const goToMenu = () => {
    navigate(`/${restaurantId}/${qrId}/menu`);
  };

  return (
    <>
      <OrderHeader order={order} />

      {/* Order Items Section */}
      <div className="my-4">
        <h3 className="text-base font-semibold mb-2">Order Items</h3>
        <div className="space-y-3">
          {order.dishes.map((dish, index) => (
            <OrderDishCard key={`order-dish-${dish.id}-${index}`} dish={dish} />
          ))}
        </div>
      </div>

      {canAddMoreItems && (
          <Button
            onClick={goToMenu}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <div className="flex items-center justify-center gap-2">
              <PlusIcon size={16} />
              {t('add_more_items')}
            </div>
          </Button>
        )}

      <OrderFooter order={order} />
    </>
  );
}; 