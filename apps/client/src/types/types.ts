import { Timestamp } from 'firebase/firestore';

export type MenuCategory = {
  id: string;
  key: string;
  sortOrder: number;
  restaurantId: string;
};

export interface OrderAddon {
  id?: string;
  price: number;
}

export type Addon = {
  id?: string;
  restaurantId?: string;
  key: string;
  price: number;
};


export type Dish = {
  id: string;
  key: string;
  description: string;
  image?: string;
  basePrice: number;
  addonOptions: string[];
  categoryId: string;
  tags?: string[];
  translations?: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
};

export interface OrderDish {
  dishId: string;
  key: string;
  basePrice: number; // price of the dish without addons
  price: number; // price of the dish with addons
  addons: OrderAddon[]; // selected addons
  comment?: string;
  takeaway: boolean;
  status: DishStatus;
}

export interface Order {
  id: string;
  qrId: string;
  restaurantId?: string;
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

export type CallType = 'waiter_call' | 'payment_call';
export type CallStatus = 'active' | 'resolved';
export type PaymentMethod = 'qr' | 'card' | 'cash';


export interface Call {
  id?: string;
  qrId: string;
  timestamp: Date;
  type: CallType;
  status: CallStatus;
  restaurantId: string;
  data?: {
    paymentMethod?: PaymentMethod;
  };
}

export interface Restaurant {
  id: string;
  key: string;
  defaultLang: string;
  createdAt: Timestamp;
  ownerEmail: string;
}

export interface QrCode {
  id: string;
  tableNumber: string;
  restaurantId: string;
  qrId: string;
}

export interface Locale {
  id: string;
  nativeName: string;
  name: string;
  country: string;
  flagEmoji: string;
}