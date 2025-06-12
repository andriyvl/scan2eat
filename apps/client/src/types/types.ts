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
    tags?: string[];
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
  

  import { Timestamp } from 'firebase/firestore';

export interface OrderAddon {
  name: string;
  price: number;
}


export interface OrderDish {
  dishId: string;
  name: string;
  basePrice: number;
  price: number;
  addons: OrderAddon[];
  comment?: string;
  takeaway: boolean;
  status: DishStatus;
}

export interface Order {
  id: string;
  tableId: string;
  language: string;
  isTakeaway: boolean;
  orderComment: string;
  status: OrderStatus;
  dishes: OrderDish[];
  price: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export enum OrderStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Delivered = 'delivered',
  RequiresAttention = 'requires_attention',
  AwaitingPayment = 'awaiting_payment',
  Paid = 'paid',
}

export enum DishStatus {
  Awaiting = 'awaiting',
  Preparing = 'preparing',
  Ready = 'ready',
  DishDelivered = 'dish_delivered',
} 