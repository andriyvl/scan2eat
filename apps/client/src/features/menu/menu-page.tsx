import { MenuList } from './list/menu-list';
import { OrderPreview } from '../order/creation/order-preview';

export const MenuPage = () => {
  const restaurantId = 'restScan2EatDemo'; // 🔁 Replace with dynamic later

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 min-h-0">
      <MenuList restaurantId={restaurantId} />
      </div>
      {/* OrderPreview is handled inside MenuList, so no need to render here */}
    </div>
  );
};
