import { MenuList } from './list/menu-list';

export const MenuPage = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 min-h-0">
      <MenuList />
      </div>
    </div>
  );
};
