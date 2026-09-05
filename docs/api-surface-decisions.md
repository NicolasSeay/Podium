# API Surface Decisions

The Angular application currently uses authentication, the current user, dashboard analytics, track-day lists and creation, tracks, vehicles, sessions, and laps. Dashboard remains the single destination for analytics.

## Keep active

- `/api/auth/*`
- `/api/users/me`
- `/api/dashboard`
- `/api/track-days` list, stats, create, complete, session list, and session create
- `/api/tracks` list
- `/api/vehicles` list, create, and delete
- `/api/sessions/{id}/laps` list and create

## Hold for an explicit UI workflow

The following mappings are currently covered by backend tests but have no Angular caller:

- Track-day detail, patch, and delete.
- Session detail, patch, and delete.
- Lap patch and delete.
- Vehicle detail and patch.
- Personal-record reads.
- Track detail reads.

They should not be removed until external clients, deployment checks, scripts, and backend tests have been checked. When a mapping is removed, remove its service method and focused tests in the same change. When a feature is imminent, implement its Angular workflow and endpoint together.

## Contract decisions

- A track day always has a vehicle. HTTP validation and service validation both reject a missing or non-positive vehicle ID.
- Vehicle ownership is checked for every track-day create, complete, and update operation.
- Existing analytics response records use a non-null vehicle ID; nullable dashboard filter values mean no filter, not a persisted missing vehicle.
