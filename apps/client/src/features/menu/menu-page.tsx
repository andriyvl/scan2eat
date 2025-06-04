import { MenuList } from './list/menu-list';
import { OrderSummary } from '../order/creation/order-summary';
import { WaiterCall } from '../waiter-call';

export const MenuPage = () => {
  const restaurantId = 'restScan2EatDemo'; // 🔁 Replace with dynamic later

  return (
    <div className="p-4 pb-32">
      <MenuList restaurantId={restaurantId} />
      <OrderSummary />
      <WaiterCall />
    </div>
  );
};
