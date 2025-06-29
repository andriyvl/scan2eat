import React from 'react';
import { OrderStatus, DishStatus } from '@/types/types';
import { getOrderStatusColors, getDishStatusColors } from '@/utils/status-colors';

interface StatusBadgeProps {
  status: OrderStatus | DishStatus;
  type: 'order' | 'dish';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type,
  label,
  size = 'md',
  className = '',
}) => {
  let bg = '', text = '';
  if (type === 'order') {
    const colors = getOrderStatusColors(status as OrderStatus);
    bg = colors.bg;
    text = colors.text;
  } else {
    const colors = getDishStatusColors(status as DishStatus);
    bg = colors.bg;
    text = colors.text;
  }
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : size === 'lg'
    ? 'px-5 py-1.5 text-base'
    : 'px-3 py-1 text-sm';
  return (
    <span
      className={`inline-block rounded-full font-semibold ${sizeClasses} ${className}`}
      style={{
        background: bg,
        color: text,
      }}
    >
      {label || (typeof status === 'string' ? status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : status)}
    </span>
  );
}; 