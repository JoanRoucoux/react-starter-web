import { screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { MemoryRouter } from 'react-router';

import type { User } from '@core/api-client/reactStarterWebAPI.schemas';

import { server } from '@shared/testing/msw-server';

import { renderWithProviders } from '@testing/render-with-providers';

import { UserListPage } from './user-list-page';

describe('UserListPage', () => {
  const john: User = { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', status: 'active' };
  const alice: User = {
    id: 2,
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice.smith@example.com',
    status: 'pending',
  };

  const serveUsers = (users: User[]): void => {
    server.use(http.get('/api/users', () => HttpResponse.json(users)));
  };

  const renderPage = (): ReturnType<typeof renderWithProviders> =>
    renderWithProviders(
      <MemoryRouter>
        <UserListPage />
      </MemoryRouter>,
    );

  it('displays users once loaded', async () => {
    serveUsers([john, alice]);

    renderPage();

    expect(await screen.findAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'John Doe' })).toHaveAttribute('href', '/users/1');
    expect(screen.getByRole('link', { name: 'users:list.create' })).toHaveAttribute('href', '/users/new');
  });

  it('displays a loading state before the response', () => {
    serveUsers([john]);

    renderPage();

    expect(screen.getByTestId('user-list-loading')).toHaveTextContent('users:list.loading');
  });

  it('displays an error state with a retry button when loading fails', async () => {
    server.use(http.get('/api/users', () => new HttpResponse(null, { status: 500 })));

    renderPage();

    expect(await screen.findByText('users:list.error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'users:list.retry' })).toBeInTheDocument();
  });

  it('reloads the users when the retry button is clicked', async () => {
    server.use(http.get('/api/users', () => new HttpResponse(null, { status: 500 })));
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: 'users:list.retry' }));
    serveUsers([john]);
    await user.click(await screen.findByRole('button', { name: 'users:list.retry' }));

    expect(await screen.findAllByRole('listitem')).toHaveLength(1);
  });

  it('displays an empty state when there are no users', async () => {
    serveUsers([]);

    renderPage();

    expect(await screen.findByText('users:list.empty')).toBeInTheDocument();
  });

  it('filters the displayed users when typing in the search field', async () => {
    serveUsers([john, alice]);
    const { user } = renderPage();
    expect(await screen.findAllByRole('listitem')).toHaveLength(2);

    await user.type(screen.getByRole('searchbox', { name: 'users:list.search' }), 'alice');

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Alice Smith' })).toBeInTheDocument();
  });

  it('deletes a user through the confirmation dialog', async () => {
    let deleted = false;
    server.use(
      http.get('/api/users', () => HttpResponse.json(deleted ? [] : [john])),
      http.delete('/api/users/1', () => {
        deleted = true;
        return new HttpResponse(null, { status: 204 });
      }),
    );
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: 'users:list.deleteUser' }));
    expect(screen.getByRole('dialog', { name: 'users:delete.title' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'users:delete.submit' }));

    expect(await screen.findByText('users:list.empty')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('user-list-status')).toHaveTextContent('users:list.deleted');
    expect(screen.getByRole('heading', { name: 'users:list.title' })).toHaveFocus();
  });

  it('closes the confirmation dialog without deleting when it is cancelled', async () => {
    serveUsers([john]);
    const { user } = renderPage();

    await user.click(await screen.findByRole('button', { name: 'users:list.deleteUser' }));
    await user.click(screen.getByRole('button', { name: 'users:delete.cancel' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});
