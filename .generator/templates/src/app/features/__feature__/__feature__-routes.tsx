import { type RouteObject } from 'react-router';

import { loadNamespace } from '@core/i18n/load-namespace';

import { {{featurePascal}}Page } from './{{feature}}-page';

export const {{featureConst}}_ROUTES: RouteObject[] = [
  {
    loader: loadNamespace('{{feature}}'),
    children: [{ index: true, Component: {{featurePascal}}Page, handle: { title: 'pageTitle.{{featureCamel}}' } }],
  },
];
