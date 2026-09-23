<script setup lang="ts">
defineProps<{
  label: string
  options: readonly { value: string, label: string }[]
  placeholder?: string
}>()

const model = defineModel<string>({
  get: value => value ?? '',
  set: value => value || undefined,
})
</script>

<template>
  <select
    v-model="model"
    class="ui-select"
    :aria-label="label"
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
