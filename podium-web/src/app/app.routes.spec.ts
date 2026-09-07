import { routes } from './app.routes';
import { App } from './app';
import { TrackDayCreateComponent } from './track-days/create-track-day/create-track-day.component';

describe('application routes', () => {
  it('exposes analytics as a protected standalone destination', () => {
    const analyticsRoute = routes.find((route) => route.path === 'analytics');
    expect(analyticsRoute?.component).toBe(App);
    expect(analyticsRoute?.canActivate).toBeDefined();
  });

  it('keeps dashboard as the performance snapshot destination', () => {
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
