import { useEffect, useRef } from 'react';

import { useTranslation } from 'react-i18next';

import type { User } from '@core/api-client/reactStarterWebAPI.schemas';

import { useUserDelete } from './use-user-delete';

type UserDeleteDialogProps = {
  user: User;
  onDeleted(): void;
  onDismissed(): void;
};

export function UserDeleteDialog({ user, onDeleted, onDismissed }: UserDeleteDialogProps): React.JSX.Element {
  const { t } = useTranslation('users');
  const { remove, deleting, error } = useUserDelete();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();

    return () => {
      dialog?.close();
    };
  }, []);

  const dismiss = (): void => {
    dialogRef.current?.close();
    onDismissed();
  };

  const confirm = async (): Promise<void> => {
    if (await remove(user.id)) {
      dialogRef.current?.close();
      onDeleted();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-describedby="user-delete-description"
      aria-labelledby="user-delete-title"
      className="w-full max-w-md rounded-lg border border-(--border) bg-(--card) p-6 text-(--foreground) backdrop:bg-black/50"
      data-testid="user-delete-dialog"
      onCancel={(event) => {
        event.preventDefault();
        dismiss();
      }}
    >
      <h2 className="text-lg font-semibold tracking-tight" id="user-delete-title">
        {t('delete.title')}
      </h2>

      <p className="mt-2 text-sm text-(--muted-foreground)" id="user-delete-description">
        {t('delete.description', { name: `${user.firstName} ${user.lastName}` })}
      </p>

      {error && (
        <p className="mt-4 text-sm text-(--destructive)" data-testid="user-delete-error" role="alert">
          {t('delete.error')}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          className="inline-flex items-center justify-center rounded-md border border-(--border) px-4 py-2 text-sm font-medium transition-colors hover:bg-(--accent) disabled:opacity-50"
          data-testid="user-delete-cancel"
          disabled={deleting}
          type="button"
          onClick={dismiss}
        >
          {t('delete.cancel')}
        </button>
        <button
          className="inline-flex items-center justify-center rounded-md bg-(--destructive) px-4 py-2 text-sm font-medium text-(--destructive-foreground) transition-colors hover:bg-(--destructive)/90 disabled:opacity-50"
          data-testid="user-delete-confirm"
          disabled={deleting}
          type="button"
          onClick={() => void confirm()}
        >
          {t('delete.submit')}
        </button>
      </div>
    </dialog>
  );
}
