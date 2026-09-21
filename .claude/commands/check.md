---
description: Typecheck and build the project, then review the diff against the SEO/performance checklist
---

1. Run `npx nuxi typecheck` (install `vue-tsc` and `typescript` first if missing) and fix errors.
2. Run `npm run build` and confirm it succeeds; note any warnings about bundle size or hydration.
3. Load the `nuxt-seo-performance` skill and review `git diff` against its checklist (SEO meta, JSON-LD, lazy hydration, CLS reservations, caching in `routeRules`).
4. Report what passed, what was fixed, and what still needs attention. Do not commit.
