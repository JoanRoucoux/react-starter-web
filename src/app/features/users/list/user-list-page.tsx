import { useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

import type { User } from '@core/api-client/reactStarterWebAPI.schemas';

import { USERS_PATHS } from '../contract/users-paths';
import { UserDeleteDialog } from './delete-dialog/user-delete-dialog';
import { useUserList } from './use-user-list';

export function UserListPage(): React.JSX.Element {
  const { t } = useTranslation('users');
  const { filteredUsers, search, setSearch, isLoading, isError, retry } = useUserList();
  const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);
  const [deletedUserName, setDeletedUserName] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  const onDeleted = (user: User): void => {
    setDeletedUserName(`${user.firstName} ${user.lastName}`);
    setUserToDelete(undefined);
    headingRef.current?.focus();
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 ref={headingRef} className="text-2xl font-semibold tracking-tight" tabIndex={-1}>
          {t('list.title')}
        </h1>
        <Link
          className="inline-flex items-center justify-center rounded-md bg-(--primary) px-4 py-2 text-sm font-medium text-(--primary-foreground) transition-colors hover:bg-(--primary)/90"
          data-testid="user-list-create"
          to={USERS_PATHS.create}
        >
          {t('list.create')}
        </Link>
      </div>

      <p className="sr-only" data-testid="user-list-status" role="status">
        {deletedUserName && t('list.deleted', { name: deletedUserName })}
      </p>

      <input
        aria-label={t('list.search')}
        className="mb-4 w-full rounded-md border border-(--input) bg-(--card) px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)"
        data-testid="user-list-search"
        placeholder={t('list.search')}
        type="search"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
      />

      {isLoading ? (
        <p
          className="rounded-lg border border-(--border) bg-(--card) p-6 text-sm text-(--muted-foreground)"
          data-testid="user-list-loading"
        >
          {t('list.loading')}
        </p>
      ) : isError ? (
        <div className="rounded-lg border border-(--border) bg-(--card) p-6">
          <p className="text-sm text-(--destructive)" data-testid="user-list-error">
            {t('list.error')}
          </p>
          <button
            className="mt-3 inline-flex items-center justify-center rounded-md bg-(--primary) px-4 py-2 text-sm font-medium text-(--primary-foreground) transition-colors hover:bg-(--primary)/90"
            data-testid="user-list-retry"
            type="button"
            onClick={retry}
          >
            {t('list.retry')}
          </button>
        </div>
      ) : (
        <ul
          className="divide-y divide-(--border) overflow-hidden rounded-lg border border-(--border) bg-(--card)"
          data-testid="user-list"
        >
          {filteredUsers.map((user) => (
            <li key={user.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-(--accent)/50">
              <Link
                className="flex-1 text-sm font-medium hover:underline"
                data-testid="user-item"
                to={USERS_PATHS.detail(user.id)}
              >
                {user.firstName} {user.lastName}
              </Link>
              <span className="rounded-full bg-(--secondary) px-2.5 py-0.5 text-xs font-semibold text-(--secondary-foreground)">
                {t(`status.${user.status}`)}
              </span>
              <button
                aria-label={t('list.deleteUser', { name: `${user.firstName} ${user.lastName}` })}
                className="rounded-md px-2 py-1 text-xs font-medium text-(--destructive) transition-colors hover:bg-(--destructive)/10"
                data-testid="user-item-delete"
                type="button"
                onClick={() => {
                  setUserToDelete(user);
                }}
              >
                {t('list.delete')}
              </button>
            </li>
          ))}
          {filteredUsers.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-(--muted-foreground)" data-testid="user-list-empty">
              {t('list.empty')}
            </li>
          )}
        </ul>
      )}

      {userToDelete && (
        <UserDeleteDialog
          user={userToDelete}
          onDeleted={() => {
            onDeleted(userToDelete);
          }}
          onDismissed={() => {
            setUserToDelete(undefined);
          }}
        />
      )}
    </>
  );
}
