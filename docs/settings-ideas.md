# Settings Ideas

Settings should be a practical account and data-management workspace, not a second analytics surface. The first release can be organized into three sections.

## Account and security

- Edit first and last name.
- Show the account email and reserve email changes for an explicit verification flow.
- Change the password with the current password and a confirmation field.
- List active sessions or devices and provide a log-out-other-sessions action.
- Delete the account and all associated data behind a typed confirmation.

## Preferences

- Lap-time precision: milliseconds, centiseconds, or seconds.
- Distance: miles or kilometers.
- Temperature: Fahrenheit or Celsius.
- Date format.
- Default dashboard track and vehicle.
- Default names for new track-day sessions.
- Theme: system, light, or dark, if the visual system supports all three accessibly.

Preferences should be stored per user, have explicit defaults, and affect display rather than changing imported source data. The dashboard should continue to own analytics navigation and filters.

## Data management

- Export all data as CSV or JSON.
- Import data with validation and a preview before saving.
- Download and restore a backup.
- Permanently delete track-day data while retaining the account.

Destructive actions should state exactly what will be removed and require confirmation. Imports and restores should validate the full payload before writing, then report record-level successes and failures. They should not partially write silently.

## Suggested first slice

Profile editing and distance/temperature/default dashboard preferences are implemented through the authenticated user settings endpoint. Lap-time precision, date format, export, deletion, and session management remain future slices; deletion and session management should wait until their backend audit and recovery behavior are specified.
