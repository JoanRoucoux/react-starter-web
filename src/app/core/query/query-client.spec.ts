import { queryClient } from '@core/query/query-client';

describe('queryClient', () => {
  it('does not retry failed queries or mutations', () => {
    const options = queryClient.getDefaultOptions();

    expect(options.queries?.retry).toBe(false);
    expect(options.mutations?.retry).toBe(false);
  });
});
