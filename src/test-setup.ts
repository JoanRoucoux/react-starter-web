import '@testing-library/jest-dom/vitest';

import { queryClient } from '@core/query/query-client';

import { server } from '@shared/testing/msw-server';

HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement): void {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function (this: HTMLDialogElement): void {
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};

beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => {
  server.resetHandlers();
  queryClient.clear();
});
afterAll(() => server.close());
