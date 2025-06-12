import React from 'react';
import { useOrderStore } from '@/features/order/order.store';

const OrderDishesButton = ({ onOpen }: { onOpen: () => void }) => {
  const { dishes } = useOrderStore();
  const total = dishes.reduce((sum, d) => sum + d.price, 0);
  if (!dishes.length) return null;
  return (
    <div className="fixed left-0 right-0 bottom-0 z-[110] px-4 pb-4 pointer-events-none">
      <div className="max-w-xl mx-auto">
    <button
          onClick={onOpen}
          className="w-full flex items-center justify-between gap-4 bg-red-500 text-white py-4 rounded-full font-semibold px-6 text-lg shadow-lg pointer-events-auto transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ minWidth: 320 }}
    >
      <div className="flex items-center gap-3">
            <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 font-bold text-base mr-2">{dishes.length}</span>
            <span>Order dishes</span>
      </div>
          <span className="font-bold text-xl">₫{total.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
}; 

export default OrderDishesButton; 