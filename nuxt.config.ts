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
    // Public catalog pages are cacheable at the edge and revalidated in the background
    '/': { swr: 300 },
    '/professionals/**': { swr: 3600 },
    // Both the bare list route and its nested detail route need an entry: on Vercel's
    // preset, '/**' alone compiles to a regex requiring a trailing slash + segment
    // (`/api/professionals/(?:.*)`), which never matches `/api/professionals` itself —
    // that 404'd in production (the list endpoint) while `/api/professionals/1` worked fine.
    '/api/professionals': { swr: 300, headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } },
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
