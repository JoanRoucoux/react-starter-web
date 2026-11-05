import { type ReactNode, createElement } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import type { User } from '@core/api-client/reactStarterWebAPI.schemas';
import { queryClient } from '@core/query/query-client';

import { server } from '@shared/testing/msw-server';

import { useUserList } from './use-user-list';

describe('useUserList', () => {
  const users: User[] = [
    { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', status: 'active' },
    { id: 2, firstName: 'Alice', lastName: 'Smith', email: 'alice.smith@example.com', status: 'pending' },
  ];

  const wrapper = ({ children }: { children: ReactNode }): React.JSX.Element =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  const loadUsers = async (): Promise<ReturnType<typeof renderHook<ReturnType<typeof useUserList>, unknown>>> => {
    server.use(http.get('/api/users', () => HttpResponse.json(users)));
    const hook = renderHook(() => useUserList(), { wrapper });
    await waitFor(() => expect(hook.result.current.isLoading).toBe(false));

    return hook;
  };

  it('exposes the users returned by the API', async () => {
    const { result } = await loadUsers();

    expect(result.current.users).toEqual(users);
    expect(result.current.filteredUsers).toEqual(users);
  });

  it('is loading and empty before the response', () => {
    server.use(http.get('/api/users', () => HttpResponse.json(users)));

    const { result } = renderHook(() => useUserList(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.users).toEqual([]);
  });

  it('filters the users on first name, last name and case', async () => {
    const { result } = await loadUsers();

    act(() => {
      result.current.setSearch('ALICE');
    });
    expect(result.current.filteredUsers).toEqual([users[1]]);

    act(() => {
      result.current.setSearch('doe');
    });
    expect(result.current.filteredUsers).toEqual([users[0]]);
  });

  it('returns every user when the search term is blank', async () => {
    const { result } = await loadUsers();

    act(() => {
      result.current.setSearch('   ');
    });

    expect(result.current.filteredUsers).toEqual(users);
  });

  it('returns no user when nothing matches', async () => {
    const { result } = await loadUsers();

    act(() => {
      result.current.setSearch('unknown');
    });

    expect(result.current.filteredUsers).toEqual([]);
  });

  it('exposes the error when the request fails and recovers on retry', async () => {
    server.use(http.get('/api/users', () => new HttpResponse(null, { status: 500 })));
    const { result } = renderHook(() => useUserList(), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.filteredUsers).toEqual([]);

    server.use(http.get('/api/users', () => HttpResponse.json(users)));
    act(() => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.users).toEqual(users));
    expect(result.current.isError).toBe(false);
  });
});
