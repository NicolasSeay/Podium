---
name: angular-coverage
description: 'Measure and report Angular frontend test coverage for podium-web with Angular CLI and Vitest. Use when checking Angular coverage percentages, generating frontend coverage reports, or diagnosing missing LCOV coverage output.'
user-invocable: true
---

# Measuring Angular Coverage

Measure coverage for `podium-web` using the configured Angular CLI unit-test builder and Vitest V8 provider.

## Procedure

1. Confirm Node.js and npm are available. Use the repository package manager version where possible (`npm@11.7.0`).
2. Change into `podium-web` and install dependencies if `node_modules` is missing:

   ```text
   npm install
   ```

3. Run the full Angular test suite with coverage in non-watch mode:

   ```text
   npm run coverage
   ```

4. Inspect the terminal summary for statements, branches, functions, and lines. Report the metric requested by the user; when unspecified, report line coverage and include the other metrics.
5. Check the generated report under `podium-web/coverage/`. Open `podium-web/coverage/index.html` for the navigable HTML report and `podium-web/coverage/lcov.info` for machine-readable LCOV data when generated.
6. For a focused diagnostic run, use the Angular CLI test filter supported by the installed builder, but do not present focused coverage as the project-wide percentage. Confirm the complete suite after any test or configuration change.
7. If coverage fails to start, distinguish a missing or incompatible V8 provider from test compilation, assertion, and browser/runtime failures. If no report is generated, verify that the test command reached completion and that coverage was not disabled by the active Angular configuration.

## Completion Criteria

- The Angular test suite completes successfully in non-watch mode.
- A coverage summary is present and the report directory contains the generated artifacts.
- The final result names the command, test scope, coverage metric, percentage, and report path.
- Environment, dependency, compilation, test, and coverage-report failures are reported separately.
