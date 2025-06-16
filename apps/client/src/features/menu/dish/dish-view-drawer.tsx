import * as React from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { X, Heart, Briefcase } from 'lucide-react';
import type { Dish } from '@/types/types';
import { AddToCardButton } from '@/features/menu/dish/add-to-card-button';
import { useOrderStore } from '@/features/order/order.store';
import { DialogTitle } from '@radix-ui/react-dialog';
import { DishStatus } from '@/types/types';
import { SelectButton } from '@/components/ui/select-button';
import { IconButton } from "@/components/ui/icon-button";
import { useTranslation } from 'react-i18next';
import { ToggleOption } from "@/components/ui/toggle-option";

interface DishPreviewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish: Dish;
}

const STATIC_DISH_IMAGE = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/670447d22e-b32f04b3787c58602633.png';

// Example add-ons for demo
const ADDONS = [
  { name: 'Extra Egg', desc: 'Soft-boiled egg', price: 10000 },
  { name: 'Extra Chicken', desc: 'Additional sliced chicken', price: 15000 },
  { name: 'Extra Noodles', desc: 'More rice noodles', price: 8000 },
  { name: 'Extra Herbs', desc: 'Fresh basil & cilantro', price: 0 },
];

export const DishViewDrawer: React.FC<DishPreviewDrawerProps> = ({ open, onOpenChange, dish }) => {
  const { t } = useTranslation();
  const [selectedAddons, setSelectedAddons] = React.useState<string[]>([]);
  const [takeaway, setTakeaway] = React.useState(false);
  const [comment, setComment] = React.useState('');
  const [adding, setAdding] = React.useState(false);
  const setDish = useOrderStore((s) => s.setDish);

  const toggleAddon = (name: string) => {
    setSelectedAddons((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const total = dish.basePrice + ADDONS.filter(a => selectedAddons.includes(a.name)).reduce((sum, a) => sum + a.price, 0);

  const handleAddToOrder = async () => {
    if (adding) return;
    setAdding(true);
    setDish({
      dishId: dish.id,
      name: dish.name,
      basePrice: dish.basePrice,
      price: total,
      addons: ADDONS.filter(a => selectedAddons.includes(a.name)).map(a => ({ name: a.name, price: a.price })),
      comment: comment.trim() || "",
      takeaway,
      status: DishStatus.Awaiting,
    });
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
            alt={dish.name}
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
        <div className="bg-white rounded-t-3xl -mt-8 pt-8 px-6 pb-32 relative z-10 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-2xl">{dish.name}</h2>
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
            Traditional Vietnamese chicken noodle soup with rice noodles, tender chicken, fresh herbs, bean sprouts, and aromatic broth simmered for hours. Served with lime, chili, and hoisin sauce on the side.
          </div>
          {/* Add-ons */}
          <div className="mb-4">
            <div className="font-semibold mb-2">Add-ons</div>
            <div className="flex flex-col gap-3">
              {ADDONS.map((addon) => {
                const selected = selectedAddons.includes(addon.name);
                return (
                  <SelectButton
                    key={addon.name}
                    isSelected={selected}
                    onClick={() => toggleAddon(addon.name)}
                    title={addon.name}
                    description={addon.desc}
                    price={addon.price}
                  />
                );
              })}
            </div>
          </div>
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