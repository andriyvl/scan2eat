import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/app.context';
import { hasActiveCall as checkActiveCall, createCall } from './services/calls.service';
import { Bell } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';

interface WaiterCallProps {
  className?: string;
  iconOnly?: boolean;
}

export const WaiterCall = ({ className = '', iconOnly = false }: WaiterCallProps) => {
  const { t } = useTranslation();
  const { qrId, restaurantId } = useApp();
  const [isCalling, setIsCalling] = useState(false);
  const [hasActiveCall, setHasActiveCall] = useState(false);

  useEffect(() => {
    const checkCall = async () => {
      if (!qrId || !restaurantId) return;
      const hasCall = await checkActiveCall(qrId, 'waiter_call', restaurantId);
      setHasActiveCall(hasCall);
    };
    // TODO fix this. call every 2 minutes.

    checkCall();
  }, [qrId, restaurantId]);

  const handleCallWaiter = async () => {
    if (!qrId || !restaurantId) return;

    try {
      setIsCalling(true);
      await createCall(qrId, 'waiter_call', restaurantId);
      setHasActiveCall(true);
    } catch (error) {
      console.error('Error calling waiter:', error);
    } finally {
      setIsCalling(false);
    }
  };

  if (iconOnly) {
    return (
      <IconButton
        onClick={handleCallWaiter}
        disabled={isCalling || hasActiveCall}
        variant="default"
        size="md"
        className={className}
        aria-label={t('call_waiter')}
      >
        <Bell size={20} />
      </IconButton>
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