import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable } from '@/contexts/table.context';
import { hasActiveCall as checkActiveCall, CallsService } from './services/calls.service';
import { Bell } from 'lucide-react';

interface WaiterCallProps {
  className?: string;
  iconOnly?: boolean;
}

export const WaiterCall = ({ className = '', iconOnly = false }: WaiterCallProps) => {
  const { t } = useTranslation();
  const { tableId } = useTable();
  const [isCalling, setIsCalling] = useState(false);
  const [hasActiveCall, setHasActiveCall] = useState(false);

  useEffect(() => {
    const checkCall = async () => {
      if (!tableId) return;
      const hasCall = await checkActiveCall(tableId, 'waiter_call');
      setHasActiveCall(hasCall);
    };

    checkCall();
  }, [tableId]);

  const handleCallWaiter = async () => {
    if (!tableId) return;

    try {
      setIsCalling(true);
      await CallsService.getInstance().createCall(tableId, 'waiter_call');
      setHasActiveCall(true);
    } catch (error) {
      console.error('Error calling waiter:', error);
    } finally {
      setIsCalling(false);
    }
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleCallWaiter}
        disabled={isCalling || hasActiveCall}
        className={`w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label={t('call_waiter')}
      >
        <Bell size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={handleCallWaiter}
      disabled={isCalling || hasActiveCall}
      className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-base shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isCalling ? t('calling_waiter') : hasActiveCall ? t('waiter_called') : t('call_waiter')}
    </button>
  );
}; 