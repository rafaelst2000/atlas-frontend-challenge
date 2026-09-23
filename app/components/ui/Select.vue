<script setup lang="ts">
defineProps<{
  label: string
  options: readonly { value: string, label: string }[]
  modelValue?: string
  placeholder?: string
}>()

defineEmits<{ 'update:modelValue': [value: string | undefined] }>()
</script>

<template>
  <select
    class="ui-select"
    :value="modelValue ?? ''"
    :aria-label="label"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value || undefined)"
  >
    <option
      v-if="placeholder"
      value=""
    >
      {{ placeholder }}
    </option>
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>
