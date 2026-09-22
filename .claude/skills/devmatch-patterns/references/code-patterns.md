# Code patterns — DevMatch Frontend

For **any code change**. The root `CLAUDE.md` rules; this is the portable summary.

## One structure, not two

DevMatch has no legacy code to route around — Nuxt 4's app-dir convention is the only structure:

- **`app/`** — `pages/` (file-based routing), `components/` (grouped by domain folder), `composables/`, `layouts/`, `assets/css/main.css` (Tailwind theme + component classes), `router.options.ts`, `error.vue`.
- **`server/`** — Nitro, runtime code only. `api/` (route handlers), `db/` (Drizzle schema), `utils/` (`db.ts` client, `professionalQuery.ts` SQL filter/sort builder). The deterministic professional generator (`generate-professionals.ts`) lives in `scripts/`, not here — nothing under `server/` imports it, since its whole output is seeded into Neon once, not computed at request time.
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
- **Everything a professional's profile shows is a real column, generated once at seed time — never synthesized at request time or hardcoded in a component.** `scripts/generate-professionals.ts`'s generator produces the full `ProfessionalDetail` row (about, services, projects with a per-project image, reviews, availability, working hours, contract type, languages) using the same seeded PRNG as the rest of the dataset; `npm run db:seed` persists it. `GET /api/professionals/:id` is a plain `SELECT`, not a helper computing content on the fly. `GET /api/professionals` (the list) explicitly selects only card-level columns — don't let it fall back to `select()` (all columns), or every paginated row drags its profile content along for nothing.
- If a field genuinely can't come from the database (a button label, a platform-wide trust/policy blurb, a decorative placeholder with no underlying data), it's fine as static markup — the rule is about data that's presented as if it's specific to a professional, not all UI copy.

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

**A `routeRules` key ending in `/**` covers everything *nested under* that path, not the bare path itself — on Vercel specifically, it compiles to a regex that requires a trailing slash.** `'/api/professionals/**'` alone 404'd the bare `/api/professionals` list endpoint in production (`/api/professionals/1` worked fine) while every local `node-server` build looked correct, because Vercel translates `swr`/ISR route rules into its own rewrite regexes at build time and `node-server` doesn't reproduce that layer at all. A route needs its own explicit entry for the bare path if callers hit it directly, in addition to the `/**` one for anything nested.

**Never give `swr` to a route whose response varies by *query string*, only to one that varies by *path segment*.** `swr` compiles to Vercel's native ISR on that preset, and ISR caches by path alone — it does not vary by query string at all. `'/'` (reads `?spec=`/`?q=`/... for shareable filtered links) and the bare `/api/professionals` (reads `?page=`/`?spec=`/...) both got `swr` at first, which silently collapsed every query variant onto whichever response was cached first: confirmed live, `/` and `/?spec=QA` served byte-identical HTML, and 50 different `?page=N` requests returned only 12 distinct professionals total — "Carregar mais" just kept re-appending the same frozen page. Both were fixed by dropping `swr` and setting an equivalent `Cache-Control` header directly instead (ordinary CDN edge caching, which *does* key on the full URL including the query string). `/professionals/**` and `/api/professionals/**` keep `swr` safely, since their only variance is the `:id` path segment.

**Prefer a plain sibling file (`server/api/professionals.get.ts`) over `index.get.ts` when a dynamic sibling route shares its parent folder.** `server/api/professionals/index.get.ts` next to `server/api/professionals/[id].get.ts` bundled to a wrongly-named chunk (`api/index.get.mjs`, missing the `professionals` segment) under `NITRO_PRESET=vercel`. This turned out to be cosmetic — Nitro's h3 router still resolved it correctly, and renaming the file alone did *not* fix the real production 404 — but the resulting `api/professionals.get.mjs` chunk name is clearer regardless, so keep the convention.

**The actual cause of the bare `/api/professionals` 404: giving `swr` to `/api/professionals/**` generates a physical, nested ISR function directory (`.vercel/output/functions/api/professionals/[...]-isr.func`) that collides with the bare path at Vercel's `handle: filesystem` routing step.** Nitro's Vercel preset bundles all runtime handlers into one `__fallback.func`, reached only via the catch-all rewrite at the *end* of `config.json`'s `routes` array (after `handle: filesystem`). A `routeRules` entry with `swr`/`isr` on a nested path (`/api/professionals/**`) makes Nitro emit a separate physical ISR function *at that literal nested path* (`functions/api/professionals/[...]-isr.func`) so Vercel can serve it without invoking the fallback. The mere existence of that `functions/api/professionals/` directory makes Vercel's filesystem-matching step treat `api/professionals` as occupied, so a request for the exact bare path never reaches the catch-all `/(.*) → /__fallback` rule — it 404s before headers-only route rules or the fallback function ever run. This is invisible from `config.json`'s `routes` array alone (the bare-path headers rule looks perfectly fine there); it only shows up by listing `.vercel/output/functions/**` and noticing the nested directory. Fix: don't give `swr`/`isr` to any nested route (`X/**`) that shares a path prefix with a bare route (`X`) also served at runtime — use a plain `Cache-Control` header instead (safe here since `/api/professionals/:id` only varies by the `:id` path segment, never by query string).

**Verify any `routeRules` or route-file-structure change against the deployed preset, before *and* after the fix** — not just before shipping it: `rm -rf .output .nuxt .vercel && NITRO_PRESET=vercel npm run build`, then inspect **both** `.vercel/output/config.json`'s `routes` array **and** `find .vercel/output/functions -maxdepth 3` for a nested function/ISR directory whose path prefix collides with a bare sibling route — the routes array alone won't show this class of bug. Plain `npm run build` uses Nitro's `node-server` preset, which never generates this layer at all; it will build and serve every route correctly locally while the real Vercel deployment 404s or silently caches the wrong response. Every bug in this saga was only caught by testing the live `https://…vercel.app` URL directly, and more than one fix attempt *introduced* a new regression instead of resolving it — re-check after fixing, not just before. `.vercel/` is git-ignored and disposable — regenerate it whenever this needs re-checking.

## i18n

There isn't one. All UI copy is hardcoded Portuguese directly in templates; the product is single-locale (`pt-BR`, set via `<html lang="pt-BR">` and `site.defaultLocale`). Don't introduce a translation layer for a one-locale challenge submission.

## Aliases

Nuxt's own conventions already cover what's needed: `#shared/*` (the `shared/` directory), `~/` (`app/`), `#app`. There's no separate `vite.config.ts` to keep in sync — Tailwind is the only custom Vite plugin, wired directly in `nuxt.config.ts`. Only touch `nuxt.config.ts`'s `alias` if something outside these conventions is genuinely needed.
