# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Solution to the Atlas Technologies front-end challenge (full brief in `docs/challenge.md`, written in Portuguese): a **professionals catalog** built with **Vue 3, Nuxt 4 and TypeScript**. The product name is **DevMatch**; the UI follows the design in the claude.ai/design project `f522fe50-67c2-44da-8b80-10407cbce318` (`DevMatch.dc.html`).

Requirements from the brief that should drive design decisions:
- Home page listing **at least 500 professionals** (local JSON or API) with photo, name, profession and service price.
- Search by name/profession, filtering, sorting, and on-demand loading (pagination or infinite scroll).
- Professional detail view (dedicated page, modal or drawer) with photo, name, profession, description and price; rating/location optional.
- Mobile-first, responsive; performance and Core Web Vitals are explicitly weighted, and related decisions should be documented in the README.
- The delivery README must explain how to run the project (install, run, tests/lint/build), technical decisions, and which AI tools were used.

## Commands

```bash
npm install        # also runs `nuxt prepare` via postinstall
npm run dev        # dev server (Nuxt devtools enabled)
npm run build      # production build
npm run generate   # static generation
npm run preview    # preview the production build
```

Typecheck with `npx nuxi typecheck` (TypeScript is pinned to 5.x because `vue-tsc` does not work with TS 7). No test or lint tooling is configured yet. The `/check` command runs typecheck, build and the SEO/performance review.

## Structure

Nuxt 4 layout: application source lives under `app/` (not the repo root), and static assets under `public/`. Config is in `nuxt.config.ts`.

- `shared/professional.ts`: types plus filter/sort option constants, imported by both sides via `#shared/professional`.
- Data lives in Neon Postgres via Drizzle (`server/db/schema.ts`, client in `server/utils/db.ts` using the HTTP driver for serverless). `.env` holds `DATABASE_URL` (pooled, runtime) and `DATABASE_URL_UNPOOLED` (drizzle-kit and seed); it is git-ignored, never commit or print credentials. `npm run db:push` syncs the schema and `npm run db:seed` reseeds (truncates) the table from `server/data/professionals.ts`, a deterministic generator (524 professionals, the 12 from the design first) that also builds each profile's detail content.
- `server/api/professionals/` exposes the list (search, filters, sort and pagination done in SQL by `server/utils/professionalQuery.ts`, search uses the `unaccent` extension) and the detail; `server/api/__sitemap__/urls.ts` feeds the sitemap.
- Filters live in the URL query (`app/composables/useProfessionalFilters.ts`). Data fetching is composables, not a service layer: `useProfessionals` (list + "load more" pagination) backs the home page (`app/pages/index.vue`), `useProfessionalDetail` backs the profile page (`app/pages/professionals/[id].vue`).
- SEO/performance is a first-class requirement: follow the `nuxt-seo-performance` skill (`.claude/skills/nuxt-seo-performance/SKILL.md`) for every route, component and asset.
- General code conventions (structure, naming, comments, git workflow, the testing plan) are in the `devmatch-patterns` skill (`.claude/skills/devmatch-patterns/SKILL.md`) — this file refines/overrides it wherever the two disagree.

## Styling / design system

Tailwind CSS v4 is wired through the `@tailwindcss/vite` plugin in `nuxt.config.ts` (no `tailwind.config`). All design tokens live in the `@theme` block of `app/assets/css/main.css`, which also holds the reusable component classes (`.btn`, `.btn-primary`, `.card`, `.section-label`, `.hero-orb`, ...) and the required body grain texture. Fonts (Inter, JetBrains Mono) are self-hosted by `@nuxt/fonts` (declared in `nuxt.config.ts`); do not add a Google Fonts `<link>`.

The "Dark Luxury" design rules are in `DESIGN.md` (root) and `.claude/skills/dark-luxury-design/SKILL.md`; follow them when building UI (no filled amber buttons, cards without borders, `[Label]` section labels, color-contrast headlines, SVG icons only, no emojis). Prefer the token utilities (`bg-card`, `text-primary`, `text-body`, `font-mono`, ...) over hardcoded hex values.

## Conventions

- Commit messages must follow Conventional Commits (e.g. `feat:`, `chore:`, `docs:`).
- The default branch is `main`, tracking `origin` (`rafaelst2000/atlas-frontend-challenge`); there's no feature-branch/PR flow.
- Never `git push` without the user's explicit confirmation for that specific push, even right after a commit they asked for.
