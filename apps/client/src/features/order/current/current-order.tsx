import { useNavigate } from 'react-router-dom';
import { useTable } from '@/contexts/table.context';
import { useOrderStore } from '../order.store';
import { PaymentCall } from '@/features/call/payment-call';
import { useTranslation } from 'react-i18next';
import { getOrderStatusColors, getDishStatusColorVar } from '@/utils/status-colors';
import { OrderStatus } from '@/types/types';
import { formatDate } from '../../../utils/format-date';
import { StatusBadge } from './status-badge';
import { OrderDishCard } from './order-dish-card';
import { RequestPaymentButton } from './request-payment-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, ClockIcon, PlusIcon } from 'lucide-react';

export const CurrentOrder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { qrId, restaurantId } = useTable();
  const order = useOrderStore((s) => s.currentOrder);

  // Simulate loading state if order is null
  if (order === null) {
    return <div className="text-center py-8">Loading order status...</div>;
  }

  // Simulate error state if order is undefined (should not happen)
  if (typeof order === 'undefined') {
    return <div className="text-center py-8 text-red-600">Order not found</div>;
  }

  const canAddMoreItems = order.status !== OrderStatus.Paid;

  return (

      <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-base">Order Status</span>
            <StatusBadge status={order.status} type="order" size="sm" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <div className="flex items-center gap-1"><CalendarIcon size={12} className="text-gray-500" /> Created at:</div>
            <span>{formatDate(order.createdAt?.toDate())}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <div className="flex items-center gap-1"><ClockIcon size={12} className="text-gray-500" /> Preparing time:</div>
            <span>15 minutes</span> {/* TODO: get preparing time from server */}
          </div>
        </CardContent>
      </Card>

      {/* Order Items Section */}
      <div className="my-4">
        <h3 className="text-base font-semibold mb-2">Order Items</h3>
        <div className="space-y-3">
          {order.dishes.map((dish, index) => (
            <OrderDishCard key={`order-dish-${dish.dishId}-${index}`} dish={dish} />
          ))}
        </div>
      </div>

      {canAddMoreItems && (
          <Button
            onClick={() => navigate(`/${restaurantId}/${qrId}`)}
            variant="outline"
            size="lg"
          >
            <div className="flex items-center justify-center gap-2">
              <PlusIcon size={16} />
              {t('add_more_items')}
            </div>
          </Button>
        )}

      <Card className="rounded-b-3xl mt-4">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-t py-2">
            <div className="flex justify-between items-center text-base">
              <span>Tax included (15%)</span>
              <span>{(order.price * 0.05).toLocaleString()}₫</span>
            </div>
            <div className="flex justify-between items-center font-bold text-base">
              <span>Total</span>
              <span>{order.price.toLocaleString()}₫</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-stretch">
          <RequestPaymentButton className="w-full" />
        </CardFooter>
      </Card>
    </>
  );
}; 