import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable } from '@/contexts/table.context';
import { createCall } from './services/calls.service';
import { SelectButton } from '@/components/ui/select-button';
import { BanknoteIcon, CreditCardIcon, QrCodeIcon, SmartphoneIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentMethodModal = ({ isOpen, onClose, onSuccess }: PaymentMethodModalProps) => {
  const { t } = useTranslation();
  const { qrId, restaurantId } = useTable();
  const [selectedMethod, setSelectedMethod] = useState<'qr' | 'card' | 'cash' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedMethod || !qrId || !restaurantId) return;

    try {
      setIsSubmitting(true);
      await createCall(qrId, 'payment_call', restaurantId, { paymentMethod: selectedMethod });
      onSuccess();
    } catch (error) {
      console.error('Error requesting bill:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: 'qr', icon: <div className="rounded-full bg-violet-200 p-2"><QrCodeIcon /></div>, title: t('payment_methods.qr') },
    { id: 'card', icon: <div className="rounded-full bg-blue-200 p-2"><CreditCardIcon /></div>, title: t('payment_methods.card') },
    { id: 'cash', icon: <div className="rounded-full bg-green-200 p-2"><BanknoteIcon /></div>, title: t('payment_methods.cash') },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('select_payment_method')}</h2>
        <div className="space-y-4 mb-8">
          {paymentMethods.map((method) => (
            <SelectButton
              key={method.id}
              isSelected={selectedMethod === method.id}
              icon={method.icon}
              title={method.title}
              onClick={() => setSelectedMethod(method.id)}
            />
          ))}
        </div>
        <div className="flex justify-end space-x-3">
          <Button
            onClick={onClose}
            size="md"
            variant="outline"
          >
            {t('cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedMethod || isSubmitting}
            size="md"
            variant="default"
          >
            {isSubmitting ? t('requesting_bill') : t('request_bill')}
          </Button>
        </div>
      </div>
    </div>
  );
}; 