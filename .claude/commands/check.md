---
description: The standard verification gate — typecheck, lint, tests with the coverage floor, build, then review the diff against the SEO/performance checklist.
---

Run these in order, fixing what fails before moving on. Report at the end; **do not commit**.

1. **Typecheck** — `npx nuxi typecheck`. It must be clean. (The `nuxt-site-config` localhost warning is expected noise, not a failure.)
2. **Lint** — `npm run lint`. Must be clean; try `npm run lint:fix` first for anything mechanical (formatting, `nuxt.config.ts` key order) before fixing the rest by hand.
3. **Tests** — `npm run test:coverage`. All tests must pass *and* every component must stay at or above the 90% per-file floor; a threshold failure is a real failure, not a warning.
4. **Build** — `npm run build`. It must succeed. Read the output rather than skimming for the word "error": Nuxt reports some real defects as warnings, e.g. `NUXT_B3006` (a component with `hydrate-on-*` props but no `Lazy` prefix — the hydration strategy is being silently ignored).
5. **Review** — load the `nuxt-seo-performance` skill and review `git diff` against its checklist: SEO meta and canonical, JSON-LD, lazy hydration, CLS reservations, `routeRules` caching, accessible names.
6. **Report** — what passed, what you fixed, and what still needs a human (Lighthouse numbers, contrast, anything only visible in a browser).

For an accessibility-focused pass, use `/a11y` instead — it goes deeper than step 4's single checklist line.
