import { Utensils } from 'lucide-react';
import React from 'react';

export const AddToCardButton = ({ total, count, onClick, disabled, children }: {
  total: number;
  count?: number;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between gap-4 bg-red-500 text-white py-4 rounded-full font-semibold px-6 text-lg shadow-lg pointer-events-auto transition-all disabled:opacity-60 disabled:cursor-not-allowed"
    disabled={disabled}
    style={{ minWidth: 320 }}
  >
    <div className="flex items-center gap-3">

    <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20">
    <Utensils size={22} />
          </span>
      {count ? (
        <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 font-bold text-base mr-2">{count}</span>
      ) : null}
      <span>{children || 'Add dishes to order'}</span>
    </div>
    <span className="font-bold text-xl">₫{total.toLocaleString()}</span>
  </button>
); 