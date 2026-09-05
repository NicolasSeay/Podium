# Product Roadmap Notes

This document captures the next product and API decisions for Podium. It is intentionally focused on closing the gap between the current Angular experience and the backend capabilities before adding larger motorsport features.

## 1. Analytics Navigation

There should be no separate Analytics route or sidebar destination.

Analytics are already part of the Dashboard and currently include:

- Fastest-lap progression
- Session consistency ranges
- In-session lap traces
- Lap-time distributions
- Session detail statistics
- Track and vehicle filters

The Angular route `analytics` should be removed rather than redirecting to the Dashboard. The Dashboard remains the single home for both summary metrics and analytics.

When future analytics are added, they should be integrated into the Dashboard unless the amount of information creates a clear usability problem.

## 2. Settings Ideas

Settings should contain account, application, and data-management concerns rather than analytics.

### Account and security

- Edit first name and last name
- Change password
- Show account email, with an explicit email-change flow if supported later
- View active sessions or devices
- Log out of other sessions
- Delete the account and all associated data

### Preferences

- Lap-time display precision
- Distance units: miles or kilometers
- Temperature units: Fahrenheit or Celsius
- Date format
- Default dashboard track
- Default dashboard vehicle
- Default track-day session names
- Theme preference, including system, light, and dark options if the design supports them

### Data management

- Export all data as CSV or JSON
- Import data with validation and a preview before saving
- Download a backup
- Restore a backup
- Permanently delete all track-day data while retaining the account

Destructive actions should require confirmation and explain exactly what will be deleted. Import and restore should never partially write data without reporting which records succeeded or failed.

## 3. Backend Endpoints and Angular Usage

The backend should not expose or maintain application endpoints that are not part of the current Angular product workflow unless they are deliberately reserved for an imminent feature.

The current Angular app uses these endpoint groups:

- `/api/auth/register`, `/api/auth/login`, and `/api/auth/logout`
- `/api/users/me`: authenticated-user loading
- `/api/dashboard`: dashboard metrics and analytics data
- `/api/track-days`: list, statistics, creation, completion, session loading, and session creation
- `/api/tracks`: track catalog reads used when creating and viewing track days
- `/api/vehicles`: list, creation, and deletion
- `/api/sessions/{id}/laps`: lap loading and creation

The following backend capabilities are currently not called by the Angular app and should be commented out, disabled, or removed from the active API surface until their UI workflow exists:

- Standalone track-day detail reads if the Angular app uses the list and in-memory selection instead
- Track-day patch and delete operations until edit and delete controls are implemented
- Session detail, patch, and delete operations until session editing is implemented
- Lap patch and delete operations until lap editing is implemented
- Vehicle detail and patch operations until vehicle editing is implemented
- Personal-record reads until a Records view is implemented
- Track detail reads until a Track detail view is implemented

Before disabling an endpoint, verify that it is not used by tests, deployment checks, scripts, or external clients. Prefer removing unused controller mappings and service methods over leaving undocumented routes available by accident. When an endpoint is needed for the next feature, implement the corresponding Angular workflow in the same change instead of re-enabling an unused route by itself.

## 4. Editing Capabilities

Podium should support editing for all user-owned logbook data:

- Track days
- Sessions
- Laps
- Vehicles

### Track days

Allow editing of:

- Track
- Vehicle
- Start and end dates
- Conditions
- Notes

Deleting a track day should clearly explain that its sessions and laps will also be deleted or otherwise handled. The backend must enforce ownership for every edit and delete operation.

### Sessions

Allow editing of:

- Session name
- Session date
- Session notes

Allow deleting a session after confirmation, including a clear warning about its laps.

### Laps

Allow editing of:

- Lap number
- Lap time

Allow deleting an individual lap. Recalculate personal records after lap edits or deletions so records never refer to stale times.

### Vehicles

Allow editing of:

- Vehicle name
- Make, model, trim, and year
- Vehicle modifications

Do not delete a vehicle that is referenced by existing track days without an explicit data-retention policy. The preferred behavior is either to prevent deletion while references exist or to archive the vehicle instead of deleting it.

## 5. Nullability Contract

Frontend and backend nullability must describe the same business rules. The current implementation is inconsistent: the database requires `track_days.vehicle_id`, the backend request model currently requires a positive vehicle ID, but several frontend types and creation flows still allow `vehicleId` to be `null`.

A vehicle is required for every track day.

This means:

- The database column remains `NOT NULL`.
- Backend `TrackDay`, `TrackDayRequest`, and related response models use a non-null `Long vehicleId`.
- Backend validation rejects missing, zero, or invalid vehicle IDs.
- The service verifies that the vehicle belongs to the authenticated user.
- Angular `TrackDay`, `TrackDayRequest`, and API payload types use `vehicleId: number` rather than `number | null`.
- Track-day forms require a vehicle before advancing or submitting.
- The UI should not offer a `No vehicle` option for a track day.
- Dashboard and analytics filters should not need a `No vehicle recorded` option once existing data has been migrated and the rule is enforced.

Any legacy rows with a missing vehicle must be migrated before this contract is enforced in production. The migration should either associate each row with the correct vehicle or stop and produce a reviewable exception list.

Other nullable fields should remain nullable only when the domain permits absence. Examples include notes, conditions, optional vehicle metadata, and optional session dates. The same decision must be reflected in the SQL schema, Java records/entities, TypeScript interfaces, forms, and tests.

## 6. Vehicle Modifications

Introduce modifications as user-owned vehicle history. A modification should not be stored as a single comma-separated field because users need to add, edit, remove, and associate changes with performance data.

### Proposed model

`VehicleModification`:

- `id`
- `vehicleId`
- `name`
- `category`
- `description`
- `installedDate`
- `removedDate`, nullable
- `createdAt`
- `updatedAt`

Suggested categories include:

- Engine
- Intake
- Exhaust
- Brakes
- Suspension
- Tires
- Aero
- Drivetrain
- Safety
- Electronics
- Other

A modification is active when `removedDate` is null. Historical modifications should remain available so users can compare performance before and after a setup change.

### User experience

The vehicle detail/edit view should provide:

- An active modifications list
- Add, edit, and remove actions
- Category and description fields
- Installation and removal dates
- A way to mark a modification as active or historical
- A vehicle history timeline

### Performance association

The first release can associate active modifications with a track day by date: a modification is considered active when its installation date is on or before the track-day date and its removal date is after the track-day date or absent.

A later release may add an explicit vehicle setup snapshot to each track day. That is more reliable for race-day changes and should be preferred once setup comparisons become a major analytics feature.

### API direction

Proposed routes:

- `GET /api/vehicles/{vehicleId}/modifications`
- `POST /api/vehicles/{vehicleId}/modifications`
- `PATCH /api/vehicles/{vehicleId}/modifications/{modificationId}`
- `DELETE /api/vehicles/{vehicleId}/modifications/{modificationId}`

These routes should not be enabled until the Angular vehicle detail/edit workflow is ready. All operations must verify that the vehicle belongs to the authenticated user and that the modification belongs to that vehicle.

## Suggested Delivery Order

1. Remove the Analytics route and keep analytics on Dashboard.
2. Align vehicle-required nullability across SQL, backend, frontend, and tests.
3. Add track-day, session, lap, and vehicle editing.
4. Disable unused backend endpoints and remove dead service methods.
5. Add a Settings page focused on profile, preferences, and data management.
6. Add vehicle modifications through a vehicle detail/edit workflow.
7. Add structured setup snapshots and modification-aware analytics.
