# Validation

## Forms
- Always use React Hook Form + Zod resolver (`@hookform/resolvers/zod`).
- Schemas live in `features/[feature]/schemas/`.
- Infer TypeScript types with `z.infer<typeof schema>`.

## API Responses
- Validate critical responses with Zod when the shape is not guaranteed.
- Place response schemas next to the request functions.

## File Validation
- Use `useFileUpload` hook.
- Always validate MIME type and size before upload.
