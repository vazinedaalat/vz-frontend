---
name: seo-geo
description: >-
  SEO and GEO (Generative Engine Optimization) standards for Vazinedalat
  marketing and blog pages. Use when adding or editing blog posts, public
  pages, meta tags, JSON-LD, sitemap, robots, llms.txt, or when the user asks
  for SEO, GEO, Open Graph, schema.org, or AI-search visibility.
---

# SEO & GEO — وزین عدالت

Persian RTL legal-tech site. Prefer **crawlable, citable, entity-clear** pages over keyword stuffing.

## When this applies

- New/updated marketing pages (`/`, `/blog`, `/blog/:slug`)
- Blog content models, mocks, or CMS field contracts
- Head tags, canonical URLs, structured data, `robots.txt`, `sitemap.xml`, `llms.txt`

## Non-negotiables

1. **One H1** per page; headings outline the real content (no fake H2 for decoration).
2. **Unique title + meta description** per indexable URL (fa_IR).
3. **Canonical** absolute URL via `VITE_SITE_URL` + Vite `BASE_URL`.
4. **Open Graph + Twitter** cards with absolute image URLs.
5. **JSON-LD** in head: at least `Organization` (sitewide) + page type (`WebSite` / `CollectionPage` / `BlogPosting` / `BreadcrumbList` / `FAQPage` when FAQs exist).
6. **GEO**: answer-first lead, key takeaways, FAQ with direct answers, clear author + organization entity, dates (`datePublished` / `dateModified`).
7. Never invent legal advice as “official law”; soft-disclaimers OK in body, not in title spam.
8. SPA note: client head updates help JS crawlers; keep `public/robots.txt`, `sitemap.xml`, `llms.txt` in sync for bots that do not execute JS.

## Implementation map (this repo)

| Concern | Location |
|---------|----------|
| Site origin / absolute URLs | `src/lib/seo/site.ts` |
| Document head upsert/cleanup | `src/lib/seo/document-meta.ts` + `DocumentHead` |
| JSON-LD builders | `src/lib/seo/json-ld.ts` |
| Blog page meta builders | `src/features/blog/lib/seo.ts` |
| SEO fields on posts | `src/features/blog/types.ts` |
| Static bot files | `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt` |

## Blog post checklist

- [ ] `slug` stable kebab-case
- [ ] `seoTitle` ≤ ~60 chars (or safe fallback from `title`)
- [ ] `seoDescription` 120–160 chars, answer-oriented
- [ ] `keywords` 3–8 topical phrases (not stuffing)
- [ ] `keyTakeaways` 3–5 bullets (rendered + useful for AI citations)
- [ ] `faq` 2–5 Q&As → visible UI + `FAQPage` schema
- [ ] `updatedAt` when content changes
- [ ] Cover `alt` descriptive (Persian)
- [ ] Internal links to `/blog` and related posts
- [ ] Backend fields documented in `docs/BLOG_API.md`

## GEO writing rules

- First paragraph answers the query directly.
- Use entities by name: «وزین عدالت»، «سامانه ثنا»، «اظهارنامه»، «دادخواست».
- Prefer concrete lists/checklists over vague prose.
- FAQ answers must stand alone without the question repeated as fluff.
- Avoid thin pages: mock/API posts should be substantive enough to cite.

## Anti-patterns

- Duplicate titles across posts
- Empty `alt` on meaningful cover images
- Keyword lists in visible UI
- Multiple competing H1s
- Relative URLs in `og:image` / JSON-LD `image`
- `noindex` on public blog posts (only 404 / private app routes)

## Quality gate

After SEO changes: `npm run typecheck && npm run lint && npm run test && npm run build`.
Add/update unit tests for URL builders and JSON-LD shape helpers.
