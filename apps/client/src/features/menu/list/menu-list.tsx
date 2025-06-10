import { useEffect, useState } from 'react';
import type { Dish, MenuCategory } from '@/types/types';
import { DishCard } from '../dish/dish-card';
import { getMenuCategories, getDishes } from '../../../services/api.service';

export const MenuList = ({ restaurantId }: { restaurantId: string }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    const fetchMenu = async () => {
      const [categories, dishes] = await Promise.all([
        getMenuCategories(restaurantId),
        getDishes(restaurantId),
      ]);
      setCategories(categories);
      setDishes(dishes);
    };
    fetchMenu();
  }, [restaurantId]);

  const filteredDishes = selectedCategory === 'all' 
    ? dishes 
    : dishes.filter(dish => dish.categoryId === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="bg-white sticky top-16 z-40 border-b border-gray-200">
        <div className="flex overflow-x-auto scrollbar-hide px-4 py-2">
          <button
            className={`category-tab px-4 py-2 text-sm font-medium whitespace-nowrap ${
              selectedCategory === 'all' ? 'active' : 'text-gray-600'
            }`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </button>
          {categories
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((cat) => (
              <button
                key={cat.id}
                className={`category-tab px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  selectedCategory === cat.id ? 'active' : 'text-gray-600'
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.categoryName}
              </button>
            ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {filteredDishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </div>
  );
};
