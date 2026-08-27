---
name: angular-testing
description: 'Use when writing or reviewing frontend unit tests for podium-web, including Angular TestBed, standalone components, Vitest, NgRx state, templates, and DOM behavior.'
applyTo: 'podium-web/src/**/*.spec.ts'
---

# Angular Testing

## Test Stack and Location

Frontend tests use Angular's unit-test builder configured by `angular.json`, with Vitest available in the project dependencies. Keep specs colocated with the code they exercise and name them `*.spec.ts`.

## TestBed Patterns

- Import standalone components directly into `TestBed.configureTestingModule`.
- Compile components asynchronously in `beforeEach` when templates or component metadata require compilation.
- Create a fresh fixture for each test.
- Test observable behavior: rendered DOM, input/output behavior, state transitions, and user-facing effects.
- Avoid testing private fields or implementation details.
- Provide only the required Angular providers and NgRx test setup for the behavior under test.

```typescript
import { TestBed } from '@angular/core/testing';
import { MetricCardComponent } from './metric-card.component';

describe('MetricCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricCardComponent],
    }).compileComponents();
  });

  it('renders the supplied metric', () => {
    const fixture = TestBed.createComponent(MetricCardComponent);
    fixture.componentRef.setInput('title', 'Total Laps');
    fixture.componentRef.setInput('value', '42');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Total Laps');
    expect(fixture.nativeElement.textContent).toContain('42');
  });
});
```

## Test Coverage

For a component, cover creation, important inputs, rendered states, and user interactions. For NgRx feature state, test reducer transitions and selectors where they contain meaningful behavior. For route or application configuration, test the configured result rather than framework internals.

Keep tests deterministic. Avoid real network requests, timers, or dependence on test ordering; mock external boundaries.

## Validation

Run from `podium-web` in non-watch mode:

```text
npm test -- --watch=false
```

For a failing test, first identify whether the problem is TypeScript compilation, TestBed configuration, template rendering, or an assertion. Rerun the narrowest available check after the fix, then run the full suite.
