import React from 'react';

export const OrderDishesButton = ({ total, count, onClick, disabled, children, icon, minimal, iconPosition = 'left' }: {
  total?: number;
  count?: number;
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  minimal?: boolean;
  iconPosition?: 'left' | 'right';
}) => {
  const isLeft = iconPosition === 'left';
  const isRight = iconPosition === 'right';

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center ${isRight ? 'justify-between' : 'justify-between'} gap-4 bg-red-500 text-white py-4 rounded-full font-semibold px-6 text-lg shadow-lg pointer-events-auto transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
      disabled={disabled}
      style={{ minWidth: 320 }}
    >
      <div className="flex items-center gap-3">
        {count ? (
                <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 font-bold text-base mr-2">{count}</span>
              ) : null}
          {isLeft && icon && (
          <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </div>

      <div className="flex items-center gap-3">
        {isRight && icon && (
          <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20">
            {icon}
          </span>
        )}
            {typeof total === 'number' && (
              <span className="font-bold text-xl">₫{total?.toLocaleString()}</span>
            )}
      </div>
    </button>
  );
}; 