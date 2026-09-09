# Security

## Absolute Rules
- Never put real secrets in the frontend or in `VITE_*` variables.
- Never log passwords, tokens, or PII.
- Never use `dangerouslySetInnerHTML` unless the content is sanitized.
- Validate all user inputs with Zod.
- Validate file type (MIME) and size before upload.
- Prevent open redirects: always check external URLs against an allowlist if needed.
- Error messages shown to users must not leak internal details.

## Auth Token
- Stored in localStorage under a clear key (current: `access_token`).
- Interceptor attaches it automatically.
- Clear it on logout / 401.

## XSS
- React escapes by default. Prefer that.
- Sanitize any HTML content if you ever need to render it.
