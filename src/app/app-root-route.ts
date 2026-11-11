import { type RouteObject } from 'react-router';

import { NavigationErrorPage } from '@core/navigation-error-page/navigation-error-page';

import { App } from './app';

export const createAppRoot = (children: RouteObject[]): RouteObject => ({
  Component: App,
  HydrateFallback: () => null,
  children: [{ ErrorBoundary: NavigationErrorPage, children }],
});
