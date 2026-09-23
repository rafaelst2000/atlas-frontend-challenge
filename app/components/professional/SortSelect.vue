<script setup lang="ts">
import { SORT_OPTIONS } from '#shared/professional'

defineProps<{ modelValue?: string }>()

defineEmits<{ 'update:modelValue': [value: string | undefined] }>()

const explicitSorts = SORT_OPTIONS.filter(option => option.value !== 'relevance')
const defaultLabel = SORT_OPTIONS.find(option => option.value === 'relevance')!.label
</script>

<template>
  <UiSelect
    label="Ordenar por"
    :placeholder="defaultLabel"
    :options="explicitSorts"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>
