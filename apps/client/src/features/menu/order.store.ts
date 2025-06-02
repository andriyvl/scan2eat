import { create } from 'zustand';
import type { OrderDish } from './menu.types';

type OrderStore = {
  dishes: OrderDish[];
  setDish: (dish: OrderDish) => void;
  removeDish: (dishId: string) => void;
  clearOrder: () => void;
  updateDish: (dishId: string, updater: (dish: OrderDish) => OrderDish) => void;
};

export const useOrderStore = create<OrderStore>((set) => ({
  dishes: [],
  setDish: (newDish) =>
    set((state) => ({
      dishes: [...state.dishes, newDish],
    })),
  removeDish: (dishId) =>
    set((state) => ({
      dishes: state.dishes.filter((d) => d.dishId !== dishId),
    })),
  clearOrder: () => set({ dishes: [] }),
  updateDish: (dishId, updater) =>
    set((state) => ({
      dishes: state.dishes.map((dish) =>
        dish.dishId === dishId ? updater(dish) : dish
      ),
    })),
}));
