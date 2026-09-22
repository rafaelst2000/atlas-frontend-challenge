import type { RouterConfig } from '@nuxt/schema'

export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      const prefersReducedMotion = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      return { el: to.hash, behavior: prefersReducedMotion ? 'auto' : 'smooth' }
    }

    if (to.path === from.path) return false

    return { top: 0 }
  },
} satisfies RouterConfig
