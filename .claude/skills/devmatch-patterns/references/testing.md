# Testing — DevMatch Frontend

The toolkit is installed and configured (`vitest.config.ts`).

## Coverage: components have a hard floor of 90%

**Every component under `app/components/` must keep statements, branches, functions and lines at or above 90%.** This is enforced, not aspirational: `vitest.config.ts` sets `coverage.thresholds` to 90 across all four metrics with `perFile: true`, scoped to `app/components/**/*.vue`, so `npm run test:coverage` fails the run when *any single component* drops below it — a well-covered component can't carry a neglected one.

What this means in practice:

- A new component ships with its test file in the same change — not "later".
- Every `v-if`/`v-else-if`/`v-else` branch, every `v-for` empty-vs-populated case, and every emitted event needs to be exercised, since branches are part of the threshold.
- If a branch is genuinely unreachable in a test (a defensive fallback, say), prefer deleting the dead branch over writing a contrived test for it — see `code-patterns.md` on not keeping unused code around.

Non-component code (composables, `server/`) isn't under the threshold, but the "what to cover" list below still applies to it.

## Stack

- **Vitest** (`npm run test` / `npm run test:watch`) — matches the Vite/Nuxt toolchain already in use.
- **`@nuxt/test-utils`** for anything that needs Nuxt's runtime context (auto-imported composables/components, `useFetch`, routing) — `mountSuspended`/`renderSuspended` from `@nuxt/test-utils/runtime`, not a bare `@vue/test-utils` `mount`, so components don't silently lose the context they rely on in the app.
- **`@testing-library/vue`** on top of that for querying (`screen`, `getByRole`, `getByLabelText`, ...) — by role/label text, not by class name or component internals, so tests keep working through markup refactors.

## Environment: per-file, not global

`vitest.config.ts` defaults to `environment: 'node'` (fast, no DOM) — that's right for pure logic (`professionalQuery.test.ts` doesn't need a DOM at all). A file that needs Nuxt's context (auto-imports, `<NuxtImg>`, `<NuxtLink>`, composables) opts in with a pragma as its **first line**:

```ts
// @vitest-environment nuxt
```

See `ProfessionalAvatar.test.ts` for the shape: the pragma, then `renderSuspended(Component, { props })` from `@nuxt/test-utils/runtime`, then querying with `screen` from `@testing-library/vue`. There's no `@testing-library/jest-dom` installed, so assert with plain Vitest matchers (`toBeTruthy()`, `toBe(...)`) rather than `toBeInTheDocument()` — Testing Library's `getBy*` queries already throw if nothing matches, so a query call itself is most of the assertion.

## The rule to carry over: never mount without the Nuxt context

Every component here relies on Nuxt auto-imports (composables, `<NuxtLink>`, `<NuxtImg>`, other components) and, for most of them, on the URL query via `useProfessionalFilters` or a `useFetch` call. A bare `@vue/test-utils` `mount()` won't resolve any of that. Always go through `@nuxt/test-utils`'s suspended helpers.

## Fixtures

Test data lives in `test/fixtures.ts` (`makeProfessional`, `makeProfessionalDetail`), imported as `~~/test/fixtures`. Both take an overrides object, so a test states only the field it actually cares about (`makeProfessional({ years: 1 })`) instead of restating a whole professional.

## Mocking a composable

Use `mockNuxtImport` with `vi.hoisted` for the shared spies/state, and **return real `computed`/`ref` values from the factory** — a plain `{ value }` object is not a ref, so Vue won't unwrap it in the template and `filters.spec` silently reads `undefined`:

```ts
const mocks = vi.hoisted(() => ({ filters: {}, update: vi.fn(), clear: vi.fn() }))

mockNuxtImport('useProfessionalFilters', () => () => ({
  filters: computed(() => mocks.filters),
  activeCount: computed(() => 0),
  update: mocks.update,
  clear: mocks.clear
}))
```

If a test needs the mocked value to change *after* mount (to exercise a `watch`), build the reactive source inside the factory and expose a setter on `mocks` — see `Hero.test.ts`, which uses that to prove the search input re-syncs when the query is cleared elsewhere.

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

## File naming

Colocated next to the source file, `<Name>.test.ts` (or `.test.ts` next to a `.vue` file for a component test) — not a separate `__tests__`/`test/` folder.

## Running

Run only the file(s) for what you're working on (`npx vitest run <path>`) — not the full suite (`npm run test`), unless asked. `npm run test:coverage` runs everything and enforces the 90% component floor; run it before committing a change that touches a component.

## Hygiene

No `console.log` left in a test file. There's no pre-commit hook enforcing this yet (see `git-workflow.md`) — it's a manual check on the diff, same as everywhere else in this repo.
