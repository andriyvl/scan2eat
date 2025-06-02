import { MenuList } from './list/menu-list';
import { OrderSummary } from './order/order-summary';

export const MenuPage = () => {
  const restaurantId = 'restScan2EatDemo'; // 🔁 Replace with dynamic later

  return (
    <div className="p-4 pb-32">
      <MenuList restaurantId={restaurantId} />
      <OrderSummary />
    </div>
  );
};
