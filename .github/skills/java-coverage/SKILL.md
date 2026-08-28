---
name: java-coverage
description: 'Measure and report Java and Groovy backend test coverage for podium-service with JaCoCo. Use when checking Java coverage percentages, generating JaCoCo reports, or diagnosing missing backend coverage reports.'
user-invocable: true
---

# Measuring Backend Coverage

Measure coverage for `podium-service` with the JaCoCo plugin configured in `pom.xml`.

## Procedure

1. Confirm a JDK compatible with the project is available. The Maven project targets Java 26.
2. Change into `podium-service` before running Maven commands.
3. Run the full test suite and generate the HTML and XML reports:

   ```text
   mvn clean verify
   ```

4. Check the generated report at `podium-service/target/site/jacoco/index.html`. The XML result is at `podium-service/target/site/jacoco/jacoco.xml`.
5. Report the overall line coverage percentage and identify the lowest-covered packages or classes. Distinguish instruction, branch, line, method, and class coverage; do not substitute one metric for another.
6. If the report is missing, first check that tests completed successfully and that `target/jacoco.exec` was created. A failed test run or a skipped test phase does not produce a meaningful percentage.
7. For a focused measurement, run a selected test class before the report goal:

   ```text
   mvn clean -Dtest=AuthServiceTest verify
   ```

   Treat focused coverage as diagnostic only; use the full suite for the project-level percentage.

## Completion Criteria

- Maven tests complete successfully.
- JaCoCo generates `target/site/jacoco/index.html` and `target/site/jacoco/jacoco.xml`.
- The final result names the command, test scope, metric reported, percentage, and report path.
- Environment, compilation, test, and coverage-report failures are reported separately.
