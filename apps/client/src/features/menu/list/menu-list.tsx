import { useEffect, useState } from 'react';
import type { Dish, MenuCategory } from '@/types/types';
import { DishCard } from '../dish/dish-card';
import { getMenuCategories, getDishes } from '../../../services/api.service';

export const MenuList = ({ restaurantId }: { restaurantId: string }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);

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


  useEffect(() => {
    console.log('Current dishes in state:', dishes);
  }, [dishes]);

  return (
    <div className="space-y-6">
      {categories
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((cat) => {
          const categoryDishes = dishes.filter((d) => d.categoryId === cat.id);
          console.log(`Dishes for category ${cat.categoryName}:`, categoryDishes);
          return (
            <div key={cat.id}>
              <h2 className="text-xl font-semibold">{cat.categoryName}</h2>
              <div className="grid gap-4">
                {categoryDishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};
