import { render, screen, waitFor, within } from '@testing-library/react';

import { logger } from '@core/logger/logger';

import { renderWithProviders } from '@testing/render-with-providers';

import { createAppRoot } from './app-root-route';

describe('createAppRoot', () => {
  it('renders nothing while the router hydrates', () => {
    const { HydrateFallback } = createAppRoot([]);

    const { container } = render(HydrateFallback ? <HydrateFallback /> : null);

    expect(container).toBeEmptyDOMElement();
  });

  it('shows the navigation error inside the layout when a lazy route fails', async () => {
    const failure = new Error('chunk is gone');
    vi.spyOn(logger, 'error').mockImplementation(() => undefined);

    renderWithProviders({
      routes: [{ path: '/', lazy: () => Promise.reject(failure) }],
      initialEntries: ['/'],
    });

    const heading = await screen.findByRole('heading', { name: 'navigationError.title' });

    expect(within(screen.getByRole('main')).getByRole('heading', { name: 'navigationError.title' })).toBe(heading);
    await waitFor(() => expect(logger.error).toHaveBeenCalledWith('NavigationErrorPage', failure));
  });
});
