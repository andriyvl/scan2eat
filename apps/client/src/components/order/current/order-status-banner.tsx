import { Clock, CheckCircle2, AlertTriangle, DollarSign, Loader2 } from 'lucide-react';
import { useAppStore } from '../app.store';
import { getOrderStatusColors } from '@/utils/status-colors';
import { DishStatus, OrderStatus } from '@/types/types';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/app.context';

const STATUS_CONFIG = {
  pending: {
    icon: <Loader2 className="w-5 h-5" />, label: 'Order pending', details: (count = 0) => `${count} dishes awaiting`,
  },
  in_progress: {
    icon: <Clock className="w-5 h-5" />, label: 'Order in progress', details: (countPreparing = 0) => `${countPreparing} dishes preparing`,
  },
  delivered: {
    icon: <CheckCircle2 className="w-5 h-5" />, label: 'Order delivered', details: () => 'Enjoy your meal!',
  },
  requires_attention: {
    icon: <AlertTriangle className="w-5 h-5" />, label: 'Needs attention', details: () => 'Waiter was informed',
  },
  awaiting_payment: {
    icon: <DollarSign className="w-5 h-5" />, label: 'Awaiting payment', details: () => 'Please pay at the counter',
  },
  paid: {
    icon: <CheckCircle2 className="w-5 h-5" />, label: 'Order paid', details: () => 'Thank you!',
  },
};

export const OrderStatusBanner = ({ className }: { className?: string }) => {
  const currentOrder = useAppStore((s) => s.currentOrder);
  const navigate = useNavigate();
  const { restaurantId, qrId } = useApp();
  if (!currentOrder) return null;
  const status = currentOrder.status;
  const config = STATUS_CONFIG[status] || STATUS_CONFIG[OrderStatus.Pending];
  const colors = getOrderStatusColors(status);

  const dishesPreparing = currentOrder.dishes.filter(d => {
    return status === OrderStatus.Pending && d.status === DishStatus.Awaiting
    || status === OrderStatus.InProgress && d.status === DishStatus.Preparing
    || status === OrderStatus.Delivered && d.status === DishStatus.DishDelivered;
  }).length;

  const handleClick = () => {
    if (currentOrder.id && restaurantId && qrId) {
      navigate(`/${restaurantId}/${qrId}/order/${currentOrder.id}`);
    }
  };

  return (
    <div
      className={`border-l-4 p-3 rounded-r-lg flex items-center space-x-2 cursor-pointer hover:shadow-md transition-shadow ${className}`}
      style={{ 
        background: colors.bg,
        borderColor: colors.border
      }}
      onClick={handleClick}
      title="View order details"
    >
      <span style={{ color: colors.icon }}>{config.icon}</span>
      <span className="text-sm font-medium" style={{ color: colors.text }}>{config.label}</span>
      {config.details && (
        <span className="text-xs" style={{ color: colors.textSecondary }}>{config.details(dishesPreparing)}</span>
      )}
    </div>
  );
}; 