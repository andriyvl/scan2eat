import React from 'react';

export const SendToKitchenButton = ({ onClick, disabled, children, icon, iconPosition = 'left' }: {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
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
        {isLeft && icon && (
          <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20">
            {icon}
          </span>
        )}
        <span>{children}</span>
      </div>
      {isRight && icon && (
        <span className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20">
          {icon}
        </span>
      )}
    </button>
  );
}; 