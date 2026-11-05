import { render, screen } from '@testing-library/react';

import { App } from './app';

describe('App', () => {
  it('should render the main landmark', () => {
    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
