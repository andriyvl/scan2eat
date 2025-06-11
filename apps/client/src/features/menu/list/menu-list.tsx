import { useEffect, useState } from 'react';
import type { Dish, MenuCategory } from '@/types/types';
import { DishCard } from '../dish/dish-card';
import { getMenuCategories, getDishes } from '../../../services/api.service';
import { Clock } from 'lucide-react';
import { useOrderStore } from '@/features/order/order.store';
import { OrderDishesButton } from '@/features/order/creation/order-dishes-button';
import { OrderPreview } from '@/features/order/creation/order-preview';

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
    <div className="space-y-6">
      {/* Order in progress banner */}
      {orderInProgress && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mx-4 mt-3 rounded-r-lg flex items-center space-x-2">
          <Clock className="text-amber-600 w-5 h-5" />
          <span className="text-sm font-medium text-amber-800">Order in progress</span>
          <span className="text-xs text-amber-600">• 2 dishes preparing</span>
        </div>
      )}
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
          <DishCard key={dish.id} dish={dish} onPreviewOpen={setDishPreviewOpen} />
        ))}
      </div>
      {/* Fixed OrderDishesButton at bottom, only when no drawers open */}
      {!(dishPreviewOpen || orderDrawerOpen) && (
        <MenuOrderDishesButton onOpen={() => setOrderDrawerOpen(true)} />
      )}
      <OrderPreview open={orderDrawerOpen} onOpenChange={setOrderDrawerOpen} />
    </div>
  );
};

// Helper component for fixed order button
const MenuOrderDishesButton = ({ onOpen }: { onOpen: () => void }) => {
  const { dishes } = useOrderStore();
  const total = dishes.reduce((sum, d) => sum + d.price, 0);
  if (!dishes.length) return null;
  return (
    <div className="fixed left-0 right-0 bottom-0 z-[110] px-4 pb-4 pointer-events-none">
      <div className="max-w-xl mx-auto">
        <OrderDishesButton total={total} iconPosition='left' count={dishes.length} onClick={onOpen}>
          Order dishes
        </OrderDishesButton>
      </div>
    </div>
  );
};
