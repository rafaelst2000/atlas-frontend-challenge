<script setup lang="ts">
import { SORT_OPTIONS } from '#shared/professional'

defineProps<{ modelValue?: string }>()

defineEmits<{ 'update:modelValue': [value: string | undefined] }>()
</script>

<template>
  <select
    class="cursor-pointer rounded-button border border-medium bg-card text-[13px] text-primary"
    aria-label="Ordenar por"
    :value="modelValue ?? 'relevance'"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value === 'relevance' ? undefined : ($event.target as HTMLSelectElement).value)"
  >
    <option
      v-for="option in SORT_OPTIONS"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>
