import tailwindcss from '@tailwindcss/vite'

// Explicit NUXT_PUBLIC_SITE_URL wins; on Vercel fall back to the production domain it injects (host only, no scheme)
const siteUrl = process.env.NUXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/image', '@nuxt/fonts', '@nuxtjs/sitemap', '@nuxtjs/robots'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  // Self-hosted fonts (no render-blocking third-party stylesheet, metric-adjusted fallbacks to limit CLS)
  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700, 800] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500] }
    ]
  },

  // Remote portraits and project screenshots are resized and served as WebP by the image optimizer (Vercel provider in production).
  // picsum.photos redirects (302) to fastly.picsum.photos to actually serve the bytes — the image
  // optimizer validates the redirect target's host too, so both domains need to be allow-listed.
  image: {
    domains: ['randomuser.me', 'picsum.photos', 'fastly.picsum.photos'],
    format: ['webp']
  },

  site: {
    url: siteUrl,
    name: 'DevMatch',
    defaultLocale: 'pt-BR'
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls']
  },

  routeRules: {
    // '/' reads filters from the query string (?spec=QA, ?q=..., ...) for shareable URLs —
    // so it's query-driven, same trap as the list API below: no `swr` here, since Vercel's
    // ISR (what `swr` compiles to on that preset) caches by PATH ONLY and would serve the
    // unfiltered `/` response for every `?spec=...` variant (confirmed live: identical HTML,
    // "524 profissionais encontrados" on both `/` and `/?spec=QA`). Plain Cache-Control goes
    // through the ordinary CDN edge cache instead, which does vary by the full URL.
    '/': { headers: { 'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=300' } },
    // The profile page's only variance is the :id path segment, not a query string, so ISR
    // is safe here — each id gets its own correctly-scoped cache entry.
    '/professionals/**': { swr: 3600 },
    // Both the bare list route and its nested detail route need an entry: on Vercel's
    // preset, '/**' alone compiles to a regex requiring a trailing slash + segment
    // (`/api/professionals/(?:.*)`), which never matches `/api/professionals` itself —
    // that 404'd in production (the list endpoint) while `/api/professionals/1` worked fine.
    //
    // The list route is query-string-driven (page/q/spec/price/rating/exp/sort) and gets
    // NO `swr` here on purpose: Nitro's `swr` compiles to Vercel's native ISR on that
    // preset, and Vercel ISR caches by PATH ONLY — every `?page=N` collapsed onto the same
    // cached response, so "Carregar mais" kept re-appending whichever page got cached first
    // (confirmed live: 50 different `?page=N` requests returned only 12 distinct ids total).
    // A plain Cache-Control header goes through Vercel's ordinary CDN edge cache instead,
    // which does vary by full URL including the query string.
    '/api/professionals': { headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } },
    '/api/professionals/**': { swr: 300, headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } },
    // Old Portuguese route kept as a permanent redirect for anyone with an indexed/bookmarked link
    '/profissionais/**': { redirect: { to: '/professionals/**', statusCode: 301 } }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      meta: [{ name: 'theme-color', content: '#0a0907' }]
    }
  }
})
