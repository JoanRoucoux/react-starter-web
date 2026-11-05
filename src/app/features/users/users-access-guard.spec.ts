import { HttpResponse, http } from 'msw';

import { server } from '@shared/testing/msw-server';

import { usersAccessGuard } from './users-access-guard';

const expectRedirectHome = async (): Promise<void> => {
  const thrown: unknown = await usersAccessGuard().catch((error: unknown) => error);

  expect(thrown).toBeInstanceOf(Response);
  expect((thrown as Response).headers.get('Location')).toBe('/');
};

describe('usersAccessGuard', () => {
  it('lets the navigation through with users:read', async () => {
    server.use(http.get('/api/session', () => HttpResponse.json({ permissions: ['users:read'] })));

    await expect(usersAccessGuard()).resolves.toBeNull();
  });

  it('redirects home without users:read', async () => {
    server.use(http.get('/api/session', () => HttpResponse.json({ permissions: [] })));

    await expectRedirectHome();
  });

  it('redirects home when the session call fails', async () => {
    server.use(http.get('/api/session', () => new HttpResponse(null, { status: 500 })));

    await expectRedirectHome();
  });

  it('redirects home when the session call cannot reach the server', async () => {
    server.use(http.get('/api/session', () => HttpResponse.error()));

    await expectRedirectHome();
  });
});
