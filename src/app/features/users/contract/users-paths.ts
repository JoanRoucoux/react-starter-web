const SEGMENT = 'users';
const CREATE_SEGMENT = 'new';

export const USERS_PATHS = {
  segment: SEGMENT,
  createSegment: CREATE_SEGMENT,
  list: `/${SEGMENT}`,
  create: `/${SEGMENT}/${CREATE_SEGMENT}`,
  detail: (id: number): string => `/${SEGMENT}/${id}`,
} as const;
