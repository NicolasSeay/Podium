# Production Security Checklist

## What the Warning Means

Spring Boot generated a temporary password because Spring Security is enabled but no production authentication provider has been configured. The password is for development only and must not be used in production.

## Current Risks

Podium has a custom token authentication flow, but it still needs hardening:

- User passwords are stored as plain text.
- Tokens are stored only in application memory and disappear on restart.
- Tokens do not expire, use a signing key, or support reliable revocation.
- `X-User-Id` can be used to claim a user identity and must not be trusted.
- Authorization and ownership rules need security tests.

## Required Changes

1. Hash passwords with BCrypt or Argon2. Use password-hash matching during login and migrate or invalidate existing plain-text passwords.
2. Replace the in-memory token map with signed JWTs or persistent, securely stored tokens.
3. Add token expiration, refresh-token rotation, logout/revocation, and protection against token replay.
4. Store signing keys, database credentials, and other secrets in environment variables or a secret manager.
5. Remove `X-User-Id` authentication. Accept identity only from a validated bearer token.
6. Require authentication for private `/api/**` routes and explicitly allow only public routes such as login, registration, and health checks.
7. Add role and ownership checks so an authenticated user cannot access or modify another user's data.
8. Return consistent `401 Unauthorized` responses for missing, malformed, expired, or revoked tokens.

## Additional Production Checks

- Expose only the actuator health endpoint publicly; protect other actuator endpoints.
- Keep CSRF disabled only if the API uses bearer tokens and not browser cookies for authentication.
- Configure an explicit CORS policy for the deployed frontend.
- Use database migrations and set `spring.jpa.hibernate.ddl-auto=validate` in production.
- Add login rate limiting and security audit logging without logging passwords or tokens.
- Add tests for unauthenticated requests, valid and invalid tokens, expired tokens, logout, cross-user access, and role restrictions.

Do not silence the warning by hardcoding a value for `spring.security.user.password`. That would only replace the temporary development credential; it would not make the application secure.
