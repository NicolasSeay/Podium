# Vehicle Modifications Design

Vehicle modifications should be historical records rather than a comma-separated vehicle field. Each record belongs to one user-owned vehicle and contains:

- Name and category.
- Optional description.
- Installation date.
- Optional removal date.
- Created and updated timestamps.

Suggested categories are Engine, Intake, Exhaust, Brakes, Suspension, Tires, Aero, Drivetrain, Safety, Electronics, and Other.

## First user workflow

A vehicle detail/edit view should show active modifications first, preserve historical modifications, and provide add, edit, remove, and active/history actions. Removal should set a removal date so performance history remains explainable.

## Performance association

The initial analytics rule can determine active modifications by track-day date:

- `installedDate <= trackDayDate`
- `removedDate > trackDayDate` or `removedDate` is absent

A later setup snapshot attached to each track day is preferable for same-day changes and should replace date inference when setup comparison becomes important.

## API direction

Reserve these routes until the Angular vehicle detail workflow is ready:

- `GET /api/vehicles/{vehicleId}/modifications`
- `POST /api/vehicles/{vehicleId}/modifications`
- `PATCH /api/vehicles/{vehicleId}/modifications/{modificationId}`
- `DELETE /api/vehicles/{vehicleId}/modifications/{modificationId}`

Every operation must verify both vehicle ownership and modification ownership. Deletion should normally archive a modification by recording its removal date rather than destroying history.
