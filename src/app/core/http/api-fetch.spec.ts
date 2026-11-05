import { HttpResponse, http } from 'msw';

import { ApiError } from '@core/http/api-error';
import { apiFetch } from '@core/http/api-fetch';
import { logger } from '@core/logger/logger';

import { server } from '@shared/testing/msw-server';

describe('apiFetch', () => {
  it('returns the parsed body on 200', async () => {
    server.use(http.get('/api/users', () => HttpResponse.json([{ id: 1 }])));

    await expect(apiFetch('/users', { method: 'GET' })).resolves.toEqual([{ id: 1 }]);
  });

  it('prefixes the API base URL', async () => {
    const handler = vi.fn(() => HttpResponse.json({}));
    server.use(http.get('/api/users', handler));

    await apiFetch('/users', {});

    expect(handler).toHaveBeenCalledOnce();
  });

  it('returns undefined on 204', async () => {
    server.use(http.delete('/api/users/1', () => new HttpResponse(null, { status: 204 })));

    await expect(apiFetch('/users/1', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('sends the JSON body and content type on POST', async () => {
    let contentType: string | null = null;
    let body: unknown;
    server.use(
      http.post('/api/users', async ({ request }) => {
        contentType = request.headers.get('Content-Type');
        body = await request.json();
        return HttpResponse.json({ id: 2 }, { status: 201 });
      }),
    );

    await apiFetch('/users', { method: 'POST', body: JSON.stringify({ name: 'Ada' }) });

    expect(contentType).toBe('application/json');
    expect(body).toEqual({ name: 'Ada' });
  });

  it('throws an ApiError with the status and logs it on 500', async () => {
    const spy = vi.spyOn(logger, 'error').mockImplementation(() => undefined);
    server.use(http.get('/api/users', () => new HttpResponse(null, { status: 500 })));

    const error = await apiFetch('/users', { method: 'GET' }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 500, method: 'GET', url: '/users' });
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('apiFetch', expect.stringContaining('GET /users'), error);
  });

  it('throws an ApiError with status 0 on a network error', async () => {
    const spy = vi.spyOn(logger, 'error').mockImplementation(() => undefined);
    server.use(http.get('/api/users', () => HttpResponse.error()));

    const error = await apiFetch('/users', { method: 'GET' }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 0 });
    expect(spy).toHaveBeenCalledOnce();
    expect(spy).toHaveBeenCalledWith('apiFetch', expect.stringContaining('GET /users'), error);
  });

  it('does not log or wrap an aborted request', async () => {
    const spy = vi.spyOn(logger, 'error').mockImplementation(() => undefined);
    server.use(http.get('/api/users', () => HttpResponse.json([])));
    const controller = new AbortController();
    controller.abort();

    const error = await apiFetch('/users', { method: 'GET', signal: controller.signal }).catch((e: unknown) => e);

    expect(error).not.toBeInstanceOf(ApiError);
    expect(spy).not.toHaveBeenCalled();
  });

  it('rethrows an AbortError raised without an aborted signal', async () => {
    const spy = vi.spyOn(logger, 'error').mockImplementation(() => undefined);
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new DOMException('aborted', 'AbortError'));

    const error = await apiFetch('/users', { method: 'GET' }).catch((e: unknown) => e);

    expect(error).not.toBeInstanceOf(ApiError);
    expect(spy).not.toHaveBeenCalled();
  });

  it('throws a logged ApiError when a successful response is not JSON', async () => {
    const spy = vi.spyOn(logger, 'error').mockImplementation(() => undefined);
    server.use(http.get('/api/users', () => new HttpResponse('<html>', { status: 200 })));

    const error = await apiFetch('/users', { method: 'GET' }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 200, method: 'GET', url: '/users' });
    expect(spy).toHaveBeenCalledOnce();
  });
});
