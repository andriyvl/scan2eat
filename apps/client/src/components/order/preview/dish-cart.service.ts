import { DishStatus, type OrderAddon, type Dish, type OrderDish } from "@/types/types";
import { useAppStore } from "@/components/order/app.store";

export const addDishToCart = (dish: Dish | OrderDish, total: number, selectedOrderAddons: OrderAddon[], comment: string, takeaway: boolean) => {
  let cartDishId;

  let storeDish: OrderDish | undefined;
  let quantity: number;

  if ((dish as OrderDish).cartDishId) {
    // adding from cart
    storeDish = dish as OrderDish;
  } else {
    // adding from menu - assume it exists and find exact dish matching id, addons, comments and takeaway
    storeDish = useAppStore.getState().cartDishes.find(
      storeDish => {
        const hasSameId = storeDish.id === dish.id;
        const hasNoAddons = !storeDish.addons.length && !selectedOrderAddons.length;
        const hasSameAddons = storeDish.addons.every(addon => selectedOrderAddons.map(a => a.id).indexOf(addon.id!) > -1);
        const hasSameComment = storeDish.comment === comment.trim();
        const hasSameTakeaway = storeDish.takeaway === takeaway;

        return hasSameId && (hasNoAddons || hasSameAddons) && hasSameComment && hasSameTakeaway
      }
    );
  }

  if (storeDish) {
    // get existing cart dish id
    cartDishId = storeDish.cartDishId;
    quantity = storeDish.quantity! + 1;
  } else {
    // create new cart dish id.
    cartDishId = Math.random().toString().slice(2,10);
    quantity = 1;
  }
  
  useAppStore.getState().addCartDish({
    id: dish.id,
    cartDishId,
    key: dish.key,
    basePrice: dish.basePrice,
    price: total,
    addons: selectedOrderAddons,
    comment: comment.trim(),
    takeaway,
    status: DishStatus.Awaiting,
    quantity
  });
  return cartDishId;
}