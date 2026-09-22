import type { Professional, ProfessionalsPage } from '#types/professional'

const EMPTY_PAGE: ProfessionalsPage = { items: [], total: 0, page: 1, pageSize: 12, totalPages: 1, catalogTotal: 0 }

/**
 * Fetches the professionals list for the current URL filters (SSR-friendly,
 * refetches automatically when filters change) and layers "load more"
 * pagination on top. An in-flight "load more" request is aborted when the
 * filters change, so a slow response for a stale search can't land after
 * the list has already been reset for the new one.
 */
export function useProfessionals() {
  const { filters } = useProfessionalFilters()

  const { data: professionalsPage, status: fetchStatus, error: fetchError, refresh } = useFetch<ProfessionalsPage>('/api/professionals', {
    query: filters,
    default: () => EMPTY_PAGE,
  })

  const additionalProfessionals = shallowRef<Professional[]>([])
  const nextPage = ref(2)
  const loadingMore = ref(false)
  const loadMoreError = ref(false)
  let loadMoreController: AbortController | undefined

  watch(filters, () => {
    loadMoreController?.abort()
    additionalProfessionals.value = []
    nextPage.value = 2
    loadMoreError.value = false
  })

  const professionals = computed(() => [...professionalsPage.value.items, ...additionalProfessionals.value])
  const hasMore = computed(() => professionals.value.length < professionalsPage.value.total)
  const isLoading = computed(() => fetchStatus.value === 'pending')

  const totalState = useState<number>('professionals-total')
  watchEffect(() => {
    totalState.value = professionalsPage.value.total
  })

  async function loadMore() {
    if (loadingMore.value || !hasMore.value) return

    loadingMore.value = true
    loadMoreError.value = false
    const controller = new AbortController()
    loadMoreController = controller
    const page = nextPage.value

    try {
      const nextPageResult = await $fetch<ProfessionalsPage>('/api/professionals', {
        query: { ...filters.value, page },
        signal: controller.signal,
      })
      additionalProfessionals.value = [...additionalProfessionals.value, ...nextPageResult.items]
      nextPage.value = page + 1
    }
    catch {
      if (!controller.signal.aborted) loadMoreError.value = true
    }
    finally {
      loadingMore.value = false
    }
  }

  return {
    professionals,
    professionalsPage,
    isLoading,
    hasMore,
    loadingMore,
    loadMore,
    hasError: computed(() => !!fetchError.value),
    hasLoadMoreError: loadMoreError,
    refresh,
  }
}
