import React from 'react';
import { Clock } from 'lucide-react';

export const OrderProgressBanner = ({ orderInProgress }: { orderInProgress: boolean }) => {
  if (!orderInProgress) return null;
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mx-4 mt-3 rounded-r-lg flex items-center space-x-2">
      <Clock className="text-amber-600 w-5 h-5" />
      <span className="text-sm font-medium text-amber-800">Order in progress</span>
      <span className="text-xs text-amber-600">• 2 dishes preparing</span>
    </div>
  );
}; 