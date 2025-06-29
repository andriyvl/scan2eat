import { useEffect, useState } from 'react';
import { type Dish, type MenuCategory } from '@/types/types';
import { DishCard } from '../dish/dish-card';
import { getMenuCategories, getDishes } from '../../../services/api.service';
import OrderDishesButton from '@/components/order/preview/preview-order-button';
import { OrderPreviewDrawer } from '@/components/order/preview/order-preview-drawer';
import { CategoryTabs } from './category-tabs';
import { OrderStatusBanner } from '../../order/current/order-status-banner';
import { useApp } from '@/contexts/app.context';

export const MenuList = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [orderDrawerOpen, setOrderDrawerOpen] = useState(false);
  const [dishPreviewOpen, setDishPreviewOpen] = useState(false);
  const { restaurantId } = useApp();

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
    <div className="flex flex-col h-full min-h-0">
      <div className="sticky top-0 z-20">
        <OrderStatusBanner className="mb-4" />
        <CategoryTabs categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="py-4 space-y-4">
        {filteredDishes.map((dish) => (
          <DishCard key={`menu-dish-${dish.id}`} dish={dish} onPreviewOpen={setDishPreviewOpen} />
        ))}
      </div>
      </div>
      {!(dishPreviewOpen || orderDrawerOpen) && (
        <OrderDishesButton onOpen={() => setOrderDrawerOpen(true)} />
      )}
      <OrderPreviewDrawer open={orderDrawerOpen} onOpenChange={setOrderDrawerOpen} />
    </div>
  );
};
