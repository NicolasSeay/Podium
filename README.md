# Podium

Application for logging track day information and visualizing progression.

## Local database

The backend uses MySQL at `jdbc:mysql://localhost:3306/podium` with the
`podium_service` user. Create the database and user in MySQL Workbench before
starting the service:

```sql
CREATE DATABASE podium CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'podium_service'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON podium.* TO 'podium_service'@'localhost';
FLUSH PRIVILEGES;
```

Run the backend from `podium-service` with `mvn spring-boot:run`. Hibernate
creates or updates the JPA tables on startup. Tests use an in-memory H2 database
instead of the local MySQL instance.

Useful MySQL maintenance scripts are collected in `SQL/utils.sql`: one section
removes the application tables, one clears their data, and one reports table
sizes and approximate row counts. Uncomment and run only the section you need;
review destructive statements before running them.

Run the Angular frontend from the repository root with `npm start`. This
delegates to `podium-web` and starts `ng serve` on port 4200.

The local Angular development build keeps API requests relative and uses the
development proxy to reach `http://localhost:8080`. Build the frontend with
`npm --prefix podium-web run build` for production; Angular replaces the local
API configuration with `https://podium-u3rl.onrender.com` in that build.

## Deploy the backend with Docker

The backend includes a multi-stage Docker build in `podium-service/Dockerfile`.
It expects a network-accessible MySQL database supplied through these
environment variables:

- `DB_URL`, for example `jdbc:mysql://db-host:3306/podium`
- `DB_USERNAME`
- `DB_PASSWORD`
- `CORS_ALLOWED_ORIGINS`, a comma-separated list of origin patterns such as
  `https://podium-*-bronze7.vercel.app`

Spring Boot uses Render's `PORT` value automatically and defaults to port 8080
when running locally. Spring Boot Actuator exposes `/actuator/health` for the
Render health check. Only the Actuator health endpoint is exposed over HTTP.
The root `render.yaml` defines the Docker service and leaves the database and
CORS origin values as secrets to be configured in Render. The backend defaults
to Podium's Vercel deployment pattern and `http://localhost:4200` when the
CORS variable is not set.

The service still uses MySQL and Hibernate's `ddl-auto=update`; it does not
create or provision the external database. Create the database and grant the
configured user access before deploying, and treat `SQL/hydration.sql` as an
optional, reviewed data-load script rather than an automatic production step.

## Test coverage

Run `mvn clean verify` from `podium-service` to generate the JaCoCo report at
`podium-service/target/site/jacoco/index.html`. Run `npm run coverage` from
`podium-web` to generate the Angular report at `podium-web/coverage/index.html`.

## Commit formatting

Install the root development dependencies with `npm install`. The Husky
pre-commit hook runs `lint-staged` and formats staged Angular frontend files
automatically before the commit is created.
