import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import { AVAILABLE_LANGS } from '@core/i18n/available-langs';

const DEFAULT_NAMESPACE = 'translation';
const COOKIE_MINUTES = 60 * 24 * 30;

const loadPath = (_languages: string[], namespaces: string[]): string =>
  namespaces[0] === DEFAULT_NAMESPACE ? '/i18n/{{lng}}.json' : '/i18n/{{ns}}/{{lng}}.json';

const syncHtmlLang = (lang: string): void => {
  document.documentElement.lang = new Intl.Locale(lang).language;
};

export const initI18n = async (): Promise<typeof i18n> => {
  i18n.off('languageChanged', syncHtmlLang);
  i18n.on('languageChanged', syncHtmlLang);

  await i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      backend: { loadPath },
      detection: {
        order: ['cookie', 'navigator'],
        caches: ['cookie'],
        lookupCookie: 'lang',
        cookieMinutes: COOKIE_MINUTES,
      },
      supportedLngs: AVAILABLE_LANGS,
      nonExplicitSupportedLngs: true,
      load: 'languageOnly',
      fallbackLng: 'en',
      ns: [DEFAULT_NAMESPACE],
      defaultNS: DEFAULT_NAMESPACE,
      react: { useSuspense: false },
    });

  return i18n;
};
