import type { RouterConfig } from '@nuxt/schema'

// Smooth-scroll to hash anchors (e.g. "Quero contratar" -> #profissionais), unless the user prefers reduced motion
export default {
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) {
      const reduce = import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      return { el: to.hash, behavior: reduce ? 'auto' : 'smooth' }
    }

    // Same page, only query (filters) changed: keep scroll position
    if (to.path === from.path) return false

    return { top: 0 }
  }
} satisfies RouterConfig
