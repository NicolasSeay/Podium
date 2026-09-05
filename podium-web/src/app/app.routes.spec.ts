import { routes } from './app.routes';
import { App } from './app';
import { TrackDayCreateComponent } from './track-days/track-day-create.component';

describe('application routes', () => {
  it('does not expose a standalone analytics route', () => {
    expect(routes.some((route) => route.path === 'analytics')).toBe(false);
  });

  it('keeps dashboard as the analytics destination', () => {
    expect(routes.find((route) => route.path === 'dashboard')?.component).toBeDefined();
  });

  it('matches the create route before the track-day list route', () => {
    const createRouteIndex = routes.findIndex((route) => route.path === 'track-days/new');
    const listRouteIndex = routes.findIndex((route) => route.path === 'track-days');

    expect(createRouteIndex).toBeLessThan(listRouteIndex);
    expect(routes[createRouteIndex].component).toBe(TrackDayCreateComponent);
    expect(routes[listRouteIndex].component).toBe(App);
  });
});
