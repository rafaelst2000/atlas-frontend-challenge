# CLAUDE.md

Guidance for Claude Code when working in this repository. This file is the source of truth: where it and a skill disagree, this file wins.

## Project

**DevMatch** — solution to the Atlas Technologies front-end challenge (brief: `docs/challenge.md`, pt-BR). A catalog of 524 tech professionals with search, filters, sorting, on-demand loading and a profile page. Stack: Nuxt 4, Vue 3, TypeScript, Tailwind v4, Neon Postgres + Drizzle, deployed on Vercel.

The brief explicitly weights **performance / Core Web Vitals**, **code organization** and **clarity of technical decisions**, and asks that decisions be documented in the README — favour those when judging a tradeoff. UI copy is pt-BR; code identifiers, docs and commits are English.

## Commands

```bash
npm install            # postinstall runs `nuxt prepare`
npm run dev            # dev server
npm run build          # production build
npm run preview        # serve the build
npx nuxi typecheck     # types (TS pinned to 5.x — vue-tsc doesn't support TS 7)

npm run test           # Vitest
npm run test:coverage  # + coverage; fails below 90% on any single component

npm run db:push        # sync the Drizzle schema to Neon
npm run db:seed        # truncate + reseed the 524 professionals
```

No lint or formatter is configured — typecheck, tests and build are the automated checks.

## Skills and commands

| Load | For |
| --- | --- |
| `devmatch-patterns` skill | Structure, composables, data layer, naming, comments, git workflow, testing. Applies to any code change; its `references/` split the topics. |
| `nuxt-seo-performance` skill | Any route, component, image, font, data fetch or third-party script — SEO and Core Web Vitals. |
| `dark-luxury-design` skill | Building new UI. `DESIGN.md` and `app/assets/css/main.css` win over it wherever they differ. |
| `/check` | The verification gate: typecheck → tests + coverage → build → review the diff against the SEO/performance checklist. |
| `/a11y` | WCAG 2.2 AA audit of `app/`, applying fixes; `--report` to only report. |
| `/generate-frontend-doc`, `/generate-claude-doc` | Write a doc into `docs/frontend/` or `docs/claude/`. |

## Structure

Nuxt 4 app-dir: `app/` (pages, components grouped by domain folder, composables, layouts), `server/` (Nitro API + Drizzle data layer), `shared/` (isomorphic types via `#shared/*`), `test/` (mirrors the tree it covers; nothing here ships). Details in `devmatch-patterns` → `code-patterns.md`.

`.env` holds `DATABASE_URL` (pooled, runtime) and `DATABASE_URL_UNPOOLED` (drizzle-kit and seed). It is git-ignored — never commit or print credentials.

## Conventions

- **Conventional Commits** for every commit message.
- **Never `git push` without explicit confirmation for that specific push**, even right after a requested commit.
- `main` is the only branch, tracking `origin` (`rafaelst2000/atlas-frontend-challenge`).
