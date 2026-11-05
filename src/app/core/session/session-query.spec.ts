import { HttpResponse, http } from 'msw';
import { vi } from 'vitest';

import { queryClient } from '@core/query/query-client';

import { server } from '@shared/testing/msw-server';

import { hasPermission } from './session-query';

describe('session query', () => {
  it('asks the backend once for the whole app', async () => {
    let calls = 0;
    server.use(
      http.get('/api/session', () => {
        calls += 1;
        return HttpResponse.json({ permissions: ['users:read'] });
      }),
    );

    await hasPermission('users:read');
    await hasPermission('users:write');

    expect(calls).toBe(1);
  });

  it('answers from the permissions list', async () => {
    server.use(http.get('/api/session', () => HttpResponse.json({ permissions: ['users:read'] })));

    await expect(hasPermission('users:read')).resolves.toBe(true);
    await expect(hasPermission('users:write')).resolves.toBe(false);
  });

  it('keeps the session in the cache past the default garbage collection delay', async () => {
    let calls = 0;
    server.use(
      http.get('/api/session', () => {
        calls += 1;
        return HttpResponse.json({ permissions: ['users:read'] });
      }),
    );
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

    try {
      await hasPermission('users:read');
      await vi.advanceTimersByTimeAsync(6 * 60 * 1000);

      expect(queryClient.getQueryCache().getAll()).toHaveLength(1);

      await hasPermission('users:read');

      expect(calls).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
