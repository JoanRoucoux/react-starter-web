import { type RouteObject } from 'react-router';

import { NotFoundPage } from '@core/not-found-page/not-found-page';

import { HOME_PATHS } from '@features/home/contract/home-paths';
import { HOME_ROUTES } from '@features/home/home-routes';

export const routes: RouteObject[] = [
  { path: HOME_PATHS.segment, children: HOME_ROUTES },
  { path: '*', Component: NotFoundPage, handle: { title: 'pageTitle.notFound' } },
];
