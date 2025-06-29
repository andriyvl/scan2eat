import { MenuList } from '../components/menu/list/menu-list';
import { Header } from '../components/header';

export const MenuPage = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 p-4">
        <MenuList />
      </main>
    </div>
  );
};
