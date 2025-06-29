import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Order, OrderDish } from '@/types/types';

type OrderStore = {
  cartDishes: OrderDish[];
  setCartDish: (dish: OrderDish) => void;
  removeCartDish: (dishId: string) => void;
  clearCartDishes: () => void;
  updateCartDish: (dishId: string, updater: (dish: OrderDish) => OrderDish) => void;
  
  isTakeaway: boolean;
  setIsTakeaway: (isTakeaway: boolean) => void;

  currentOrder: Order | null;
  setCurrentOrder: (order: Order) => void;
  getCurrentOrderId: () => string | null;
  clearCurrentOrder: () => void;
};

export const useOrderStore = create<OrderStore>()(
  devtools(
    (set, get) => ({
      cartDishes: [],
      setCartDish: (newDish) =>
        set((state) => ({
          cartDishes: [...state.cartDishes, newDish],
        }), false, 'setCartDish'),
      removeCartDish: (dishId) =>
        set((state) => ({
          cartDishes: state.cartDishes.filter((d) => d.dishId !== dishId),
        }), false, 'removeCartDish'),
      clearCartDishes: () => set({ cartDishes: [] }, false, 'clearCartDishes'),
      updateCartDish: (dishId, updater) =>
        set((state) => ({
          cartDishes: state.cartDishes.map((dish) =>
            dish.dishId === dishId ? updater(dish) : dish
          ),
        }), false, 'updateCartDish'),

      isTakeaway: false,
      setIsTakeaway: (isTakeaway) => set({ isTakeaway }, false, 'setIsTakeaway'),
      currentOrder: null,
      getCurrentOrderId: () => get().currentOrder?.id,
      setCurrentOrder: (order) => set({ currentOrder: order }, false, 'setCurrentOrder'),
      clearCurrentOrder: () => set({ currentOrder: null }, false, 'clearCurrentOrder'),
    }),
    { name: 'OrderStore', enabled: import.meta.env.MODE === 'development' }
  )
);
