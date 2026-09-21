<script setup lang="ts">
defineProps<{
  label: string
  placeholder: string
  options: readonly { value: string, label: string }[]
  modelValue?: string
}>()

defineEmits<{ 'update:modelValue': [value: string | undefined] }>()
</script>

<template>
  <label class="flex flex-col gap-1.5 text-[13px] font-semibold text-primary md:block">
    <span class="md:sr-only">{{ label }}</span>
    <select
      class="w-full cursor-pointer rounded-button border border-medium bg-card px-3.5 py-3 text-sm font-normal text-primary md:bg-surface md:py-2.5 md:text-[13px]"
      :value="modelValue ?? ''"
      :aria-label="label"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value || undefined)"
    >
      <option value="">{{ placeholder }}</option>
      <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
    </select>
  </label>
</template>
