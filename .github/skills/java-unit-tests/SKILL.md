---
name: java-unit-tests
description: 'Run and troubleshoot backend unit tests for the Podium Spring Boot service. Use when validating podium-service Java or Groovy changes, running Maven tests, filtering test classes, or diagnosing backend test failures.'
user-invocable: true
---

# Running Backend Unit Tests

Run the backend test suite for `podium-service` and report the result clearly.

## Procedure

1. Confirm a JDK compatible with the project is available. The Maven project targets Java 26.
2. Change into `podium-service` before running Maven commands.
3. Run the full suite:

   ```text
   mvn test
   ```

4. Review Maven and Surefire output. A successful run ends with `BUILD SUCCESS`; inspect the reported test count and failures.
5. For a focused check, run a single test class or package, for example:

   ```text
   mvn -Dtest=AuthServiceTest test
   mvn -Dtest='com.nico.podium.service.*Test' test
   ```

6. When a test fails, capture the failing test name and first relevant cause, fix only the backend slice involved, and rerun the same focused command before rerunning the full suite.
7. Report any environment failure separately from a test failure, such as an unavailable JDK, Maven dependency resolution issue, or compilation error.

## Completion Criteria

- The intended test command completed without compilation or test failures.
- The final result includes the command, test scope, and pass/fail status.
- Focused reruns are followed by the full suite when the change could affect shared backend behavior.
