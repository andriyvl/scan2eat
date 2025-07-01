// This file will be renamed to app.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Order, OrderDish, Dish, Addon, Restaurant } from '@/types/types';

// Order slice
interface OrderSlice {
  cartDishes: OrderDish[];
  addCartDish: (dish: OrderDish) => void;
  removeCartDish: (cartDishId: string) => void;
  clearCartDishes: () => void;
  updateCartDish: (dishId: string, updater: (dish: OrderDish) => OrderDish) => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isCartEmpty: () => boolean;
  hasCartItems: () => boolean;
  isTakeaway: boolean;
  setIsTakeaway: (isTakeaway: boolean) => void;
  currentOrder: Order | null;
  setCurrentOrder: (order: Order) => void;
  getCurrentOrderId: () => string | null;
  clearCurrentOrder: () => void;
}

// All dishes slice
interface DishesSlice {
  allDishes: Dish[];
  setAllDishes: (dishes: Dish[]) => void;
}

// All addons slice
interface AddonsSlice {
  allAddons: Addon[];
  setAllAddons: (addons: Addon[]) => void;
}

// Restaurant slice
interface RestaurantSlice {
  restaurant: Restaurant | null;
  setRestaurant: (restaurant: Restaurant) => void;
}

// Combine all slices
type AppStore = OrderSlice & DishesSlice & AddonsSlice & RestaurantSlice;

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      // Order slice
      cartDishes: [],
      addCartDish: (newDish: OrderDish) =>
        set(({ cartDishes }) => ({
          cartDishes: cartDishes?.some(dish => dish.cartDishId === newDish.cartDishId)
          ? cartDishes.map(dish => dish.cartDishId === newDish.cartDishId ? newDish : dish)
          : [...cartDishes, newDish],
        }), false, 'addCartDish'),
      removeCartDish: (cartDishId: string) =>
        set(({ cartDishes }) => {
          const cardDish = cartDishes.find(dish => dish.cartDishId === cartDishId);
          if (!cardDish) return { cartDishes };
          
          let filteredCartDishes;
          
          if (cardDish.quantity && cardDish.quantity > 1) {
            // Decrease quantity by 1
            filteredCartDishes = cartDishes.map(dish => 
              dish.cartDishId === cartDishId 
                ? { ...dish, quantity: dish.quantity! - 1 }
                : dish
            );
          } else {
            // Remove the dish completely
            filteredCartDishes = cartDishes.filter(dish => dish.cartDishId !== cartDishId);
          }
          
          return {
            cartDishes: filteredCartDishes,
          };
        }, false, 'removeCartDish'),
      clearCartDishes: () => set({ cartDishes: [] }, false, 'clearCartDishes'),
      updateCartDish: (dishId: string, updater: (dish: OrderDish) => OrderDish) =>
        set((state) => ({
          cartDishes: state.cartDishes.map((dish) =>
            dish.id === dishId ? updater(dish) : dish
          ),
        }), false, 'updateCartDish'),
      getCartTotal: () => {
        const { cartDishes } = get();
        return cartDishes.reduce((total, dish) => {
          const dishTotal = dish.basePrice + dish.addons.reduce((sum, addon) => sum + addon.price, 0);
          const quantity = dish.quantity || 1;
          return total + (dishTotal * quantity);
        }, 0);
      },
      getCartItemCount: () => {
        const { cartDishes } = get();
        return cartDishes.reduce((count, dish) => count + (dish.quantity || 1), 0);
      },
      isCartEmpty: () => {
        const { cartDishes } = get();
        return cartDishes.length === 0;
      },
      hasCartItems: () => {
        const { cartDishes } = get();
        return cartDishes.length > 0;
      },
      isTakeaway: false,
      setIsTakeaway: (isTakeaway: boolean) => set({ isTakeaway }, false, 'setIsTakeaway'),
      currentOrder: null,
      getCurrentOrderId: () => get().currentOrder?.id,
      setCurrentOrder: (order: Order) => set({ currentOrder: order }, false, 'setCurrentOrder'),
      clearCurrentOrder: () => set({ currentOrder: null }, false, 'clearCurrentOrder'),
      // Dishes slice
      allDishes: [],
      setAllDishes: (dishes: Dish[]) => set({ allDishes: dishes }, false, 'setAllDishes'),
      // Addons slice
      allAddons: [],
      setAllAddons: (addons: Addon[]) => set({ allAddons: addons }, false, 'setAllAddons'),
      // Restaurant slice
      restaurant: null,
      setRestaurant: (restaurant: Restaurant) => set({ restaurant }, false, 'setRestaurant'),
    }),
    { name: 'AppStore', enabled: import.meta.env.MODE === 'development' }
  )
);
