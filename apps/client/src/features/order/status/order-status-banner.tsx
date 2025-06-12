import { Clock, CheckCircle2, AlertTriangle, DollarSign, Loader2 } from 'lucide-react';
import { OrderStatus } from '@/types/types';
import { getOrderStatusColors } from '@/utils/status-colors';

interface OrderStatusBannerProps {
  status: OrderStatus;
  dishesPreparing?: number;
}

const STATUS_CONFIG: Record<OrderStatus, {
  icon: React.ReactNode;
  label: string;
  details?: (dishesPreparing?: number) => string;
}> = {
  [OrderStatus.Pending]: {
    icon: <Loader2 className="w-5 h-5" />, label: 'Order pending', details: () => 'Waiting to be accepted',
  },
  [OrderStatus.InProgress]: {
    icon: <Clock className="w-5 h-5" />, label: 'Order in progress', details: (d) => d ? `• ${d} dishes preparing` : '',
  },
  [OrderStatus.Delivered]: {
    icon: <CheckCircle2 className="w-5 h-5" />, label: 'Order delivered', details: () => 'Enjoy your meal!',
  },
  [OrderStatus.RequiresAttention]: {
    icon: <AlertTriangle className="w-5 h-5" />, label: 'Needs attention', details: () => 'Please call staff',
  },
  [OrderStatus.AwaitingPayment]: {
    icon: <DollarSign className="w-5 h-5" />, label: 'Awaiting payment', details: () => 'Please pay at the counter',
  },
  [OrderStatus.Paid]: {
    icon: <CheckCircle2 className="w-5 h-5" />, label: 'Order paid', details: () => 'Thank you!',
  },
};

export const OrderStatusBanner = ({ status, dishesPreparing = 2 }: OrderStatusBannerProps) => {
  const config = STATUS_CONFIG[status];
  const colors = getOrderStatusColors(status);
  
  return (
    <div
      className="border-l-4 p-3 rounded-r-lg flex items-center space-x-2"
      style={{ 
        background: colors.bg,
        borderColor: colors.border
      }}
    >
      <span style={{ color: colors.icon }}>{config.icon}</span>
      <span className="text-sm font-medium" style={{ color: colors.text }}>{config.label}</span>
      {config.details && (
        <span className="text-xs" style={{ color: colors.textSecondary }}>{config.details(dishesPreparing)}</span>
      )}
    </div>
  );
}; 