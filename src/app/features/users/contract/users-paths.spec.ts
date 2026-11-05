import { USERS_PATHS } from './users-paths';

describe('USERS_PATHS', () => {
  it('builds the list, create and detail paths', () => {
    expect(USERS_PATHS.list).toBe('/users');
    expect(USERS_PATHS.create).toBe('/users/new');
    expect(USERS_PATHS.detail(7)).toBe('/users/7');
  });
});
