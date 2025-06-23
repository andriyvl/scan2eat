import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  Utensils,
  ShoppingBag,
  Armchair,
  Wifi,
  Bell,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { useQrCode } from '@/contexts/qr-code.context';
import { useOrderStore } from '@/features/order/order.store';
import { cn } from '@/utils/utils';

const RESTAURANT_IMAGE_URL = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/fc46fd8759-7163ce2744f74232301d.png';

export const WelcomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { restaurantKey, qrId } = useQrCode();
  const restaurantName = restaurantKey ? t(`restaurants.${restaurantKey}.name`) : '';
  const slogan = restaurantKey ? t(`restaurants.${restaurantKey}.slogan`) : '';
  const { isTakeaway, setIsTakeaway } = useOrderStore();

  const handleStartOrdering = () => {
    navigate('./../menu');
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex flex-col">
      <div className="absolute top-0 left-0 right-0 h-[40vh]">
        <img src={RESTAURANT_IMAGE_URL} alt="Restaurant" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-10 left-0 right-0 p-4 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Utensils size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{restaurantName}</h1>
              <p className="text-sm">"{slogan}"</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-[35vh] flex-1 flex flex-col">
        <div className="bg-white rounded-t-3xl p-6 flex-1">
          <div className="text-center">
            <h2 className="text-2xl font-bold">{restaurantName}</h2>
            <p className="text-gray-500 mt-1">"{slogan}"</p>
            <div className="flex items-center justify-center gap-2 mt-3 text-gray-600">
              <MapPin size={16} />
              <span>123 Nguyen Hue, District 1, Ho Chi Minh City</span>
            </div>
            <div className="inline-flex items-center gap-2 mt-3 bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-lg">
              <QrCode size={16} />
              <span>QR ID: {qrId}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">{t('order_type')}</h3>
            <div className="bg-gray-100 rounded-xl p-1 flex">
              <button
                onClick={() => setIsTakeaway(false)}
                className={cn(
                  "flex-1 rounded-lg py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                  !isTakeaway ? 'bg-black text-white' : 'bg-transparent text-gray-700'
                )}
              >
                <Utensils size={16} />
                {t('dine_in')}
              </button>
              <button
                onClick={() => setIsTakeaway(true)}
                className={cn(
                  "flex-1 rounded-lg py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all",
                  isTakeaway ? 'bg-black text-white' : 'bg-transparent text-gray-700'
                )}
              >
                <ShoppingBag size={16} />
                {t('takeaway')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white shadow-top p-4">
        <Button size="lg" className="w-full" rightContent={<ArrowRight size={16} />} onClick={handleStartOrdering}>
          {t('start_ordering')}
        </Button>
        <div className="flex justify-around items-center text-xs text-gray-500 mt-4">
          <div className="flex items-center gap-1">
            <Wifi size={14} />
            <span>{t('easy_ordering')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bell size={14} />
            <span>{t('fast_service')}</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard size={14} />
            <span>{t('secure_payment')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 