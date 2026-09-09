# Testing

## Stack
- Unit / Component: Vitest + Testing Library
- E2E: placeholder (add Playwright or Cypress when needed)

## What to test
- Utilities (`cn`, error normalization, validation schemas)
- Critical shared components
- Feature hooks that contain logic
- Routing guards (ProtectedRoute)

## Commands
```bash
npm run test          # run once
npm run test:watch    # watch mode
```

## Coverage
- Aim for meaningful coverage of business-critical paths, not 100% of UI.
