
import { useEffect, useState } from 'react';
import type { Dish, MenuCategory } from '../menu.types';
import { DishCard } from '../dish/dish-card';
import { getMenuCategories, getDishes } from '../menu-api.service';

export const MenuList = ({ restaurantId }: { restaurantId: string }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const [cats, ds] = await Promise.all([
        getMenuCategories(restaurantId),
        getDishes(restaurantId),
      ]);
      setCategories(cats);
      setDishes(ds);
    };
    fetchMenu();
  }, [restaurantId]);

  return (
    <div className="space-y-6">
      {categories
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((cat) => (
          <div key={cat.id}>
            <h2 className="text-xl font-semibold">{cat.categoryName}</h2>
            <div className="grid gap-4">
              {dishes
                .filter((d) => d.categoryId === cat.id)
                .map((dish) => (
                  <DishCard key={dish.id} dish={dish} />
                ))}
            </div>
          </div>
        ))}
    </div>
  );
};
