import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTable } from '@/contexts/table.context';
import { CallsService } from './services/calls.service';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentMethodModal = ({ isOpen, onClose, onSuccess }: PaymentMethodModalProps) => {
  const { t } = useTranslation();
  const { tableId } = useTable();
  const [selectedMethod, setSelectedMethod] = useState<'qr' | 'card' | 'cash' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedMethod || !tableId) return;

    try {
      setIsSubmitting(true);
      await CallsService.getInstance().createCall(tableId, 'payment_call', { paymentMethod: selectedMethod });
      onSuccess();
    } catch (error) {
      console.error('Error requesting bill:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">{t('select_payment_method')}</h2>
        <div className="space-y-4 mb-8">
          {(['qr', 'card', 'cash'] as const).map((method) => (
            <button
              key={method}
              onClick={() => setSelectedMethod(method)}
              className={`w-full flex items-center gap-3 p-4 text-left rounded-lg border-2 transition-all font-semibold text-base shadow-sm
                ${selectedMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}
              `}
            >
              <span className="text-xl">
                {method === 'qr' && '📱'}
                {method === 'card' && '💳'}
                {method === 'cash' && '💵'}
              </span>
              <span>{t(`payment_methods.${method}`)}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg font-semibold"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedMethod || isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? t('requesting_bill') : t('request_bill')}
          </button>
        </div>
      </div>
    </div>
  );
}; 