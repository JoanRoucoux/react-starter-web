import { type RouteObject } from 'react-router';

import { App } from './app';

export const createAppRoot = (children: RouteObject[]): RouteObject => ({
  Component: App,
  HydrateFallback: () => null,
  children,
});
