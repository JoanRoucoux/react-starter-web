import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useRouteError } from 'react-router';

import { logger } from '@core/logger/logger';

import { reloadPage } from './reload-page';

export function NavigationErrorPage(): React.JSX.Element {
  const { t } = useTranslation();
  const error = useRouteError();

  useEffect(() => {
    logger.error('NavigationErrorPage', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{t('navigationError.title')}</h1>
      <p className="max-w-xl text-lg text-(--muted-foreground)">{t('navigationError.description')}</p>
      <button
        className="mt-2 inline-flex items-center justify-center rounded-md bg-(--primary) px-4 py-2 text-sm font-medium text-(--primary-foreground) transition-colors hover:bg-(--primary)/90"
        onClick={reloadPage}
        type="button"
      >
        {t('navigationError.reload')}
      </button>
    </div>
  );
}
