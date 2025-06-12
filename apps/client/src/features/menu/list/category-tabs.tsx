import type { MenuCategory } from '@/types/types';
import React from 'react';

export const CategoryTabs = ({ categories, selectedCategory, setSelectedCategory }: {
  categories: MenuCategory[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
}) => (
  <div className="bg-white sticky top-8 z-40 border-b border-gray-200">
    <div className="flex overflow-x-auto scrollbar-hide px-4 py-2">
      <button
        className={`category-tab px-4 py-2 text-sm font-medium whitespace-nowrap relative ${
          selectedCategory === 'all' ? 'text-red-600 font-bold' : 'text-gray-600'
        }`}
        onClick={() => setSelectedCategory('all')}
      >
        All
        {selectedCategory === 'all' && (
          <span className="absolute left-0 right-0 -bottom-1 h-1 bg-red-500 rounded-full"></span>
        )}
      </button>
      {categories
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((cat) => (
          <button
            key={cat.id}
            className={`category-tab px-4 py-2 text-sm font-medium whitespace-nowrap relative ${
              selectedCategory === cat.id ? 'text-red-600 font-bold' : 'text-gray-600'
            }`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.categoryName}
            {selectedCategory === cat.id && (
              <span className="absolute left-0 right-0 -bottom-1 h-1 bg-red-500 rounded-full"></span>
            )}
          </button>
        ))}
    </div>
  </div>
); 