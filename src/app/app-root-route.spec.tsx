import { render } from '@testing-library/react';

import { createAppRoot } from './app-root-route';

describe('createAppRoot', () => {
  it('renders nothing while the router hydrates', () => {
    const { HydrateFallback } = createAppRoot([]);

    const { container } = render(HydrateFallback ? <HydrateFallback /> : null);

    expect(container).toBeEmptyDOMElement();
  });
});
