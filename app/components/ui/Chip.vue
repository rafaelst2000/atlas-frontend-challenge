<script setup lang="ts">
const props = withDefaults(defineProps<{
  as?: 'span' | 'li' | 'button'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'outline' | 'raised'
  selected?: boolean
  mono?: boolean
}>(), { as: 'span', size: 'md', variant: 'outline', selected: undefined })

const SIZES = {
  sm: 'px-2.5 py-1.25 text-label',
  md: 'px-3.5 py-1.75 text-[12.5px]',
  lg: 'px-4 py-2.25 text-[13px]',
} as const

const classes = computed(() => [
  'rounded-full transition-colors',
  SIZES[props.size],
  props.mono && 'font-mono',
  props.variant === 'raised'
    ? 'bg-card text-primary shadow-[inset_0_1px_0_rgba(255,248,230,0.08),0_2px_12px_rgba(0,0,0,0.35)]'
    : ['border', props.selected ? 'border-accent-border bg-accent-subtle text-accent' : 'border-subtle text-body'],
  props.as === 'button' && !props.selected && 'hover:text-primary',
])
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    :aria-pressed="as === 'button' ? selected : undefined"
    :class="classes"
  >
    <slot />
  </component>
</template>
