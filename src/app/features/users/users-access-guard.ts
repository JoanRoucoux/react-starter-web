import { redirect } from 'react-router';

import { hasPermission } from '@core/session/session-query';

import { HOME_PATHS } from '@features/home/contract/home-paths';

export const usersAccessGuard = async (): Promise<null> => {
  const allowed = await hasPermission('users:read').catch(() => false);

  if (!allowed) {
    throw redirect(HOME_PATHS.home);
  }

  return null;
};
