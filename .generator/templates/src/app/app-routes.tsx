import { type RouteObject } from 'react-router';

import { NotFoundPage } from '@core/not-found-page/not-found-page';

import { {{featureConst}}_PATHS } from '@features/{{feature}}/contract/{{feature}}-paths';
import { {{featureConst}}_ROUTES } from '@features/{{feature}}/{{feature}}-routes';

export const routes: RouteObject[] = [
  { path: {{featureConst}}_PATHS.segment, children: {{featureConst}}_ROUTES },
  { path: '*', Component: NotFoundPage, handle: { title: 'pageTitle.notFound' } },
];
