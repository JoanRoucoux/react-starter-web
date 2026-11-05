import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { USERS_PATHS } from '@features/users/contract/users-paths';

export function HomePage(): React.JSX.Element {
  const { t } = useTranslation('home');

  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-balance">{t('title')}</h1>
      <p className="max-w-xl text-lg text-(--muted-foreground)">{t('description')}</p>
      <Link
        className="inline-flex items-center justify-center rounded-md bg-(--primary) px-4 py-2 text-sm font-medium text-(--primary-foreground) transition-colors hover:bg-(--primary)/90"
        data-testid="home-users-link"
        to={USERS_PATHS.list}
      >
        {t('usersCta')}
      </Link>
    </div>
  );
}
