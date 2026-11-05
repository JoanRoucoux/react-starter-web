import { useQueryClient } from '@tanstack/react-query';

import { getGetUsersQueryKey, useDeleteUser } from '@core/api-client/users/users';

type UserDelete = {
  remove(userId: number): Promise<boolean>;
  deleting: boolean;
  error: boolean;
};

export function useUserDelete(): UserDelete {
  const queryClient = useQueryClient();
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
