import { useState } from 'react';
import { DishStatus, type Dish } from '@/types/types';
import { Plus } from 'lucide-react';
import { DishViewDrawer } from './dish-view-drawer';
import { useOrderStore } from '@/features/order/order.store';
import { useTranslation } from 'react-i18next';
import { DishTag } from './dish-tag';
import { IconButton } from '@/components/ui/icon-button';

const STATIC_DISH_IMAGE = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/670447d22e-b32f04b3787c58602633.png';

export const DishCard = ({ dish, onPreviewOpen }: { dish: Dish; onPreviewOpen?: (open: boolean) => void }) => {
  const [open, setOpen] = useState(false);
  const setDish = useOrderStore((s) => s.setDish);
  const { t } = useTranslation();
  const dishName = t(`dishes.${dish.key}.name`);
  const dishDescription = t(`dishes.${dish.key}.description`);

  const handleOpen = (value: boolean) => {
    if (value) {
      const target = event?.target as HTMLElement;
      if (target?.closest('.add-to-order-button')) {
        return;
      }
    }
    setOpen(value);
    if (onPreviewOpen) onPreviewOpen(value);
  };

  function addToCart(dish: Dish): void {
    setDish({
      dishId: dish.id,
      key: dish.key,
      basePrice: dish.basePrice,
      price: dish.basePrice,
      addons: [],
      comment: "",
      takeaway: false,
      status: DishStatus.Awaiting,
    });
  }

  return (
    <>
      <div
        className="dish-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
        onClick={() => handleOpen(true)}
      >
        <div className="flex">
          <div className="flex-1 p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{dishName}</h3>
              <span className="text-red-500 font-semibold">₫{dish.basePrice.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{dishDescription}</p>
            <div className="flex items-center space-x-2">
              {dish.tags?.map((tag) => (
                <DishTag key={tag} tag={tag} />
              ))}
            </div>
          </div>
          <div className="w-24 h-24 m-3 relative">
            <img
              src={STATIC_DISH_IMAGE}
              alt={dishName}
              className="w-full h-full object-cover rounded-lg"
            />
            <IconButton
              size="sm"
              variant="default"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(dish);
              }}
              className="add-to-order-button absolute -bottom-1 -right-1"
            >
              <Plus size={16} />
            </IconButton>
          </div>
        </div>
      </div>
      <DishViewDrawer open={open} onOpenChange={handleOpen} dish={dish} />
    </>
  );
};
