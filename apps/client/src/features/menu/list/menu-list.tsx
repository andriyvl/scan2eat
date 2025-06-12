import { useEffect, useState } from 'react';
import type { Dish, MenuCategory } from '@/types/types';
import { DishCard } from '../dish/dish-card';
import { getMenuCategories, getDishes } from '../../../services/api.service';
import { Clock } from 'lucide-react';
import { useOrderStore } from '@/features/order/order.store';
import OrderDishesButton from '@/features/order/creation/order-dishes-button';
import { OrderPreview } from '@/features/order/creation/order-preview';
import { CategoryTabs } from './category-tabs';
import { OrderProgressBanner } from './order-progress-banner';

export const MenuList = ({ restaurantId }: { restaurantId: string }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderInProgress, setOrderInProgress] = useState(false);
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [dishPreviewOpen, setDishPreviewOpen] = useState(false);

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
    setOrderInProgress(!!localStorage.getItem('currentOrderId'));
  }, []);

  const filteredDishes = selectedCategory === 'all' 
    ? dishes 
    : dishes.filter(dish => dish.categoryId === selectedCategory);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="sticky top-0 z-20 bg-white">
        <OrderProgressBanner orderInProgress={orderInProgress} />
        <CategoryTabs categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="p-4 space-y-4">
        {filteredDishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} onPreviewOpen={setDishPreviewOpen} />
        ))}
      </div>
      </div>
      {!(dishPreviewOpen || orderDrawerOpen) && (
        <OrderDishesButton onOpen={() => setOrderDrawerOpen(true)} />
      )}
      <OrderPreview open={orderDrawerOpen} onOpenChange={setOrderDrawerOpen} />
    </div>
  );
};
