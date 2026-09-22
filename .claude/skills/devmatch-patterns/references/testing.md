# Testing — DevMatch Frontend

**Not implemented yet.** No test runner or testing library is installed in this repo today — this file documents the plan for when it is, so the first tests land consistently instead of everyone picking their own stack. Update this file the moment real tooling/config exists, and remove this notice.

## Planned stack

- **Vitest** — matches the Vite/Nuxt toolchain already in use, no separate config to maintain.
- **`@nuxt/test-utils`** for anything that needs Nuxt's runtime context (auto-imported composables/components, `useFetch`, routing) — `mountSuspended`/`renderSuspended`, not a bare `@vue/test-utils` `mount`, so components don't silently lose the context they rely on in the app.
- **`@testing-library/vue`** on top of that for querying — by role/label text, not by class name or component internals, so tests keep working through markup refactors.

## The rule to carry over: never mount without the Nuxt context

Every component here relies on Nuxt auto-imports (composables, `<NuxtLink>`, `<NuxtImg>`, other components) and, for most of them, on the URL query via `useProfessionalFilters` or a `useFetch` call. A bare `@vue/test-utils` `mount()` won't resolve any of that. Always go through `@nuxt/test-utils`'s suspended helpers.

## Mocking the data layer

There's no global query-client mock to reach for (no React Query here) — the natural mocking boundary is the **composable**, not `fetch` itself:

- Component tests: mock `useProfessionals`/`useProfessionalDetail`/`useProfessionalFilters` to return canned state (loading / error / empty / populated) rather than hitting a real API route.
- Composable tests: mock `$fetch`/`useFetch` itself and assert the composable's own logic — in particular the two behaviors that were bug fixes, not just happy paths:
  - `useProfessionals`: a stale "load more" response (superseded by a filter change) must not land in the list — assert the abort actually happens.
  - `useProfessionalDetail`: a 404 and a non-404 failure must produce different `createError` results (`statusCode` 404 vs 500), not the same generic "not found".

## What to cover

- **Composables** (`app/composables/`) — the three above; `useProfessionalFilters`'s query parsing/writing (`update`, `clear`, `activeCount`) is pure enough to test without mounting anything.
- **SQL query builder** (`server/utils/professionalQuery.ts`) — `buildWhere`/`orderFor` given a set of filters, and `escapeLike` specifically: a search term containing `%`, `_` or `\` must not behave as a SQL wildcard (this is a security property, not just a happy-path check).
- **Data generator** (`server/data/professionals.ts`) — `generateProfessionals()` must be deterministic (same output on every run, since the seed script and any test relying on catalog size depend on that); `buildDetail()` happy path.
- **Components** — the loading/error/empty/success `v-if` chains (`HomeResultsGrid.vue` is the one with all four states in one place), form interaction (the hero search, the filter selects), and the mobile filter sheet's dialog behavior (`role="dialog"`, `aria-modal`, Escape to close).
- **API routes** (`server/api/professionals/`) — status codes and shape for the found/not-found/paginated cases.

## Accessibility

There's no design-system package here to blanket-cover the way Zenity covers `@zenity-ui`. Add an `axe-core`-based check (e.g. via `vitest-axe`) for a component only when it introduces real accessible surface of its own: a form with inputs/labels (search bar, filter selects), a modal/dialog triggered by an action (`ProfessionalFiltersSheet`), a page shell with landmarks/heading hierarchy. Skip it for a component that only composes other already-covered pieces without adding structural HTML of its own.

## Running

Run only the spec(s) for what you're working on (`npx vitest run <path>`) — not the full suite, unless asked.

## Hygiene

No `console.log` left in a spec file. There's no pre-commit hook enforcing this yet (see `git-workflow.md`) — it's a manual check on the diff, same as everywhere else in this repo.
