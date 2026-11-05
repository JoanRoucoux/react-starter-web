import { type RouteObject } from 'react-router';

import { loadNamespace } from '@core/i18n/load-namespace';

import { HomePage } from './home-page';

export const HOME_ROUTES: RouteObject[] = [
  {
    loader: loadNamespace('home'),
    children: [{ index: true, Component: HomePage, handle: { title: 'pageTitle.home' } }],
  },
];
