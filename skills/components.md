# Components

## Where to put components
- `components/ui/` → shadcn/ui base primitives (Button, Input, Card…)
- `components/animated/` → Magic UI style animations / micro-interactions
- `components/interactive/` → Aceternity-style advanced interactive UI
- `components/shared/` → App-level shared (ErrorBoundary, EmptyState, LoadingSpinner)
- `features/[name]/components/` → Feature-specific only

## When NOT to create a new component
- If an existing one in `components/ui` or `shared` can be extended with props/variants.
- If it is used only once and is trivial – keep it inline or in the feature.

## Rules
- Prefer composition over configuration.
- Props should be typed strictly. Avoid `any`.
- Keep components small and focused.
- Naming: PascalCase, descriptive (`UserAvatar`, not `Avatar2`).
- Never put data-fetching logic inside pure UI components.
- Always check Accessibility (keyboard, ARIA, focus).
