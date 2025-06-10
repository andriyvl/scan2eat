import { useState } from 'react';
import type { Dish } from '@/types/types';
import { useOrderStore } from '@/features/order/order.store';
import { useLanguage } from '@/contexts/language.context';
import type { Addon } from '@/types/types';

export const DishCard = ({ dish }: { dish: Dish }) => {
  const [comment, setComment] = useState('');
  const [takeaway, setTakeaway] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<typeof dish.addons>([]);
  const { setDish } = useOrderStore();
  const { language } = useLanguage();

  const dishName = dish.translations?.[language]?.name ?? dish.name;
  const dishDescription = dish.translations?.[language]?.description ?? dish.description;

  const toggleAddon = (addonName: string) => {
    setSelectedAddons((prev: Addon[]) =>
      prev.some((a) => a.name === addonName)
        ? prev.filter((a) => a.name !== addonName)
        : [...prev, dish.addons.find((a: Addon) => a.name === addonName)!]
    );
  };

  const price = dish.basePrice + selectedAddons.reduce((sum, a) => sum + a.price, 0);

  const handleAdd = () => {
    setDish({
      dishId: dish.id,
      name: dish.name,
      basePrice: dish.basePrice,
      price,
      addons: selectedAddons,
      comment,
      takeaway,
      status: 'awaiting',
    });
  };

  return (
    <div className="dish-card bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex">
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{dishName}</h3>
            <span className="text-red-500 font-semibold">₫{price.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{dishDescription}</p>
          
          {dish.addons.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {dish.addons.map((addon) => (
                <button
                  key={addon.name}
                  onClick={() => toggleAddon(addon.name)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    selectedAddons.some((a) => a.name === addon.name)
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {addon.name} (+₫{addon.price.toLocaleString()})
                </button>
              ))}
            </div>
          )}

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
          {dish.image && (
            <img
              src={dish.image}
              alt={dishName}
              className="w-full h-full object-cover rounded-lg"
            />
          )}
          <button
            onClick={handleAdd}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <i className="text-xs">+</i>
          </button>
        </div>
      </div>
    </div>
  );
};
