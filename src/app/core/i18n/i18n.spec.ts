import type i18n from 'i18next';
import { HttpResponse, http } from 'msw';

import { server } from '@shared/testing/msw-server';

const setBrowserLanguages = (languages: string[]): void => {
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages);
};

const initFresh = async (): Promise<typeof i18n> => {
  vi.resetModules();
  const { initI18n } = await import('./i18n');
  return initI18n();
};

describe('initI18n', () => {
  beforeEach(() => {
    document.cookie = 'lang=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.documentElement.lang = '';
    server.use(
      http.get('/i18n/en.json', () => HttpResponse.json({ hello: 'Hello' })),
      http.get('/i18n/fr.json', () => HttpResponse.json({ hello: 'Bonjour' })),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uses the persisted cookie language over the browser language', async () => {
    document.cookie = 'lang=en; path=/';
    setBrowserLanguages(['fr-FR']);

    const instance = await initFresh();

    expect(instance.resolvedLanguage).toBe('en');
  });

  it('follows a supported browser language on a first visit', async () => {
    setBrowserLanguages(['fr-FR']);

    const instance = await initFresh();

    expect(instance.resolvedLanguage).toBe('fr');
    expect(instance.t('hello')).toBe('Bonjour');
  });

  it('falls back to English for an unsupported browser language', async () => {
    setBrowserLanguages(['de-DE']);

    const instance = await initFresh();

    expect(instance.resolvedLanguage).toBe('en');
  });

  it('keeps the html lang attribute in sync', async () => {
    setBrowserLanguages(['fr-FR']);

    const instance = await initFresh();
    expect(document.documentElement.lang).toBe('fr');

    await instance.changeLanguage('en');
    expect(document.documentElement.lang).toBe('en');
  });

  it('loads the global file and feature namespaces from their paths', async () => {
    server.use(
      http.get('/i18n/users/fr.json', () => HttpResponse.json({ title: 'Utilisateurs' })),
      http.get('/i18n/users/en.json', () => HttpResponse.json({ title: 'Users' })),
    );
    setBrowserLanguages(['fr-FR']);

    const instance = await initFresh();
    await instance.loadNamespaces('users');

    expect(instance.t('hello')).toBe('Bonjour');
    expect(instance.t('title', { ns: 'users' })).toBe('Utilisateurs');
  });
});
