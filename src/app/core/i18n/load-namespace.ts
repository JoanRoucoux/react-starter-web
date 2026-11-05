import i18n from 'i18next';

import { logger } from '@core/logger/logger';

export const loadNamespace =
  (ns: string): (() => Promise<null>) =>
  async () => {
    try {
      await i18n.loadNamespaces(ns);
    } catch (error) {
      logger.error('loadNamespace', `Failed to load translation namespace "${ns}"`, error);
    }

    return null;
  };
