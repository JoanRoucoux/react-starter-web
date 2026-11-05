import { screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router';

import type { User } from '@core/api-client/reactStarterWebAPI.schemas';

import { server } from '@shared/testing/msw-server';
import { renderWithProviders } from '@shared/testing/render-with-providers';

import { UserDetailPage } from './user-detail-page';

describe('UserDetailPage', () => {
  const renderPage = (path = '/users/1'): ReturnType<typeof renderWithProviders> =>
    renderWithProviders(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<UserDetailPage />} path="/users/:userId" />
        </Routes>
      </MemoryRouter>,
    );

  it('displays the user once loaded', async () => {
    const user: User = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', status: 'active' };
    server.use(http.get('/api/users/1', () => HttpResponse.json(user)));

    renderPage();

    expect(screen.getByText('users:detail.loading')).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'john.doe@example.com' })).toHaveAttribute(
      'href',
      'mailto:john.doe@example.com',
    );
    expect(screen.getByRole('link', { name: 'users:detail.back' })).toHaveAttribute('href', '/users');
  });

  it('displays an error message when loading fails', async () => {
    server.use(http.get('/api/users/1', () => new HttpResponse(null, { status: 500 })));

    renderPage();

    expect(await screen.findByText('users:detail.error')).toBeInTheDocument();
  });

  it('shows the error state for a non-numeric id', async () => {
    server.use(http.get('/api/users/NaN', () => new HttpResponse(null, { status: 404 })));

    renderPage('/users/abc');

    expect(await screen.findByText('users:detail.error')).toBeInTheDocument();
  });
});
