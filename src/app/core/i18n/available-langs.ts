export const AVAILABLE_LANGS = ['en', 'fr'] as const;

export type AvailableLang = (typeof AVAILABLE_LANGS)[number];
