import { Outlet } from 'react-router';

import { PageTitle } from '@core/i18n/page-title';

export function App(): React.JSX.Element {
  return (
    <>
      <PageTitle />
      <main className="min-h-screen bg-(--background) text-(--foreground)" id="main-content">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Outlet />
        </div>
      </main>
    </>
  );
}
