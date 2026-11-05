import { type RouteObject } from 'react-router';

import { loadNamespace } from '@core/i18n/load-namespace';

import { USERS_PATHS } from './contract/users-paths';
import { usersAccessGuard } from './users-access-guard';

export const USERS_ROUTES: RouteObject[] = [
  {
    loader: async () => {
      await usersAccessGuard();

      return loadNamespace('users')();
    },
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('./list/user-list-page')).UserListPage }),
        handle: { title: 'pageTitle.users' },
      },
      {
        path: USERS_PATHS.createSegment,
        lazy: async () => ({ Component: (await import('./create/user-create-page')).UserCreatePage }),
        handle: { title: 'pageTitle.userCreate' },
      },
      {
        path: ':userId',
        lazy: async () => ({ Component: (await import('./detail/user-detail-page')).UserDetailPage }),
        handle: { title: 'pageTitle.userDetail' },
      },
    ],
  },
];
