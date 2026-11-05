import { z } from 'zod';

import type { UserCreation } from '@core/api-client/reactStarterWebAPI.schemas';

export const initialUserCreation = (): UserCreation => ({
  firstName: '',
  lastName: '',
  email: '',
});

const requiredText = z.string().trim().min(1, 'required');

export const userCreationSchema = z.object({
  firstName: requiredText,
  lastName: requiredText,
  email: requiredText.pipe(z.email('email')),
});
