import { reloadPage } from './reload-page';

describe('reloadPage', () => {
  it('reloads the current page', () => {
    const reload = vi.fn();
    vi.stubGlobal('location', { reload });

    reloadPage();

    expect(reload).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });
});
