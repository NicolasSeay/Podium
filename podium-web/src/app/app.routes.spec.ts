import { routes } from './app.routes';

describe('application routes', () => {
  it('does not expose a standalone analytics route', () => {
    expect(routes.some((route) => route.path === 'analytics')).toBe(false);
  });

  it('keeps dashboard as the analytics destination', () => {
    expect(routes.find((route) => route.path === 'dashboard')?.component).toBeDefined();
  });
});
