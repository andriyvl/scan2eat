import { MenuList } from './list/menu-list';
import { OrderPreview } from '../order/creation/order-preview';
import { WaiterCall } from '../call';

export const MenuPage = () => {
  const restaurantId = 'restScan2EatDemo'; // 🔁 Replace with dynamic later

  return (
    <div className="pb-32">
      <MenuList restaurantId={restaurantId} />
      <OrderPreview />
      <WaiterCall className="mt-4" />
    </div>
  );
};
