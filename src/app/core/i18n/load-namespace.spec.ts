import i18n from 'i18next';

import { logger } from '@core/logger/logger';

import { loadNamespace } from './load-namespace';

describe('loadNamespace', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('resolves once the namespace is loaded', async () => {
    const loadSpy = vi.spyOn(i18n, 'loadNamespaces').mockResolvedValue();

    await expect(loadNamespace('home')()).resolves.toBeNull();

    expect(loadSpy).toHaveBeenCalledWith('home');
  });

  it('logs and still resolves when the namespace fails to load', async () => {
    const error = new Error('boom');
    vi.spyOn(i18n, 'loadNamespaces').mockRejectedValue(error);
    const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => undefined);

    await expect(loadNamespace('home')()).resolves.toBeNull();

    expect(errorSpy).toHaveBeenCalledWith('loadNamespace', 'Failed to load translation namespace "home"', error);
  });
});
