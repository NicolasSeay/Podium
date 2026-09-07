# REST API Standards

This document defines the REST and HTTP conventions for the Podium API. It combines established HTTP standards with project-specific decisions for the Spring Boot service.

## Scope and Language

These rules apply to new and changed HTTP endpoints in `podium-service`.

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are used in their standards sense. A MUST rule is required for interoperability or security. A SHOULD rule is the default and needs a documented reason to be changed.

## Design Principles

- Model stable domain concepts as resources, not controller actions.
- Let the HTTP method and status code carry protocol semantics; do not encode success or failure only in a JSON field.
- Keep representations predictable. A client should be able to determine the shape, media type, and meaning of a response without reading server implementation details.
- Make authorization decisions at the resource and field level for every request, including reads.
- Prefer additive, backward-compatible changes. Treat removing or renaming a response field, changing its type, or changing status-code behavior as a breaking change.

## URL and Resource Naming

- Use the existing `/api` base path.
- Use lowercase, plural, hyphen-separated resource names: `/api/track-days`, `/api/vehicles`.
- Use path segments for resource identity: `/api/vehicles/{vehicleId}`.
- Use nested paths only when the child has no useful independent identity or the relationship is central to the operation: `/api/track-days/{trackDayId}/sessions`.
- Use query parameters for filtering, sorting, pagination, and representation options: `/api/sessions?status=completed&sort=-startedAt`.
- Do not put secrets, access tokens, passwords, or sensitive personal data in URLs. URLs are commonly logged, cached, and copied into browser history.
- Use stable opaque identifiers where possible. Do not expose database implementation details as part of the public contract.
- Treat path parameter values as untrusted input and percent-encode them according to URI rules.
- Avoid trailing-slash variants. Choose one canonical form and redirect or reject the other consistently.

### Resource Examples

| Intent | Method and path |
| --- | --- |
| List the authenticated user's vehicles | `GET /api/vehicles` |
| Read one vehicle | `GET /api/vehicles/{vehicleId}` |
| Create a vehicle | `POST /api/vehicles` |
| Replace a vehicle | `PUT /api/vehicles/{vehicleId}` |
| Partially update a vehicle | `PATCH /api/vehicles/{vehicleId}` |
| Delete a vehicle | `DELETE /api/vehicles/{vehicleId}` |
| List sessions for a track day | `GET /api/track-days/{trackDayId}/sessions` |

For domain operations that are not naturally CRUD, use a subordinate action resource rather than overloading `GET` or inventing verbs in the path. For example, `POST /api/sessions/{sessionId}/cancel` can be appropriate when cancellation has domain rules and is not equivalent to deleting the session.

## HTTP Methods

Use methods according to RFC 9110:

| Method | Meaning | Safety and retry guidance |
| --- | --- | --- |
| `GET` | Retrieve a current representation or collection | Safe and idempotent. MUST NOT intentionally change resource state. |
| `POST` | Create a subordinate resource or perform resource-specific processing | Not inherently idempotent. Clients MUST NOT blindly retry unless an idempotency strategy is defined. |
| `PUT` | Replace the complete representation at a known URI | Idempotent. Require a complete representation unless the endpoint explicitly documents different semantics. |
| `PATCH` | Apply a partial modification | Define the patch format and concurrency behavior. Do not assume it is idempotent. |
| `DELETE` | Remove the resource association | Idempotent. Repeating an already-completed delete should not create another side effect. |

Do not use `GET` for actions that mutate data, including delete, login state changes, exports that create persistent records, or transitions such as publish and cancel.

## Request and Response Representations

- JSON is the default representation: `Content-Type: application/json`.
- Clients sending a body MUST send the correct `Content-Type`.
- Servers SHOULD reject an unsupported request media type with `415 Unsupported Media Type`.
- Use `Accept` when an endpoint supports more than one response representation. Return `406 Not Acceptable` only when none of the requested representations can be served.
- Use UTF-8 JSON and ISO 8601 / RFC 3339 date-time strings with an explicit offset or `Z`.
- Keep field names consistent across resources. Use the existing project naming convention unless a public contract has already established another name.
- Do not return persistence entities directly when that would expose internal fields, relationships, or writable properties. Use request and response DTOs at the API boundary.
- Distinguish omitted fields from explicit `null` only when that distinction is documented and meaningful.
- Collection endpoints return a JSON array or a documented collection envelope. If pagination metadata is needed, use an envelope such as `{ "items": [], "page": { ... } }` consistently across the API.
- A successful `201 Created` response MUST include a `Location` header pointing to the new resource when the resource has a retrievable URI.
- A successful `204 No Content` response MUST have no response body. Use it for completed deletes or updates where no representation is returned.
- Use `202 Accepted` only when processing is asynchronous and the response explains how the client can observe status.

### Nulls, Dates, and Numbers

- Document whether nullable fields are returned as `null` or omitted.
- Use a single time standard for each field. Prefer UTC on the wire and preserve the original offset only when the domain requires it.
- Do not serialize floating-point values for measurements or money when precision matters. Choose a decimal representation and document its precision and rounding behavior.
- Document units for physical values such as distance, speed, fuel, and temperature. Prefer explicit field names such as `distanceKm` over an ambiguous `distance`.

## Status Codes

Use the most specific standard status code that describes the result:

| Status | Use in Podium |
| --- | --- |
| `200 OK` | Successful read, update, or action with a response representation. |
| `201 Created` | A new resource was created; include `Location` where applicable. |
| `202 Accepted` | The request was accepted for asynchronous processing. |
| `204 No Content` | The request succeeded and there is intentionally no response body. |
| `400 Bad Request` | The request cannot be parsed or violates basic request syntax. |
| `401 Unauthorized` | Authentication is missing or invalid. The response should not imply that an authenticated user exists. |
| `403 Forbidden` | The caller is authenticated but is not allowed to perform the operation. |
| `404 Not Found` | The resource does not exist, or the API intentionally hides its existence from the caller. |
| `405 Method Not Allowed` | The path exists but the method is unsupported; include an `Allow` header. |
| `409 Conflict` | The request conflicts with the current resource state or a uniqueness constraint. |
| `412 Precondition Failed` | A supplied conditional request such as `If-Match` did not hold. |
| `413 Content Too Large` | The request exceeds a documented size limit. |
| `415 Unsupported Media Type` | The request body media type is not supported. |
| `422 Unprocessable Content` | The content is syntactically valid but fails domain or validation rules. |
| `429 Too Many Requests` | A rate or usage limit was exceeded; include `Retry-After` when known. |
| `500 Internal Server Error` | An unexpected server failure. Do not expose stack traces or implementation details. |
| `503 Service Unavailable` | The service is temporarily unable to handle the request. Include `Retry-After` when useful. |

Do not use `200 OK` for every outcome, and do not use `500` for client validation, authorization, or conflict errors.

## Error Responses

Use RFC 9457 Problem Details for API errors with media type `application/problem+json`.

A typical validation response is:

```http
HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json
```

```json
{
  "type": "https://api.podium.example/problems/validation-error",
  "title": "Request validation failed",
  "status": 422,
  "detail": "One or more fields are invalid.",
  "instance": "/api/vehicles",
  "errors": [
    {
      "field": "year",
      "message": "must be between 1886 and the current year"
    }
  ]
}
```

Rules:

- The HTTP status line is authoritative. If a `status` member is included, it MUST match the actual status code.
- `type` identifies a stable problem category. Prefer an absolute URI under Podium's control.
- `title` is a short, stable summary. `detail` describes this occurrence and should help the client correct it.
- `instance` identifies the request or occurrence without exposing stack traces, SQL, secrets, or internal hostnames.
- Use documented extension members such as `errors` for structured field-level details. Clients MUST ignore extensions they do not recognize.
- Keep error responses machine-readable and safe to show to users. Log diagnostic details on the server instead.
- Use the same error format for authentication, authorization, validation, not-found, conflict, and server errors unless an endpoint has a documented domain-specific response.

## Authentication and Authorization

- Require HTTPS outside local development. Never send credentials or bearer tokens over plaintext HTTP.
- Use the project's configured authentication mechanism and do not invent endpoint-specific token formats.
- Return `401` when credentials are absent or invalid, and `403` when valid credentials lack permission.
- Enforce object-level authorization using the authenticated principal and the requested resource ID. Never trust a user ID, owner ID, or tenant ID supplied by the client when the server can derive it from authentication.
- Check authorization on every endpoint, including collection reads, nested resources, exports, and state-changing actions.
- Apply property-level authorization: allow-list fields accepted on writes and avoid returning fields that the caller cannot see.
- Do not rely on obscured IDs for authorization. An opaque ID reduces accidental disclosure but does not replace access checks.
- Rate-limit authentication, password reset, expensive queries, uploads, and other sensitive business flows.
- Set security headers and cookie attributes appropriate to the authentication mechanism. Never log authorization headers, session cookies, refresh tokens, or passwords.
- Return generic authentication errors where revealing whether an account exists would aid account enumeration.

These rules address the OWASP API Security Top 10 risks, especially broken object/property/function authorization, broken authentication, unrestricted resource consumption, security misconfiguration, and improper API inventory.

## Filtering, Sorting, and Pagination

Collection endpoints MUST define behavior for limits and unbounded result sets.

- Support an explicit page size or limit with a conservative server maximum.
- Reject invalid, negative, or excessively large values rather than silently performing an unbounded query.
- Define stable ordering. A client-visible sort should have a deterministic tie-breaker, usually the resource ID.
- Whitelist filter and sort fields. Never concatenate raw field names or SQL fragments from query parameters.
- Use a documented pagination model. Offset pagination is acceptable for small, stable collections; cursor pagination is preferred for large or frequently changing collections.
- Return enough metadata for a client to continue, refresh, or determine that no more results exist.
- Consider response size, query cost, and rate limits together. Pagination is a resource-protection feature, not only a UI feature.

Example:

```http
GET /api/sessions?status=completed&limit=25&cursor=eyJpZCI6MTIzfQ
```

```json
{
  "items": [],
  "page": {
    "limit": 25,
    "nextCursor": "eyJpZCI6MTQ4fQ",
    "hasMore": true
  }
}
```

## Concurrency and Caching

- Use `ETag` or `Last-Modified` for representations where stale updates or repeated downloads are a concern.
- For updates and deletes, use `If-Match` with a strong validator when lost updates are possible. Return `412` when the precondition fails.
- Treat `GET` and `HEAD` responses as cacheable only when the data is safe to cache and the `Cache-Control` policy is explicit.
- Do not cache user-specific or sensitive responses in shared caches. Use `Cache-Control: private` or `no-store` as appropriate.
- Invalidate or revalidate cached representations after successful writes.
- Do not use cache validators as authentication or tamper-proof security controls; they support efficiency and cooperative concurrency only.

## Versioning and Deprecation

- Prefer backward-compatible, additive evolution within a version.
- Version the public contract when a breaking change is unavoidable. Use the project's chosen strategy consistently; do not mix path, header, and media-type versioning casually.
- Do not version every internal implementation detail.
- Mark deprecated operations and fields in the API contract and documentation, provide a replacement, and define a removal date or policy.
- Keep old and new versions isolated enough that security fixes, authorization rules, and operational limits can be audited independently.

## OpenAPI Contract

Every public endpoint SHOULD be described in an OpenAPI document. The description is a contract, not a substitute for tests.

Each operation should document:

- a unique `operationId`;
- its path, method, parameters, request body, and content types;
- authentication and authorization requirements;
- request and response schemas, including required, nullable, read-only, and write-only fields;
- success and known error status codes;
- examples for representative requests and responses;
- pagination, filtering, sorting, rate-limit, and concurrency behavior where applicable;
- deprecation information when relevant.

Use reusable OpenAPI components for shared schemas, parameters, responses, and security schemes. Validate the document in CI and use it to drive generated reference documentation and contract tests where practical.

## Testing and Review Checklist

Before merging an endpoint, verify:

- The path models a resource or a clearly documented domain action.
- Each method has correct safe, idempotent, and retry semantics.
- Success responses use the correct status and media type.
- `201` responses have `Location`; `204` responses have no body.
- Invalid JSON, unsupported media types, malformed IDs, and validation failures are tested.
- `401`, `403`, `404`, and cross-user or cross-tenant access attempts are tested.
- Unknown or writable-sensitive fields cannot be mass-assigned.
- Collection limits, sorting, pagination, and expensive query behavior are bounded.
- Error responses follow RFC 9457 and do not leak implementation details.
- The endpoint is included in OpenAPI documentation and examples.
- Logs and metrics include a correlation/request ID but exclude secrets and sensitive payloads.
- The change is backward-compatible or has an explicit versioning and migration plan.

## Current Podium Conventions

The existing service provides these local anchors for new work:

- Backend endpoints use the `/api` prefix.
- Authentication is represented by `Authentication` in controller methods, and ownership is derived from the authenticated user for the current user-scoped resources.
- Existing controllers commonly return direct JSON objects or arrays rather than a universal response envelope.
- Logout and delete operations currently use `204 No Content`.
- New endpoints should preserve these conventions unless the API contract is intentionally being standardized more broadly. Any migration to a shared error format, pagination envelope, or OpenAPI source of truth should be done as a coordinated compatibility change.

## References

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [RFC 9457: Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [OWASP API Security Top 10: 2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [RFC 3986: URI Generic Syntax](https://www.rfc-editor.org/rfc/rfc3986)
- [RFC 7231: HTTP Semantics and Content](https://www.rfc-editor.org/rfc/rfc7231)

The standards links above were checked on 2026-09-07. RFC 9110 supersedes the HTTP semantics in RFC 7231; RFC 7231 remains listed because it is still commonly encountered in API documentation.
