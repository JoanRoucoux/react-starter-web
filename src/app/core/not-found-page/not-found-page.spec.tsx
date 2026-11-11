import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { renderWithProviders } from '@testing/render-with-providers';

import { NotFoundPage } from './not-found-page';

describe('NotFoundPage', () => {
  const renderPage = (): void => {
    renderWithProviders(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );
  };

  it('displays the not found message', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'notFound.title' })).toBeInTheDocument();
    expect(screen.getByText('notFound.description')).toBeInTheDocument();
  });

  it('links back to the home page', () => {
    renderPage();

    expect(screen.getByRole('link', { name: 'notFound.home' })).toHaveAttribute('href', '/');
  });
});
