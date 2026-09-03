---
name: java-testing
description: 'Use when writing or reviewing backend tests for podium-service, including JUnit 5, Groovy tests, Mockito mocks, service tests, repository tests, and Spring controller tests.'
applyTo: 'podium-service/src/test/**/*.java,podium-service/src/test/**/*.groovy'
---

# Java Testing

## Test Stack and Location

Backend tests use JUnit 5 and Mockito. Groovy tests are located under `podium-service/src/test/groovy/com/nico/podium`, organized by the production package: `controller`, `repository`, and `service`.

The Maven build compiles Groovy tests with GMavenPlus. Keep tests compatible with the Java target declared in `pom.xml` (`26`) and the configured Groovy version (`5.0.3`).

## Test Design

- Name the class `<ProductionType>Test`.
- Name test methods for observable behavior, such as `aggregatesTrackDaySessionAndLapTotals`.
- Prefer focused unit tests that instantiate the class under test directly.
- Mock external collaborators with Mockito and stub only interactions needed by the behavior under test.
- Construct the production records used for structured requests and responses directly in tests; do not reintroduce generic maps for typed payloads.
- Use descriptive parameter and local-variable names, including in test fixtures and closures.
- Always use braces and a multiline body for `if`, `for`, and `while` blocks in test code as well.
- Verify returned values and meaningful collaborator interactions; avoid testing private implementation details.
- Include empty, missing, boundary, and authorization-related cases when the production behavior supports them.
- Use Spring test slices only when HTTP mapping, serialization, or Spring wiring is the behavior under test.

```groovy
package com.nico.podium.service

import com.nico.podium.repository.TrackRepository
import com.nico.podium.service.impl.TrackServiceImpl
import org.junit.jupiter.api.Test

import static org.junit.jupiter.api.Assertions.assertTrue
import static org.mockito.Mockito.*

class TrackServiceTest {
    @Test
    void returnsTracksForUser() {
        def tracks = mock(TrackRepository)
        when(tracks.findByUserId('u1')).thenReturn([])

        def result = new TrackServiceImpl(tracks).list('u1')

        assertTrue(result.isEmpty())
        verify(tracks).findByUserId('u1')
    }
}
```

## Validation

Run from `podium-service`:

```text
mvn test
```

For a focused rerun:

```text
mvn -Dtest=TrackServiceTest test
```

When a test fails, distinguish compilation, Spring context, Mockito setup, and assertion failures. Fix the narrowest affected behavior and rerun the focused test before the full suite.
