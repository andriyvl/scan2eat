import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { App } from './app';
import './config/i18n.config';
import { loadTranslations } from './config/i18n.config';
import { LanguageProvider } from './contexts/language.context';

const browserLang = navigator.language.slice(0, 2); // 'en', 'vi', etc.
const supported = ['en', 'vi'];

// Initialize translations
loadTranslations(supported.includes(browserLang) ? browserLang : 'en').catch((e) => {
  console.error('[i18n] failed to load translations:', e);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
