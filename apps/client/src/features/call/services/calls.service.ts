import { collection, addDoc, getDocs, query, where, orderBy, limit, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase.config';
import type { Call, CallType, CallStatus } from '../../../types/types';

export async function hasActiveCall(qrId: string, type: CallType, restaurantId: string): Promise<boolean> {
  if (!qrId) return false;

  const q = query(
    collection(db, 'calls'),
    where('qrId', '==', qrId),
    where('restaurantId', '==', restaurantId),
    where('type', '==', type),
    where('status', '==', 'active'),
    orderBy('timestamp', 'desc'),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

export async function createCall(qrId: string, type: CallType, restaurantId: string, data?: Call['data'], ): Promise<string> {
  if (!qrId) {
    throw new Error('QR ID is required');
  }

  const callData: Call = {
    qrId,
    timestamp: new Date(),
    type,
    status: 'active' as CallStatus,
    data,
    restaurantId: restaurantId
  };

  const docRef = await addDoc(collection(db, 'calls'), callData);
  return docRef.id;
}

export async function getActiveCall(qrId: string, type: CallType, restaurantId: string): Promise<Call | null> {
  const q = query(
    collection(db, 'calls'),
    where('qrId', '==', qrId),
    where('restaurantId', '==', restaurantId),
    where('type', '==', type),
    where('status', '==', 'active'),
    orderBy('timestamp', 'desc'),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as Call;
}

export async function completeCall(callId: string): Promise<void> {
  const callRef = doc(collection(db, 'calls'), callId);
  await updateDoc(callRef, {
    status: 'resolved' as CallStatus,
    timestamp: new Date()
  });
}

export async function cancelCall(callId: string): Promise<void> {
  const callRef = doc(collection(db, 'calls'), callId);
  await updateDoc(callRef, {
    status: 'resolved' as CallStatus,
    timestamp: new Date()
  });
} 