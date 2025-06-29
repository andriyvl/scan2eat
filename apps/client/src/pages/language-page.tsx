import { useLanguage } from '@/contexts/language.context';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/utils/utils';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/app.context';
import { LanguageSelector } from '@/components/ui/language-selector';

const RESTAURANT_IMAGE_URL = 'https://storage.googleapis.com/uxpilot-auth.appspot.com/fc46fd8759-7163ce2744f74232301d.png';

export const LanguagePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { restaurantKey} = useApp();
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
          <LanguageSelector
            languages={supportedLanguages}
            selected={language}
            onSelect={setLanguage}
          />
        </div>

        <div>
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