import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { type UseFormReturn, useForm } from 'react-hook-form';

import type { User, UserCreation } from '@core/api-client/reactStarterWebAPI.schemas';
import { getGetUsersQueryKey, useCreateUser } from '@core/api-client/users/users';
import { queryClient } from '@core/query/query-client';

import { initialUserCreation, userCreationSchema } from './user-create-form';

type UserCreate = {
  form: UseFormReturn<UserCreation>;
  save(values: UserCreation): Promise<User | undefined>;
  submitError: boolean;
};

export function useUserCreate(): UserCreate {
  const form = useForm<UserCreation>({
    resolver: zodResolver(userCreationSchema),
    defaultValues: initialUserCreation(),
    mode: 'onTouched',
  });
  const { mutateAsync } = useCreateUser();
  const [submitError, setSubmitError] = useState(false);

  const save = async (values: UserCreation): Promise<User | undefined> => {
    setSubmitError(false);
    let created: User;
    try {
      created = await mutateAsync({ data: values });
    } catch {
      setSubmitError(true);
      return undefined;
    }
    await queryClient.invalidateQueries({ queryKey: getGetUsersQueryKey() });

    return created;
  };

  return { form, save, submitError };
}
