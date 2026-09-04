# Podium Security Review and Remediation Plan

Review date: 2026-09-04

This review covers the Spring Boot backend in `podium-service` and the Angular frontend in `podium-web`. It focuses on authentication, authorization, input handling, browser security, deployment hardening, and security regression coverage.

The application already has several good foundations:

- Passwords are encoded with BCrypt.
- Authentication tokens are cryptographically random and stored server-side as SHA-256 hashes.
- User-owned resources generally validate ownership through the authenticated user ID.
- REST data access uses Spring Data JPA repositories rather than raw SQL.
- Request DTOs limit direct entity mass assignment.
- Angular templates do not currently contain obvious unsafe HTML sinks such as `innerHTML` or `bypassSecurityTrust`.

## Priority Summary

| Priority | Item | Area |
| --- | --- | --- |
| High | Make the global track catalog read-only | Backend |
| High | Fail-closed security routing | Backend |
| Accepted | DDoS protection is provided by the deployment platform | Deployment |
| Accepted | Keep the bearer token in localStorage | Frontend and backend |
| High | Evaluate and add browser security headers | Frontend and hosting |
| Medium | Add declarative input validation | Backend |
| Medium | Add cross-user authorization tests | Backend |
| Deferred | Harden CORS configuration | Backend and deployment |
| Deferred | Clean up expired authentication tokens | Backend |
| Medium | Run the container as a non-root user | Deployment |
| Deferred | Remove or clearly mark development credentials | Backend and frontend |
| Low | Add `Secure` to the client cookie or remove it | Frontend |
| Low | Document the CSRF/authentication dependency | Backend |
| Low | Address registration email enumeration | Backend |

## Backend Findings

### 1. Tracks are a global, read-only catalog

Affected area: `podium-service/src/main/java/com/nico/podium/service/impl/TrackServiceImpl.java`

Tracks are maintained manually in the database and are global values shared by all users. They must not be user-owned data and must not be writable through the application API.

Remediation plan:

1. Keep track creation, update, and deletion out of the controller API.
2. Remove those write methods from the track service interface and implementation.
3. Remove the corresponding repository write path if it is not needed elsewhere.
4. Keep `GET` list and `GET` by ID available to authenticated users without requiring a user ID.
5. Add controller tests proving that track reads are available to authenticated users and that no track write endpoint is exposed.

### 2. The security catch-all route is fail-open

Affected area: `podium-service/src/main/java/com/nico/podium/config/SecurityConfig.java`

The authorization rules end with `.anyRequest().permitAll()`. A newly added endpoint outside `/api/**` would therefore be public by default, which can silently expose future functionality.

Remediation plan:

1. Replace the catch-all rule with `.anyRequest().denyAll()`.
2. Keep explicit `permitAll()` rules for authentication and the health endpoint.
3. Add a security configuration test that verifies an unmapped route is denied rather than becoming public.

### 3. Authentication endpoint rate limiting is delegated to deployment

Affected area: `podium-service/src/main/java/com/nico/podium/controller/AuthController.java`

The deployment platform provides DDoS protection. Application-level rate limiting for login, registration, and token refresh is not required at the current stage of the product.

Decision and follow-up:

1. Confirm that the deployed DDoS controls cover the public authentication endpoints.
2. Keep authentication errors generic and avoid revealing whether a user exists.
3. Revisit application-level rate limiting when the user base, threat model, or deployment architecture changes.

### 4. Request validation is inconsistent and incomplete

Affected areas: controller request DTOs and service implementations.

Validation is currently performed through scattered manual checks. Email format, string lengths, date ranges, numeric ranges, and several nullable fields are not consistently constrained. For example, vehicle year, track length, lap number, and text fields can receive unreasonable values.

Remediation plan:

1. Add Spring's validation starter.
2. Annotate request records with constraints such as `@NotBlank`, `@Email`, `@Size`, `@Positive`, `@Min`, and `@Max`.
3. Add `@Valid` to controller request bodies.
4. Create custom Bean Validation validators for cross-field rules, such as track-day date ranges and session dates, wherever the rule belongs to the request shape.
5. Keep domain-dependent checks in the service layer, such as verifying that a referenced vehicle belongs to the current user.
6. Return a consistent, non-sensitive validation error structure.
7. Add boundary tests for malformed, oversized, negative, and out-of-range values.

### 5. CORS hardening is deferred

Affected area: `podium-service/src/main/java/com/nico/podium/config/SecurityConfig.java`

CORS uses `setAllowedOriginPatterns` together with `setAllowCredentials(true)`. This is a valid future hardening item, but it is intentionally deferred for now.

Deferred decision:

Revisit this when deployment configuration changes or cookie-based authentication is introduced. At that point, reject wildcard origins, prefer exact origins, narrow methods and headers, and verify production behavior with integration tests.

### 6. Authentication token cleanup is deferred at the current scale

Affected area: `podium-service/src/main/java/com/nico/podium/service/impl/AuthServiceImpl.java`

Each login and refresh creates a token row. Expired and revoked rows are not currently purged. The application is not yet large enough for this to be a material operational concern.

Deferred decision:

Revisit token cleanup when token volume, database size, or operational monitoring justifies it. The eventual implementation should delete expired tokens and old revoked tokens with an indexed scheduled job, while preserving active tokens.

### 7. Authentication error and token lifecycle behavior should be standardized

Affected area: `podium-service/src/main/java/com/nico/podium/service/impl/AuthServiceImpl.java`

The token implementation is a reasonable opaque-token design, but refresh is a revoke-and-reissue operation with no explicit reuse detection or device/session management. Logout also returns an error for an invalid supplied token, which may be unnecessarily brittle for an idempotent operation.

Implementation plan:

1. Keep the current opaque bearer-token model for now, since tokens are random and only hashes are stored.
2. Make refresh explicitly revoke the presented token and issue exactly one replacement token.
3. Make logout idempotent for missing or already-revoked tokens while retaining an unauthorized response for malformed credentials where appropriate.
4. Add lifecycle tests for login, refresh, expiration, revocation, logout, and attempts to reuse a revoked token.
5. Reassess separate refresh-token families and device/session management if longer-lived sessions are introduced.

### 8. The production container runs as root

Affected area: `podium-service/Dockerfile`

The runtime image does not declare a non-root user. A container compromise would therefore begin with root privileges inside the container.

Implementation plan:

1. Create a dedicated unprivileged runtime user.
2. Grant that user ownership/read access to `/app` and the JRE files it needs.
3. Add `USER` before the entrypoint.
4. Verify the image with a container security scanner and a runtime identity check.
5. Keep the build stage separate from the smaller runtime stage, as it is currently.

### 9. Development credentials establish unsafe patterns

Affected areas: `podium-service/src/main/filters/development.properties` and `podium-web/src/environments/environment.ts`.

The backend contains a plaintext development database password, and the Angular development environment auto-fills a personal email address with the weak password `password`.

Deferred decision:

These development values will eventually be removed. Until then, confirm they are not production credentials and rotate them if they were ever real. Production secrets must remain in deployment-managed environment variables or a secret manager.

## Frontend Findings

### 10. The bearer token is stored in `localStorage`

Affected area: `podium-web/src/app/auth.service.ts`

Any successful XSS attack or compromised script running in the application origin can read the bearer token from `localStorage` and use it from another system. The current Angular code has no obvious unsafe HTML sink, but token theft remains the main browser-side authentication risk.

What this means:

`localStorage` is browser storage that JavaScript can read. If malicious JavaScript ever runs in the application origin, it can copy the bearer token and use it until the token expires or is revoked. This is different from an `HttpOnly` cookie, which the browser sends automatically but does not expose to JavaScript.

Decision:

The HttpOnly-cookie migration is intentionally not planned at this time because it would be difficult to implement correctly across the Vercel frontend and Render backend. The current localStorage-based bearer-token approach is an accepted risk.

Continue using Angular's default template escaping and avoid unsafe HTML APIs. Revisit this decision only if the deployment architecture changes, sessions become longer-lived, or the application handles more sensitive data.

### 11. No Content Security Policy or related browser headers are configured

Affected area: Vercel deployment configuration for `podium-web`.

What this means:

A Content Security Policy (CSP) is a browser-enforced allowlist for scripts, connections, frames, and other resources. It can limit the damage from an XSS bug by preventing injected code from running or sending data to an untrusted destination. HSTS tells browsers to use HTTPS, `X-Content-Type-Options` prevents MIME-type guessing, and `Referrer-Policy` limits URL information sent to other sites.

These are defense-in-depth controls, not a substitute for Angular's normal template escaping or secure token handling. The Angular application is deployed on Vercel, which supports custom response headers through a repository `vercel.json` file or Vercel project configuration. These headers should be configured on Vercel rather than in Angular source code or `index.html`.

Remediation plan:

1. Configure the headers in Vercel using `vercel.json` in the Vercel project root, or use the equivalent Vercel project configuration.
2. Start with a restrictive policy including `object-src 'none'`, `base-uri 'self'`, and `frame-ancestors 'none'`.
3. Restrict `script-src` to the application origin and `connect-src` to the application origin plus `https://podium-u3rl.onrender.com`.
4. Add `Strict-Transport-Security` only when HTTPS is guaranteed for the frontend domain and its subdomains. Vercel provides HTTPS/TLS and DDoS mitigation for deployed traffic.
5. Add `X-Content-Type-Options: nosniff` and a restrictive `Referrer-Policy`.
6. Roll out CSP in report-only mode first if existing dependencies require tuning.
7. Test production headers with `curl -I` or browser developer tools and verify that the app still loads and calls the API.
8. No Angular component, service, or template change is required solely to add these response headers.

### 12. The client-set user ID cookie is not secure and is redundant

Affected area: `podium-web/src/app/auth.service.ts`

The `podium.user.id` cookie lacks the `Secure` attribute and is readable and writable by client-side code. It is not an authorization source on the backend, so it adds state without providing security value.

Remediation plan:

1. Remove the cookie and use the authenticated `/api/users/me` response as the source of the user ID.
2. If it must remain temporarily, add `Secure`, retain `SameSite=Lax` or use `Strict` where compatible, and validate that it is never trusted for authorization.
3. Add a test proving that changing the cookie cannot change the authenticated user.

### 13. Frontend authentication state is presence-based

Affected area: `podium-web/src/app/auth.guard.ts`.

The route guard checks only whether a token exists locally. It does not verify expiration or server validity before allowing navigation. The API interceptor eventually handles a 401, but users can briefly enter protected routes with stale state.

Remediation plan:

1. Rehydrate authentication through `/api/users/me` before rendering protected application routes, or use a route resolver/initialization flow.
2. Treat failed rehydration as a cleared session and redirect to login.
3. Avoid decoding opaque tokens in the browser to infer security claims.
4. Add tests for missing, expired, revoked, and server-invalid sessions.

### 14. Registration errors can reveal whether an email exists

Affected area: `podium-service/src/main/java/com/nico/podium/service/impl/AuthServiceImpl.java`.

Registration returns a distinct conflict response when an email is already registered. This allows account enumeration. The API does not need a duplicate-email-specific message; a generic registration error is sufficient and avoids exposing whether an email already exists.

Remediation plan:

1. Return a generic registration error for duplicate or otherwise rejected registration requests.
2. Keep login failures generic, as they are currently.
3. Do not expose whether an email is already registered in the response body or status-specific message.
4. Revisit email verification if account recovery or higher assurance is needed later.

## Authorization and Data-Ownership Test Plan

Add negative-path tests for every user-owned resource. Each test should use two different user IDs and verify that the second user cannot read, update, or delete the first user's data.

Required coverage:

- Vehicles: get, update, and delete.
- Track days: get, update, and delete.
- Sessions: get, update, and delete through another user's track day.
- Laps: get, update, and delete through another user's session.
- Dashboard, records, and list endpoints: results contain only the authenticated user's data.
- Tracks: reads are global and authenticated; create, update, and delete endpoints are absent.
- Authentication filter: malformed, missing, expired, revoked, and valid bearer tokens.
- Security configuration: protected API routes require authentication and unknown routes do not become public.

Use service-level tests for ownership invariants and controller/integration tests for the HTTP status and response contract. Follow the existing backend testing conventions under `podium-service/src/test`.

## Recommended Delivery Sequence

1. Make authorization fail closed and make the global track catalog read-only.
2. Add cross-user authorization tests before changing related service logic.
3. Keep DDoS protection delegated to the deployment platform and review it when the threat model changes.
4. Add backend request validation and consistent error responses.
5. Add CSP and security headers at the hosting layer after identifying the frontend host.
6. Run the container as a non-root user.
7. Implement and test the agreed token lifecycle behavior.
8. Revisit CORS hardening, token cleanup, and development credential removal when their deferred conditions are met.

## Verification Checklist

Before release, verify:

- All protected endpoints return `401` without authentication.
- A user cannot access or mutate another user's records by changing an ID in the URL or request body.
- Track mutation permissions match the documented catalog model.
- Deployment DDoS controls cover the public authentication endpoints, and authentication does not leak sensitive account state.
- Invalid, expired, revoked, and malformed tokens are rejected.
- CORS allows only the configured production origins.
- Production responses include the intended browser security headers.
- The production container runs without root privileges.
- No real secrets or credentials exist in source, build artifacts, or frontend bundles.
- Backend and Angular security regression tests pass in CI.
