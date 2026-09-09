# Performance

## Required Practices
- Route-level code splitting with `React.lazy` + `Suspense`.
- Keep vendor chunks separated (already configured in vite.config).
- Use TanStack Query cache; avoid duplicate requests.
- Prefer CSS animations over JS when possible.
- Debounce search inputs and expensive handlers.
- Images: use proper formats and sizes (future: add image optimization pipeline).

## Avoid
- Premature `useMemo` / `useCallback` / `React.memo` unless measured.
- Large barrel files that prevent tree-shaking.
- Fetching data in components that don’t need it.
