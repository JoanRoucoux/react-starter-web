import { screen } from '@testing-library/react';

import { renderWithProviders } from '@shared/testing/render-with-providers';

import { routes } from './app-routes';

describe('App', () => {
  it('renders the {{feature}} page at /', async () => {
    renderWithProviders({ routes, initialEntries: ['/'] });

    expect(await screen.findByRole('heading', { level: 1, name: '{{feature}}:title' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the not-found page for an unknown path', async () => {
    renderWithProviders({ routes, initialEntries: ['/missing'] });

    expect(await screen.findByRole('heading', { name: 'notFound.title' })).toBeInTheDocument();
  });
});
