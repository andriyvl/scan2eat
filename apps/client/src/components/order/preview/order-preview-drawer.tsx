import { useAppStore } from '../app.store';
import { useApp } from '@/contexts/app.context';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language.context';
import { useNavigate } from 'react-router-dom';
import { calculateOrderTotal, submitNewOrder, updateExistingOrder } from '../services/order.service';
import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer';
import { X, ChefHat, Plus, Minus, ShoppingBag } from 'lucide-react';
import { SendToKitchenButton } from './send-to-kitchen-button';
import { DialogTitle } from '@radix-ui/react-dialog';
import { OrderStatusBanner } from '../current/order-status-banner';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/ui/icon-button';
import { addDishToCart } from '@/components/order/preview/dish-cart.service';
import type { OrderDish } from '@/types/types';

export const OrderPreviewDrawer = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { cartDishes, removeCartDish, clearCartDishes, allAddons, getCurrentOrderId } = useAppStore();
  const { restaurantId, qrId } = useApp();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentOrderId = getCurrentOrderId();
  // const groupedDishes = useGroupedCartDishes(cartDishes);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(calculateOrderTotal(cartDishes));
  }, [cartDishes]);

  const { language } = useLanguage();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (currentOrderId) {
        await updateExistingOrder(currentOrderId, cartDishes);
        clearCartDishes();
        navigate(`/${restaurantId}/${qrId}/order/${currentOrderId}`);
      } else {
        const orderId = await submitNewOrder(qrId, language, cartDishes, total);
        localStorage.setItem('currentOrderId', orderId);
        clearCartDishes();
        navigate(`/${restaurantId}/${qrId}/order/${orderId}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update order');
    } finally {
      setSubmitting(false);
    }
  };

  const getAddonNames = (addonIds: string[]) => {
    return addonIds.map(id => {
      const addon = allAddons.find(a => a.id === id);
      return addon ? `+ ${t(`addons.${addon.key}.name`)}` : '';
    }).filter(Boolean).join(', ');
  };

  const onAddDish = (dish: OrderDish) => {
    addDishToCart(dish, dish.price, dish.addons, dish.comment!, false);
    setTotal(calculateOrderTotal(cartDishes));
  };

  if (!cartDishes.length) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent isOverlayImage className="!p-0 !m-0 !bg-transparent">
        <div className="bg-white rounded-t-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">{t('preview_order')}</DialogTitle>
          <div className="p-6 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">{t('order_preview')}</h3>
              <DrawerClose asChild>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <X size={24} />
                </button>
              </DrawerClose>
            </div>
            <div className="divide-y">
              <div className="mb-2">
                <OrderStatusBanner />
              </div>
              {cartDishes.map((dish, i) => (
                <div key={`dish-${dish.id}-preview-${i}`} className="flex items-center py-4 gap-4">
                  <img
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/670447d22e-b32f04b3787c58602633.png"
                    alt={t(`dishes.${dish.key}.name`)}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base truncate flex items-center gap-2">
                      <span>{t(`dishes.${dish.key}.name`)}</span>
                      {dish.takeaway && <ShoppingBag size={16} className="text-gray-500" />}
                    </div>
                    <div className="text-gray-500 text-sm truncate">
                      {`${getAddonNames(dish.addons.map(a => a.id as string))}`}
                      {dish.comment ? ` • ${dish.comment}` : ''}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="font-semibold text-lg">₫{dish.price.toLocaleString()}</div>
                    <div className="flex items-center space-x-2">
                      <IconButton
                        size="sm"
                        variant="default"
                        onClick={() => removeCartDish(dish.cartDishId!)}
                      >
                        <Minus size={16} />
                      </IconButton>
                      <span className="text-base font-medium">{dish.quantity}</span>
                      <IconButton
                        size="sm"
                        variant="default"
                        onClick={() => onAddDish(dish)}
                      >
                        <Plus size={16} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-lg">Total</span>
                <span className="text-xl font-bold text-red-500">₫{total.toLocaleString()}</span>
              </div>
              <SendToKitchenButton
                onClick={handleSubmit}
                disabled={submitting}
                icon={<ChefHat size={22} />}
                iconPosition="right"
              >
                {submitting ? t('sending') : t('send_to_kitchen')}
              </SendToKitchenButton>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
