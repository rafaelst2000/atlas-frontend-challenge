<script setup lang="ts">
import type { Professional, ProfessionalsPage } from '#shared/professional'

const { filters } = useProfessionalFilters()

const { data, status } = await useFetch<ProfessionalsPage>('/api/professionals', {
  query: filters,
  default: () => ({ items: [], total: 0, page: 1, pageSize: 12, totalPages: 1, catalogTotal: 0 })
})

// Extra pages are appended on demand ("Carregar mais") and reset whenever filters change
const extra = shallowRef<Professional[]>([])
const nextPage = ref(2)
const loadingMore = ref(false)

watch(filters, () => {
  extra.value = []
  nextPage.value = 2
})

const items = computed(() => [...data.value.items, ...extra.value])
const hasMore = computed(() => items.value.length < data.value.total)
const isLoading = computed(() => status.value === 'pending')
const totalState = useState<number>('professionals-total')
watchEffect(() => { totalState.value = data.value.total })

async function loadMore() {
  loadingMore.value = true
  try {
    const next = await $fetch<ProfessionalsPage>('/api/professionals', {
      query: { ...filters.value, page: nextPage.value }
    })
    extra.value = [...extra.value, ...next.items]
    nextPage.value += 1
  }
  finally {
    loadingMore.value = false
  }
}

useSeoMeta({
  title: 'DevMatch · Encontre profissionais de tecnologia avaliados',
  description: 'Marketplace com mais de 500 profissionais de tecnologia verificados: front-end, back-end, mobile, design, dados, DevOps e QA. Compare avaliações e preços por hora.',
  ogTitle: 'DevMatch · Profissionais de tecnologia avaliados',
  ogDescription: 'Encontre o profissional de tecnologia ideal para o seu projeto.',
  ogType: 'website',
  twitterCard: 'summary'
})
const siteUrl = useSiteConfig().url
useHead({
  // Filtered/sorted views are not separate indexable pages
  link: [{ rel: 'canonical', href: `${siteUrl}/` }],
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'DevMatch',
      'url': siteUrl
    })
  }]
})
</script>

<template>
  <main>
    <HomeHero :catalog-total="data.catalogTotal" />

    <ProfessionalFilters />

    <HomeResultsGrid
      :items="items"
      :total="data.total"
      :is-loading="isLoading"
      :has-more="hasMore"
      :loading-more="loadingMore"
      @load-more="loadMore"
    />
  </main>
</template>
