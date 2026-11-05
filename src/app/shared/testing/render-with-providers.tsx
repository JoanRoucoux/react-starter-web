import { type ReactElement } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { type RenderResult, render } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { type DataRouter, type RouteObject, RouterProvider, createMemoryRouter } from 'react-router';

import { queryClient } from '@core/query/query-client';

import { createAppRoot } from '../../app-root-route';
import { createTestI18n } from './test-i18n';

type RoutesRender = { routes: RouteObject[]; initialEntries: string[] };

type RenderWithProvidersResult = RenderResult & { user: UserEvent; router?: DataRouter };

export const renderWithProviders = (ui: ReactElement | RoutesRender): RenderWithProvidersResult => {
  const user = userEvent.setup();
  const i18n = createTestI18n();

  const wrap = (children: ReactElement): ReactElement => (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </QueryClientProvider>
  );

  if ('routes' in ui) {
    const router = createMemoryRouter([createAppRoot(ui.routes)], {
      initialEntries: ui.initialEntries,
    });

    return { ...render(wrap(<RouterProvider router={router} />)), user, router };
  }

  return { ...render(wrap(ui)), user };
};
