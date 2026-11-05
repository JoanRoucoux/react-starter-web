import { getGetUsersQueryKey, useDeleteUser } from '@core/api-client/users/users';
import { queryClient } from '@core/query/query-client';

type UserDelete = {
  remove(userId: number): Promise<boolean>;
  deleting: boolean;
  error: boolean;
};

export function useUserDelete(): UserDelete {
  const { mutateAsync, isPending, isError } = useDeleteUser();

  const remove = async (userId: number): Promise<boolean> => {
    try {
      await mutateAsync({ userId });
    } catch {
      return false;
    }
    await queryClient.invalidateQueries({ queryKey: getGetUsersQueryKey() });

    return true;
  };

  return { remove, deleting: isPending, error: isError };
}
