import { screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router';

import type { User } from '@core/api-client/reactStarterWebAPI.schemas';

import { server } from '@shared/testing/msw-server';
import { renderWithProviders } from '@shared/testing/render-with-providers';

import { UserCreatePage } from './user-create-page';

describe('UserCreatePage', () => {
  const renderPage = (): ReturnType<typeof renderWithProviders> =>
    renderWithProviders(
      <MemoryRouter initialEntries={['/users/new']}>
        <Routes>
          <Route element={<UserCreatePage />} path="/users/new" />
          <Route element={<p>detail page</p>} path="/users/:userId" />
        </Routes>
      </MemoryRouter>,
    );

  const trackPosts = (): { count: number; body: unknown } => {
    const calls = { count: 0, body: undefined as unknown };
    server.use(
      http.post('/api/users', async ({ request }) => {
        calls.count += 1;
        calls.body = await request.json();
        const created: User = {
          id: 42,
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          status: 'pending',
        };
        return HttpResponse.json(created, { status: 201 });
      }),
    );

    return calls;
  };

  const fillForm = async (user: ReturnType<typeof renderWithProviders>['user'], email: string): Promise<void> => {
    await user.type(screen.getByLabelText('users:create.firstName'), 'John');
    await user.type(screen.getByLabelText('users:create.lastName'), 'Doe');
    await user.type(screen.getByLabelText('users:create.email'), email);
  };

  const submitButton = (): HTMLElement => screen.getByRole('button', { name: 'users:create.submit' });

  it('shows validation errors and sends no request when submitted empty', async () => {
    const calls = trackPosts();
    const { user } = renderPage();

    await user.click(submitButton());

    expect(await screen.findAllByText('users:create.errors.required')).toHaveLength(3);
    expect(screen.getByLabelText('users:create.firstName')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('users:create.firstName')).toHaveAttribute('aria-describedby', 'firstName-error');
    expect(calls.count).toBe(0);
  });

  it('flags only the touched empty field as invalid after tabbing out of it', async () => {
    const { user } = renderPage();

    await user.click(screen.getByLabelText('users:create.firstName'));
    await user.tab();

    expect(await screen.findByText('users:create.errors.required')).toBeInTheDocument();
    expect(screen.getByLabelText('users:create.firstName')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('users:create.lastName')).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows the format error message for a malformed email', async () => {
    const calls = trackPosts();
    const { user } = renderPage();

    await fillForm(user, 'not-an-email');
    await user.click(submitButton());

    expect(await screen.findByText('users:create.errors.email')).toBeInTheDocument();
    expect(calls.count).toBe(0);
  });

  it('creates the user and navigates to its detail page', async () => {
    const calls = trackPosts();
    const { user } = renderPage();

    await fillForm(user, 'john.doe@example.com');
    await user.click(submitButton());

    expect(await screen.findByText('detail page')).toBeInTheDocument();
    expect(calls.body).toEqual({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
  });

  it('displays an error message when the creation fails', async () => {
    server.use(http.post('/api/users', () => new HttpResponse(null, { status: 500 })));
    const { user } = renderPage();

    await fillForm(user, 'john.doe@example.com');
    await user.click(submitButton());

    expect(await screen.findByRole('alert')).toHaveTextContent('users:create.error');
    await waitFor(() => expect(submitButton()).toBeEnabled());
  });
});
