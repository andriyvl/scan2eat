import { db } from '@/config/firebase.config';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc
} from 'firebase/firestore';
import type { Dish, MenuCategory } from '../types/menu.types';
import type { OrderDish } from '@/features/menu/order/types/order.types';

export const getMenuCategories = async (restaurantId: string) => {
  const snap = await getDocs(
    query(collection(db, 'categories'), where('restaurantId', '==', restaurantId))
  );
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as MenuCategory[];
};

export const getDishes = async (restaurantId: string) => {
  const snap = await getDocs(
    query(collection(db, 'dishes'), where('restaurantId', '==', restaurantId))
  );
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Dish[];
};

export const submitOrder = async (
  tableId: string,
  language: string,
  dishes: OrderDish[],
  total: number
) => {
  const order = {
    tableId,
    language,
    isTakeaway: dishes.every((d) => d.takeaway),
    orderComment: '',
    dishes,
    status: 'pending',
    price: total,
    createdAt: new Date()
  };

  await addDoc(collection(db, 'orders'), order);
};
