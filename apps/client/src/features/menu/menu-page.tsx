import { MenuList } from './list/menu-list';
import { OrderPreview } from '../order/creation/order-preview';

export const MenuPage = () => {
  const restaurantId = 'restScan2EatDemo'; // 🔁 Replace with dynamic later

  return (
    <div className="pb-32">
      <MenuList restaurantId={restaurantId} />
      <OrderPreview />
    </div>
  );
};
