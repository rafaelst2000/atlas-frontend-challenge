<script setup lang="ts">
import { SORT_OPTIONS } from '#shared/professional'

const model = defineModel<string>()

const explicitSorts = SORT_OPTIONS.filter(option => option.value !== 'relevance')
const defaultLabel = SORT_OPTIONS.find(option => option.value === 'relevance')!.label
</script>

<template>
  <UiSelect
    v-model="model"
    label="Ordenar por"
    :placeholder="defaultLabel"
    :options="explicitSorts"
  />
</template>
