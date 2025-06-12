import { MenuList } from './list/menu-list';

export const MenuPage = () => {
  const restaurantId = 'restScan2EatDemo'; // 🔁 Replace with dynamic later

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 min-h-0">
      <MenuList restaurantId={restaurantId} />
      </div>
    </div>
  );
};
