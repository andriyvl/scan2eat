import React from 'react';

interface TabProps {
  id: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
  className?: string;
}

export const Tab: React.FC<TabProps> = ({ 
  id, 
  label, 
  isSelected, 
  onClick, 
  className = '' 
}) => {
  return (
    <button
      key={id}
      className={`category-tab px-4 py-2 text-sm font-medium whitespace-nowrap relative ${
        isSelected ? 'text-red-600 font-bold' : 'text-gray-600'
      } ${className}`}
      onClick={onClick}
    >
      {label}
      {isSelected && (
        <span className="absolute left-0 right-0 -bottom-1 h-1 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
}; 