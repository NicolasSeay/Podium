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

## Test coverage

Run `mvn clean verify` from `podium-service` to generate the JaCoCo report at
`podium-service/target/site/jacoco/index.html`. Run `npm run coverage` from
`podium-web` to generate the Angular report at `podium-web/coverage/index.html`.

## Commit formatting

Install the root development dependencies with `npm install`. The Husky
pre-commit hook runs `lint-staged` and formats staged Angular frontend files
automatically before the commit is created.
