import { useLanguage } from '@/contexts/language.context';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { useQrCode } from '@/contexts/qr-code.context';

const RESTAURANT_IMAGE_URL = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/fc46fd8759-7163ce2744f74232301d.png';

export const LanguagePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { restaurantKey} = useQrCode();
  const handleProceed = () => {
    navigate('welcome');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="relative h-[280px] overflow-hidden">
        <img className="w-full h-full object-cover" src={RESTAURANT_IMAGE_URL} alt="elegant Vietnamese restaurant interior" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute bottom-8 left-4 right-4 text-center text-white">
            <h1 className="text-3xl font-bold mb-2">{t('welcome_to')}</h1>
            <h2 className="text-4xl font-bold">{t(`restaurants.${restaurantKey}.name`)}</h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-4 py-8">
        <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('select_language')}</h3>
            <p className="text-gray-600">{t('choose_language')}</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-8">
          {supportedLanguages.map((lang) => (
             <button 
              key={lang.id}
              className={cn(
                "w-full border-2 rounded-2xl p-5 flex items-center justify-between transition-all",
                language === lang.id
                  ? "bg-black border-black" 
                  : "bg-white border-gray-200"
              )}
              onClick={() => setLanguage(lang.id)}
            >
              <div className="flex items-center space-x-4">
                  <span className="text-3xl">{lang.flagEmoji}</span>
                  <div className="text-left">
                      <h4 className={cn(
                        "font-semibold", 
                        language === lang.id ? "text-white" : "text-gray-900"
                      )}>{lang.nativeName}</h4>
                      <p className={cn(
                        "text-sm",
                        language === lang.id ? "text-white/80" : "text-gray-600"
                      )}>{lang.name}</p>
                  </div>
              </div>
              <div className={cn(
                "w-6 h-6 border-2 rounded-full flex items-center justify-center",
                language === lang.id ? "border-white" : "border-gray-300"
              )}>
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    language === lang.id ? "bg-white" : "bg-gray-900 hidden"
                  )}></div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8">
          <Button
            size="lg"
            className="w-full"
            onClick={handleProceed}
            rightContent={<ArrowRight className="w-5 h-5 ml-2" />}
          >
            {t('proceed')}
          </Button>
        </div>
      </div>
    </div>
  );
}; 