# Code patterns — DevMatch Frontend

For **any code change**. The root `CLAUDE.md` rules; this is the portable summary.

## One structure, not two

DevMatch has no legacy code to route around — Nuxt 4's app-dir convention is the only structure:

- **`app/`** — `pages/` (file-based routing), `components/` (grouped by domain folder), `composables/`, `layouts/`, `assets/css/main.css` (Tailwind theme + component classes), `router.options.ts`, `error.vue`.
- **`server/`** — Nitro. `api/` (route handlers), `data/` (the deterministic professional generator + detail-content builder), `db/` (Drizzle schema), `utils/` (`db.ts` client, `professionalQuery.ts` SQL filter/sort builder).
- **`shared/`** — isomorphic types and constants (`professional.ts`), imported from both sides via `#shared/professional`. Anything a page and an API route both need to agree on (a `Specialty`, a filter shape, `formatPrice`) belongs here, not duplicated.
- **`test/`** — every test, mirroring the tree it covers, plus `fixtures.ts`. Nothing here ships; see `testing.md`.

## Composables, not a service layer

API access goes through thin `use*` composables in `app/composables/`, one per concern:

- `useProfessionalFilters()` — reads/writes the URL query, the single source of truth for search/filters/sort.
- `useProfessionals()` — the list `useFetch` + "load more" pagination, exposing `professionals`, `hasMore`, `loadingMore`, `hasError`, etc.
- `useProfessionalDetail(id)` — the single-professional `useFetch`, throwing a real `createError` (404 vs 500) instead of returning `null` silently.

This project intentionally does **not** have a class-based "service" layer or an `endpoints.ts` catalog: there are only two API routes (`/api/professionals`, `/api/professionals/:id`), so a composable per resource is the whole abstraction needed. Don't add a heavier layer unless the number of endpoints actually grows enough to justify it.

When a composable wraps `useFetch`, surface `error` (and a `refresh`/retry) instead of letting a failed fetch look like "no results" — `HomeResultsGrid.vue`'s error state is the pattern to copy. When a request can be superseded by a newer one (pagination, search-as-you-type), guard against the stale response landing late — `useProfessionals.ts`'s `AbortController` on filter change is the reference implementation.

## Data layer

Neon Postgres via Drizzle ORM, `neon-http` driver (stateless HTTP, no pool to exhaust — required for Vercel serverless functions). `server/utils/db.ts` exposes a lazily-created singleton `useDb()`.

- Filtering, sorting, search and pagination are done **in SQL** (`server/utils/professionalQuery.ts`), never by fetching everything and filtering in JS. Search uses the `unaccent` Postgres extension plus manual `ILIKE` pattern escaping (`escapeLike`) — never interpolate user input into a `sql` template unescaped.
- Sort options are a lookup table (`ORDER: Record<SortValue, SQL[]>`) with `asc(id)` as a tiebreaker, not an if/else chain.
- `.env` holds `DATABASE_URL` (pooled, runtime) and `DATABASE_URL_UNPOOLED` (drizzle-kit / seed script); it's git-ignored — verify with `git check-ignore -v .env` before any DB-related commit, and never print or paste a real connection string into a commit, log, or doc.

## URL as state

Filters, search text and sort live in the route query, not component state or a store (`useProfessionalFilters`). This makes results shareable, crawlable, and restored correctly on back/forward navigation. Any new filter/sort control should read and write through this composable, not local component state.

## Components

Grouped by domain folder under `app/components/`: `professional/`, `home/`, `layout/`. Nuxt derives the tag name from the path and de-duplicates a redundant prefix:

- `components/professional/ProfessionalCard.vue` → `<ProfessionalCard>` (filename already starts with the folder's word)
- `components/professional/ProfileHero.vue` → `<ProfessionalProfileHero>` (folder name prepended)
- `components/home/Hero.vue` → `<HomeHero>`

Keep this in mind when naming a new file — starting the filename with the folder's word avoids a stuttering tag.

Pages stay thin orchestrators: fetch + SEO meta in `<script setup>`, composition of section components in the template (see `app/pages/index.vue` and `app/pages/professionals/[id].vue` — `HomeHero`/`HomeResultsGrid`, `ProfessionalProfileHero`/`ProfessionalProfileContent`/`ProfessionalProfileSidebar`). Only extract a section into its own component when it has real visual/logical identity — don't fragment a page that's only ever rendered once into pieces nothing else reuses.

Loading / error / empty / success states are plain `v-if`/`v-else-if`/`v-else` chains in the component that owns them (see `HomeResultsGrid.vue`) — there's no `Conditional`-style helper here, and at this scale one isn't needed.

**Lazy hydration needs the `Lazy` prefix.** `<Foo hydrate-on-visible />` does *nothing* — Nuxt only applies a hydration strategy to `<LazyFoo hydrate-on-visible />`. This shipped broken once (the profile page's portfolio/reviews block was eagerly hydrated for weeks while the README claimed otherwise); the build does warn (`NUXT_B3006`), so read build output instead of grepping it for "error".

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` — there's no `tailwind.config`; every token lives in the single `@theme` block of `app/assets/css/main.css`, alongside the reusable component classes (`.btn`, `.card`, `.section-label`, ...) and the required grain texture.

- Prefer a token utility (`bg-card`, `text-primary`, `rounded-card`, `shadow-glow`, `text-label`, `tracking-tight`, `leading-relaxed`, ...) over a hardcoded value.
- Prefer Tailwind v4's dynamic spacing-scale numbers over an arbitrary pixel value when they're an exact match (`max-w-[1200px]` → `max-w-300`, `gap-[7px]` → `gap-1.75`) — arbitrary values are for cases that genuinely have no canonical equivalent (odd font sizes, `vw`/`vh` units, `calc()`/`env()`, compound `flex-[...]` bases, one-off colors).
- Visual rules (color palette, button/card anatomy, headline color-contrast, icons, motion) are in `DESIGN.md` and the `dark-luxury-design` skill — read those, don't re-derive them here.
- Don't leave unused theme tokens or component classes behind when a UI piece is removed — check with a quick grep before assuming something is still wired up.

## Routing

Plain Nuxt file-based routing under `app/pages/` — no route registry, no permission gating (the catalog is public). A dynamic segment is a bracketed filename (`professionals/[id].vue`). Renaming a route means renaming the file/folder and updating every hardcoded link, the sitemap source (`server/api/__sitemap__/urls.ts`), and any `routeRules` entry in `nuxt.config.ts` — grep for the old path string to catch all of them.

## i18n

There isn't one. All UI copy is hardcoded Portuguese directly in templates; the product is single-locale (`pt-BR`, set via `<html lang="pt-BR">` and `site.defaultLocale`). Don't introduce a translation layer for a one-locale challenge submission.

## Aliases

Nuxt's own conventions already cover what's needed: `#shared/*` (the `shared/` directory), `~/` (`app/`), `#app`. There's no separate `vite.config.ts` to keep in sync — Tailwind is the only custom Vite plugin, wired directly in `nuxt.config.ts`. Only touch `nuxt.config.ts`'s `alias` if something outside these conventions is genuinely needed.
