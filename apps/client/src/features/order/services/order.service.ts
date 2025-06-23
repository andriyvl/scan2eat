import type { Order, OrderDish } from '@/types/types';
import { db } from '@/config/firebase.config';
import { doc, updateDoc, arrayUnion, getDoc, addDoc, collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { devtools } from 'zustand/middleware';
import { create } from 'zustand';
import { useOrderStore } from '../order.store';
import { OrderStatus } from '@/types/types';

export const calculateOrderTotal = (dishes: OrderDish[]): number => {
  return dishes.reduce((total, dish) => {
    const dishTotal = dish.basePrice + dish.addons.reduce((sum, addon) => sum + addon.price, 0);
    return total + dishTotal;
  }, 0);
};

export const submitNewOrder = async (
  qrId: string,
  language: string,
  dishes: OrderDish[],
  total: number
): Promise<string> => {
  const order = {
    qrId,
    language,
    isTakeaway: dishes.every((d) => d.takeaway),
    orderComment: '',
    dishes,
    status: OrderStatus.Pending,
    price: total,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  };

  const docRef = await addDoc(collection(db, 'orders'), order);
  // Fetch the created order and update the store
  const orderSnap = await getDoc(docRef);
  if (orderSnap.exists()) {
    useOrderStore.getState().setCurrentOrder({ id: docRef.id, ...orderSnap.data() } as Order);
  }
  return docRef.id;
};

export const updateExistingOrder = async (
  orderId: string,
  newDishes: OrderDish[]
): Promise<void> => {
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);
  const currentOrder = orderSnap.data();
  
  if (!currentOrder) {
    throw new Error('Order not found');
  }

  const allDishes = [...currentOrder.dishes, ...newDishes];
  const newTotal = calculateOrderTotal(allDishes);

  await updateDoc(orderRef, {
    dishes: arrayUnion(...newDishes),
    price: newTotal,
    updatedAt: Timestamp.now()
  });
  // Fetch the updated order and update the store
  const updatedSnap = await getDoc(orderRef);
  if (updatedSnap.exists()) {
    useOrderStore.getState().setCurrentOrder({ id: orderId, ...updatedSnap.data() } as Order);
  }
};
