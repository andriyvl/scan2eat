import { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurant, getDishes, getAddonsByRestaurant } from '@/services/api.service';
import { initCurrentOrder } from '@/components/order/services/order.service';
import { useAppStore } from '@/components/order/app.store';

interface AppContextType {
  restaurantId: string;
  qrId: string;
  orderId?: string;
  restaurantKey?: string;
}

const AppContext = createContext<AppContextType>({
  restaurantId: '',
  qrId: '',
  orderId: '',
  restaurantKey: ''
});

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurantId, setRestaurantId] = useState('');
  const [qrId, setQrId] = useState('');
  const [restaurantKey, setRestaurantKey] = useState<string>();
  const [orderId, setOrderId] = useState<string | undefined>();
  const { setAllDishes, setAllAddons } = useAppStore();
  const { restaurantId: urlRestaurantId, qrId: urlQrId, orderId: urlOrderId } = useParams<{ restaurantId: string; qrId: string; orderId?: string }>();

  useEffect(() => {
    if (restaurantId && qrId) { 
      initCurrentOrder(restaurantId, qrId, orderId);
    }
  }, [restaurantId, qrId, orderId]);

  useEffect(() => {
    if (localStorage.getItem('qrCodeContext')) {
      const parsed = JSON.parse(localStorage.getItem('qrCodeContext') || '{}');
      setRestaurantId(parsed.restaurantId);
      setQrId(parsed.qrId);
    } else if (urlRestaurantId && urlQrId) {
      setRestaurantId(urlRestaurantId);
      setQrId(urlQrId);
    }

    const localOrderId = localStorage.getItem('currentOrderId');
    if (urlOrderId) {
      setOrderId(urlOrderId);
    } else if (localOrderId) {
      setOrderId(localOrderId);
    }

    if (restaurantId) {
      getRestaurant(restaurantId).then((restaurant) => {
        setRestaurantKey(restaurant.key);
      });
      // Fetch all dishes and addons for the restaurant and store in app store
      Promise.all([
        getDishes(restaurantId),
        getAddonsByRestaurant(restaurantId)
      ]).then(([dishes, addons]) => {
        setAllDishes(dishes);
        setAllAddons(addons);
      });
    }

  }, [restaurantId, qrId]);


  return (
    <AppContext.Provider value={{ restaurantId, qrId, restaurantKey, orderId }}>
       {children}
    </AppContext.Provider>
  );
};
