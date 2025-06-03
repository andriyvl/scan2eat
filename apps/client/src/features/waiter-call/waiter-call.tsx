import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.config';
import { useTable } from '../../contexts/table.context';

export const WaiterCall = () => {
  const { t } = useTranslation();
  const { tableId } = useTable();
  const [isCalling, setIsCalling] = useState(false);

  const handleCallWaiter = async () => {
    if (!tableId) return;
    
    setIsCalling(true);
    try {
      await addDoc(collection(db, 'calls'), {
        tableId,
        type: 'waiter_call',
        status: 'active',
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Failed to call waiter:', error);
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <button
      onClick={handleCallWaiter}
      disabled={isCalling}
      className="fixed bottom-20 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {isCalling ? t('calling_waiter') : t('call_waiter')}
    </button>
  );
}; 