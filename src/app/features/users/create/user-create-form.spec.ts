import { initialUserCreation, userCreationSchema } from './user-create-form';

describe('user-create-form', () => {
  const messagesOf = (value: unknown): Record<string, string> => {
    const result = userCreationSchema.safeParse(value);
    if (result.success) {
      return {};
    }

    return Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0]), issue.message]));
  };

  it('starts with empty strings', () => {
    expect(initialUserCreation()).toEqual({ firstName: '', lastName: '', email: '' });
  });

  it('requires every field', () => {
    expect(messagesOf(initialUserCreation())).toEqual({
      firstName: 'required',
      lastName: 'required',
      email: 'required',
    });
  });

  it('treats whitespace only as empty', () => {
    expect(messagesOf({ firstName: '  ', lastName: ' ', email: '   ' })).toEqual({
      firstName: 'required',
      lastName: 'required',
      email: 'required',
    });
  });

  it('rejects a malformed email', () => {
    expect(messagesOf({ firstName: 'John', lastName: 'Doe', email: 'not-an-email' })).toEqual({ email: 'email' });
  });

  it('is valid with a complete model', () => {
    expect(messagesOf({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' })).toEqual({});
  });
});
