import { useState } from 'react';
import type { Dish } from '../menu.types';
import { useOrderStore } from '../order.store';
import { useLanguage } from '@/contexts/language.context';


export const DishCard = ({ dish }: { dish: Dish }) => {
  const [comment, setComment] = useState('');
  const [takeaway, setTakeaway] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<typeof dish.addons>([]);
  const { setDish } = useOrderStore();


const { language } = useLanguage();

const dishName = dish.translations?.[language]?.name ?? dish.name;
const dishDescription = dish.translations?.[language]?.description ?? dish.description;


  const toggleAddon = (addonName: string) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.name === addonName)
        ? prev.filter((a) => a.name !== addonName)
        : [...prev, dish.addons.find((a) => a.name === addonName)!]
    );
  };

  const handleAdd = () => {
    setDish({
      dishId: dish.id,
      name: dish.name,
      basePrice: dish.basePrice,
      addons: selectedAddons,
      comment,
      takeaway,
      status: 'pending',
    });
  };

  return (
    <div className="border rounded-xl p-4 shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{dishName}</h3>
        <span className="text-sm text-gray-600">{dish.basePrice}₫</span>
      </div>
      <p className="text-sm text-gray-700 mb-2">{dishDescription}</p>

      {dish.addons.length > 0 && (
        <div className="mb-2">
          <h4 className="text-sm font-medium">Add-ons:</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {dish.addons.map((a) => (
              <button
                key={a.name}
                className={`px-2 py-1 border rounded ${
                  selectedAddons.find((sel) => sel.name === a.name)
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-800'
                }`}
                onClick={() => toggleAddon(a.name)}
              >
                {a.name} (+{a.price}₫)
              </button>
            ))}
          </div>
        </div>
      )}

      <textarea
        placeholder="Any comments?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border mt-2 p-1 rounded text-sm"
      />

      <div className="flex items-center gap-2 mt-2">
        <label className="text-sm">
          <input
            type="checkbox"
            checked={takeaway}
            onChange={() => setTakeaway((v) => !v)}
            className="mr-1"
          />
          Takeaway
        </label>
      </div>

      <button
        onClick={handleAdd}
        className="mt-3 w-full bg-green-600 text-white py-2 rounded font-semibold"
      >
        Add to Order
      </button>
    </div>
  );
}
