import { getGetSessionQueryOptions } from '@core/api-client/session/session';
import { queryClient } from '@core/query/query-client';

export const sessionQueryOptions = (): ReturnType<typeof getGetSessionQueryOptions> =>
  getGetSessionQueryOptions({ query: { staleTime: Infinity, gcTime: Infinity } });

export const hasPermission = async (permission: string): Promise<boolean> => {
  const session = await queryClient.ensureQueryData(sessionQueryOptions());

  return session.permissions.includes(permission);
};
