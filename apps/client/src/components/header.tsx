import { useTranslation } from 'react-i18next';
import { useTable } from '@/contexts/table.context';
import { Utensils } from 'lucide-react';
import { useState } from 'react';
import { WaiterCall } from '@/features/call/waiter-call';

const LANGUAGES = [
  { code: 'vi', label: 'VI', flag: '🇻🇳' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  // Add more languages as needed
];

export const Header = () => {
  const { t, i18n } = useTranslation();
  const { restaurantName, tableId } = useTable();
  const [langDropdown, setLangDropdown] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <header className="bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <Utensils className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">{restaurantName || t('welcome')}</h1>
            <p className="text-xs text-gray-500">Table {tableId}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 relative">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 rounded-full border"
              onClick={() => setLangDropdown(v => !v)}
            >
              <span className="text-lg">{currentLang.flag}</span>
              <span className="text-sm font-medium">{currentLang.label}</span>
              <svg className="w-4 h-4 text-gray-500 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {langDropdown && (
              <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 ${lang.code === i18n.language ? 'font-bold' : ''}`}
                    onClick={() => { i18n.changeLanguage(lang.code); setLangDropdown(false); }}
                  >
                    <span className="mr-2">{lang.flag}</span> {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Waiter Call Button */}
          <WaiterCall className="!w-10 !h-10 !p-0 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-none" iconOnly />
        </div>
      </div>
    </header>
  );
}; 