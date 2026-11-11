import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

import { USERS_PATHS } from '../contract/users-paths';
import { useUserCreate } from './use-user-create';

const INPUT_CLASS =
  'mt-1 block w-full rounded-md border border-(--input) bg-(--background) px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)';

export function UserCreatePage(): React.JSX.Element {
  const { t } = useTranslation('users');
  const navigate = useNavigate();
  const { form, save, submitError } = useUserCreate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = handleSubmit(async (values) => {
    const user = await save(values);

    if (user) {
      await navigate(USERS_PATHS.detail(user.id));
    }
  });

  return (
    <>
      <Link
        className="mb-6 inline-block text-sm text-(--muted-foreground) transition-colors hover:text-(--foreground)"
        to={USERS_PATHS.list}
      >
        {t('detail.back')}
      </Link>

      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{t('create.title')}</h1>

      <form
        className="space-y-4 rounded-lg border border-(--border) bg-(--card) p-6"
        noValidate
        onSubmit={(event) => {
          void onSubmit(event);
        }}
      >
        <div>
          <label className="block text-sm font-medium" htmlFor="firstName">
            {t('create.firstName')}
          </label>
          <input
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            aria-invalid={Boolean(errors.firstName)}
            autoComplete="given-name"
            className={INPUT_CLASS}
            data-testid="user-create-first-name"
            id="firstName"
            type="text"
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-(--destructive)" id="firstName-error">
              {t(`create.errors.${errors.firstName.message}`)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="lastName">
            {t('create.lastName')}
          </label>
          <input
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            aria-invalid={Boolean(errors.lastName)}
            autoComplete="family-name"
            className={INPUT_CLASS}
            data-testid="user-create-last-name"
            id="lastName"
            type="text"
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-(--destructive)" id="lastName-error">
              {t(`create.errors.${errors.lastName.message}`)}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="email">
            {t('create.email')}
          </label>
          <input
            aria-describedby={errors.email ? 'email-error' : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className={INPUT_CLASS}
            data-testid="user-create-email"
            id="email"
            type="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-(--destructive)" id="email-error">
              {t(`create.errors.${errors.email.message}`)}
            </p>
          )}
        </div>

        {submitError && (
          <p className="text-sm text-(--destructive)" data-testid="user-create-error" role="alert">
            {t('create.error')}
          </p>
        )}

        <button
          className="inline-flex items-center justify-center rounded-md bg-(--primary) px-4 py-2 text-sm font-medium text-(--primary-foreground) transition-colors hover:bg-(--primary)/90 disabled:opacity-50"
          data-testid="user-create-submit"
          disabled={isSubmitting}
          type="submit"
        >
          {t('create.submit')}
        </button>
      </form>
    </>
  );
}
