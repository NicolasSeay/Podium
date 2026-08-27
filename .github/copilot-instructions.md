# Podium Project Instructions

## Repository Layout

Podium is a two-module application:

```text
Podium/
├── designs/                         # Product and UX planning artifacts
├── podium-service/                  # Spring Boot backend
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/nico/podium/
│       │   ├── PodiumApplication.java
│       │   ├── controller/
│       │   ├── domain/
│       │   ├── repository/
│       │   │   └── Impl/
│       │   └── service/
│       │       └── Impl/
│       ├── main/resources/
│       └── test/groovy/com/nico/podium/
└── podium-web/                       # Angular frontend
    ├── angular.json
    ├── package.json
    ├── public/
    └── src/
        ├── main.ts
        ├── styles.scss
        └── app/
            ├── app.ts
            ├── app.html
            ├── app.scss
            ├── app.config.ts
            ├── app.routes.ts
            ├── app.spec.ts
            └── dashboard/
```

Keep backend and frontend changes in their owning module. Do not place generated output from `target/`, `dist/`, or dependency folders into source control.

## Technology Stack

- Backend: Spring Boot `4.1.1`, Java `26`, Maven, Lombok, Spring Web.
- Backend tests: JUnit 5, Mockito, and Groovy `5.0.3`; tests are primarily under `podium-service/src/test/groovy`.
- Frontend: Angular `22.1`, TypeScript `6`, Angular CLI, standalone components, signals, NgRx Store, RxJS, and Vitest through Angular's unit-test builder.
- Frontend package manager: npm `11.7.0` as declared in `podium-web/package.json`.

Use the versions and scripts already declared by the module. Do not introduce a new framework, test runner, state library, or package manager without an explicit requirement.

## General Engineering Rules

- Read nearby implementations and tests before adding a new pattern.
- Always use an applicable repository skill before carrying out a documented workflow. Check `.github/skills/` for the matching skill, follow its procedure, and use its validation steps. If more than one skill applies, use all relevant skills.
- Keep changes focused; do not reformat unrelated code.
- Preserve public APIs and existing behavior unless the task requires a contract change.
- Use descriptive names rather than one-letter variables.
- Add or update tests for behavior changes.
- After every code change, whether made by the agent or requested by the user, review and update the relevant documentation and agent customizations before considering the work complete.
- Never commit secrets, generated artifacts, or local environment files.
- Validate the smallest affected slice first, then run the broader module check when appropriate.

## Post-Change Documentation Synchronization

Documentation synchronization is part of every code change, not a later cleanup task:

1. Identify whether the change affects project structure, technology versions, naming conventions, architecture, domain behavior, API contracts, commands, testing procedures, or troubleshooting guidance.
2. Update the smallest authoritative document when a documented fact changed:
    - `.github/copilot-instructions.md` for project-wide rules and structure.
    - `.github/instructions/` for language, framework, or file-scoped conventions.
    - `.github/skills/` for repeatable procedures, commands, and completion checks.
    - `designs/` or `docs/` for product intent, domain behavior, architecture, API, and design documentation.
3. Update documentation in the same change as the code. Keep examples and commands aligned with the implementation.
4. If no documentation needs changing, explicitly verify that conclusion during the final review rather than skipping the check.
5. Validate the changed documentation and agent customization files for correct paths, frontmatter, links, and formatting.

Do not create duplicate guidance in multiple files. Prefer linking or referring to the authoritative document, and remove obsolete guidance when a code change invalidates it.

## Standard Commands

Run commands from the module they affect:

```text
cd podium-service
mvn test
mvn spring-boot:run
```

```text
cd podium-web
npm install
npm test -- --watch=false
npm run build
npm start
```

The backend has no configured `server.port`, so Spring Boot normally listens on `http://localhost:8080`.

## Documentation Boundaries

- Put stable, always-applicable rules here.
- Put Java or Angular file-scoped conventions in `.github/instructions/`.
- Put repeatable workflows such as testing and local startup in `.github/skills/`.
- Keep product intent and roadmap information in `designs/` or `docs/`.
