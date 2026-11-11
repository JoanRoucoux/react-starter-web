import { screen } from '@testing-library/react';

import { renderWithProviders } from '@testing/render-with-providers';

import { {{featurePascal}}Page } from './{{feature}}-page';

describe('{{featurePascal}}Page', () => {
  it('renders the page heading', () => {
    renderWithProviders(<{{featurePascal}}Page />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('{{feature}}:title');
  });
});
