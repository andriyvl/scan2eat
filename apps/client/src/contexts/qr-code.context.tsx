import { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurant } from '@/services/api.service';

interface QrCodeContextType {
  restaurantId: string;
  qrId: string;
  restaurantKey?: string;
  setContext: (restaurantId: string, qrId: string, restaurantName?: string) => void;
}

const QrCodeContext = createContext<QrCodeContextType>({
  restaurantId: '',
  qrId: '',
  restaurantKey: '',
  setContext: () => {},
});

export const useQrCode = () => useContext(QrCodeContext);

export const QrCodeProvider = ({ children }: { children: React.ReactNode }) => {
  const [restaurantId, setRestaurantId] = useState('');
  const [qrId, setQrId] = useState('');
  const [restaurantKey, setRestaurantKey] = useState<string>();
  const { restaurantId: urlRestaurantId, qrId: urlQrId } = useParams<{ restaurantId: string; qrId: string }>();

  const setContext = (restaurant: string, qr: string, name?: string) => {
    setRestaurantId(restaurant);
    setQrId(qr);
    if (name) {
      setRestaurantKey(name);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('qrCodeContext')) {
      const parsed = JSON.parse(localStorage.getItem('qrCodeContext') || '{}');
      setRestaurantId(parsed.restaurantId);
      setQrId(parsed.qrId);
    } else if (urlRestaurantId && urlQrId) {
      setRestaurantId(urlRestaurantId);
      setQrId(urlQrId);
    }

    if (restaurantId) {
      getRestaurant(restaurantId).then((restaurant) => {
        setRestaurantKey(restaurant.key);
      });
    }

    if (restaurantId && qrId && restaurantKey) {
      setContext(restaurantId, qrId, restaurantKey);
    }
  }, [restaurantId, qrId]);


  return (
    <QrCodeContext.Provider value={{ restaurantId, qrId, restaurantKey, setContext }}>
       {children}
    </QrCodeContext.Provider>
  );
};
