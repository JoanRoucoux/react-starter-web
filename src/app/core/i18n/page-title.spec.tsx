import { act, render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider, createMemoryRouter } from 'react-router';

import { renderWithProviders } from '@shared/testing/render-with-providers';
import { createTestI18n } from '@shared/testing/test-i18n';

import { PageTitle } from './page-title';

const sampleRoutes = [
  {
    path: 'a',
    handle: { title: 'pageTitle.outer' },
    children: [{ path: 'b', handle: { title: 'pageTitle.inner' }, Component: () => null }],
  },
  { path: 'plain', Component: () => null },
];

describe('PageTitle', () => {
  it('sets the document title from the deepest route title', async () => {
    renderWithProviders({ routes: sampleRoutes, initialEntries: ['/a/b'] });

    expect(await screen.findByTestId('route-announcer')).toHaveTextContent('pageTitle.inner');
    expect(document.title).toBe('pageTitle.inner | React Starter Web');
  });

  it('uses the app title alone when no route has a title', async () => {
    renderWithProviders({ routes: sampleRoutes, initialEntries: ['/plain'] });

    expect(await screen.findByTestId('route-announcer')).toBeEmptyDOMElement();
    expect(document.title).toBe('React Starter Web');
  });

  it('announces the page title in the live region', async () => {
    renderWithProviders({ routes: sampleRoutes, initialEntries: ['/a'] });

    expect(await screen.findByTestId('route-announcer')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByTestId('route-announcer')).toHaveTextContent('pageTitle.outer');
  });

  it('re-translates the title when the language changes', async () => {
    const i18n = createTestI18n();
    i18n.addResourceBundle('en', 'translation', { 'pageTitle.outer': 'Outer' });
    i18n.addResourceBundle('fr', 'translation', { 'pageTitle.outer': 'Externe' });
    const router = createMemoryRouter([{ path: '/', Component: PageTitle, handle: { title: 'pageTitle.outer' } }]);
    render(
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
      </I18nextProvider>,
    );
    expect(await screen.findByText('Outer')).toBeInTheDocument();

    await act(() => i18n.changeLanguage('fr'));

    expect(screen.getByTestId('route-announcer')).toHaveTextContent('Externe');
    expect(document.title).toBe('Externe | React Starter Web');
  });
});
