<script setup lang="ts">
import {
  EXPERIENCE_OPTIONS, PRICE_OPTIONS, RATING_OPTIONS, SORT_OPTIONS, SPECIALTIES
} from '#shared/professional'

const { filters, activeCount, update, clear } = useProfessionalFilters()

const specOptions = SPECIALTIES.map(value => ({ value, label: value }))

const sheetOpen = ref(false)
</script>

<template>
  <section aria-labelledby="filtros-heading" class="mx-auto max-w-[1200px] px-5 pb-5 pt-2">
    <h2 id="filtros-heading" class="section-label !mb-3 !text-xs">[Filtros]</h2>

    <!-- Mobile: filters open in a bottom sheet -->
    <div class="flex gap-2.5 md:hidden">
      <button type="button" class="flex flex-1 items-center justify-center gap-2 rounded-button border border-medium bg-card p-3 text-sm font-semibold text-primary" @click="sheetOpen = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16" /><path d="M7 12h10" /><path d="M10 17h4" /></svg>
        Filtros
        <span v-if="activeCount" class="font-mono text-[11px] text-accent">{{ activeCount }}</span>
      </button>
      <select
        class="flex-1 cursor-pointer rounded-button border border-medium bg-card p-3 text-[13px] text-primary"
        aria-label="Ordenar por"
        :value="filters.sort ?? 'relevance'"
        @change="update({ sort: ($event.target as HTMLSelectElement).value === 'relevance' ? undefined : ($event.target as HTMLSelectElement).value })"
      >
        <option v-for="o in SORT_OPTIONS" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </div>

    <!-- Desktop: inline bar -->
    <div class="hidden flex-wrap items-center gap-2.5 rounded-card bg-card p-3.5 shadow-card md:flex">
      <ProfessionalFilterSelect label="Especialidade" placeholder="Especialidade" :options="specOptions" :model-value="filters.spec" @update:model-value="update({ spec: $event })" />
      <ProfessionalFilterSelect label="Faixa de preço" placeholder="Faixa de preço" :options="PRICE_OPTIONS" :model-value="filters.price" @update:model-value="update({ price: $event })" />
      <ProfessionalFilterSelect label="Avaliação mínima" placeholder="Avaliação mínima" :options="RATING_OPTIONS" :model-value="filters.rating" @update:model-value="update({ rating: $event })" />
      <ProfessionalFilterSelect label="Experiência" placeholder="Experiência" :options="EXPERIENCE_OPTIONS" :model-value="filters.exp" @update:model-value="update({ exp: $event })" />
      <button type="button" class="ml-auto rounded-button border border-subtle px-4 py-2.5 text-[13px] font-medium text-body transition-colors hover:text-primary" @click="clear()">
        Limpar filtros
      </button>
    </div>

    <div class="mt-3 hidden flex-wrap gap-2 md:flex" role="group" aria-label="Especialidade">
      <button
        v-for="spec in SPECIALTIES"
        :key="spec"
        type="button"
        class="rounded-full border px-3.5 py-[7px] text-[12.5px] transition-colors"
        :class="filters.spec === spec ? 'border-accent-border bg-accent-subtle text-accent' : 'border-subtle text-body hover:text-primary'"
        :aria-pressed="filters.spec === spec"
        @click="update({ spec: filters.spec === spec ? undefined : spec })"
      >
        {{ spec }}
      </button>
    </div>

    <LazyProfessionalFiltersSheet v-if="sheetOpen" @close="sheetOpen = false" />
  </section>
</template>
