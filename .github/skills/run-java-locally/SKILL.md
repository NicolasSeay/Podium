---
name: run-java-locally
description: 'Start and verify the Podium backend application locally. Use when developing or manually testing podium-service, launching Spring Boot with Maven, checking localhost:8080, or diagnosing startup failures.'
user-invocable: true
---

# Running The Backend Locally

Start the Podium Spring Boot service from its module directory and keep the process available for manual API testing.

## Procedure

1. Confirm a JDK compatible with the project is available. The Maven project targets Java 26.
2. Change into `podium-service`.
3. Start the application:

   ```text
   mvn spring-boot:run
   ```

4. Wait for the Spring Boot startup log to report that the application has started. The service has no custom `server.port`, so use `http://localhost:8080` unless startup configuration says otherwise.
5. Verify the process is reachable with a request to the base URL. A `404` can still confirm that the server is listening when no root route is defined. In PowerShell:

   ```powershell
   Invoke-WebRequest http://localhost:8080 -UseBasicParsing
   ```

6. Use the application’s controller routes for manual testing. Check the backend source for the exact endpoint and HTTP method rather than guessing a route.
7. If startup fails, classify the first meaningful cause: Java/Maven mismatch, compilation failure, port conflict, or application configuration error. Resolve that cause and restart.
8. Stop the foreground process with `Ctrl+C` when testing is complete. Do not leave a development server running unintentionally.

## Completion Criteria

- The application starts without compilation or Spring context errors.
- The expected port is confirmed from logs or configuration and is reachable locally.
- The process is stopped after manual testing unless the user explicitly needs it left running.
