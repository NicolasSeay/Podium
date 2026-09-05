---
name: full-stack-local-verification
description: 'Run full Podium validation: Angular and Java tests, frontend and backend coverage, local Spring Boot and Angular servers, health checks, frontend reachability, and API proxy verification.'
user-invocable: true
---

# Full-Stack Local Verification

Use this workflow when a change spans `podium-web` and `podium-service`, or when the user asks whether Podium can be tested and run locally end to end. Run the test and coverage stages before starting servers so failures are easier to classify.

## Prerequisites

- Node.js and npm are available; use the repository package manager version (`npm@11.7.0`).
- A JDK compatible with the Maven project is available; the project targets Java 26.
- Local MySQL is running on port 3306 with the `podium` database and the credentials in `podium-service/src/main/filters/development.properties`.
- Ports 8080 and 4200 are free, or alternate ports are selected and reported.

Do not print or expose credentials from the development properties file.

## 1. Frontend Tests and Coverage

From `podium-web`, install dependencies only if `node_modules` is missing:

```text
npm install
```

Run the complete frontend suite in non-watch mode:

```text
npm test -- --watch=false
```

Generate frontend coverage:

```text
npm run coverage
```

Confirm the coverage command completed and inspect:

- `podium-web/coverage/index.html`
- `podium-web/coverage/lcov.info`

Report statements, branches, functions, and lines when available. Distinguish test compilation, assertion, browser/runtime, and coverage-report failures.

## 2. Backend Tests and Coverage

From `podium-service`, run the complete Maven verification lifecycle:

```text
mvn clean verify
```

This runs the backend tests and JaCoCo report goal. Confirm these artifacts exist:

- `podium-service/target/site/jacoco/index.html`
- `podium-service/target/site/jacoco/jacoco.xml`

Report the Maven test count and JaCoCo instruction, branch, line, method, and class coverage when available. Distinguish Java/Maven environment, compilation, test, and coverage-report failures.

## 3. Start and Verify the Backend

From `podium-service`, start Spring Boot with the local development configuration:

```text
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.config.additional-location=file:./src/main/filters/development.properties"
```

Keep the process running while the frontend is checked. The default backend URL is `http://localhost:8080`.

Verify the Actuator endpoint:

```text
GET http://localhost:8080/actuator/health
```

The expected result is HTTP 200 with a health payload whose `status` is `UP`. If the response is unavailable, classify the first meaningful cause as one of: missing development properties, Java/Maven mismatch, compilation failure, database connection failure, port conflict, or Spring context failure.

## 4. Start and Verify the Frontend

From `podium-web`, start Angular:

```text
npm start -- --host 127.0.0.1 --port 4200
```

Keep the process running while the backend is available. Verify:

```text
GET http://127.0.0.1:4200/
```

The expected result is HTTP 200 and a successful Angular compilation. Use another free port if 4200 is occupied and report the URL.

## 5. Verify the Frontend-to-Backend Path

Confirm the Angular proxy can reach the backend through the frontend origin. Request a protected API route through port 4200, for example:

```text
GET http://127.0.0.1:4200/api/users/me
```

An HTTP 401/403 is acceptable for this unauthenticated probe because it proves the request reached the backend. A proxy error, HTML fallback, connection refusal, or 5xx response indicates a frontend proxy or backend reachability problem.

## Completion Criteria

- The full Angular test suite passes.
- Frontend coverage completes and produces its configured report artifacts.
- Maven verification passes, including backend tests and JaCoCo report generation.
- Spring Boot starts with the development configuration.
- `/actuator/health` responds with HTTP 200 and `UP`.
- Angular compiles and the root URL responds with HTTP 200.
- The frontend-origin API probe reaches the backend and returns an expected application response.
- Both development processes are stopped cleanly after verification unless the user explicitly asks to leave them running.

Report results in separate sections for frontend tests, frontend coverage, backend tests, backend coverage, backend startup, frontend startup, proxy/API reachability, and cleanup. Never describe a coverage or runtime stage as passing when only compilation succeeded.
