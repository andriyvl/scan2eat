import type { OrderDish } from '@/features/menu/order/types/order.types';

export const calculateOrderTotal = (dishes: OrderDish[]): number => {
  return dishes.reduce((total, dish) => {
    const dishTotal = dish.basePrice + dish.addons.reduce((sum, addon) => sum + addon.price, 0);
    return total + dishTotal;
  }, 0);
}; 