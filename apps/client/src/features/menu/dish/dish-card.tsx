import { useState } from 'react';
import type { Dish } from '@/types/types';
import { useLanguage } from '@/contexts/language.context';
import { Plus } from 'lucide-react';
import { DishPreviewDrawer } from './dish-preview-drawer';

const STATIC_DISH_IMAGE = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/670447d22e-b32f04b3787c58602633.png';

export const DishCard = ({ dish, onPreviewOpen }: { dish: Dish; onPreviewOpen?: (open: boolean) => void }) => {
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  const dishName = dish.translations?.[language]?.name ?? dish.name;
  const dishDescription = dish.translations?.[language]?.description ?? dish.description;

  const handleOpen = (value: boolean) => {
    setOpen(value);
    if (onPreviewOpen) onPreviewOpen(value);
  };

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
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs rounded-full ${
                    tag === 'Popular' ? 'bg-green-100 text-green-700' :
                    tag === 'Spicy' ? 'bg-blue-100 text-blue-700' :
                    tag === 'Fresh' ? 'bg-green-100 text-green-700' :
                    tag === 'Quick' ? 'bg-orange-100 text-orange-700' :
                    tag === 'Sweet' ? 'bg-purple-100 text-purple-700' :
                    tag === 'Cold' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="w-24 h-24 m-3 relative">
            <img
              src={STATIC_DISH_IMAGE}
              alt={dishName}
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
              <Plus size={16} />
            </div>
          </div>
        </div>
      </div>
      <DishPreviewDrawer open={open} onOpenChange={handleOpen} dish={dish} />
    </>
  );
};
