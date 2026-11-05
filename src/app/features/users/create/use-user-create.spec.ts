import { type ReactNode, createElement } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import type { User, UserCreation } from '@core/api-client/reactStarterWebAPI.schemas';
import { useGetUsers } from '@core/api-client/users/users';
import { queryClient } from '@core/query/query-client';

import { server } from '@shared/testing/msw-server';

import { useUserCreate } from './use-user-create';

describe('useUserCreate', () => {
  const wrapper = ({ children }: { children: ReactNode }): React.JSX.Element =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  const values: UserCreation = { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' };
  const created: User = { id: 42, ...values, status: 'pending' };

  it('starts with empty values and no error', () => {
    const { result } = renderHook(() => useUserCreate(), { wrapper });

    expect(result.current.form.getValues()).toEqual({ firstName: '', lastName: '', email: '' });
    expect(result.current.submitError).toBe(false);
  });

  it('posts the values and returns the created user', async () => {
    let body: unknown;
    let method = '';
    server.use(
      http.post('/api/users', async ({ request }) => {
        method = request.method;
        body = await request.json();
        return HttpResponse.json(created, { status: 201 });
      }),
    );
    const { result } = renderHook(() => useUserCreate(), { wrapper });

    let saved: User | undefined;
    await act(async () => {
      saved = await result.current.save(values);
    });

    expect(method).toBe('POST');
    expect(body).toEqual(values);
    expect(saved).toEqual(created);
    expect(result.current.submitError).toBe(false);
  });

  it('flags the error and returns nothing when the call fails', async () => {
    server.use(http.post('/api/users', () => new HttpResponse(null, { status: 500 })));
    const { result } = renderHook(() => useUserCreate(), { wrapper });

    let saved: User | undefined = created;
    await act(async () => {
      saved = await result.current.save(values);
    });

    expect(saved).toBeUndefined();
    expect(result.current.submitError).toBe(true);
  });

  it('clears a previous error when saving again', async () => {
    server.use(http.post('/api/users', () => new HttpResponse(null, { status: 500 })));
    const { result } = renderHook(() => useUserCreate(), { wrapper });
    await act(async () => {
      await result.current.save(values);
    });
    expect(result.current.submitError).toBe(true);

    server.use(http.post('/api/users', () => HttpResponse.json(created, { status: 201 })));
    await act(async () => {
      await result.current.save(values);
    });

    expect(result.current.submitError).toBe(false);
  });

  it('invalidates the users list after a creation', async () => {
    let listCalls = 0;
    server.use(
      http.get('/api/users', () => {
        listCalls += 1;
        return HttpResponse.json([]);
      }),
      http.post('/api/users', () => HttpResponse.json(created, { status: 201 })),
    );
    const { result } = renderHook(() => ({ list: useGetUsers(), creation: useUserCreate() }), { wrapper });
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    expect(listCalls).toBe(1);

    await act(async () => {
      await result.current.creation.save(values);
    });

    await waitFor(() => expect(listCalls).toBe(2));
  });
});
