import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from './status-badge';
import { formatDate } from '../../../utils/format-date';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import type { Order } from '@/types/types';

interface OrderHeaderProps {
  order: Order;
  className?: string;
}

export function OrderHeader({ order, className = '' }: OrderHeaderProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-base">Order Status</span>
          <StatusBadge status={order.status} type="order" size="md" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <div className="flex items-center gap-1">
            <CalendarIcon size={12} className="text-gray-500" /> 
            Created at:
          </div>
          <span>{formatDate(order.createdAt?.toDate())}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
          <div className="flex items-center gap-1">
            <ClockIcon size={12} className="text-gray-500" /> 
            Preparing time:
          </div>
          <span>15 minutes</span> {/* TODO: get preparing time from server */}
        </div>
      </CardContent>
    </Card>
  );
} 