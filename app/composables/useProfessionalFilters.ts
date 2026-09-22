import type { ProfessionalFilters } from '#types/professional'

const FILTER_KEYS = ['q', 'spec', 'price', 'rating', 'exp', 'sort'] as const
type FilterKey = (typeof FILTER_KEYS)[number]

export function useProfessionalFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed<ProfessionalFilters>(() => {
    const parsedFilters: Record<string, string> = {}
    for (const key of FILTER_KEYS) {
      const value = route.query[key]
      if (typeof value === 'string' && value) parsedFilters[key] = value
    }
    return parsedFilters as ProfessionalFilters
  })

  const activeCount = computed(
    () => FILTER_KEYS.filter(key => key !== 'q' && key !== 'sort' && filters.value[key]).length,
  )

  function update(patch: Partial<Record<FilterKey, string | undefined>>) {
    const query = { ...route.query }
    for (const [key, value] of Object.entries(patch)) {
      if (value) query[key] = value
      else Reflect.deleteProperty(query, key)
    }
    return router.replace({ query })
  }

  function clear() {
    return router.replace({ query: filters.value.sort ? { sort: filters.value.sort } : {} })
  }

  return { filters, activeCount, update, clear }
}
