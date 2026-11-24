import { ApiError } from '@core/http/api-error';
import { logger } from '@core/logger/logger';

import { environment } from '@environments/environment';

const TRACE_ID_HEADER = 'X-Trace-Id';

const fail = (error: ApiError): never => {
  const trace = error.traceId ? ` (trace ${error.traceId})` : '';
  logger.error('apiFetch', `API error on ${error.method} ${error.url}${trace}`, error);
  throw error;
};

const isAbort = (cause: unknown, options: RequestInit): boolean =>
  options.signal?.aborted === true || (cause instanceof DOMException && cause.name === 'AbortError');

export const apiFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
  const method = (options.method ?? 'GET').toUpperCase();
  const headers = new Headers(options.headers);
  if (options.body !== undefined && options.body !== null && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;
  try {
    response = await fetch(`${environment.apiBaseUrl}${url}`, { ...options, headers });
  } catch (cause) {
    if (isAbort(cause, options)) {
      throw cause;
    }
    return fail(new ApiError((cause as Error).message, 0, method, url));
  }

  const traceId = response.headers.get(TRACE_ID_HEADER);
  if (!response.ok) {
    return fail(
      new ApiError(`${response.status} ${response.statusText}`.trim(), response.status, method, url, traceId),
    );
  }

  const text = await response.text();
  if (!text) {
    return undefined as T;
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    return fail(new ApiError('Invalid JSON response', response.status, method, url, traceId));
  }
};
