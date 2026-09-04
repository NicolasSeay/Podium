---
name: run-java-locally
description: 'Start and verify the Podium backend application locally. Use when developing or manually testing podium-service, launching Spring Boot with Maven, checking localhost:8080, or diagnosing startup failures.'
user-invocable: true
---

# Running The Backend Locally

Start the Podium Spring Boot service from its module directory and keep the process available for manual API testing.

The local datasource values are stored in
`podium-service/src/main/filters/development.properties`. A local MySQL
database must be running before the application starts. This file is loaded as
an additional Spring configuration source so the standard
`src/main/resources/application.properties` remains active.

## Procedure

1. Confirm a JDK compatible with the project is available. The Maven project targets Java 26.
2. Ensure the local MySQL database exists and is reachable. The default local
   database documented in the project README is `podium` on port 3306.
3. Change into `podium-service`.
4. Start the application with the development properties file:

   ```text
   mvn spring-boot:run -Dspring-boot.run.arguments="--spring.config.additional-location=file:./src/main/filters/development.properties"
   ```

   The file supplies `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`. `PORT` is
   optional locally because `application.properties` defaults it to 8080.
   Keep production credentials out of this file and use Render environment
   variables for the deployed service.

5. Wait for the Spring Boot startup log to report that the application has
   started. The configured port is `${PORT:8080}`, so use
   `http://localhost:8080` unless `PORT` is set differently.
6. Verify the Actuator health endpoint in PowerShell:

   ```powershell
   Invoke-WebRequest http://localhost:8080/actuator/health -UseBasicParsing
   ```

   A successful response should report an `UP` health status. A connection
   failure means the process has not started or the configured port is wrong;
   a database health failure means the MySQL settings or database are not
   available.
7. Use the application’s controller routes for manual testing. Check the backend source for the exact endpoint and HTTP method rather than guessing a route.
8. If startup fails, classify the first meaningful cause: missing development
   properties file, Java/Maven mismatch, compilation failure, database
   connection failure, port conflict, or another application configuration
   error. Resolve that cause and restart.
9. Stop the foreground process with `Ctrl+C` when testing is complete. Do not leave a development server running unintentionally.

## Completion Criteria

- The application starts without compilation or Spring context errors.
- The expected port is confirmed from logs or configuration and is reachable locally.
- The development properties file is loaded and the health endpoint responds successfully.
- The process is stopped after manual testing unless the user explicitly needs it left running.
