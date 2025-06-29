import { useTranslation } from 'react-i18next';
import { useApp } from '@/contexts/app.context';
import { QrCodeIcon, Utensils } from 'lucide-react';
import { useState } from 'react';
import { WaiterCall } from '@/components/call/waiter-call';
import { useLocation, useNavigate, useParams, } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/language.context';

export const Header = () => {
  const { t } = useTranslation();
  const { restaurantKey } = useApp();
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const [langDropdown, setLangDropdown] = useState(false);

  const { restaurantId, qrId, orderId } = useParams();
  const { pathname } = useLocation();
  
  const currentLang = supportedLanguages.find(l => l.id === language) || supportedLanguages[0];
  
  const navigate = useNavigate();
  const showBack = !!orderId;

  const handleBackClick = () => {

    if (pathname.includes('/menu')) {
      navigate(`/${restaurantId}/${qrId}`);
    } else if (pathname.includes('/order') && orderId) {
      navigate(`/${restaurantId}/${qrId}/menu`);
    } else {
      navigate(-1);
    }
  };

    return (
    <header className="bg-white sticky top-0 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          {showBack && (
            <button
              className="mr-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={handleBackClick}
              aria-label={t('back_to_menu') || 'Back to menu'}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          {!showBack && <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
            <Utensils className="text-white" size={20} />
          </div>}
          <div>
            <h1 className="font-bold text-lg text-gray-900">{t(`restaurants.${restaurantKey}.name`) || t('welcome')}</h1>
            <div className="text-xs text-gray-500 inline-flex items-center gap-1"><QrCodeIcon className="w-4 h-4" />QR ID: {qrId}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 relative">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 rounded-full border"
              onClick={() => setLangDropdown(v => !v)}
            >
              <span className="text-lg">{currentLang?.flagEmoji}</span>
              <span className="text-sm font-medium">{currentLang?.country}</span>
              <svg className="w-4 h-4 text-gray-500 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {langDropdown && (
              <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                {supportedLanguages.map(lang => (
                  <button
                    key={lang.id}
                    className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 ${lang.id === language ? 'font-bold' : ''}`}
                    onClick={() => { setLanguage(lang.id); setLangDropdown(false); }}
                  >
                    <span className="mr-2">{lang.flagEmoji}</span> {lang.country}
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