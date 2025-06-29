import { useOrderStore } from '../order.store';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language.context';
import { useApp } from '@/contexts/app.context';
import { useNavigate } from 'react-router-dom';
import { calculateOrderTotal, submitNewOrder, updateExistingOrder } from '../services/order.service';
import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer';
import { X, ChefHat } from 'lucide-react';
import { SendToKitchenButton } from './send-to-kitchen-button';
import { DialogTitle } from '@radix-ui/react-dialog';
import { OrderStatusBanner } from '../current/order-status-banner';
import { useTranslation } from 'react-i18next';
import { getAddons } from '@/services/api.service';
import type { Addon } from '@/types/types';

export const OrderPreviewDrawer = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { cartDishes, removeCartDish, clearCartDishes } = useOrderStore();
  const [submitting, setSubmitting] = useState(false);
  const { restaurantId, qrId } = useApp();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentOrderId = useOrderStore((s) => s.getCurrentOrderId());
  const [addonsObjects, setAddonsObjects] = useState<Addon[]>([]);
  

  useEffect(() => {
    const fetchAddons = async () => {
      const addons = await getAddons(cartDishes.flatMap(d => d.addons?.map(a => a.id as string) ?? []));
      setAddonsObjects(addons);
    };
    fetchAddons();
  }, [cartDishes]);

  const total = calculateOrderTotal(cartDishes);
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
    return addonIds.map(id => `+ ${t(`addons.${addonsObjects.find(o => o.id === id)?.key}.name`)}`).join(', ');
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
                <div key={`dish-${dish.dishId}-preview-${i}`} className="flex items-center py-4 gap-4">
                  <img
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/670447d22e-b32f04b3787c58602633.png"
                    alt={t(`dishes.${dish.key}.name`)}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base truncate">{t(`dishes.${dish.key}.name`)}</div>
                    <div className="text-gray-500 text-sm truncate">
                      {`${getAddonNames(dish.addons.map(a => a.id as string))}`}
                      {dish.comment ? ` • ${dish.comment}` : ''}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="font-semibold text-lg">₫{dish.price.toLocaleString()}</div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300"
                        onClick={() => removeCartDish(dish.dishId)}
                      >
                        <span className="text-base">–</span>
                      </button>
                      <span className="text-base font-medium">1</span>
                      <button
                        className="w-7 h-7 bg-gray-300 text-white rounded-full flex items-center justify-center opacity-50 cursor-not-allowed"
                        disabled
                      >
                        <span className="text-base">+</span>
                      </button>
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
