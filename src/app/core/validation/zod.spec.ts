import { z } from '@core/validation/zod';

describe('zod', () => {
  it('runs without the eval probe', () => {
    expect(z.config().jitless).toBe(true);
  });
});
