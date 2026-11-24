export class ApiError extends Error {
  readonly status: number;
  readonly method: string;
  readonly url: string;
  readonly traceId: string | null;

  constructor(message: string, status: number, method: string, url: string, traceId: string | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.method = method;
    this.url = url;
    this.traceId = traceId;
  }
}
