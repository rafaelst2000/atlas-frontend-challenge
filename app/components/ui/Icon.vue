<script setup lang="ts">
import { ICONS, type IconName } from '~/utils/icons'

const props = withDefaults(defineProps<{ name: IconName, size?: number }>(), { size: 14 })

const icon = computed(() => ICONS[props.name])
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="icon.filled ? 'currentColor' : 'none'"
    :stroke="icon.filled ? 'none' : 'currentColor'"
    :stroke-width="icon.strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="shrink-0"
    aria-hidden="true"
  >
    <component
      :is="shape.tag"
      v-for="(shape, index) in icon.shapes"
      :key="index"
      v-bind="shape.attrs"
    />
  </svg>
</template>
