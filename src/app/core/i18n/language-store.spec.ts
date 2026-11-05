import { act, renderHook, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { server } from '@shared/testing/msw-server';

const clearLangCookie = (): void => {
  document.cookie = 'lang=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};

describe('language store', () => {
  beforeEach(clearLangCookie);

  afterEach(() => {
    vi.restoreAllMocks();
    clearLangCookie();
  });

  it('switches the active language and persists it in the lang cookie', async () => {
    server.use(
      http.get('/i18n/en.json', () => HttpResponse.json({ hello: 'Hello' })),
      http.get('/i18n/fr.json', () => HttpResponse.json({ hello: 'Bonjour' })),
    );
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US']);
    vi.resetModules();
    const { initI18n } = await import('./i18n');
    const { setActiveLang, useActiveLang } = await import('./language-store');
    await initI18n();
    const { result } = renderHook(() => useActiveLang());
    expect(result.current).toBe('en');

    await act(() => setActiveLang('fr'));

    await waitFor(() => expect(result.current).toBe('fr'));
    expect(document.cookie).toContain('lang=fr');
  });
});
