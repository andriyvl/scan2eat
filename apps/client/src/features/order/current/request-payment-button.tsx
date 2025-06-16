import { Button } from "@/components/ui/button"
import { useTable } from "@/contexts/table.context"
import { PaymentMethodModal } from "@/features/call/payment-method-modal"
import { CallsService } from "@/features/call/services/calls.service"
import { CreditCard } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export const RequestPaymentButton = ({ className }: { className?: string }) => {
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