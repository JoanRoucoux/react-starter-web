import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import { USERS_PATHS } from '../contract/users-paths';
import { useUserDetail } from './use-user-detail';

export function UserDetailPage(): React.JSX.Element {
  const { t } = useTranslation('users');
  const { user, isLoading } = useUserDetail();

  return (
    <>
      <Link
        className="mb-4 inline-block text-sm font-medium text-(--muted-foreground) hover:text-(--foreground)"
        to={USERS_PATHS.list}
      >
        {t('detail.back')}
      </Link>

      {isLoading ? (
        <p className="rounded-lg border border-(--border) bg-(--card) p-6 text-sm text-(--muted-foreground)">
          {t('detail.loading')}
        </p>
      ) : user ? (
        <div className="rounded-lg border border-(--border) bg-(--card) p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              {user.firstName} {user.lastName}
            </h1>
            <span className="rounded-full bg-(--secondary) px-2.5 py-0.5 text-xs font-semibold text-(--secondary-foreground)">
              {t(`status.${user.status}`)}
            </span>
          </div>
          <a
            className="mt-2 inline-block text-sm text-(--muted-foreground) underline-offset-4 hover:text-(--foreground) hover:underline"
            href={`mailto:${user.email}`}
          >
            {user.email}
          </a>
        </div>
      ) : (
        <p className="rounded-lg border border-(--border) bg-(--card) p-6 text-sm text-(--destructive)">
          {t('detail.error')}
        </p>
      )}
    </>
  );
}
