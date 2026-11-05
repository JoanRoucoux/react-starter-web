import { useParams } from 'react-router';

import type { User } from '@core/api-client/reactStarterWebAPI.schemas';
import { useGetUser } from '@core/api-client/users/users';

type UserDetail = {
  user: User | undefined;
  isLoading: boolean;
  isError: boolean;
};

export function useUserDetail(): UserDetail {
  const { userId } = useParams();
  const { data, isLoading, isError } = useGetUser(Number(userId));

  return { user: data, isLoading, isError };
}
