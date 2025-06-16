import React from 'react';
import type { OrderDish } from '@/types/types';
import { StatusBadge } from './status-badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface OrderDishCardProps {
  dish: OrderDish;
}

export const OrderDishCard: React.FC<OrderDishCardProps> = ({ dish }) => {
  return (
    <>
    <Card>
      <CardContent>
        <div className="flex items-center gap-2 my-1">
          <span className="font-medium text-base">{dish.name}</span>
          <StatusBadge status={dish.status} type="dish" size="sm" />
        </div>
      
        {dish.addons.length > 0 && (
          <div className="text-xs text-gray-500">+ {dish.addons.map(addon => addon.name).join(', ')}</div>
        )}
        {dish.comment && (
          <div className="text-xs text-gray-400 italic">Comment: {dish.comment}</div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Qty: 1</span>
          <span className="font-semibold text-red-500">{dish.price.toLocaleString()}₫</span>
      </CardFooter>
    </Card>
    </>
  );
}; 