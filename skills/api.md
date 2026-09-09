# API Layer

## Central Client
- Use `apiClient` or `apiRequest` from `@/services/api`.
- Base URL comes from `VITE_API_URL`.
- Auth token is attached automatically if present in localStorage.
- Errors are normalized to `AppError` subclasses.

## Adding a new API endpoint
1. Create `src/features/[feature]/api/[resource].ts`
2. Export typed functions that call `apiRequest` or `apiClient`.
3. Optionally validate response with Zod.
4. Consume via TanStack Query in the feature.

## Error Handling
- Always let the interceptor normalize the error.
- In UI, catch `AppError` and show user-friendly messages.
- Never display raw backend error messages that may contain sensitive data.

## Authentication
- Token storage is currently localStorage for simplicity.
- For production consider httpOnly cookies + refresh flow.
- Never log tokens.
