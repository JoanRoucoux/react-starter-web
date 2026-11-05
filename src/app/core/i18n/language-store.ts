import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

import { type AvailableLang } from '@core/i18n/available-langs';

export const setActiveLang = async (lang: AvailableLang): Promise<void> => {
  await i18n.changeLanguage(lang);
};

export const useActiveLang = (): string => new Intl.Locale(useTranslation().i18n.language).language;
