---
name: skeleton-loading
description: >-
  Professional, layout-matching skeleton loaders with delayed (lazy) reveal
  for backend/TanStack Query and Suspense boundaries. Use when adding or editing
  loading UI, isLoading/isPending states, Suspense fallbacks, route loaders,
  list/card/detail async sections, or when the user asks for skeleton, shimmer,
  placeholder, or loading UX.
---

# Skeleton Loading — وزین عدالت

Persian RTL legal-tech app. Prefer **shape-matched, delayed skeletons** over bare
“در حال بارگذاری…” text or full-page spinners for content that comes from the backend.

## When this applies

- Any `useQuery` / `useQueries` / `isPending` / `isLoading` / `isFetching` UI
- Route `React.lazy` + `Suspense` fallbacks
- List / grid / card / detail / chat / form-adjacent async regions
- Marketing strips that fetch (`blog`, home banners, etc.)
- Refetch that would otherwise cause layout jump or flash

## Goals

1. **Perceived speed** — user sees the *structure* of the page immediately.
2. **No flash** — do not show skeleton for sub-~150–200ms responses (**lazy reveal**).
3. **Layout stability** — skeleton mirrors final layout (same grid, radius, gaps).
4. **Brand polish** — navy/gold tokens, soft shimmer, RTL-safe; not generic gray bars.
5. **Honest UX** — skeleton only where data is missing; keep chrome (header, nav, page title) stable.

## Non-negotiables

1. **Never** use only `<p>در حال بارگذاری…</p>` for list/detail/card regions.
2. **Never** hardcode hex/rgb — use tokens (`bg-navy-100`, `bg-navy-50`, `via-gold-100/40`, `border-navy-100`, `rounded-2xl` / `rounded-[1.5rem]`).
3. Skeletons **match the real component shape** (card grid ≠ one tall block; chat list ≠ spinner).
4. Wrap the loading region with `aria-busy="true"` and a polite live region when useful.
5. Respect `prefers-reduced-motion`: static soft fill, no aggressive shimmer.
6. Use shared primitives from `components/shared/` (or `components/ui/skeleton` if added) — do not reinvent pulse blocks per page.
7. **Lazy reveal**: show skeleton only after a short delay (default **180ms**) or when the request is still pending past that threshold — avoids flicker on warm cache / fast APIs.
8. On **cached data** (`isFetching && !isPending` / placeholderData): prefer subtle top progress / opacity, **not** a full skeleton wipe.
9. Keep **PageHeader / SiteHeader / AppShell** visible while content skeletons load.
10. Count of skeleton items ≈ first page density (e.g. pageSize 6 → 6 cards), not 20 fake rows.

## Lazy reveal (required pattern)

```tsx
// Conceptual — implement once in shared hook, reuse everywhere
const showSkeleton = useDelayedFlag(isPending, 180)
```

| Condition | UI |
|-----------|-----|
| `isPending` & elapsed &lt; 180ms | keep previous UI or empty reserved space (no flash) |
| `isPending` & elapsed ≥ 180ms | show layout skeleton |
| `isSuccess` & empty | `AppEmptyState` / empty copy — **not** skeleton |
| `isError` | `ErrorBadge` / retry — **not** skeleton |
| `isFetching` with existing data | keep content; optional faint progress |

Hook name suggestion: `useDelayedFlag` or `useLazySkeleton(isPending, delayMs?)` in `src/hooks/`.

## Component hierarchy

| Layer | Location | Role |
|-------|----------|------|
| Primitive | `components/ui/skeleton.tsx` or `components/shared/skeleton.tsx` | Base bone + shimmer |
| Composed | `components/shared/skeletons/*` | Card / list-row / detail / chat / blog |
| Feature | `features/[name]/components/*-skeleton.tsx` | Only if layout is unique |
| Hook | `src/hooks/use-lazy-skeleton.ts` | Delayed reveal |
| Route | `app/router` Suspense fallback | Page-level shell skeleton (not endless spinner alone) |

Prefer composition:

```tsx
{showSkeleton ? (
  <section aria-busy="true" aria-label="در حال بارگذاری فهرست">
    <CaseCardSkeletonGrid count={6} />
  </section>
) : ...}
```

## Shape recipes (map to real pages)

| Region | Skeleton shape |
|--------|----------------|
| Cases / discounts / bookings grids | `rounded-[1.5rem]` cards, title bar + 2 lines + footer chip |
| Notifications / tickets | stacked rows: eyebrow + title + 2 lines + date |
| Documents list | full-width cards matching `DocumentRequestCard` |
| Blog list / home blog | cover aspect + category chip + title + excerpt |
| Case detail | header block + progress + stage list |
| Chat thread | bubbles L/R alternating (RTL-aware) |
| App home | banner aspect + shortcut row + mini case cards |
| Route Suspense | centered soft panel or content-shaped shell inside layout — avoid blank white screen |

## Visual craft

- Soft **shimmer** along the reading direction (RTL: highlight moves right→left) via CSS only.
- Slight **stagger** on sibling bones (`animation-delay`) — subtle, ≤ 3–5 items delay steps.
- Borders: `border border-navy-100`; fill: `bg-navy-50` / `bg-navy-100/80`; optional `via-white/60` shimmer.
- Same **gaps and columns** as the loaded grid (`md:grid-cols-2`, `xl:grid-cols-3`, etc.).
- Min heights that approximate real cards — prevent CLS when data arrives.
- Dark marketing heroes: use `bg-white/10` bones, not navy-100 on navy-900.

## Anti-patterns

- Full-viewport spinner for in-page lists
- Skeleton that does not match final layout (random bars)
- Replacing the whole app shell on every refetch
- Infinite skeleton with no timeout/error path
- Emoji / purple glow / generic Inter-style placeholder kits
- Showing skeleton and real content stacked (double layout)
- `animate-pulse` on huge full-page blocks without structure
- Hardcoded `#eee` / gray-200 without brand tokens

## Accessibility

- `aria-busy="true"` on the loading container
- `aria-label` in Persian (e.g. «در حال بارگذاری پرونده‌ها»)
- Decorative bones: `aria-hidden="true"`
- Do not trap focus inside skeletons
- After load, ensure focus is not lost unexpectedly; announce errors via existing `ErrorBadge` / toast patterns

## Implementation checklist (per async section)

- [ ] Identify the real loaded layout (grid/list/detail)
- [ ] Add/reuse a composed skeleton that mirrors it
- [ ] Gate with **lazy reveal** (`~180ms`)
- [ ] Keep page chrome mounted
- [ ] Handle empty + error separately
- [ ] Soft refetch state when data already exists
- [ ] `prefers-reduced-motion` safe
- [ ] Mobile: same stacking as real UI (320–390 check)

## Quality gate

After skeleton work: `npm run typecheck && npm run lint && npm run test && npm run build`.

Also follow: `skills/ui-system.md`, `skills/components.md`, `skills/performance.md`, `.cursor/rules/ui-craft.mdc`, `.cursor/rules/responsive-ui-qa.mdc`.
