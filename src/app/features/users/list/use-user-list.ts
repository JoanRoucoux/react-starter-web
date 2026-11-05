import { useMemo, useState } from 'react';

import type { User } from '@core/api-client/reactStarterWebAPI.schemas';
import { useGetUsers } from '@core/api-client/users/users';

type UserList = {
  users: User[];
  filteredUsers: User[];
  search: string;
  setSearch(value: string): void;
  isLoading: boolean;
  isError: boolean;
  retry(): void;
};

const NO_USERS: User[] = [];

export function useUserList(): UserList {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useGetUsers();
  const users = data ?? NO_USERS;

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      return users;
    }

    return users.filter((user) => `${user.firstName} ${user.lastName}`.toLowerCase().includes(term));
  }, [users, search]);

  return {
    users,
    filteredUsers,
    search,
    setSearch,
    isLoading,
    isError,
    retry: () => {
      void refetch();
    },
  };
}
