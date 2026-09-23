<script setup lang="ts">
import type { Professional } from '#types/professional'
import { SORT_OPTIONS } from '#shared/professional'

const props = defineProps<{
  professionals: Professional[]
  total: number
  isLoading: boolean
  hasMore: boolean
  loadingMore: boolean
  hasError: boolean
  hasLoadMoreError: boolean
}>()

defineEmits<{ 'load-more': [], 'retry': [] }>()

const { filters, update, clear } = useProfessionalFilters()

const sortValue = computed(() => filters.value.sort ?? 'relevance')
const sortCaption = computed(() => SORT_OPTIONS.find(option => option.value === sortValue.value)?.label.toUpperCase() ?? '')
const hasFilters = computed(() => Object.keys(filters.value).some(key => key !== 'sort'))
const totalLabel = computed(() => `${props.total} ${props.total === 1 ? 'profissional encontrado' : 'profissionais encontrados'}`)
const loadMoreLabel = computed(() => props.loadingMore ? 'Carregando...' : 'Carregar mais profissionais')

const view = computed(() => {
  if (props.professionals.length) return 'results'
  if (props.isLoading) return 'loading'
  if (props.hasError) return 'error'
  return 'empty'
})
</script>

<template>
  <section
    id="profissionais"
    class="mx-auto flex max-w-300 flex-wrap items-end gap-3 px-5 pt-3"
    aria-labelledby="resultados-heading"
  >
    <div class="min-w-0 flex-[1_1_200px]">
      <h2
        id="resultados-heading"
        class="text-[clamp(20px,5vw,28px)] font-bold tracking-tight text-primary"
        aria-live="polite"
      >
        {{ totalLabel }}
      </h2>
      <p class="meta-line mt-1.5 !whitespace-normal">
        ORDENADO POR {{ sortCaption }} // ATUALIZADO HÁ 4 MIN
      </p>
    </div>
    <div class="hidden items-center gap-2 md:flex">
      <label
        for="sort"
        class="text-[13px] text-tertiary"
      >Ordenar por</label>
      <ProfessionalSortSelect
        id="sort"
        class="py-2.5"
        :model-value="filters.sort"
        @update:model-value="update({ sort: $event })"
      />
    </div>
  </section>

  <section class="mx-auto max-w-300 px-5 pb-10 pt-5">
    <div
      v-if="view === 'loading'"
      class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]"
    >
      <ProfessionalCardSkeleton
        v-for="index in 6"
        :key="index"
      />
    </div>

    <UiStatePanel
      v-else-if="view === 'error'"
      icon="alert"
      tone="error"
      title="Não foi possível carregar os profissionais"
      description="Houve uma falha ao buscar os dados. Verifique sua conexão e tente novamente."
    >
      <UiButton
        class="mt-6"
        @click="$emit('retry')"
      >
        Tentar novamente
      </UiButton>
    </UiStatePanel>

    <div
      v-else-if="view === 'results'"
      :class="{ 'opacity-60 transition-opacity': isLoading }"
    >
      <ul class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        <li
          v-for="professional in professionals"
          :key="professional.id"
          class="flex [&>*]:w-full"
        >
          <ProfessionalCard :professional="professional" />
        </li>
      </ul>

      <div class="mt-8 flex flex-col items-center gap-4">
        <UiButton
          v-if="hasMore"
          class="w-full max-w-70 !py-3.5"
          :disabled="loadingMore"
          @click="$emit('load-more')"
        >
          {{ loadMoreLabel }}
        </UiButton>
        <p
          v-if="hasLoadMoreError"
          class="text-sm text-error"
        >
          Não foi possível carregar mais profissionais. Tente novamente.
        </p>
        <p class="font-mono text-label tracking-[0.04em] text-tertiary">
          MOSTRANDO {{ professionals.length }} DE {{ total }}
        </p>
      </div>
    </div>

    <UiStatePanel
      v-else
      icon="search-minus"
      title="Nenhum profissional encontrado"
      description="Tente remover alguns filtros ou buscar por outra tecnologia. Você também pode ampliar a faixa de preço ou a distância."
    >
      <UiButton
        v-if="hasFilters"
        class="mt-6"
        @click="clear()"
      >
        Limpar filtros
      </UiButton>
    </UiStatePanel>
  </section>
</template>
