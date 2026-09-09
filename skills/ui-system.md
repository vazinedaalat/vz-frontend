# UI System

## Hierarchy
1. **shadcn/ui** → Primary UI primitives (Button, Input, Dialog, Card, Form…)
2. **Magic UI** → Animations, hover effects, loading animations, subtle motion → put in `components/animated/`
3. **Aceternity UI** → Advanced interactive / premium sections → put in `components/interactive/`

Never implement the same component with two libraries.

## Design Tokens
- All colors, radius, shadows live in `src/styles/globals.css` (CSS variables) and `tailwind.config.js`.
- Never hardcode hex/rgb values inside components.
- Use Tailwind semantic classes: `bg-background`, `text-foreground`, `border-border`, etc.

## Theme
- Managed by `useUiStore` + `ThemeProvider`.
- Supports `light` | `dark` | `system`.
- Components automatically adapt via CSS variables. Do not add theme logic inside individual components.

## Responsive
- Mobile-first.
- Use Tailwind breakpoints: `sm`, `md`, `lg`, `xl`, `2xl`.

## Accessibility
- Keep Radix primitives for dialogs, dropdowns, etc.
- Always provide visible focus states.
- Forms must have associated labels.
