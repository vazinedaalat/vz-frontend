# Architecture

## Overview
Feature-Based Modular Architecture.

```
src/
├── app/          # App shell: router, providers, global stores
├── components/   # Shared UI (ui, animated, interactive, shared)
├── features/     # Business features (isolated)
├── services/     # Global services (api, storage)
├── hooks/        # Shared hooks
├── lib/          # Pure utilities (cn, logger)
├── utils/        # Additional helpers
├── types/        # Global types
├── config/       # Environment & app config
├── assets/
└── styles/
```

## Adding a New Feature
1. Create `src/features/[feature-name]/`
2. Inside it:
   - `components/` – feature-specific UI
   - `hooks/` – feature-specific hooks
   - `api/` – feature API calls (use central apiClient)
   - `schemas/` – Zod schemas
   - `types/` – feature types
   - `index.ts` – public API of the feature
3. Import only through the feature’s `index.ts` from outside.
4. Register routes in `src/app/router/routes.tsx`.

## Dependency Rules
- Features must not import from other features directly.
- Features may import from `app/`, `components/`, `services/`, `hooks/`, `lib/`, `config/`.
- Global code only for truly cross-cutting concerns.
- No circular dependencies.

## Forbidden
- Putting business logic in `components/ui`
- Creating global stores for server data (use TanStack Query)
- Hardcoding API URLs or secrets
- Adding unused dependencies or components “just in case”
