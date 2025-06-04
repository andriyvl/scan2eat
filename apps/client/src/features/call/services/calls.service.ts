import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase.config';

export interface Call {
  id: string;
  tableId: string;
  type: 'waiter_call' | 'payment_call';
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export type CallType = 'waiter_call' | 'payment_call';
export type PaymentMethod = 'qr' | 'card' | 'cash';

interface CallData {
  paymentMethod?: PaymentMethod;
}

export const hasActiveCall = async (tableId: string, type: CallType): Promise<boolean> => {
  if (!tableId) return false;
  
  const callsQuery = query(
    collection(db, 'calls'),
    where('tableId', '==', tableId),
    where('type', '==', type),
    where('status', '==', 'active')
  );
  
  const snapshot = await getDocs(callsQuery);
  return !snapshot.empty;
};

export class CallsService {
  private static instance: CallsService;
  private readonly callsCollection = collection(db, 'calls');

  private constructor() {}

  public static getInstance(): CallsService {
    if (!CallsService.instance) {
      CallsService.instance = new CallsService();
    }
    return CallsService.instance;
  }

  async createCall(tableId: string, type: CallType, data?: CallData): Promise<void> {
    if (!tableId) {
      throw new Error('Table ID is required');
    }

    await addDoc(this.callsCollection, {
      tableId,
      type,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    });
  }

  async getActiveCall(tableId: string, type: Call['type']): Promise<Call | null> {
    const callsQuery = query(
      this.callsCollection,
      where('tableId', '==', tableId),
      where('type', '==', type),
      where('status', '==', 'active')
    );

    const snapshot = await getDocs(callsQuery);
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    } as Call;
  }

  async completeCall(callId: string): Promise<void> {
    const callRef = doc(this.callsCollection, callId);
    await updateDoc(callRef, {
      status: 'completed',
      updatedAt: new Date(),
    });
  }

  async cancelCall(callId: string): Promise<void> {
    const callRef = doc(this.callsCollection, callId);
    await updateDoc(callRef, {
      status: 'cancelled',
      updatedAt: new Date(),
    });
  }
} 