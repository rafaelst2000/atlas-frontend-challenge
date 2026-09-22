<script setup lang="ts">
import type { Professional } from '#shared/professional'
import { SORT_OPTIONS } from '#shared/professional'

defineProps<{
  items: Professional[]
  total: number
  isLoading: boolean
  hasMore: boolean
  loadingMore: boolean
}>()

defineEmits<{ 'load-more': [] }>()

const { filters, update, clear } = useProfessionalFilters()

const sortValue = computed(() => filters.value.sort ?? 'relevance')
const sortLabel = computed(() => SORT_OPTIONS.find(o => o.value === sortValue.value)?.label ?? '')
const hasFilters = computed(() => Object.keys(filters.value).some(key => key !== 'sort'))
</script>

<template>
  <section id="profissionais" class="mx-auto flex max-w-300 flex-wrap items-end gap-3 px-5 pt-3" aria-labelledby="resultados-heading">
    <div class="min-w-0 flex-[1_1_200px]">
      <h2 id="resultados-heading" class="text-[clamp(20px,5vw,28px)] font-bold tracking-tight text-primary" aria-live="polite">
        {{ total }} {{ total === 1 ? 'profissional encontrado' : 'profissionais encontrados' }}
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

  <section class="mx-auto max-w-300 px-5 pb-10 pt-5">
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
        <button v-if="hasMore" type="button" class="btn btn-primary w-full max-w-70 !py-3.5" :disabled="loadingMore" @click="$emit('load-more')">
          {{ loadingMore ? 'Carregando...' : 'Carregar mais profissionais' }}
        </button>
        <p class="font-mono text-label tracking-[0.04em] text-tertiary">MOSTRANDO {{ items.length }} DE {{ total }}</p>
      </div>
    </div>

    <div v-else class="rounded-card bg-card px-6 py-12 text-center shadow-card">
      <div class="mx-auto mb-5 flex size-13 items-center justify-center rounded-xl border border-medium bg-surface">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /><path d="M8.5 11h5" /></svg>
      </div>
      <h3 class="text-xl font-bold tracking-[-0.02em] text-primary">Nenhum profissional encontrado</h3>
      <p class="mx-auto mt-2.5 max-w-100 text-sm leading-relaxed text-body">
        Tente remover alguns filtros ou buscar por outra tecnologia. Você também pode ampliar a faixa de preço ou a distância.
      </p>
      <button v-if="hasFilters" type="button" class="btn btn-primary mt-6" @click="clear()">Limpar filtros</button>
    </div>
  </section>
</template>
