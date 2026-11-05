export class ApiError extends Error {
  readonly status: number;
  readonly method: string;
  readonly url: string;

  constructor(message: string, status: number, method: string, url: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.method = method;
    this.url = url;
  }
}
