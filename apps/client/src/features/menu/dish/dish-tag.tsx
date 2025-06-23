import { useTranslation } from 'react-i18next';

interface DishTagProps {
  tag: string;
}

export const DishTag = ({ tag }: DishTagProps) => {
  const { t } = useTranslation();
  
  const getTagStyles = (tag: string) => {
    switch (tag) {
      // Dietary restrictions
      case 'vegetarian':
        return 'bg-green-100 text-green-700';
      case 'vegan':
        return 'bg-emerald-100 text-emerald-700';
      case 'gluten-free':
        return 'bg-blue-100 text-blue-700';
      case 'halal':
        return 'bg-teal-100 text-teal-700';
      case 'kosher':
        return 'bg-indigo-100 text-indigo-700';
      
      // Quality indicators
      case 'organic':
        return 'bg-lime-100 text-lime-700';
      case 'sustainable':
        return 'bg-cyan-100 text-cyan-700';
      case 'local':
        return 'bg-amber-100 text-amber-700';
      case 'seasonal':
        return 'bg-orange-100 text-orange-700';
      
      // Taste/flavor profiles
      case 'spicy':
        return 'bg-red-100 text-red-700';
      case 'sweet':
        return 'bg-pink-100 text-pink-700';
      case 'salty':
        return 'bg-slate-100 text-slate-700';
      case 'sour':
        return 'bg-yellow-100 text-yellow-700';
      case 'bitter':
        return 'bg-purple-100 text-purple-700';
      case 'umami':
        return 'bg-rose-100 text-rose-700';
      case 'savory':
        return 'bg-brown-100 text-brown-700';
      
      // Popularity/status
      case 'popular':
        return 'bg-green-100 text-green-700';
      case 'hot':
        return 'bg-red-100 text-red-700';
      
      // Legacy tags (keeping for backward compatibility)
      case 'fresh':
        return 'bg-green-100 text-green-700';
      case 'quick':
        return 'bg-orange-100 text-orange-700';
      case 'cold':
        return 'bg-blue-100 text-blue-700';
      
      // Default fallback
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs rounded-full ${getTagStyles(tag)}`}
    >
      {t(`tags.${tag}`)} 
    </span>
  );
}; 