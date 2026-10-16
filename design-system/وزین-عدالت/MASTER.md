# Design System Master File — وزین عدالت

> **LOGIC:** When building a specific page, first check `design-system/وزین-عدالت/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.
>
> Installed via UI/UX Pro Max (`.cursor/skills/ui-ux-pro-max`). Brand tokens in
> `src/styles/globals.css` always win over generic skill palette suggestions.

---

**Project:** وزین عدالت  
**Category:** Legal-tech / online law firm  
**Layout:** RTL Persian  
**Stack:** React + Vite + Tailwind

---

## Global Rules

### Color Palette (project tokens — never hardcode hex in components)

| Role | Token | Hex |
|------|-------|-----|
| Primary | `navy-900` | `#0b1c2c` |
| Primary soft | `navy-700` | `#17293c` |
| Accent / CTA | `gold-500` / `gold-600` | `#c9a86c` / `#a9853f` |
| Page bg | `navy-50` | off-white navy tint |
| Text | `navy-900` / `navy-600` | body / muted |

**Avoid:** purple/indigo gradients, neon glow, glassmorphism stacks, sky-blue SaaS palettes.

### Typography

- **Headings:** Estedad (`font-display`)
- **Body:** Vazirmatn
- Self-hosted via `@fontsource` in `src/styles/theme.css` — no Google Fonts CDN

### Motion

- 2–3 purposeful motions per section max
- Respect `prefers-reduced-motion`
- Use shared `Reveal` / Framer Motion patterns already in the app

### Anti-patterns (landing)

- Floating promo badges / stickers on hero media
- Pill badge clusters in the first viewport
- Overcrowded heroes (stats + schedule + CTAs + selectors)
- Identical icon-in-circle card grids without hierarchy
- Generic Inter/Roboto stacks

### Accessibility & touch

- Touch targets ~44px where practical (min 24×24 with spacing)
- `cursor-pointer` on clickable elements
- Visible focus rings (gold)
- No horizontal scroll at 320px
- Sticky header must not cover section titles (`scroll-margin`)

---

## Pre-delivery checklist

- [ ] Responsive: 320 · 375–390 · 768 · 1024 · 1280–1520
- [ ] RTL logical spacing (`ms-`/`me-`, start/end)
- [ ] Contrast 4.5:1 on light surfaces
- [ ] Lucide icons only (no emoji decoration)
- [ ] `npm run typecheck && lint && test && build`
