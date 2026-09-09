# State Management

## Rules
| Kind of state              | Tool              |
|---------------------------|-------------------|
| Server / remote data      | TanStack Query    |
| Client UI state           | Zustand           |
| Form state                | React Hook Form   |
| Truly local component     | useState / useReducer |

## Zustand
- Only client state: theme, sidebar, modals, preferences, auth session flags.
- Create small domain stores (`ui-store.ts`, `auth-store.ts`…).
- Never put server data in Zustand.

## TanStack Query
- All API data.
- Define query keys in a consistent way: `['feature', 'resource', id]`
- Prefer `queryOptions` / factory functions for reusability.
- Use `invalidateQueries` after mutations.

## Local State
- Prefer local state when the value is not needed outside the component tree.
