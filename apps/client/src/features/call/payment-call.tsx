import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable } from '@/contexts/table.context';
import { PaymentMethodModal } from './payment-method-modal';
import { CallsService } from './services/calls.service';

export const PaymentCall = () => {
  const { t } = useTranslation();
  const { tableId } = useTable();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  useEffect(() => {
    const checkActiveCall = async () => {
      if (!tableId) return;
      
      const callsService = CallsService.getInstance();
      const activeCall = await callsService.getActiveCall(tableId, 'payment_call');
      
      if (activeCall) {
        setIsWaiting(true);
        setActiveCallId(activeCall.id);
      }
    };

    checkActiveCall();
  }, [tableId]);

  const handleRequestBill = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePaymentSuccess = async () => {
    if (!tableId) return;

    const callsService = CallsService.getInstance();
    const callId = await callsService.createCall(tableId, 'payment_call');
    
    setIsModalOpen(false);
    setIsWaiting(true);
    setActiveCallId(callId);
  };

  return (
    <>
      <button
        onClick={handleRequestBill}
        disabled={isWaiting}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isWaiting ? t('waiting_for_bill') : t('request_bill')}
      </button>

      <PaymentMethodModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}; 