# Code style — DevMatch Frontend

Read when writing or reviewing code.

## Naming

Props, state, `v-for` iterators and computed values must be intention-revealing — no single- or double-letter identifiers, even for loop variables. This was a deliberate cleanup pass; use it as the calibration:

- `v-for="p in items"` → `v-for="professional in professionals"`; `o`/`s`/`t`/`r`/`pr` → `option`/`suggestion`/`tech`/`review`/`project`; a bare index `n`/`i` → `index`.
- Generic fetch state `data`/`status` (from `useFetch`) → named for what they hold: `professionalsPage`/`fetchStatus`.
- A local accumulator named after its type (`out: Record<string, string>`) → named for its role (`parsedFilters`).
- A boolean read from an API (`reduce`) → named for what it asserts (`prefersReducedMotion`).

The bar: someone reading the line in isolation, without scrolling up for context, should know what the value represents.

## Comments

Default to none. Only add a comment when it explains a non-obvious **why** — a security rationale, a workaround for a specific constraint, a performance tradeoff, a decision that would otherwise look arbitrary. Never restate what the next line already says.

Kept (explains why, not visible from the code alone):
```ts
// Neon's HTTP driver is stateless: ideal for serverless functions (no connection pool to exhaust)
return drizzle(neon(url), { schema })
```
Removed (just restates the line under it):
```ts
// If the photo fails to load, fall back to the initials avatar
const failed = ref(false)
```

If you can delete a comment and a future reader would still understand the code the same way, delete it.

## Formatting (enforced by ESLint — run `npm run lint`/`lint:fix`, don't hand-roll it)

`@nuxt/eslint` with `stylistic: true` (see `nuxt.config.ts`'s `eslint` key) enforces the style, generated from the project's own structure: single quotes, no semicolons, 2-space indent, **trailing commas in multiline literals**. Run `npm run lint:fix` instead of matching it by hand — it also sorts `nuxt.config.ts`'s top-level keys into the order the `nuxt/nuxt-config-keys-order` rule expects.

## TypeScript

- Strict mode comes from Nuxt's generated config (not overridden) — keep new code fully typed, don't introduce a new `any`.
- Isomorphic runtime values (`SPECIALTIES`, `SORT_OPTIONS`, `formatPrice`, ...) and the types derived from them (`Specialty`, `SortValue`) live in `shared/professional.ts`, imported via `#shared/professional`. Pure `interface`/`type` declarations with no backing value (`Professional`, `ProfessionalDetail`, `ProfessionalFilters`, ...) live in `types/professional.ts`, imported via `#types/professional`. Never redeclare either locally.
- Props use the generic `defineProps<{...}>()` / `defineEmits<{...}>()` syntax, not the runtime validator object form.
- Composables return a typed object (each field's type inferred from `ref`/`computed`), never `any`.

## Hygiene

- No `console.log`/`debugger` left in `app/` or `server/` code — ESLint doesn't flag either, so check the diff yourself. `scripts/seed.ts`'s `console.log` is fine: it's a CLI tool reporting to a human running it, not app code.
- Code identifiers (variables, functions, files, commit messages) are in **English**. UI copy and content shown to the user are in **Portuguese** (`pt-BR`) — don't mix the two up in either direction.

## Imports

- `#shared/professional` and `#types/professional` from anything under `app/` or `server/api|utils/`. Files a plain `tsx` script also loads directly — `server/db/schema.ts` and everything under `scripts/` (the data generator, `seed.ts`) — import both with a **relative path** instead on purpose (`../types/professional`, not `#types/professional`): `tsx` never goes through Nuxt's build, so neither alias would resolve there.
- Composables and components under `app/` are Nuxt-auto-imported — don't write an `import` statement for `useProfessionalFilters`, `<ProfessionalCard>`, etc.
- No import-order tool is configured; group type-only imports with the value imports they come from (`import type { X } from '...'` right next to `import { Y } from '...'` of the same module) rather than enforcing a strict alphabetical or external-before-internal order.

## Tooling

`npx nuxi typecheck`, `npm run lint`, `npm run test` (Vitest — see `testing.md`) and `npm run build` are the automated checks (also run via the `/check` command, and in CI on every push/PR to `main`). If a lint rule ever needs overriding for a real reason, do it in `eslint.config.mjs` with a comment explaining why, not by disabling it inline.
