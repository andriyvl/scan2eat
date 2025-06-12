import { useOrderStore } from '../order.store';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language.context';
import { useTable } from '@/contexts/table.context';
import { useNavigate } from 'react-router-dom';
import { calculateOrderTotal, submitNewOrder, updateExistingOrder } from '../services/order.service';
import { Drawer, DrawerContent, DrawerClose } from '@/components/ui/drawer';
import { X, ChefHat } from 'lucide-react';
import { SendToKitchenButton } from './send-to-kitchen-button';
import { DialogTitle } from '@radix-ui/react-dialog';
import { OrderStatusBanner } from '../status/order-status-banner';
import { OrderStatus } from '@/types/types'
export const OrderPreviewDrawer = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { dishes, removeDish, clearOrder } = useOrderStore();
  const [submitting, setSubmitting] = useState(false);
  const { tableId } = useTable();
  const navigate = useNavigate();
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  useEffect(() => {
    const storedOrderId = localStorage.getItem('currentOrderId');
    setCurrentOrderId(storedOrderId);
  }, []);

  const total = calculateOrderTotal(dishes);
  const { language } = useLanguage();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (currentOrderId) {
        await updateExistingOrder(currentOrderId, dishes);
        clearOrder();
        navigate(`/order/${currentOrderId}`);
      } else {
        const orderId = await submitNewOrder(tableId, language, dishes, total);
        localStorage.setItem('currentOrderId', orderId);
        clearOrder();
        navigate(`/order/${orderId}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update order');
    } finally {
      setSubmitting(false);
    }
  };

  if (!dishes.length) return null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent isOverlayImage className="!p-0 !m-0 !bg-transparent">
        <div className="bg-white rounded-t-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Preview order</DialogTitle>
          <div className="p-6 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">Order preview</h3>
              <DrawerClose asChild>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <X size={24} />
                </button>
              </DrawerClose>
            </div>
            <div className="divide-y">
              <div className="mb-2">
                <OrderStatusBanner status={OrderStatus.Pending} />
              </div>
              {dishes.map((d, i) => (
                <div key={i} className="flex items-center py-4 gap-4">
                  <img
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/670447d22e-b32f04b3787c58602633.png"
                    alt={d.name}
                    className="w-14 h-14 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base truncate">{d.name}</div>
                    <div className="text-gray-500 text-sm truncate">
                      {d.addons.map(a => a.name).join(' • ')}
                      {d.comment ? ` • ${d.comment}` : ''}
                    </div>
                    <div className="mt-1">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">Preparing</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                    <div className="font-semibold text-lg">₫{d.price.toLocaleString()}</div>
                    <div className="flex items-center space-x-2">
                      <button
                        className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-300"
                        onClick={() => removeDish(d.dishId)}
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
                {submitting ? 'Sending...' : 'Send to kitchen'}
              </SendToKitchenButton>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
