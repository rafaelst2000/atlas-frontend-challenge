<script setup lang="ts">
import type { Professional, ProfessionalsPage } from '#shared/professional'
import { SORT_OPTIONS } from '#shared/professional'

const { filters, update, clear } = useProfessionalFilters()

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

// Debounced search: keeps typing (INP) cheap and avoids a request per keystroke
const search = ref(filters.value.q ?? '')
let timer: ReturnType<typeof setTimeout> | undefined
watch(search, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => update({ q: value.trim() || undefined }), 300)
})
watch(() => filters.value.q, (value) => {
  if ((value ?? '') !== search.value.trim()) search.value = value ?? ''
})
onBeforeUnmount(() => clearTimeout(timer))

const sortValue = computed(() => filters.value.sort ?? 'relevance')
const sortLabel = computed(() => SORT_OPTIONS.find(o => o.value === sortValue.value)?.label ?? '')
const suggestions = ['React', 'Front-end', 'Designer UX', 'DevOps']

const hasFilters = computed(() => Object.keys(filters.value).some(key => key !== 'sort'))

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
    <section class="relative overflow-hidden px-5 pb-10 pt-14">
      <div class="hero-orb" aria-hidden="true" />
      <div class="relative mx-auto max-w-[820px] text-center">
        <p class="hero-badge mb-6 !text-[13px]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m9 12 2 2 4-4" /></svg>
          <span>{{ data.catalogTotal }} profissionais verificados</span>
        </p>
        <h1 class="text-[clamp(32px,7vw,64px)] font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:pretty]">
          <span class="hl-muted">Encontre o profissional de </span><span class="hl-bright">tecnologia ideal</span><span class="hl-muted"> para o seu projeto</span>
        </h1>
        <p class="mx-auto mt-5 max-w-[560px] text-[clamp(14px,3.4vw,17px)] leading-[1.65] text-body">
          Conecte-se com especialistas avaliados em desenvolvimento, design, dados, infraestrutura e muito mais.
        </p>

        <form role="search" class="mt-[30px] flex flex-wrap gap-2.5 rounded-card bg-card p-2.5 shadow-card" @submit.prevent="update({ q: search.trim() || undefined })">
          <label class="flex min-w-0 flex-[1_1_220px] items-center gap-2.5 px-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-tertiary)" stroke-width="1.7" stroke-linecap="round" class="shrink-0" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <span class="sr-only">Buscar profissionais</span>
            <input v-model="search" type="search" placeholder="Busque por nome, profissão ou tecnologia..." class="min-w-0 flex-1 bg-transparent py-3 text-[15px] text-primary outline-none placeholder:text-tertiary" autocomplete="off">
          </label>
          <button type="submit" class="btn btn-primary ml-auto w-full max-w-[180px] flex-[1_1_100%] !bg-surface !py-[13px]">Buscar</button>
        </form>

        <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span class="font-mono text-[11px] tracking-[0.04em] text-tertiary">POPULARES //</span>
          <button v-for="s in suggestions" :key="s" type="button" class="rounded-full border border-subtle px-3 py-1.5 text-xs text-body transition-colors hover:text-primary" @click="search = s; update({ q: s })">
            {{ s }}
          </button>
        </div>
      </div>
    </section>

    <ProfessionalFilters />

    <section id="profissionais" class="mx-auto flex max-w-[1200px] flex-wrap items-end gap-3 px-5 pt-3" aria-labelledby="resultados-heading">
      <div class="min-w-0 flex-[1_1_200px]">
        <h2 id="resultados-heading" class="text-[clamp(20px,5vw,28px)] font-bold tracking-[-0.03em] text-primary" aria-live="polite">
          {{ data.total }} {{ data.total === 1 ? 'profissional encontrado' : 'profissionais encontrados' }}
        </h2>
        <p class="meta-line mt-1.5 !whitespace-normal">ORDENADO POR {{ sortLabel.toUpperCase() }} // ATUALIZADO HÁ 4 MIN</p>
      </div>
      <div class="hidden items-center gap-2 md:flex">
        <label for="sort" class="text-[13px] text-tertiary">Ordenar por</label>
        <select id="sort" class="cursor-pointer rounded-button border border-medium bg-card px-3.5 py-2.5 text-[13px] text-primary" :value="sortValue" @change="update({ sort: ($event.target as HTMLSelectElement).value === 'relevance' ? undefined : ($event.target as HTMLSelectElement).value })">
          <option v-for="o in SORT_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </div>
    </section>

    <section class="mx-auto max-w-[1200px] px-5 pb-10 pt-5">
      <div v-if="isLoading && !items.length" class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        <ProfessionalCardSkeleton v-for="n in 6" :key="n" />
      </div>

      <div v-else-if="items.length" :class="{ 'opacity-60 transition-opacity': isLoading }">
        <ul class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
          <li v-for="p in items" :key="p.id" class="flex [&>*]:w-full">
            <ProfessionalCard :professional="p" />
          </li>
        </ul>

        <div class="mt-8 flex flex-col items-center gap-4">
          <button v-if="hasMore" type="button" class="btn btn-primary w-full max-w-[280px] !py-3.5" :disabled="loadingMore" @click="loadMore">
            {{ loadingMore ? 'Carregando...' : 'Carregar mais profissionais' }}
          </button>
          <p class="font-mono text-[11px] tracking-[0.04em] text-tertiary">MOSTRANDO {{ items.length }} DE {{ data.total }}</p>
        </div>
      </div>

      <div v-else class="rounded-card bg-card px-6 py-12 text-center shadow-card">
        <div class="mx-auto mb-5 flex size-[52px] items-center justify-center rounded-xl border border-medium bg-surface">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /><path d="M8.5 11h5" /></svg>
        </div>
        <h3 class="text-xl font-bold tracking-[-0.02em] text-primary">Nenhum profissional encontrado</h3>
        <p class="mx-auto mt-2.5 max-w-[400px] text-sm leading-[1.65] text-body">
          Tente remover alguns filtros ou buscar por outra tecnologia. Você também pode ampliar a faixa de preço ou a distância.
        </p>
        <button v-if="hasFilters" type="button" class="btn btn-primary mt-6" @click="clear(); search = ''">Limpar filtros</button>
      </div>
    </section>
  </main>
</template>
