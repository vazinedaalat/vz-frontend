# Frontend Boilerplate

Production-ready React frontend infrastructure. Clean, fast, secure, maintainable and ready for backend integration.

This is **not** an application with business logic — it is a solid foundation.

## Tech Stack

- **React 18** + **TypeScript** (strict)
- **Vite 6**
- **Tailwind CSS 3** + Design Tokens
- **React Router 7**
- **Zustand** (client state)
- **TanStack Query 5** (server state)
- **Axios** (API client)
- **Zod** + **React Hook Form**
- **shadcn/ui** + Radix primitives
- **Lucide React**
- Structure ready for Magic UI & Aceternity UI

## Architecture

Feature-Based Modular Architecture. See `skills/architecture.md`.

```
src/
├── app/           # Router, Providers, Stores
├── components/    # ui / animated / interactive / shared
├── features/      # Isolated feature modules
├── services/      # API client, storage
├── hooks/
├── lib/
├── config/
└── styles/
```

## Getting Started

```bash
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173

## Environment

| Variable         | Description              | Example                        |
|------------------|--------------------------|--------------------------------|
| `VITE_API_URL`   | Backend base URL         | `http://localhost:3000/api`    |
| `VITE_APP_ENV`   | Environment              | `development`                  |
| `VITE_APP_NAME`  | App display name         | `Frontend Boilerplate`         |

> **Never** put real secrets in `VITE_*` variables — they are exposed to the browser.

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run typecheck    # TypeScript check
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Unit tests
```

## UI System

1. **shadcn/ui** → base components (`components/ui`)
2. **Magic UI** → animations (`components/animated`)
3. **Aceternity UI** → advanced interactive (`components/interactive`)

Design tokens live in `src/styles/globals.css` and `tailwind.config.js`.

Theme: Light / Dark / System via `useUiStore`.

## Adding a New Feature

1. Create `src/features/my-feature/`
2. Add `components/`, `hooks/`, `api/`, `schemas/`, `types/`, `index.ts`
3. Register routes in `src/app/router/routes.tsx`
4. Follow the rules in `skills/`

## Security Notes

- No secrets in frontend code
- Tokens never logged
- All inputs validated with Zod
- File uploads validated (MIME + size)
- Centralized error handling (no raw backend errors to user)
- XSS-safe by default (React)

## Coding Standards

- TypeScript strict mode
- No unused code / dependencies
- Feature isolation
- Accessibility first
- Mobile-first responsive
- Meaningful tests for logic

See the `skills/` folder for detailed operational guidelines that keep the architecture intact.

## License

Private / Internal use.
