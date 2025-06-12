import { useEffect, useState } from 'react';
import { OrderStatus, type Dish, type MenuCategory } from '@/types/types';
import { DishCard } from '../dish/dish-card';
import { getMenuCategories, getDishes } from '../../../services/api.service';
import OrderDishesButton from '@/features/order/preview/preview-order-button';
import { OrderPreviewDrawer } from '@/features/order/preview/order-preview-drawer';
import { CategoryTabs } from './category-tabs';
import { OrderStatusBanner } from '../../order/status/order-status-banner';

export const MenuList = ({ restaurantId }: { restaurantId: string }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  const filteredDishes = selectedCategory === 'all' 
    ? dishes 
    : dishes.filter(dish => dish.categoryId === selectedCategory);

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="sticky top-0 z-20 bg-white">
        <OrderStatusBanner status={OrderStatus.Paid} />
        <CategoryTabs categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="py-4 space-y-4">
        {filteredDishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} onPreviewOpen={setDishPreviewOpen} />
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
