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

## Formatting (no formatter enforces this — match it by hand)

No Prettier/ESLint config exists in this repo, so nothing runs on save or on commit. The style already used consistently across the codebase, to match: single quotes, **no semicolons**, 2-space indent, no trailing comma. Don't introduce double quotes or semicolons into a `.vue`/`.ts` file because an editor's default formatter did it — check the surrounding file's existing style and match it.

## TypeScript

- Strict mode comes from Nuxt's generated config (not overridden) — keep new code fully typed, don't introduce a new `any`.
- Shared types and constants that both a page and an API route need to agree on live in `shared/professional.ts`, imported via `#shared/professional` — never redeclared locally.
- Props use the generic `defineProps<{...}>()` / `defineEmits<{...}>()` syntax, not the runtime validator object form.
- Composables return a typed object (each field's type inferred from `ref`/`computed`), never `any`.

## Hygiene

- No `console.log`/`debugger` left in `app/` or `server/` code — there's no pre-commit hook to catch it, so check the diff yourself. `scripts/seed.ts`'s `console.log` is fine: it's a CLI tool reporting to a human running it, not app code.
- Code identifiers (variables, functions, files, commit messages) are in **English**. UI copy and content shown to the user are in **Portuguese** (`pt-BR`) — don't mix the two up in either direction.

## Imports

- `#shared/professional` from anything under `app/` or `server/api|utils/`. Files under `server/data/` import it with a **relative path** instead (`../../shared/professional`) on purpose: `server/data/professionals.ts` is also imported directly by `scripts/seed.ts`, a plain `tsx`-run Node script that never goes through Nuxt's build, so the `#shared` alias wouldn't resolve there.
- Composables and components under `app/` are Nuxt-auto-imported — don't write an `import` statement for `useProfessionalFilters`, `<ProfessionalCard>`, etc.
- No import-order tool is configured; group type-only imports with the value imports they come from (`import type { X } from '...'` right next to `import { Y } from '...'` of the same module) rather than enforcing a strict alphabetical or external-before-internal order.

## Tooling

No lint or formatter is configured in this repo yet — `npx nuxi typecheck` (run via the `/check` command alongside `npm run build`) and `npm run test` (Vitest — see `testing.md`) are the only automated checks. Don't assume ESLint/Prettier rules are being enforced — style consistency here is manual, per this file. If lint/format tooling is added later, update this file to describe what it actually enforces instead of duplicating rules the tool would catch automatically.
