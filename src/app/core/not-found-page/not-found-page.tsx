import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { HOME_PATHS } from '@features/home/contract/home-paths';

export function NotFoundPage(): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight">{t('notFound.title')}</h1>
      <p className="max-w-xl text-lg text-(--muted-foreground)">{t('notFound.description')}</p>
      <Link
        className="mt-2 inline-flex items-center justify-center rounded-md bg-(--primary) px-4 py-2 text-sm font-medium text-(--primary-foreground) transition-colors hover:bg-(--primary)/90"
        to={HOME_PATHS.home}
      >
        {t('notFound.home')}
      </Link>
    </div>
  );
}
