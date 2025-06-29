import type { MenuCategory } from '@/types/types';
import React from 'react'; 
import { useTranslation } from 'react-i18next';
import { Tab } from '@/components/ui/tab';

export const CategoryTabs = ({ categories, selectedCategory, setSelectedCategory }: {
  categories: MenuCategory[];
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
}) => {
  const { t } = useTranslation();

  return (
  <div className="bg-white sticky top-8 z-40 border-b border-gray-200">
    <div className="flex overflow-x-auto scrollbar-hide px-4 py-2">
      <Tab
        id="all"
        label="All"
        isSelected={selectedCategory === 'all'}
        onClick={() => setSelectedCategory('all')}
      />
      {categories
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((cat) => (
          <Tab
            key={cat.id}
            id={cat.id}
            label={t(`categories.${cat.key}.name`)}
            isSelected={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
          />
        ))}
    </div>
  </div>
)};