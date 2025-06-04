import type { OrderDish } from '@/types/types';
import { db } from '@/config/firebase.config';
import { doc, updateDoc, arrayUnion, getDoc, addDoc, collection } from 'firebase/firestore';

export const calculateOrderTotal = (dishes: OrderDish[]): number => {
  return dishes.reduce((total, dish) => {
    const dishTotal = dish.basePrice + dish.addons.reduce((sum, addon) => sum + addon.price, 0);
    return total + dishTotal;
  }, 0);
};

export const submitNewOrder = async (
  tableId: string,
  language: string,
  dishes: OrderDish[],
  total: number
): Promise<string> => {
  const order = {
    tableId,
    language,
    isTakeaway: dishes.every((d) => d.takeaway),
    orderComment: '',
    dishes,
    status: 'pending',
    price: total,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const docRef = await addDoc(collection(db, 'orders'), order);
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
    updatedAt: new Date()
  });
};