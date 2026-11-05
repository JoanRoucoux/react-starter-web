import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router';

import { initI18n } from '@core/i18n/i18n';
import { queryClient } from '@core/query/query-client';

import { App } from './app/app';
import { routes } from './app/app-routes';
import './styles.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element not found');
}

await initI18n();

const router = createBrowserRouter([{ Component: App, children: routes }]);

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
