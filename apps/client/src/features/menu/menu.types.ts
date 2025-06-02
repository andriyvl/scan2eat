export type Addon = {
    name: string;
    price: number;
    custom?: boolean;
  };
  
  export type Dish = {
    id: string;
    name: string;
    description: string;
    image?: string;
    basePrice: number;
    addons: Addon[];
    categoryId: string;
    translations?: {
      [key: string]: {
        name: string;
        description: string;
      };
    };
  };
  
  export type OrderDish = {
    dishId: string;
    name: string;
    basePrice: number;
    addons: Addon[];
    comment?: string;
    takeaway: boolean;
    status: 'pending' | 'in_progress' | 'ready' | 'delivered';
  };
  
  export type MenuCategory = {
    id: string;
    categoryName: string;
    sortOrder: number;
    restaurantId: string;
  };
  