import { createInstance, type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';

export const createTestI18n = (): i18n => {
  const instance = createInstance();
  void instance.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: false,
    resources: {},
    initAsync: false,
    appendNamespaceToMissingKey: true,
    parseMissingKeyHandler: (key: string): string => key.replace(/^translation:/, ''),
    react: { useSuspense: false },
  });

  return instance;
};
