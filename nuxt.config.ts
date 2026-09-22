import tailwindcss from '@tailwindcss/vite'

const siteUrl = process.env.NUXT_PUBLIC_SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000')

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/image', '@nuxt/fonts', '@nuxtjs/sitemap', '@nuxtjs/robots', '@vercel/speed-insights/nuxt', '@vercel/analytics/nuxt'],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()]
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [400, 500, 600, 700, 800] },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 500] }
    ]
  },

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
    '/': { headers: { 'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=300' } },
    '/professionals/**': { swr: 3600 },
    '/api/professionals': { headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } },
    '/api/professionals/**': { headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } },
    '/profissionais/**': { redirect: { to: '/professionals/**', statusCode: 301 } }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      meta: [{ name: 'theme-color', content: '#0a0907' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }
      ]
    }
  }
})
