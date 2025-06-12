import * as React from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { X, Heart, CheckCircle2, Briefcase } from 'lucide-react';
import type { Dish } from '@/types/types';
import { AddDishButton } from '@/features/menu/dish/add-dish-button';
import { useOrderStore } from '@/features/order/order.store';
import { DialogTitle } from '@radix-ui/react-dialog';

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
      comment: comment.trim() || undefined,
      takeaway,
      status: 'awaiting',
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
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 left-4 bg-white/80 hover:bg-white rounded-full p-2 shadow z-10"
            aria-label="Close"
          >
            <X className="text-red-500" />
          </button>
          <button className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow z-10" aria-label="Favorite">
            <Heart className="text-red-500" />
          </button>
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
                  <button
                    key={addon.name}
                    onClick={() => toggleAddon(addon.name)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                      selected
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-red-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {selected && <CheckCircle2 className="text-red-500 w-5 h-5" />}
                      <div>
                        <div className={`font-semibold ${selected ? 'text-red-500' : 'text-gray-900'}`}>{addon.name}</div>
                        <div className="text-xs text-gray-500">{addon.desc}</div>
                      </div>
                    </div>
                    <div className={`font-semibold text-lg ${selected ? 'text-red-500' : 'text-gray-700'}`}>{addon.price > 0 ? `+₫${addon.price.toLocaleString()}` : 'Free'}</div>
                  </button>
                );
              })}
            </div>
          </div>
          {/* Takeaway */}
          <div className="mb-4 flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-gray-500" />
              <div>
                <div className="font-semibold">Takeaway</div>
                <div className="text-xs text-gray-500">Pack for takeout</div>
              </div>
            </div>
            <input
              type="checkbox"
              className="w-6 h-6 rounded border-gray-300"
              checked={takeaway}
              onChange={() => setTakeaway((v) => !v)}
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
              <AddDishButton total={total} onClick={handleAddToOrder} disabled={adding}>
                Add dish
              </AddDishButton>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}; 