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
  comment: string;
  takeaway: boolean;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
}

export interface Order {
  id: string;
  tableId: string;
  language: string;
  isTakeaway: boolean;
  orderComment: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  dishes: OrderDish[];
  price: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
} 