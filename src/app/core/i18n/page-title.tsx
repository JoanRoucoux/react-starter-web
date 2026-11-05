import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { useMatches } from 'react-router';

export const APP_TITLE = 'React Starter Web';

export type RouteHandle = { title?: string };

export function PageTitle(): React.JSX.Element {
  const { t } = useTranslation();
  const titleKey = useMatches()
    .map((match) => (match.handle as RouteHandle | undefined)?.title)
    .findLast(Boolean);
  const title = titleKey ? t(titleKey) : '';

  useEffect(() => {
    document.title = title ? `${title} | ${APP_TITLE}` : APP_TITLE;
  }, [title]);

  return (
    <p aria-live="polite" className="sr-only" data-testid="route-announcer">
      {title}
    </p>
  );
}
