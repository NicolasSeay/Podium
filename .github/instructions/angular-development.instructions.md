---
name: angular-development
description: 'Use when developing or reviewing Angular code in podium-web, including standalone components, templates, styles, routes, signals, NgRx state, and TypeScript.'
applyTo: 'podium-web/src/**/*.ts,podium-web/src/**/*.html,podium-web/src/**/*.scss'
---

# Angular Development

## Application Structure

The frontend is an Angular `22.1` application using standalone components. The main application files are under `podium-web/src/app`; feature code is grouped by feature, currently including `dashboard/`.

Keep a component's TypeScript, template, styles, and spec colocated. Use the existing suffixes:

- `*.component.ts` for reusable components.
- `*.store.ts` for NgRx feature state.
- `*.spec.ts` for tests.
- `app.ts`, `app.html`, and `app.scss` for the root application.

## Naming and Components

- Use kebab-case filenames, for example `metric-card.component.ts`.
- Use PascalCase for classes and types, for example `MetricCardComponent`.
- Use `app-` selectors for application components, for example `app-metric-card`.
- Use `ChangeDetectionStrategy.OnPush` for components.
- Prefer standalone component `imports` and Angular `inject()` as used by the existing app.
- Keep component classes focused on view state and user interaction; move reusable state transitions into a feature store or service.
- Use typed inputs and outputs. The existing code uses signal inputs such as `input.required<string>()` where appropriate.

```typescript
@Component({
  selector: 'app-metric-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './metric-card.component.html',
  styleUrl: './metric-card.component.scss',
})
export class MetricCardComponent {
  readonly title = input.required<string>();
  readonly value = input.required<string>();
}
```

## State and TypeScript

- Use NgRx for feature state when state is shared or represented as a feature store.
- Define state interfaces and string-literal unions for constrained values.
- Keep action names descriptive and scoped, such as `[Dashboard] Set Range`.
- Preserve immutable state updates.
- Prefer strict, explicit types over `any`; type DOM events at the boundary and cast only after checking the expected element type.
- Use single quotes and trailing commas consistent with the existing TypeScript formatting.

```typescript
export type DashboardRange = 'Last 12 Months' | 'Last 6 Months' | 'This Year';

export const setRange = createAction(
  '[Dashboard] Set Range',
  (range: DashboardRange) => ({ range }),
);
```

## Validation

Run from `podium-web`:

```text
npm test -- --watch=false
npm run build
```

Add or update a colocated spec for behavior changes. Do not introduce a second state-management or component pattern without a clear repository-level reason.
