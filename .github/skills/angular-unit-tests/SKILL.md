---
name: angular-unit-tests
description: 'Run and troubleshoot frontend unit tests for the Podium Angular application. Use when validating podium-web TypeScript changes, running Angular or Vitest tests, filtering specs, or diagnosing frontend test failures.'
user-invocable: true
---

# Running Frontend Unit Tests

Run the frontend unit tests for `podium-web` using the project’s Angular CLI configuration.

## Procedure

1. Confirm Node.js and npm are available. Use the repository package manager version where possible (`npm@11.7.0`).
2. Change into `podium-web` and install dependencies if `node_modules` is missing:

   ```text
   npm install
   ```

3. Run the suite in a non-watch mode suitable for validation:

   ```text
   npm test -- --watch=false
   ```

   The package script delegates to `ng test`, and the Angular unit-test builder runs the project’s specs.
4. Review the output for the final pass/fail summary. Do not treat a successful compilation alone as passing tests.
5. For a narrow check, use the Angular CLI options supported by the installed builder, or run the relevant spec through the configured test runner when the output identifies a specific file. For example, inspect `src/app/app.spec.ts` first before choosing a file filter.
6. When a test fails, record the first assertion or compilation error, repair the affected frontend slice, and rerun the same focused check before rerunning the complete suite.
7. Report dependency installation, browser/runtime, compilation, and assertion failures as distinct failure categories.

## Completion Criteria

- The test command completes in non-watch mode with no compilation or assertion failures.
- The final result names the command, test scope, and pass/fail status.
- Changes affecting shared Angular behavior are checked with the full suite after any focused rerun.
