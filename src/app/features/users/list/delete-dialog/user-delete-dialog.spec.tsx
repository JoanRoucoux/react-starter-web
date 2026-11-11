import { fireEvent, screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { type MockInstance } from 'vitest';

import type { User } from '@core/api-client/reactStarterWebAPI.schemas';

import { server } from '@shared/testing/msw-server';

import { renderWithProviders } from '@testing/render-with-providers';

import { UserDeleteDialog } from './user-delete-dialog';

describe('UserDeleteDialog', () => {
  const user: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    status: 'active',
  };
  const onDeleted = vi.fn();
  const onDismissed = vi.fn();

  const renderDialog = (): ReturnType<typeof renderWithProviders> =>
    renderWithProviders(<UserDeleteDialog user={user} onDeleted={onDeleted} onDismissed={onDismissed} />);

  let closeSpy: MockInstance<() => void>;

  beforeEach(() => {
    closeSpy = vi.spyOn(HTMLDialogElement.prototype, 'close');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it('opens as a modal dialog labelled and described for screen readers', () => {
    renderDialog();

    const dialog = screen.getByRole('dialog', { name: 'users:delete.title' });
    expect(dialog).toHaveAttribute('open');
    expect(dialog).toHaveAccessibleDescription('users:delete.description');
  });

  it('calls onDismissed without calling the API when cancelling', async () => {
    const { user: actor } = renderDialog();

    await actor.click(screen.getByRole('button', { name: 'users:delete.cancel' }));

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(onDismissed).toHaveBeenCalledTimes(1);
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it('calls onDismissed when the dialog is cancelled with the Escape key', () => {
    renderDialog();

    fireEvent(screen.getByRole('dialog'), new Event('cancel', { cancelable: true }));

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(onDismissed).toHaveBeenCalledTimes(1);
    expect(onDeleted).not.toHaveBeenCalled();
  });

  it('deletes the user and calls onDeleted when confirming', async () => {
    server.use(http.delete('/api/users/1', () => new HttpResponse(null, { status: 204 })));
    const { user: actor } = renderDialog();

    await actor.click(screen.getByRole('button', { name: 'users:delete.submit' }));

    await waitFor(() => expect(onDeleted).toHaveBeenCalledTimes(1));
    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(onDismissed).not.toHaveBeenCalled();
  });

  it('stays open and announces the error when the deletion fails', async () => {
    server.use(http.delete('/api/users/1', () => new HttpResponse(null, { status: 500 })));
    const { user: actor } = renderDialog();

    await actor.click(screen.getByRole('button', { name: 'users:delete.submit' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('users:delete.error');
    expect(screen.getByRole('dialog')).toHaveAttribute('open');
    expect(closeSpy).not.toHaveBeenCalled();
    expect(onDeleted).not.toHaveBeenCalled();
  });
});
