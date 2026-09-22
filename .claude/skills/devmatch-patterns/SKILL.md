---
name: devmatch-patterns
description: Foundational rules for the DevMatch frontend (Nuxt 4 + Vue 3 + TypeScript, Neon Postgres + Drizzle, deployed on Vercel). Load before writing or reviewing code, creating a commit, or planning a test. Covers code conventions (app/ + server/ + shared/ layout, composables over a service layer, filters-as-URL-state, the Neon/Drizzle data layer with SQL-side filtering and escaping, Tailwind v4 tokens and canonical classes), naming/comments/TypeScript style, git workflow (Conventional Commits, always confirm before push), and the (not-yet-implemented) testing plan. For SEO/Core Web Vitals rules use the nuxt-seo-performance skill; for visual design rules use the dark-luxury-design skill — this skill does not duplicate either.
user-invokable: false
---

# Development patterns — DevMatch Frontend

Rules that apply to the whole project (Nuxt 4 + Vue 3 + TypeScript). Packaged as a **skill** so they load on demand whenever you touch the code — not only inside a specific command.

**`CLAUDE.md`** at the repo root is the **source of truth** and **refines/overrides** what's here. When this skill and `CLAUDE.md` disagree, **`CLAUDE.md` wins**. The references below are a navigable summary of decisions already made in this project — read the one relevant to your change, they're short.

## Rule sets

- **`.claude/skills/devmatch-patterns/references/code-patterns.md`** — the `app/` + `server/` + `shared/` layout, component organization by domain folder, composables instead of a service layer, filters living in the URL query, the Neon/Drizzle data layer with SQL-side filtering, Tailwind v4 tokens vs. arbitrary values. **Read on any code change.**
- **`.claude/skills/devmatch-patterns/references/code-style.md`** — naming (no single/double-letter props, state, `v-for` iterators or computed), comments policy (why, not what), TypeScript conventions. Read when writing or reviewing code.
- **`.claude/skills/devmatch-patterns/references/git-workflow.md`** — Conventional Commits format, branch/push rules, the verification steps a commit needs first.
- **`.claude/skills/devmatch-patterns/references/testing.md`** — not implemented yet; the planned stack and conventions for when tests are added. Read before writing the first test, so it doesn't diverge from the plan.

Secrets/SQL-escaping and deployment specifics didn't get their own reference files — they're small enough that `code-patterns.md` (data layer) and `CLAUDE.md` (env vars, `.env` handling) already cover them without needing a separate doc.

## Project specifics

`CLAUDE.md` refines/overrides everything above (exact structure, scripts, current dependencies). When it disagrees with a rule here, **`CLAUDE.md` wins**.
