import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { renderWithProviders } from '@testing/render-with-providers';

import { HomePage } from './home-page';

describe('HomePage', () => {
  it('links to the users feature', () => {
    renderWithProviders(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'home:usersCta' })).toHaveAttribute('href', '/users');
  });
});
