import { type ReactNode, createElement } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { useGetUsers } from '@core/api-client/users/users';
import { queryClient } from '@core/query/query-client';

import { server } from '@shared/testing/msw-server';

import { useUserDelete } from './use-user-delete';

describe('useUserDelete', () => {
  const wrapper = ({ children }: { children: ReactNode }): React.JSX.Element =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  const succeed = (): void => {
    server.use(http.delete('/api/users/1', () => new HttpResponse(null, { status: 204 })));
  };

  const fail = (): void => {
    server.use(http.delete('/api/users/1', () => new HttpResponse(null, { status: 500 })));
  };

  it('deletes the user and reports a success', async () => {
    let method = '';
    server.use(
      http.delete('/api/users/1', ({ request }) => {
        method = request.method;
        return new HttpResponse(null, { status: 204 });
      }),
    );
    const { result } = renderHook(() => useUserDelete(), { wrapper });

    let removed = false;
    await act(async () => {
      removed = await result.current.remove(1);
    });

    expect(method).toBe('DELETE');
    expect(removed).toBe(true);
    expect(result.current.deleting).toBe(false);
    expect(result.current.error).toBe(false);
  });

  it('is deleting while the request is pending', async () => {
    let release = (): void => undefined;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    server.use(
      http.delete('/api/users/1', async () => {
        await gate;
        return new HttpResponse(null, { status: 204 });
      }),
    );
    const { result } = renderHook(() => useUserDelete(), { wrapper });

    let removal = Promise.resolve(false);
    act(() => {
      removal = result.current.remove(1);
    });
    await waitFor(() => expect(result.current.deleting).toBe(true));

    release();
    await act(async () => {
      await removal;
    });
    await waitFor(() => expect(result.current.deleting).toBe(false));
  });

  it('reports a failure and exposes the error when the request fails', async () => {
    fail();
    const { result } = renderHook(() => useUserDelete(), { wrapper });

    let removed = true;
    await act(async () => {
      removed = await result.current.remove(1);
    });

    expect(removed).toBe(false);
    expect(result.current.deleting).toBe(false);
    expect(result.current.error).toBe(true);
  });

  it('clears a previous error when deleting again', async () => {
    fail();
    const { result } = renderHook(() => useUserDelete(), { wrapper });
    await act(async () => {
      await result.current.remove(1);
    });
    expect(result.current.error).toBe(true);

    succeed();
    let removed = false;
    await act(async () => {
      removed = await result.current.remove(1);
    });

    expect(removed).toBe(true);
    expect(result.current.error).toBe(false);
  });

  it('invalidates the users list after a deletion', async () => {
    let listCalls = 0;
    server.use(
      http.get('/api/users', () => {
        listCalls += 1;
        return HttpResponse.json([]);
      }),
    );
    succeed();
    const { result } = renderHook(() => ({ list: useGetUsers(), deletion: useUserDelete() }), { wrapper });
    await waitFor(() => expect(result.current.list.isSuccess).toBe(true));
    expect(listCalls).toBe(1);

    await act(async () => {
      await result.current.deletion.remove(1);
    });

    await waitFor(() => expect(listCalls).toBe(2));
  });
});
