import { act, screen } from '@testing-library/react';
import { HttpResponse, http } from 'msw';

import { server } from '@shared/testing/msw-server';
import { renderWithProviders } from '@shared/testing/render-with-providers';

import { routes } from '../../app-routes';

describe('app routes for users', () => {
  const john = { id: 42, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', status: 'active' };

  const serveJohn = (): void => {
    server.use(http.get('/api/users/42', () => HttpResponse.json(john)));
  };

  const allow = (permissions: string[]): void => {
    server.use(http.get('/api/session', () => HttpResponse.json({ permissions })));
  };

  it('renders the create page on /users/new, not the detail page', async () => {
    allow(['users:read']);

    renderWithProviders({ routes, initialEntries: ['/users/new'] });

    expect(await screen.findByRole('heading', { name: 'users:create.title' })).toBeInTheDocument();
    expect(screen.queryByText('users:detail.loading')).not.toBeInTheDocument();
  });

  it('renders the list page on /users', async () => {
    allow(['users:read']);

    server.use(http.get('/api/users', () => HttpResponse.json([])));

    renderWithProviders({ routes, initialEntries: ['/users'] });

    expect(await screen.findByRole('heading', { name: 'users:list.title' })).toBeInTheDocument();
  });

  it('renders the detail page on /users/42', async () => {
    allow(['users:read']);
    serveJohn();

    renderWithProviders({ routes, initialEntries: ['/users/42'] });

    expect(await screen.findByRole('heading', { name: 'John Doe' })).toBeInTheDocument();
  });

  it('lands on home when access is refused', async () => {
    allow([]);

    renderWithProviders({ routes, initialEntries: ['/users'] });

    expect(await screen.findByTestId('home-users-link')).toBeInTheDocument();
  });

  it('asks for the session once across users navigations', async () => {
    serveJohn();
    let calls = 0;
    server.use(
      http.get('/api/session', () => {
        calls += 1;
        return HttpResponse.json({ permissions: ['users:read'] });
      }),
    );

    server.use(http.get('/api/users', () => HttpResponse.json([])));

    const { router } = renderWithProviders({ routes, initialEntries: ['/users'] });
    await screen.findByRole('heading', { name: 'users:list.title' });
    await act(() => router!.navigate('/users/42'));
    await screen.findByRole('heading', { name: 'John Doe' });

    expect(calls).toBe(1);
  });
});
