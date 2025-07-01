import { useMemo } from 'react';
import type { OrderDish } from '@/types/types';

/**
 * Group cart dishes by dish id and addon ids
 * @param cartDishes - The cart dishes to group
 * @returns The grouped cart dishes
 */
export function useGroupedCartDishes(cartDishes: OrderDish[]) {
  return useMemo(() => {
    return Object.values(
      cartDishes.reduce((acc, dish) => {
        const addonIds = (dish.addons && dish.addons.length > 0)
          ? dish.addons.map(a => a.id).sort().join(',')
          : '';
          
        const key = `${dish.id}__${addonIds}`;
        if (!acc[key]) {
          acc[key] = { ...dish, quantity: 1 };
        } else {
          acc[key].quantity! += 1;
        }
        return acc;
      }, {} as Record<string, OrderDish & { quantity: number }>)
    );
  }, [cartDishes]);
}