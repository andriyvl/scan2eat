import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Order, OrderDish } from '@/types/types';

type OrderStore = {
  dishes: OrderDish[];
  setDish: (dish: OrderDish) => void;
  removeDish: (dishId: string) => void;
  clearOrder: () => void;
  updateDish: (dishId: string, updater: (dish: OrderDish) => OrderDish) => void;
  currentOrder: Order | null;
  setCurrentOrder: (order: Order) => void;
  clearCurrentOrder: () => void;
};

export const useOrderStore = create<OrderStore>()(
  devtools(
    (set) => ({
      dishes: [],
      setDish: (newDish) =>
        set((state) => ({
          dishes: [...state.dishes, newDish],
        }), false, 'setDish'),
      removeDish: (dishId) =>
        set((state) => ({
          dishes: state.dishes.filter((d) => d.dishId !== dishId),
        }), false, 'removeDish'),
      clearOrder: () => set({ dishes: [] }, false, 'clearOrder'),
      updateDish: (dishId, updater) =>
        set((state) => ({
          dishes: state.dishes.map((dish) =>
            dish.dishId === dishId ? updater(dish) : dish
          ),
        }), false, 'updateDish'),
      currentOrder: null,
      setCurrentOrder: (order) => set({ currentOrder: order }, false, 'setCurrentOrder'),
      clearCurrentOrder: () => set({ currentOrder: null }, false, 'clearCurrentOrder'),
    }),
    { name: 'OrderStore', enabled: import.meta.env.MODE === 'development' }
  )
);
