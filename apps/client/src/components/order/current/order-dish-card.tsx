import React, { useEffect, useState } from 'react';
import type { Addon, OrderDish, Dish, OrderAddon } from '@/types/types';
import { StatusBadge } from './status-badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { getDishes, getAddonsByRestaurant } from '@/services/api.service';
import { useApp } from '@/contexts/app.context';

interface OrderDishCardProps {
  dish: OrderDish;
}

export const OrderDishCard: React.FC<OrderDishCardProps> = ({ dish }) => {
  const { t } = useTranslation();
  const { restaurantId } = useApp();
  const [addonsObjects, setAddonsObjects] = useState<Addon[]>([]);
  const [dishObject, setDishObject] = useState<Dish | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!restaurantId) return;
      try {
        const [dishes, allAddons] = await Promise.all([
          getDishes(restaurantId),
          getAddonsByRestaurant(restaurantId)
        ]);
        const foundDish = dishes.find(d => d.id === dish.dishId);
        setDishObject(foundDish || null);
        setAddonsObjects(allAddons);
      } catch (error) {
        console.error('Error fetching dish and addon data:', error);
      }
    };
    fetchData();
  }, [dish.dishId, restaurantId]);

  const getAddonObject = (addonId: string | undefined) => {
    return addonsObjects.find(o => o.id === addonId);
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-2 my-1">
          <span className="font-bold text-base">
            {dishObject ? t(`dishes.${dishObject.key}.name`) : t(`dishes.${dish.key}.name`)}
          </span>
          <StatusBadge status={dish.status} type="dish" size="sm" />
        </div>
        {dishObject && (
          <div className="text-sm text-gray-500 mb-2">
            {t(`dishes.${dishObject.key}.description`)}
          </div>
        )}
        <div className="text-sm text-gray-600 flex items-center justify-between gap-2 mb-1">
          <span className="font-medium">{t('base_price')}</span>
          <span className="font-semibold">₫{dish.basePrice.toLocaleString()}</span>
        </div>
        {dish.addons.length > 0 && dish.addons.map((addon, idx) => {
          const addonObj = getAddonObject(addon.id);
          return (
            <div key={idx} className="text-sm text-gray-600 flex items-center justify-between gap-2 mb-1">
              <span>+ {addonObj ? t(`addons.${addonObj.key}.name`) : t('addon')}</span>
              <span className="font-semibold">₫{addon.price.toLocaleString()}</span>
            </div>
          );
        })}
        {/* Custom text for addons if present */}
        {/* If you want to support custom text, add here: */}
        {/* {customAddonTexts.length > 0 && (
          <div className="text-sm text-gray-700">{t('custom')}: {customAddonTexts.join(', ')}</div>
        )} */}
        {dish.comment && (
          <div className="text-sm text-gray-500">{t('comment')}: {dish.comment}</div>
        )}
      </CardContent>
      <hr className="my-2" />
      <CardFooter className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{t('qty')}: 1</span>
        <span className="font-semibold text-red-500 text-lg">₫{dish.price.toLocaleString()}</span>
      </CardFooter>
    </Card>
  );
}; 