import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestPaymentButton } from './request-payment-button';
import type { Order } from '@/types/types';

interface OrderFooterProps {
  order: Order;
  className?: string;
}

export function OrderFooter({ order, className = '' }: OrderFooterProps) {
  const taxAmount = order.price * 0.05; // 5% tax
  const subtotal = order.price - taxAmount;

  return (
    <Card className={`rounded-b-3xl mt-4 ${className}`}>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Subtotal</span>
            <span>{subtotal.toLocaleString()}₫</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Tax included (5%)</span>
            <span>{taxAmount.toLocaleString()}₫</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between items-center font-bold text-base">
              <span>Total</span>
              <span>{order.price.toLocaleString()}₫</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-stretch">
        <RequestPaymentButton className="w-full" />
      </CardFooter>
    </Card>
  );
} 