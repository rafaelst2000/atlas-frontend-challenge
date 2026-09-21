import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
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

  // Remote portraits are resized and served as WebP by the image optimizer (Vercel provider in production)
  image: {
    domains: ['randomuser.me'],
    format: ['webp']
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    name: 'DevMatch',
    defaultLocale: 'pt-BR'
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls']
  },

  routeRules: {
    // Public catalog pages are cacheable at the edge and revalidated in the background
    '/': { swr: 300 },
    '/profissionais/**': { swr: 3600 },
    '/api/professionals/**': { swr: 300, headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      meta: [{ name: 'theme-color', content: '#0a0907' }]
    }
  }
})
