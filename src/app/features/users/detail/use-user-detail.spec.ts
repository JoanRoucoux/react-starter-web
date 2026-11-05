import { type ReactNode, createElement } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router';

import type { User } from '@core/api-client/reactStarterWebAPI.schemas';
import { queryClient } from '@core/query/query-client';

import { server } from '@shared/testing/msw-server';

import { useUserDetail } from './use-user-detail';

describe('useUserDetail', () => {
  const user: User = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', status: 'active' };

  const wrapperAt =
    (path: string) =>
    ({ children }: { children: ReactNode }): React.JSX.Element =>
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(
          MemoryRouter,
          { initialEntries: [path] },
          createElement(Routes, null, createElement(Route, { path: '/users/:userId', element: children })),
        ),
      );

  it('loads the user of the current route', async () => {
    server.use(http.get('/api/users/1', () => HttpResponse.json(user)));

    const { result } = renderHook(() => useUserDetail(), { wrapper: wrapperAt('/users/1') });

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.user).toEqual(user));
    expect(result.current.isError).toBe(false);
  });

  it('exposes the error when the request fails', async () => {
    server.use(http.get('/api/users/1', () => new HttpResponse(null, { status: 404 })));

    const { result } = renderHook(() => useUserDetail(), { wrapper: wrapperAt('/users/1') });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.user).toBeUndefined();
  });

  it('reports an error for a non-numeric id', async () => {
    server.use(http.get('/api/users/NaN', () => new HttpResponse(null, { status: 404 })));

    const { result } = renderHook(() => useUserDetail(), { wrapper: wrapperAt('/users/abc') });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.user).toBeUndefined();
  });
});
