import { Button } from "@/components/ui/button"
import { useTable } from "@/contexts/table.context"
import { PaymentMethodModal } from "@/features/call/payment-method-modal"
import { createCall, getActiveCall } from "@/features/call/services/calls.service"
import { CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export const RequestPaymentButton = ({ className }: { className?: string }) => {
    const { t } = useTranslation();
    const { qrId } = useTable();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [activeCallId, setActiveCallId] = useState<string | null>(null);
    const { restaurantId } = useTable();
  
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
      if (!qrId || !restaurantId) return;
  
      const callId = await createCall(qrId, 'payment_call', restaurantId);
      
      setIsModalOpen(false);
      setIsWaiting(true);
      setActiveCallId(callId);
    };
    return (
    <>
        <Button
          className={className}
            size="lg"
            leftIcon={<span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20"><CreditCard size={22} /></span>}
            onClick={handleRequestBill}
            disabled={isWaiting}
        >
            {isWaiting ? t('waiting_for_bill') : t('request_bill')}
        </Button>
        
        <PaymentMethodModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSuccess={handlePaymentSuccess}
        />
    </>
    )
}