<script setup lang="ts">
defineProps<{
  label: string
  placeholder: string
  options: readonly { value: string, label: string }[]
}>()

const model = defineModel<string>()
</script>

<template>
  <label class="flex flex-col gap-1.5 text-[13px] font-semibold text-primary md:block">
    <span class="md:sr-only">{{ label }}</span>
    <UiSelect
      v-model="model"
      class="w-full py-3 text-sm md:bg-surface md:py-2.5 md:text-[13px]"
      :label="label"
      :placeholder="placeholder"
      :options="options"
    />
  </label>
</template>
