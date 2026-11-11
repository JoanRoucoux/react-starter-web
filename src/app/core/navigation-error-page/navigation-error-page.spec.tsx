import { screen, waitFor } from '@testing-library/react';

import { logger } from '@core/logger/logger';

import { renderWithProviders } from '@testing/render-with-providers';

import { NavigationErrorPage } from './navigation-error-page';
import { reloadPage } from './reload-page';

vi.mock('./reload-page', () => ({ reloadPage: vi.fn() }));

describe('NavigationErrorPage', () => {
  const failure = new Error('chunk is gone');

  const renderPage = (): void => {
    renderWithProviders({
      routes: [
        {
          path: '/',
          Component: (): never => {
            throw failure;
          },
          ErrorBoundary: NavigationErrorPage,
        },
      ],
      initialEntries: ['/'],
    });
  };

  beforeEach(() => {
    vi.spyOn(logger, 'error').mockImplementation(() => undefined);
  });

  it('explains the failure and logs the error', async () => {
    renderPage();

    expect(await screen.findByRole('heading', { name: 'navigationError.title' })).toBeInTheDocument();
    expect(screen.getByText('navigationError.description')).toBeInTheDocument();
    await waitFor(() => expect(logger.error).toHaveBeenCalledWith('NavigationErrorPage', failure));
  });

  it('reloads the page on demand', async () => {
    renderPage();

    const button = await screen.findByRole('button', { name: 'navigationError.reload' });
    button.click();

    expect(reloadPage).toHaveBeenCalledOnce();
  });
});
