---
name: java-development
description: 'Use when developing or reviewing Java code in podium-service, including Spring controllers, services, repositories, domain models, and application configuration.'
applyTo: 'podium-service/src/main/java/**/*.java,podium-service/src/main/resources/**/*'
---

# Java Development

## Package Structure

Use the existing root package `com.nico.podium` and keep responsibilities separated:

- `controller`: HTTP endpoints and request/response handling.
- `service`: service interfaces and business-facing contracts.
- `service.impl`: current service implementations.
- `repository`: repository interfaces and data-access contracts.
- `repository.impl`: current repository implementations.
- `domain`: domain models, currently grouped in `PodiumModels`.


## Spring Patterns

- Use constructor injection.
- Annotate HTTP controllers with `@RestController` and a resource-level `@RequestMapping`.
- Annotate service implementations with `@Service`.
- Keep controllers thin: authenticate/extract request context, delegate to a service, and return the service result.
- Use `/api/<plural-resource>` paths and kebab-case for multiword resource paths, such as `/api/track-days`.
- Follow neighboring classes for authentication headers and shared support helpers.

```java
@RestController
@RequestMapping("/api/tracks")
public class TrackController extends ControllerSupport {
    private final TrackService tracks;

    public TrackController(AuthService auth, TrackService tracks) {
        super(auth);
        this.tracks = tracks;
    }

    @GetMapping
    public List<Track> list(@RequestHeader(value = "Authorization", required = false) String authorization,
                            @RequestHeader(value = "X-User-Id", required = false) String userId) {
        return tracks.list(userId(authorization, userId));
    }
}
```

## Java Style

- Use four spaces for indentation, braces, and explicit types consistent with nearby Java files.
- Put one statement or declaration per line. Format constructors, methods, and lambdas across multiple lines when their signatures or bodies would otherwise be difficult to scan.
- Prefer `final` fields and immutable return values where practical.
- Use Java standard-library types already used by the module, such as `List`, `Map`, `LocalDate`, and `Optional` where appropriate.
- Keep methods small and make business rules explicit.
- Use Lombok only when it matches an existing module pattern; do not add annotations solely to reduce a small amount of code.
- Do not silently change API response keys or domain record shapes.

## Adding a Feature

1. Inspect the related domain model and repository/service interfaces.
2. Add or extend the repository contract and implementation if persistence behavior is needed.
3. Add business logic to the service layer.
4. Expose it through a thin controller only when an HTTP endpoint is required.
5. Add focused tests under the matching package in `podium-service/src/test/groovy`.
6. Run `mvn test` from `podium-service`.
