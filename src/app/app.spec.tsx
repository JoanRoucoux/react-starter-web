import { screen } from '@testing-library/react';

import { renderWithProviders } from '@testing/render-with-providers';

import { routes } from './app-routes';

describe('App', () => {
  it('renders the home page at /', async () => {
    renderWithProviders({ routes, initialEntries: ['/'] });

    expect(await screen.findByTestId('home-users-link')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders the not-found page for an unknown path', async () => {
    renderWithProviders({ routes, initialEntries: ['/missing'] });

    expect(await screen.findByRole('heading', { name: 'notFound.title' })).toBeInTheDocument();
  });
});
