<script setup lang="ts">
import {
  EXPERIENCE_OPTIONS, LOCATION_OPTIONS, PRICE_OPTIONS, RATING_OPTIONS, SPECIALTIES, TECH_OPTIONS
} from '#shared/professional'

const emit = defineEmits<{ close: [] }>()

const { filters, update, clear } = useProfessionalFilters()
const techOptions = TECH_OPTIONS.map(value => ({ value, label: value }))

const total = useState<number>('professionals-total', () => 0)

onMounted(() => {
  document.body.style.overflow = 'hidden'
})
onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="fixed inset-0 z-[500] flex items-end bg-[rgba(6,5,4,0.72)]" role="dialog" aria-modal="true" aria-label="Filtros" @keydown.esc="emit('close')">
    <div class="absolute inset-0" @click="emit('close')" />
    <div class="relative max-h-[88vh] w-full animate-[sheet-up_260ms_var(--ease-out-expo)] overflow-y-auto rounded-t-panel bg-footer p-5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-[inset_0_1px_0_rgba(255,248,230,0.08),0_-12px_40px_rgba(0,0,0,0.6)]">
      <div class="mb-5 flex items-center">
        <span class="font-mono text-xs tracking-[0.06em] text-accent">[Filtros]</span>
        <button type="button" class="ml-auto flex size-[34px] items-center justify-center rounded-button border border-medium bg-card" aria-label="Fechar" @click="emit('close')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12" /><path d="M18 6 6 18" /></svg>
        </button>
      </div>

      <p class="mb-2.5 text-[13px] font-semibold text-primary">Especialidade</p>
      <div class="mb-5 flex flex-wrap gap-2">
        <button
          v-for="spec in SPECIALTIES"
          :key="spec"
          type="button"
          class="rounded-full border px-[15px] py-[9px] text-[13px]"
          :class="filters.spec === spec ? 'border-accent-border bg-accent-subtle text-accent' : 'border-subtle text-body'"
          :aria-pressed="filters.spec === spec"
          @click="update({ spec: filters.spec === spec ? undefined : spec })"
        >
          {{ spec }}
        </button>
      </div>

      <div class="flex flex-col gap-3.5">
        <ProfessionalFilterSelect label="Tecnologias" placeholder="Todas" :options="techOptions" :model-value="filters.tech" @update:model-value="update({ tech: $event })" />
        <ProfessionalFilterSelect label="Faixa de preço" placeholder="Qualquer" :options="PRICE_OPTIONS" :model-value="filters.price" @update:model-value="update({ price: $event })" />
        <ProfessionalFilterSelect label="Avaliação mínima" placeholder="Qualquer" :options="RATING_OPTIONS" :model-value="filters.rating" @update:model-value="update({ rating: $event })" />
        <ProfessionalFilterSelect label="Experiência" placeholder="Qualquer" :options="EXPERIENCE_OPTIONS" :model-value="filters.exp" @update:model-value="update({ exp: $event })" />
        <ProfessionalFilterSelect label="Localização / distância" placeholder="Qualquer" :options="LOCATION_OPTIONS" :model-value="filters.loc" @update:model-value="update({ loc: $event })" />
      </div>

      <div class="mt-5 flex gap-2.5">
        <button type="button" class="flex-1 rounded-button border border-subtle p-3 text-sm font-semibold text-body" @click="clear()">Limpar filtros</button>
        <button type="button" class="btn btn-primary flex-[1.4]" @click="emit('close')">Ver {{ total }} resultados</button>
      </div>
    </div>
  </div>
</template>
