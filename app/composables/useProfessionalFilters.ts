import type { ProfessionalFilters } from '#shared/professional'

const FILTER_KEYS = ['q', 'spec', 'tech', 'price', 'rating', 'exp', 'loc', 'sort'] as const
type FilterKey = (typeof FILTER_KEYS)[number]

/**
 * Filters live in the URL query so results are shareable, crawlable and
 * restored on back/forward navigation. The URL is the single source of truth.
 */
export function useProfessionalFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<ProfessionalFilters>(() => {
    const out: Record<string, string> = {}
    for (const key of FILTER_KEYS) {
      const value = route.query[key]
      if (typeof value === 'string' && value) out[key] = value
    }
    return out as ProfessionalFilters
  })

  // Everything except search text and sort counts as an "active filter"
  const activeCount = computed(
    () => FILTER_KEYS.filter(key => key !== 'q' && key !== 'sort' && filters.value[key]).length
  )

  function update(patch: Partial<Record<FilterKey, string | undefined>>) {
    const query = { ...route.query }
    for (const [key, value] of Object.entries(patch)) {
      if (value) query[key] = value
      else delete query[key]
    }
    return router.replace({ query })
  }

  function clear() {
    return router.replace({ query: filters.value.sort ? { sort: filters.value.sort } : {} })
  }

  return { filters, activeCount, update, clear }
}
