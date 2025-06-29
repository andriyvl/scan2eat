import { db } from '@/config/firebase.config';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  getDoc,
  doc,
  documentId
} from 'firebase/firestore';
import type { Addon, Dish, MenuCategory, OrderDish, Restaurant, Order, QrCode } from '@/types/types';

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

export const getAddons = async (addonIds: string[]) => {
  if (addonIds.length === 0) return [];
  const snap = await getDocs(
    query(collection(db, 'addons'), where(documentId(), 'in', addonIds))
  );
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Addon[];
};

export const getRestaurant = async (restaurantId: string) => {
  const snap = await getDoc(doc(db, 'restaurants', restaurantId));
  return snap.data() as Restaurant;
};

export const submitOrder = async (
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
    status: 'pending',
    price: total,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const docRef = await addDoc(collection(db, 'orders'), order);
  return docRef.id;
};

export const getAddonsByRestaurant = async (restaurantId: string) => {
  const snap = await getDocs(
    query(collection(db, 'addons'), where('restaurantId', '==', restaurantId))
  );
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Addon[];
};

export const getAllRestaurants = async () => {
  const snap = await getDocs(collection(db, 'restaurants'));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Restaurant[];
};

export const getQrCodesByRestaurant = async (restaurantId: string) => {
  const snap = await getDocs(
    query(collection(db, 'qrCodes'), where('restaurantId', '==', restaurantId))
  );
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as QrCode[];
};

export const getAllQrCodes = async () => {
  const snap = await getDocs(collection(db, 'qrCodes'));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as QrCode[];
};

export const getOrdersByQrId = async (qrId: string) => {
  const snap = await getDocs(
    query(collection(db, 'orders'), where('qrId', '==', qrId))
  );
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Order[];
};

export const getAllOrders = async () => {
  const snap = await getDocs(collection(db, 'orders'));
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Order[];
};
