import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/app.context';
import { PaymentMethodModal } from './payment-method-modal';
import { createCall } from './services/calls.service';
import { getActiveCall } from './services/calls.service';

export const PaymentCall = () => {
  const { t } = useTranslation();
  const { qrId, restaurantId } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);

  useEffect(() => {
    const checkActiveCall = async () => {
      if (!qrId || !restaurantId) return;

      const activeCall = await getActiveCall(qrId, 'payment_call', restaurantId);
      
      if (activeCall) {
        setIsWaiting(true);
        setActiveCallId(activeCall?.id || null);
      }
    };

    checkActiveCall();
  }, [qrId, restaurantId]);

  const handleRequestBill = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handlePaymentSuccess = async () => {
    if (!qrId) return;

    const callId = await createCall(qrId, 'payment_call', restaurantId);
    
    setIsModalOpen(false);
    setIsWaiting(true);
    setActiveCallId(callId);
  };

  return (
    <>
      <button
        onClick={handleRequestBill}
        disabled={isWaiting}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold text-base shadow-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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