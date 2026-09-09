# Development Guide

## Setup
```bash
cp .env.example .env
npm install
npm run dev
```

## Scripts
| Command            | Purpose                    |
|--------------------|----------------------------|
| `npm run dev`      | Start dev server           |
| `npm run build`    | Production build           |
| `npm run preview`  | Preview production build   |
| `npm run typecheck`| TypeScript check           |
| `npm run lint`     | ESLint                     |
| `npm run format`   | Prettier                   |
| `npm run test`     | Unit tests                 |

## Adding a Feature
1. Create folder under `src/features/`
2. Add schemas, api, components, hooks
3. Export public API from `index.ts`
4. Register route(s)
5. Write tests for logic

## Code Review Checklist
- [ ] No secrets in code
- [ ] No unused dependencies / components
- [ ] Types are strict (no unnecessary `any`)
- [ ] Feature isolation respected
- [ ] Errors are handled via centralized system
- [ ] Accessibility considered
- [ ] Tests for new logic
