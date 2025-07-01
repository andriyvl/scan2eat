import * as React from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { X, Heart, Briefcase } from 'lucide-react';
import type { Addon, Dish } from '@/types/types';
import { AddToCardButton } from '@/components/menu/dish/add-to-card-button';
import { useAppStore } from '@/components/order/app.store';
import { DialogTitle } from '@radix-ui/react-dialog';
import { DishStatus } from '@/types/types';
import { SelectButton } from '@/components/ui/select-button';
import { IconButton } from "@/components/ui/icon-button";
import { useTranslation } from 'react-i18next';
import { ToggleOption } from "@/components/ui/toggle-option";
import { useEffect, useState } from 'react';
import { addDishToCart } from '../../order/preview/dish-cart.service';

interface DishPreviewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish: Dish;
}

const STATIC_DISH_IMAGE = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/670447d22e-b32f04b3787c58602633.png';

export const DishDrawer: React.FC<DishPreviewDrawerProps> = ({ open, onOpenChange, dish }) => {
  const { t } = useTranslation();
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const { allAddons } = useAppStore();
  const [takeaway, setTakeaway] = useState(false);
  const [comment, setComment] = useState('');
  const [adding, setAdding] = useState(false);
  const isTakeaway = useAppStore((s) => s.isTakeaway);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTakeaway(isTakeaway);
  }, []);

  // Use allAddons from the store and filter for this dish's addonIds
  const addons = allAddons.filter(a => dish.addonIds.includes(a.id as string));

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const selectedOrderAddons = addons.filter(addon => selectedAddons.includes(addon.id as string)).map(addon => ({ id: addon.id, price: addon.price }));


  useEffect(() => {
    const totalPrice = dish.basePrice + addons.filter(a => selectedAddons.includes(a.id as string)).reduce((sum, a) => sum + a.price, 0);
    setTotal(totalPrice);
  }, [dish, selectedOrderAddons]);

  const handleAddToOrder = async () => {
    if (adding) return;
    setAdding(true);
    addDishToCart(dish, total, selectedOrderAddons, comment.trim() || "", takeaway);

    setTimeout(() => {
      setAdding(false);
      onOpenChange(false);
    }, 200); // allow state to propagate before closing
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="!p-0 !m-0 !bg-transparent">
        <DialogTitle className="sr-only">Dish details</DialogTitle>
        {/* Top image, edge-to-edge */}
        <div className="relative w-full" style={{height: '240px'}}>
          <img
            src={STATIC_DISH_IMAGE}
            alt={t(`dishes.${dish.key}.name`)}
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
            style={{height: '240px'}}
          />
          {/* X and heart icons overlayed */}
          <IconButton
            onClick={() => onOpenChange(false)}
            variant="outline"
            size="md"
            className="absolute top-4 left-4 z-10"
            aria-label="Close"
          >
            <X />
          </IconButton>
          <IconButton
            variant="outline"
            size="md"
            className="absolute top-4 right-4 z-10"
            aria-label="Favorite"
          >
            <Heart />
          </IconButton>
        </div>
        {/* Main content with rounded top corners, starts below image */}
        <div className="bg-white h-full rounded-t-3xl -mt-8 pt-8 px-6 pb-32 relative z-10 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-2xl">{t(`dishes.${dish.key}.name`)}</h2>
            <div className="text-right">
              <div className="text-red-500 font-bold text-2xl">₫{dish.basePrice.toLocaleString()}</div>
              <div className="text-xs text-gray-400">per portion</div>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Popular</span>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Spicy</span>
            <span className="flex items-center text-xs text-gray-700 font-medium"><span className="mr-1">★</span>4.8 <span className="ml-1 text-gray-400">(127)</span></span>
          </div>
          <div className="text-gray-700 text-base mb-4">
            {t(`dishes.${dish.key}.description`)}
          </div>
          {/* Add-ons */}
          {addons.length > 0 && <div className="mb-4">
            <div className="font-semibold mb-2">Add-ons</div>
            <div className="flex flex-col gap-3">
              {addons.map((addon) => {
                const selected = selectedAddons.includes(addon.id as string);
                return (
                  <SelectButton
                    key={addon.id}
                    isSelected={selected}
                    onClick={() => toggleAddon(addon.id as string)}
                    title={t(`addons.${addon.key}.name`)}
                    description={t(`addons.${addon.key}.description`)}
                    price={addon.price}
                  />
                );
              })}
            </div>
          </div>}
          {/* Takeaway */}
          <div className="mb-4">
            <ToggleOption
              icon={Briefcase}
              title={t('takeaway')}
              description={t('takeaway_description')}
              checked={takeaway}
              onChange={setTakeaway}
            />
          </div>
          {/* Special Instructions */}
          <div className="mb-4">
            <div className="font-semibold mb-2">Special Instructions</div>
            <textarea
              className="w-full border rounded-xl p-3 text-base text-gray-700 bg-gray-50"
              rows={2}
              placeholder="Any special requests? (e.g., no onions, extra spicy, etc.)"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          {/* Add to Order Button (reused) */}
          <div className="fixed left-0 right-0 bottom-0 z-[110] px-4 pb-4 pointer-events-none">
            <div className="max-w-xl mx-auto">
              <AddToCardButton total={total} onClick={handleAddToOrder} disabled={adding}>
                {t('add_to_cart')}
              </AddToCardButton>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}; 