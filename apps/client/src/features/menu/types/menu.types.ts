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
  
  export type MenuCategory = {
    id: string;
    categoryName: string;
    sortOrder: number;
    restaurantId: string;
  };
  