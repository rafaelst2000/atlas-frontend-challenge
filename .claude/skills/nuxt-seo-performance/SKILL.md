---
name: nuxt-seo-performance
description: Checklist for building or reviewing any page/component in this Nuxt 4 project with SEO, performance and Core Web Vitals as first-class requirements. Use it whenever you add a route, component, image, font, data fetch or third-party script.
---

# Nuxt 4: SEO, Performance and Core Web Vitals

This project is judged on SEO, performance and Core Web Vitals (LCP, CLS, INP). Apply this checklist to every change and mention the relevant decisions in the README.

## Data and rendering
- Fetch with `useFetch` / `useAsyncData` (SSR, payload reuse). Never fetch in `onMounted` for content that should be indexed.
- Give every `useFetch` a stable `key` when params are reactive, and use `getCachedData`/`default` to avoid refetch flashes.
- Set caching per route in `routeRules` in `nuxt.config.ts` (`prerender`, `swr`, `isr`, `headers`). Public catalog pages should be cacheable.
- Keep API handlers in `server/api`, validate query input, and paginate; never ship the whole dataset to the client.
- Share types and constants through `shared/` (`#shared/...`).

## SEO
- Every page calls `useSeoMeta` (title, description, og:*, twitter:*) and sets a canonical URL; titles/descriptions are unique per page.
- Profile pages add JSON-LD (`useHead` script `application/ld+json`) with schema.org `Person`/`ProfilePage` and `AggregateRating` when ratings exist.
- One `h1` per page, semantic landmarks (`header`, `nav`, `main`, `footer`), meaningful link text, `lang` on `<html>`.
- Links are real `<NuxtLink>` anchors (crawlable), never click handlers on `span`s. Non-existent resources return a real 404 via `createError({ statusCode: 404 })`.
- Sitemap and robots come from `@nuxtjs/sitemap` / `@nuxtjs/robots`; keep the dynamic profile URLs source up to date.

## Core Web Vitals
- **LCP:** keep the above-the-fold markup server-rendered and light; no render-blocking CSS/JS; fonts are self-hosted by `@nuxt/fonts` (no Google Fonts `<link>`).
- **CLS:** reserve space for everything that loads later (skeletons with fixed heights, explicit `width`/`height` on media, `font-display` swap with metric fallbacks).
- **INP:** debounce search input, avoid heavy work in handlers, keep reactive state small (`shallowRef` for big lists), no unnecessary watchers.
- Lazy-load below-the-fold or interaction-only UI with the `Lazy` prefix **plus** a hydration strategy (`hydrate-on-visible`, `hydrate-on-idle`, `hydrate-on-interaction`); mobile filter sheet and similar overlays must be lazy. Without the `Lazy` prefix the strategy is silently ignored and the component hydrates eagerly — the build warns with `NUXT_B3006`, so read its output.
- Respect `prefers-reduced-motion`; animations use `transform`/`opacity` only.
- `<NuxtLink>`'s default prefetch fires on **visibility**, not click intent — fine for a handful of nav links, wasteful for a `<NuxtLink>` repeated once per item in a long/infinite list (every `ProfessionalCard`'s "Ver perfil"): scrolling past dozens of cards silently fetches each profile's full payload, most of which are never opened. Use `prefetch-on="interaction"` (hover/focus) on any link that's repeated per list item.
- Images: `<NuxtImg>` with `loading="lazy"` by default, `fetchpriority="high"` + `eager` only on the LCP image (the profile avatar), explicit `width`/`height`, and WebP via the `image.format` config. Remote hosts must be allow-listed in `nuxt.config.ts`'s `image.domains`. Prefer SVG/inline for icons; no icon fonts.
- No third-party scripts unless deferred and justified.

## Accessibility (affects SEO and UX)
- Buttons are `<button>`, inputs have labels, focus states visible, `aria-label` on icon-only buttons, sufficient contrast (design tokens already comply), `aria-live` for result counts.

## Verify before finishing
Run the `/check` command — it is the standard gate (typecheck → `npm run test:coverage` → `npm run build` → a review of the diff against this checklist). For UI changes, also inspect the built output with `npm run preview` (Lighthouse/DevTools for LCP, CLS, INP), since those numbers can't be read off the source.
