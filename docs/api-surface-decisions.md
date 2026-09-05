# API Surface Decisions

The Angular application currently uses authentication, the current user, dashboard analytics, track-day lists and creation, tracks, vehicles, sessions, and laps. Dashboard remains the single destination for analytics.

## Keep active

- `/api/auth/register`, `/api/auth/login`, and `/api/auth/logout`
- `/api/users/me` read
- `/api/dashboard`
- `/api/track-days` list, stats, create, complete, session list, and session create
- `/api/tracks` list
- `/api/vehicles` list, create, and delete
- `/api/sessions/{id}/laps` list and create

## Hold for an explicit UI workflow

The following mappings are disabled because they are covered by backend tests but have no Angular caller:

- Track-day detail, patch, and delete.
- Session detail, patch, and delete.
- Lap patch and delete.
- Vehicle detail and patch.
- Personal-record reads.
- Track detail reads.

Their service methods remain reserved, but the controller mappings are commented out until external clients, deployment checks, scripts, and backend tests justify reactivation. When a feature is imminent, implement its Angular workflow and endpoint together.

## Contract decisions

- A track day always has a vehicle. HTTP validation and service validation both reject a missing or non-positive vehicle ID.
- Vehicle ownership is checked for every track-day create, complete, and update operation.
- Existing analytics response records use a non-null vehicle ID; nullable dashboard filter values mean no filter, not a persisted missing vehicle.
